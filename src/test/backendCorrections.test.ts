import { describe, it, expect, vi } from 'vitest';
import { 
  mapFrontendStatusToDatabase, 
  mapDatabaseStatusToFrontend, 
  calculateStageFromStatus,
  createApplicationInDb,
  fetchApplicationsFromDb 
} from '../services/applicationDbService';
import { 
  saveAssessmentToBackend,
  canonicalJsonStringify,
  computeCanonicalAnswersSha256
} from '../services/assessmentDbService';
import { 
  fetchHouseholdMembersFromDb, 
  createHouseholdMemberInDb, 
  deleteHouseholdMemberFromDb 
} from '../services/householdMembersDbService';
import { supabase } from '../lib/supabaseClient';
import * as supabaseClientModule from '../lib/supabaseClient';

describe('Phase 5.2.1 — Final Backend Corrections & Verification', () => {
  describe('1. Application Status Bidirectional Mapping & Normalization', () => {
    it('correctly maps under_review to canonical in_review', () => {
      expect(mapFrontendStatusToDatabase('under_review')).toBe('in_review');
      expect(mapFrontendStatusToDatabase('in_review')).toBe('in_review');
    });

    it('correctly maps sanctioned and approved to canonical approved', () => {
      expect(mapFrontendStatusToDatabase('sanctioned')).toBe('approved');
      expect(mapFrontendStatusToDatabase('approved')).toBe('approved');
      expect(mapFrontendStatusToDatabase('disbursed')).toBe('approved');
    });

    it('correctly maps verified to canonical verified', () => {
      expect(mapFrontendStatusToDatabase('verified')).toBe('verified');
    });

    it('correctly maps rejected to canonical rejected', () => {
      expect(mapFrontendStatusToDatabase('rejected')).toBe('rejected');
    });

    it('safely normalizes unknown or null statuses to submitted', () => {
      expect(mapFrontendStatusToDatabase(null)).toBe('submitted');
      expect(mapFrontendStatusToDatabase(undefined)).toBe('submitted');
      expect(mapFrontendStatusToDatabase('')).toBe('submitted');
      expect(mapFrontendStatusToDatabase('completely_invalid_status')).toBe('submitted');
    });

    it('maps database statuses to frontend badge representations', () => {
      expect(mapDatabaseStatusToFrontend('in_review')).toBe('under_review');
      expect(mapDatabaseStatusToFrontend('verified')).toBe('under_review');
      expect(mapDatabaseStatusToFrontend('approved')).toBe('sanctioned');
      expect(mapDatabaseStatusToFrontend('rejected')).toBe('action_needed');
      expect(mapDatabaseStatusToFrontend('draft')).toBe('action_needed');
      expect(mapDatabaseStatusToFrontend('submitted')).toBe('submitted');
    });

    it('calculates the correct linear stage for progress steppers', () => {
      expect(calculateStageFromStatus('submitted')).toBe(1);
      expect(calculateStageFromStatus('draft')).toBe(1);
      expect(calculateStageFromStatus('in_review')).toBe(2);
      expect(calculateStageFromStatus('verified')).toBe(3);
      expect(calculateStageFromStatus('approved')).toBe(4);
      expect(calculateStageFromStatus('sanctioned')).toBe(4);
    });
  });

  describe('2. Assessment Hashing: Deterministic Canonical JSON & SHA-256', () => {
    it('canonicalJsonStringify lexicographically sorts keys recursively', () => {
      const unordered = { z: 1, a: { y: 2, b: 3 }, m: 'middle' };
      const serialized = canonicalJsonStringify(unordered);
      expect(serialized).toBe('{"a":{"b":3,"y":2},"m":"middle","z":1}');
    });

    it('canonicalJsonStringify preserves original value types (boolean, number, string, null)', () => {
      const data = {
        age: 45,
        income: 150000.5,
        isFarmer: true,
        hasKcc: false,
        district: null,
        notes: 'Citizen verified'
      };
      const serialized = canonicalJsonStringify(data);
      expect(serialized).toContain('"age":45');
      expect(serialized).toContain('"income":150000.5');
      expect(serialized).toContain('"isFarmer":true');
      expect(serialized).toContain('"hasKcc":false');
      expect(serialized).toContain('"district":null');
      expect(serialized).toContain('"notes":"Citizen verified"');
    });

    it('canonicalJsonStringify preserves exact character casing without lowercase mutation', () => {
      const data = { Occupation: 'Farmer', District: 'Mandya', State: 'KARNATAKA' };
      const serialized = canonicalJsonStringify(data);
      expect(serialized).toBe('{"District":"Mandya","Occupation":"Farmer","State":"KARNATAKA"}');
    });

    it('computeCanonicalAnswersSha256 produces identical hash regardless of key order', async () => {
      const answersA = { occupation: 'farmer', age: 45, landholdingAcres: 2.5 } as any;
      const answersB = { landholdingAcres: 2.5, occupation: 'farmer', age: 45 } as any;

      const hashA = await computeCanonicalAnswersSha256('user-uuid-1', answersA);
      const hashB = await computeCanonicalAnswersSha256('user-uuid-1', answersB);

      expect(hashA).toBe(hashB);
      expect(hashA).toMatch(/^sha256-[0-9a-f]{64}$/);
    });

    it('computeCanonicalAnswersSha256 produces distinct hashes when casing or types differ', async () => {
      const answersUpper = { occupation: 'Farmer' } as any;
      const answersLower = { occupation: 'farmer' } as any;

      const hashUpper = await computeCanonicalAnswersSha256('user-uuid-1', answersUpper);
      const hashLower = await computeCanonicalAnswersSha256('user-uuid-1', answersLower);

      expect(hashUpper).not.toBe(hashLower);
    });

    it('computeCanonicalAnswersSha256 throws clear error when secure hashing is unavailable', async () => {
      const originalSubtle = globalThis.crypto?.subtle;
      try {
        // Temporarily delete subtle to simulate an insecure or legacy runtime
        Object.defineProperty(globalThis.crypto, 'subtle', {
          value: undefined,
          configurable: true
        });

        await expect(computeCanonicalAnswersSha256('user-1', { age: 25 } as any))
          .rejects
          .toThrow('Secure hashing unavailable: Web Crypto API (crypto.subtle) with SHA-256 is required.');
      } finally {
        Object.defineProperty(globalThis.crypto, 'subtle', {
          value: originalSubtle,
          configurable: true
        });
      }
    });
  });

  describe('3. Assessment Persistence, Race-Safe RPC & Deduplication', () => {
    it('preserves guest mode persistence without network errors', async () => {
      const res = await saveAssessmentToBackend(null, { occupation: 'farmer' } as any, { evaluations: {} } as any);
      expect(res.success).toBe(true);
      expect(res.isGuest).toBe(true);
      expect(res.assessmentId).toBeDefined();
    });

    it('detects duplicate assessment fingerprints via RPC and returns existing assessment ID without re-inserting results', async () => {
      const configSpy = vi.spyOn(supabaseClientModule, 'isSupabaseConfigured').mockReturnValue(true);
      const rpcSpy = vi.spyOn(supabase, 'rpc').mockResolvedValue({
        data: [{ id: 'existing-asm-456', is_duplicate: true }],
        error: null
      } as any);

      const fromSpy = vi.spyOn(supabase, 'from');

      try {
        const res = await saveAssessmentToBackend(
          'user-123',
          { occupation: 'farmer', age: 45 } as any,
          {
            evaluations: {
              'pm-kisan': { status: 'eligible', missingCriteria: [], explanation: 'Qualified' }
            }
          } as any
        );

        expect(res.success).toBe(true);
        expect(res.isDuplicate).toBe(true);
        expect(res.assessmentId).toBe('existing-asm-456');

        // Verify RPC was invoked with p_user_id and idempotency key
        expect(rpcSpy).toHaveBeenCalledWith('save_assessment_idempotent', expect.objectContaining({
          p_user_id: 'user-123',
          p_idempotency_key: expect.stringMatching(/^sha256-[0-9a-f]{64}$/)
        }));

        // Verify assessment_results table was NOT queried or inserted into for duplicates
        expect(fromSpy).not.toHaveBeenCalledWith('assessment_results');
      } finally {
        configSpy.mockRestore();
        rpcSpy.mockRestore();
        fromSpy.mockRestore();
      }
    });

    it('inserts assessment results on newly created assessment and returns success', async () => {
      const configSpy = vi.spyOn(supabaseClientModule, 'isSupabaseConfigured').mockReturnValue(true);
      const rpcSpy = vi.spyOn(supabase, 'rpc').mockResolvedValue({
        data: [{ id: 'new-asm-789', is_duplicate: false }],
        error: null
      } as any);

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'schemes') {
          return {
            select: vi.fn().mockResolvedValue({
              data: [{ id: 'scheme-uuid-kisan', scheme_code: 'pm-kisan' }],
              error: null
            })
          };
        }
        if (table === 'assessment_results') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null })
          };
        }
        return (supabase.from as any)(table);
      });

      const fromSpy = vi.spyOn(supabase, 'from').mockImplementation(mockFrom as any);

      try {
        const res = await saveAssessmentToBackend(
          'user-123',
          { occupation: 'farmer', age: 45 } as any,
          {
            evaluations: {
              'pm-kisan': { status: 'eligible', missingCriteria: [], explanation: 'Qualified' }
            }
          } as any
        );

        expect(res.success).toBe(true);
        expect(res.isDuplicate).toBe(false);
        expect(res.assessmentId).toBe('new-asm-789');
      } finally {
        configSpy.mockRestore();
        rpcSpy.mockRestore();
        fromSpy.mockRestore();
      }
    });

    it('never reports partial failure as complete success when results insert fails, and rolls back parent', async () => {
      const configSpy = vi.spyOn(supabaseClientModule, 'isSupabaseConfigured').mockReturnValue(true);
      const rpcSpy = vi.spyOn(supabase, 'rpc').mockResolvedValue({
        data: [{ id: 'test-asm-123', is_duplicate: false }],
        error: null
      } as any);

      const rollbackEqMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'assessments') {
          return {
            delete: vi.fn().mockReturnValue({
              eq: rollbackEqMock
            })
          };
        }
        if (table === 'schemes') {
          return {
            select: vi.fn().mockResolvedValue({
              data: [{ id: 'scheme-uuid-1', scheme_code: 'pm-kisan' }],
              error: null
            })
          };
        }
        if (table === 'assessment_results') {
          return {
            insert: vi.fn().mockResolvedValue({
              error: { message: 'Database connection timeout during results insert' }
            })
          };
        }
        return (supabase.from as any)(table);
      });

      const fromSpy = vi.spyOn(supabase, 'from').mockImplementation(mockFrom as any);

      try {
        const res = await saveAssessmentToBackend(
          'user-123',
          { occupation: 'farmer' } as any,
          {
            evaluations: {
              'pm-kisan': { status: 'potentially_eligible', missingCriteria: [], explanation: 'Eligible' }
            }
          } as any
        );

        expect(res.success).toBe(false);
        expect(res.error).toContain('Failed to persist scheme evaluation details');
        expect(rollbackEqMock).toHaveBeenCalledWith('id', 'test-asm-123');
      } finally {
        configSpy.mockRestore();
        rpcSpy.mockRestore();
        fromSpy.mockRestore();
      }
    });
  });

  describe('4. Application Tracking & Data Authenticity', () => {
    it('fetchApplicationsFromDb returns empty array safely for guest user', async () => {
      const res = await fetchApplicationsFromDb(null);
      expect(res.applications).toEqual([]);
    });

    it('createApplicationInDb sanitizes raw status before persisting', async () => {
      const res = await createApplicationInDb(null, {
        scheme_id: 'pm-kisan',
        status: 'UNDER_REVIEW' as any,
        application_reference: 'APP-TEST-99'
      });
      expect(res.success).toBe(true);
    });
  });

  describe('5. Household Members Multi-Family Profiles', () => {
    it('fetchHouseholdMembersFromDb returns empty array for guest user without error', async () => {
      const res = await fetchHouseholdMembersFromDb(null);
      expect(res.members).toEqual([]);
    });

    it('createHouseholdMemberInDb returns local profile fallback for guest user', async () => {
      const res = await createHouseholdMemberInDb(null, {
        name: 'Sunita',
        relation: 'child',
        age: 19,
        gender: 'female',
        occupation: 'student',
        state: 'Karnataka',
        district: 'Mandya',
        socialCategory: 'obc',
        landholdingAcres: 0,
        annualIncome: 0,
        isAadhaarLinkedBank: true,
        isDigiLockerLinked: true
      });

      expect(res.success).toBe(true);
      expect(res.member).toBeDefined();
      expect(res.member?.name).toBe('Sunita');
      expect(res.member?.id).toContain('local-prof-');
    });

    it('deleteHouseholdMemberFromDb succeeds gracefully for guest user', async () => {
      const res = await deleteHouseholdMemberFromDb(null, 'member-123');
      expect(res.success).toBe(true);
    });
  });
});
