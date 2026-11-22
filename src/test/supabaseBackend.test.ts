import { describe, it, expect } from 'vitest';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  EmailSchema, 
  PasswordSchema, 
  SignUpSchema, 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword 
} from '../services/authService';
import { fetchSchemesFromDb } from '../services/schemesDbService';
import { fetchSavedSchemeCodes, saveSchemeToDb, removeSavedSchemeFromDb } from '../services/savedSchemesDbService';
import { fetchApplicationsFromDb, createApplicationInDb } from '../services/applicationDbService';
import { saveAssessmentToDb, fetchLatestUserAssessment } from '../services/assessmentDbService';
import { validateDocumentFile, uploadUserDocument, getDocumentSignedUrl } from '../services/storageService';

describe('Phase 5 — Supabase Backend & Database Architecture', () => {
  describe('1. Supabase Client Configuration & Security', () => {
    it('should initialize a valid Supabase client instance', () => {
      expect(supabase).toBeDefined();
      expect(supabase.auth).toBeDefined();
      expect(supabase.from).toBeDefined();
      expect(supabase.storage).toBeDefined();
    });

    it('should determine configuration state accurately', () => {
      const configured = isSupabaseConfigured();
      expect(typeof configured).toBe('boolean');
    });

    it('should never expose or reference a service-role secret key in client environment', () => {
      // Frontend client should NEVER use SUPABASE_SERVICE_ROLE_KEY
      const meta = (import.meta as any).env || {};
      expect(meta.VITE_SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
      expect(meta.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    });
  });

  describe('2. Authentication Schemas & Zod Input Validation', () => {
    it('validates correct email addresses and rejects invalid formats', () => {
      expect(EmailSchema.safeParse('citizen@sahayak.gov.in').success).toBe(true);
      expect(EmailSchema.safeParse('farmer.karnataka@gmail.com').success).toBe(true);
      expect(EmailSchema.safeParse('invalid-email').success).toBe(false);
      expect(EmailSchema.safeParse('').success).toBe(false);
    });

    it('enforces password minimum length of 6 characters', () => {
      expect(PasswordSchema.safeParse('pass123').success).toBe(true);
      expect(PasswordSchema.safeParse('12345').success).toBe(false);
      expect(PasswordSchema.safeParse('').success).toBe(false);
    });

    it('validates user registration payload correctly', () => {
      const validPayload = {
        email: 'rameshwar@karnataka.gov.in',
        password: 'securePassword123',
        fullName: 'Rameshwar Yadav',
        preferredLanguage: 'kn' as const
      };
      const result = SignUpSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preferredLanguage).toBe('kn');
      }
    });

    it('rejects registration with short full name or invalid language', () => {
      const invalidPayload = {
        email: 'rameshwar@karnataka.gov.in',
        password: 'pass',
        fullName: 'R',
        preferredLanguage: 'fr' as any
      };
      const result = SignUpSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('3. Auth Service Operations & Sovereign Guest Mode', () => {
    it('registerUser rejects invalid input before reaching Supabase', async () => {
      const res = await registerUser({
        email: 'bad',
        password: '123',
        fullName: '',
        preferredLanguage: 'kn'
      });
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('loginUser operates safely and reports guest mode or invalid inputs', async () => {
      const res = await loginUser('invalid-email', '123');
      expect(res.success).toBe(false);
    });

    it('logoutUser executes without crashing', async () => {
      const res = await logoutUser();
      expect(res).toBeDefined();
      expect(typeof res.success).toBe('boolean');
    });

    it('resetPassword validates email before dispatching', async () => {
      const res = await resetPassword('not-an-email');
      expect(res.success).toBe(false);
    });
  });

  describe('4. Database Services & Seamless Guest Fallback', () => {
    it('fetchSchemesFromDb returns all 7 verified schemes when unconfigured or in offline fallback', async () => {
      const schemes = await fetchSchemesFromDb();
      expect(schemes).toBeDefined();
      expect(schemes.length).toBeGreaterThanOrEqual(7);
      const schemeIds = schemes.map(s => s.id);
      expect(schemeIds).toContain('pm-kisan');
      expect(schemeIds).toContain('pm-jay');
      expect(schemeIds).toContain('pmmvy');
      expect(schemeIds).toContain('pm-svanidhi');
      expect(schemeIds).toContain('post-matric-scholarship');
      expect(schemeIds).toContain('post-matric-scholarship-minority');
      expect(schemeIds).toContain('pm-kcc');
    });

    it('fetchSavedSchemeCodes returns empty list when user is null (guest mode)', async () => {
      const res = await fetchSavedSchemeCodes(null);
      expect(res.savedCodes).toEqual([]);
    });

    it('saveSchemeToDb succeeds without crash for guest user', async () => {
      const res = await saveSchemeToDb(null, 'pm-kisan');
      expect(res.success).toBe(true);
    });

    it('removeSavedSchemeFromDb succeeds without crash for guest user', async () => {
      const res = await removeSavedSchemeFromDb(null, 'pm-kisan');
      expect(res.success).toBe(true);
    });

    it('fetchApplicationsFromDb returns empty list for guest user without error', async () => {
      const res = await fetchApplicationsFromDb(null);
      expect(res.applications).toEqual([]);
    });

    it('createApplicationInDb succeeds in guest mode fallback', async () => {
      const res = await createApplicationInDb(null, {
        scheme_id: 'pm-kisan',
        status: 'submitted',
        application_reference: 'APP-TEST-1234'
      });
      expect(res.success).toBe(true);
    });

    it('saveAssessmentToDb returns guest mode fallback without error', async () => {
      const res = await saveAssessmentToDb(null, { occupation: 'farmer' } as any, { evaluations: {} } as any);
      expect(res.success).toBe(true);
      expect(res.isGuest).toBe(true);
    });

    it('fetchLatestUserAssessment returns null for guest user', async () => {
      const res = await fetchLatestUserAssessment(null);
      expect(res.assessment).toBeNull();
    });
  });

  describe('5. Storage Security & File Upload Policy Enforcement', () => {
    it('accepts compliant PDF documents under 5MB', () => {
      const validPdf = new File(['%PDF-1.4 mock content'], 'aadhaar_card.pdf', {
        type: 'application/pdf'
      });
      const check = validateDocumentFile(validPdf);
      expect(check.valid).toBe(true);
      expect(check.error).toBeUndefined();
    });

    it('accepts compliant JPEG and PNG images under 5MB', () => {
      const validJpeg = new File(['mock jpeg binary'], 'passbook.jpg', {
        type: 'image/jpeg'
      });
      expect(validateDocumentFile(validJpeg).valid).toBe(true);

      const validPng = new File(['mock png binary'], 'land_record.png', {
        type: 'image/png'
      });
      expect(validateDocumentFile(validPng).valid).toBe(true);
    });

    it('strictly rejects files exceeding the 5MB statutory limit', () => {
      const largeContent = new Uint8Array(6 * 1024 * 1024); // 6MB
      const oversizedFile = new File([largeContent], 'huge_scan.pdf', {
        type: 'application/pdf'
      });
      const check = validateDocumentFile(oversizedFile);
      expect(check.valid).toBe(false);
      expect(check.error).toContain('5MB');
    });

    it('strictly rejects disallowed file extensions and unsafe MIME types', () => {
      const htmlFile = new File(['<script>alert(1)</script>'], 'hack.html', {
        type: 'text/html'
      });
      expect(validateDocumentFile(htmlFile).valid).toBe(false);

      const exeFile = new File(['MZ executable'], 'installer.exe', {
        type: 'application/x-msdownload'
      });
      expect(validateDocumentFile(exeFile).valid).toBe(false);

      const zipFile = new File(['PK zip content'], 'archive.zip', {
        type: 'application/zip'
      });
      expect(validateDocumentFile(zipFile).valid).toBe(false);
    });

    it('uploadUserDocument requires authenticated user_id', async () => {
      const validPdf = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const res = await uploadUserDocument(null, 'aadhaar', validPdf);
      expect(res.success).toBe(false);
      expect(res.error).toContain('User must be authenticated');
    });

    it('getDocumentSignedUrl requires authenticated user_id', async () => {
      const res = await getDocumentSignedUrl(null, 'user123/aadhaar_123.pdf');
      expect(res.signedUrl).toBeNull();
      expect(res.error).toBeDefined();
    });
  });
});
