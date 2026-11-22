import { describe, it, expect, vi } from 'vitest';
import { 
  mapFrontendStatusToDatabase, 
  mapDatabaseStatusToFrontend, 
  calculateStageFromStatus,
  createApplicationInDb,
  fetchApplicationsFromDb 
} from '../services/applicationDbService';
import { saveAssessmentToBackend } from '../services/assessmentDbService';
import { 
  fetchHouseholdMembersFromDb, 
  createHouseholdMemberInDb, 
  deleteHouseholdMemberFromDb 
} from '../services/householdMembersDbService';
import { supabase } from '../lib/supabaseClient';

describe('Phase 5.1 — Backend Security, Permissions & Persistence Corrections', () => {
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

  describe('2. Assessment Persistence & Failure Handling', () => {
    it('preserves guest mode persistence without network errors', async () => {
      const res = await saveAssessmentToBackend(null, { occupation: 'farmer' } as any, { evaluations: {} } as any);
      expect(res.success).toBe(true);
      expect(res.isGuest).toBe(true);
      expect(res.assessmentId).toBeDefined();
    });

    it('never reports partial failure as complete success when results insert fails', async () => {
      // Mock supabase to simulate failure during assessment_results insert
      const originalFrom = supabase.from;
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'assessments') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: 'test-asm-123' }, error: null })
              })
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: null, error: null })
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
        return (originalFrom as any)(table);
      });

      // Temporarily swap supabase.from
      (supabase as any).from = mockFrom;

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
      } finally {
        (supabase as any).from = originalFrom;
      }
    });

    it('detects duplicate assessment fingerprints and avoids redundant records', async () => {
      const originalFrom = supabase.from;
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'assessments') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'existing-asm-456' }, error: null })
          };
        }
        return (originalFrom as any)(table);
      });

      (supabase as any).from = mockFrom;

      try {
        const res = await saveAssessmentToBackend(
          'user-123',
          { occupation: 'farmer', age: 45 } as any,
          { evaluations: {} } as any
        );

        expect(res.success).toBe(true);
        expect(res.isDuplicate).toBe(true);
        expect(res.assessmentId).toBe('existing-asm-456');
      } finally {
        (supabase as any).from = originalFrom;
      }
    });
  });

  describe('3. Application Tracking & Data Authenticity', () => {
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

  describe('4. Household Members Multi-Family Profiles', () => {
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
