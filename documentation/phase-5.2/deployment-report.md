# SAHAYAK — Phase 5.2.1: Supabase Deployment & Verification Report

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 Government Schemes in Your Language  
**Phase:** 5.2.1 — Final Backend Corrections & Verification  
**Date:** November 2026  
**Status:** BACKEND CODE HARDENED & VERIFIED (Cloud Provisioning Ready)

---

## 1. Executive Summary

Phase 5.2.1 provides the final backend corrections and verification for SAHAYAK prior to cloud deployment. This phase addresses critical backend robustness requirements:
1. **Assessment Hashing**: Replaced ad-hoc string formatting with deterministic canonical JSON serialization. Preserves exact value types (numbers, booleans, strings) and character casing. Strictly uses SHA-256 via the native Web Crypto API (`crypto.subtle.digest`). Completely removed weak fallback hashing and returns an explicit error if secure cryptographic hashing is unavailable.
2. **Race-Safe Idempotency**: Eliminated the vulnerable "check-then-insert" pattern. Created the PostgreSQL RPC function `save_assessment_idempotent` utilizing atomic `INSERT ... ON CONFLICT (user_id, idempotency_key) ... DO UPDATE ... RETURNING assessments.id, (xmax <> 0) AS is_duplicate`. Automatically detects duplicates and returns the existing assessment ID without redundant insertions.
3. **Audit of Verification Suite**: Corrected the live verification script (`scripts/verify_live_supabase.cjs`). Removed false claims that treated `PGRST205` ("Table not found in schema cache") as proof of RLS security; it is now strictly treated as a missing-table failure. Dynamically resolves scheme UUIDs before application operations. Incorporates cross-user CRUD (SELECT, INSERT, UPDATE, DELETE), data integrity assertions, two-user storage testing, and explicit PASS, FAIL, and NOT RUN statuses.
4. **Consolidated SQL Deployment**: Audited `supabase/full_schema_setup.sql` across all migrations (001–006). Ensures constraints, triggers, role grants, RLS policies, and storage policies are 100% idempotent, safe to re-run without dropping tables or losing user data, and contains no silently swallowed SQL exceptions.
5. **Rigorous Documentation**: Strictly distinguishes between **Local Unit Tests**, **Mocked Integration Tests**, and **Live Cloud Verification**. No unexecuted live deployment claims are made.

---

## 2. Test Execution & Verification Categorization

To maintain complete architectural integrity, test evidence is explicitly divided into three tiers:

### 2.1 Local Automated Unit Tests (Vitest)
- **Status:** **PASS** (119 passing tests across 8 test suites)
- **Runtime:** Node.js / jsdom via Vitest (`npm test`)
- **Coverage:**
  - `src/test/backendCorrections.test.ts` (22 tests): Deterministic canonical JSON key ordering, type preservation, case preservation, SHA-256 hashing format (`sha256-<64-hex>`), error handling on missing crypto subtle, status normalization, and household member fallbacks.
  - `src/test/translations.test.ts` (4 tests): Multi-lingual key completeness.
  - `src/test/schemeSearch.test.ts` (5 tests): Statutory scheme filtering and caching.
  - `src/test/schemeValidation.test.ts` (5 tests): Scheme schema and constraint validation.
  - `src/test/eligibilityEngine.test.ts` (49 tests): Core welfare rules engine.
  - `src/test/securityAndPrivacy.test.ts` (3 tests): Local storage data hygiene.
  - `src/test/store.test.ts` (6 tests): Client state management.
  - `src/test/supabaseBackend.test.ts` (25 tests): Auth input validation, password policies, sovereign guest fallbacks, and storage file validation.

### 2.2 Mocked Integration Tests (Vitest Mocks)
- **Status:** **PASS**
- **Tested Operations:**
  - **Idempotent RPC Simulation**: Mocked `supabase.rpc('save_assessment_idempotent', ...)` returning `{ is_duplicate: true }` verifies that existing assessment IDs are returned and `assessment_results` are NOT re-inserted.
  - **New Assessment Insertion**: Mocked `supabase.rpc` returning `{ is_duplicate: false }` verifies that evaluation results are properly persisted to `assessment_results`.
  - **Atomic Transaction Rollback**: When `assessment_results` insertion fails, parent assessment deletion rollback (`assessments.delete().eq('id', ...)` ) is called and verified.
  - **Status Constraint Normalization**: Frontend application statuses are mapped bidirectionally to database constraints.

### 2.3 Live Supabase Cloud Project Verification
- **Status:** **PENDING DASHBOARD DDL PROVISIONING** (Explicit Results Recorded)
- **Target URL:** `https://jqoceggpxejagpsetjzi.supabase.co`
- **Execution Evidence:** `node scripts/verify_live_supabase.cjs`

| Check ID | Verification Target | Live Cloud Response | Explicit Status | Technical Explanation |
| :--- | :--- | :--- | :--- | :--- |
| **TEST_1** | Public Schemes Anonymous Read | HTTP 404 / PGRST205 | **FAIL** | Table `public.schemes` is not in the schema cache. DDL script has not yet been executed in dashboard. |
| **TEST_2** | Anonymous Block on Private Tables | HTTP 404 / PGRST205 | **FAIL** | Private tables (`profiles`, `assessments`, etc.) do not yet exist. PGRST205 is correctly treated as missing-table failure, not RLS proof. |
| **TEST_3** | Isolated Citizen Account Creation | Auth Rate Limit Triggered | **NOT RUN** | GoTrue auth service is responsive and actively rate-limiting repeated signup requests. |
| **TEST_4** | Cross-User CRUD Isolation | Skipped | **NOT RUN** | Awaits table provisioning in Supabase project dashboard. |
| **TEST_5** | User A Data Integrity Post Tampering | Skipped | **NOT RUN** | Awaits table provisioning in Supabase project dashboard. |
| **TEST_6** | Storage Bucket Mutual Isolation | Skipped | **NOT RUN** | Awaits storage bucket creation and table provisioning. |

---

## 3. Implementation Details

### 3.1 Deterministic Canonical JSON & SHA-256 Hashing

In `src/services/assessmentDbService.ts`:

```typescript
export function canonicalJsonStringify(data: any): string {
  if (data === null || typeof data !== 'object') {
    return JSON.stringify(data);
  }
  if (Array.isArray(data)) {
    return '[' + data.map(item => (item === undefined ? 'null' : canonicalJsonStringify(item))).join(',') + ']';
  }
  const sortedKeys = Object.keys(data).sort();
  const entries: string[] = [];
  for (const key of sortedKeys) {
    const val = data[key];
    if (val !== undefined) {
      entries.push(`${JSON.stringify(key)}:${canonicalJsonStringify(val)}`);
    }
  }
  return '{' + entries.join(',') + '}';
}

export async function computeCanonicalAnswersSha256(userId: string, answers: AssessmentAnswers): Promise<string> {
  const canonicalPayload = canonicalJsonStringify({ answers: answers || {}, userId });
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : (globalThis as any)?.crypto;
  const subtle = cryptoObj?.subtle;

  if (!subtle || typeof subtle.digest !== 'function') {
    throw new Error('Secure hashing unavailable: Web Crypto API (crypto.subtle) with SHA-256 is required.');
  }

  const msgBuffer = new TextEncoder().encode(canonicalPayload);
  const hashBuffer = await subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return `sha256-${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;
}
```

### 3.2 Race-Safe Atomic Idempotency RPC

In `supabase/full_schema_setup.sql` and `supabase/migrations/20261122000006_assessment_idempotency_rpc.sql`:

```sql
CREATE OR REPLACE FUNCTION public.save_assessment_idempotent(
    p_user_id UUID,
    p_assessment_data JSONB,
    p_idempotency_key TEXT,
    p_completed_at TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
    id UUID,
    is_duplicate BOOLEAN
) AS $$
DECLARE
    v_id UUID;
    v_is_duplicate BOOLEAN;
BEGIN
    INSERT INTO public.assessments (user_id, assessment_data, idempotency_key, completed_at)
    VALUES (p_user_id, p_assessment_data, p_idempotency_key, p_completed_at)
    ON CONFLICT (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL
    DO UPDATE SET idempotency_key = EXCLUDED.idempotency_key
    RETURNING assessments.id, (xmax <> 0) INTO v_id, v_is_duplicate;

    RETURN QUERY SELECT v_id, v_is_duplicate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.save_assessment_idempotent(UUID, JSONB, TEXT, TIMESTAMPTZ) TO authenticated, service_role;
```

---

## 4. Production Build Verification

TypeScript compilation and Vite production packaging:
- Command: `npm run build` (`tsc -b && vite build`)
- Result: **CLEAN BUILD**
- Output artifacts:
  - `dist/index.html` (1.22 kB)
  - `dist/assets/index-G38TlWxc.css` (54.25 kB)
  - `dist/assets/index-CoQCgInk.js` (742.15 kB)
- Zero TypeScript errors, zero bundler errors.

---

## 5. Next Steps for Cloud Deployment (Manual Dashboard Step)

Because Supabase does not permit arbitrary client keys to execute DDL (`CREATE TABLE`, `CREATE FUNCTION`, `ALTER TABLE`), the consolidated script must be executed by the database administrator in the Supabase Dashboard:

1. Open the [Supabase Dashboard SQL Editor](https://supabase.com/dashboard/project/jqoceggpxejagpsetjzi).
2. Paste the contents of `supabase/full_schema_setup.sql`.
3. Click **Run**.
4. Run `node scripts/verify_live_supabase.cjs` to confirm that all checks transition to **PASS**.
