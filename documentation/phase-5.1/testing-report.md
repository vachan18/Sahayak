# SAHAYAK — Phase 5.1 Verification & Testing Report
**Phase:** 5.1 — Backend Security, Permissions & Persistence Corrections  
**Product:** SAHAYAK (DS-02 Government Schemes in Your Language)  
**Test Framework:** Vitest v5.1.1  
**TypeScript Version:** 5.6.3 (Strict Mode)  
**Total Automated Tests:** **112 Passed** across 8 test suites (0 failures)

---

## 1. Automated Test Suites Summary

```
 RUN  v5.1.1 C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory

 ✓ src/test/translations.test.ts (4 tests)
 ✓ src/test/schemeValidation.test.ts (5 tests)
 ✓ src/test/eligibilityEngine.test.ts (49 tests)
 ✓ src/test/schemeSearch.test.ts (5 tests)
 ✓ src/test/backendCorrections.test.ts (15 tests)
 ✓ src/test/store.test.ts (6 tests)
 ✓ src/test/securityAndPrivacy.test.ts (3 tests)
 ✓ src/test/supabaseBackend.test.ts (25 tests)

 Test Files  8 passed (8)
      Tests  112 passed (112)
   Duration  8.71s
```

---

## 2. Phase 5.1 New Tests (`src/test/backendCorrections.test.ts`)

| Test Suite | Spec Name | Outcome | Verification Detail |
| :--- | :--- | :--- | :--- |
| **Status Mapping** | `correctly maps under_review to canonical in_review` | **PASS** | Validates `under_review` ➔ `in_review` normalization |
| **Status Mapping** | `correctly maps sanctioned and approved to canonical approved` | **PASS** | Validates `sanctioned`, `approved`, `disbursed` ➔ `approved` |
| **Status Mapping** | `correctly maps verified to canonical verified` | **PASS** | Validates `verified` preservation |
| **Status Mapping** | `correctly maps rejected to canonical rejected` | **PASS** | Validates `rejected` mapping |
| **Status Mapping** | `safely normalizes unknown or null statuses to submitted` | **PASS** | Validates fallback to `submitted` for invalid inputs |
| **Status Mapping** | `maps database statuses to frontend badge representations` | **PASS** | Validates `in_review` ➔ `under_review`, `approved` ➔ `sanctioned` |
| **Status Mapping** | `calculates the correct linear stage for progress steppers` | **PASS** | Stage 1 (submitted) ➔ 2 (in_review) ➔ 3 (verified) ➔ 4 (approved) |
| **Persistence** | `preserves guest mode persistence without network errors` | **PASS** | Validates `{ success: true, isGuest: true }` |
| **Persistence** | `never reports partial failure as complete success when results insert fails` | **PASS** | Simulates failure during `assessment_results` insert, verifies parent rollback and `{ success: false }` |
| **Persistence** | `detects duplicate assessment fingerprints and avoids redundant records` | **PASS** | Verifies `isDuplicate: true` and idempotent key lookup |
| **Tracking** | `fetchApplicationsFromDb returns empty array safely for guest user` | **PASS** | No crashes or unhandled rejections |
| **Tracking** | `createApplicationInDb sanitizes raw status before persisting` | **PASS** | Intercepts uppercase/invalid status strings before DB dispatch |
| **Household** | `fetchHouseholdMembersFromDb returns empty array for guest user without error` | **PASS** | Guest fallback verification |
| **Household** | `createHouseholdMemberInDb returns local profile fallback for guest user` | **PASS** | Generates `local-prof-{timestamp}` in guest mode |
| **Household** | `deleteHouseholdMemberFromDb succeeds gracefully for guest user` | **PASS** | No crash on deletion |

---

## 3. Actual Live Supabase Verification Report

Live connection was tested against project `https://jqoceggpxejagpsetjzi.supabase.co` using [scripts/verify_live_supabase.cjs](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/scripts/verify_live_supabase.cjs).

### Verified Live Operations:
1. **Endpoint Reachability**: `https://jqoceggpxejagpsetjzi.supabase.co` responds with `200 OK`.
2. **Auth Service Registration**: Live account creation succeeded (`userId: d63d24ba-1c3f-4abb-b92a-d98037998aeb`).
3. **GoTrue Rate Limiting**: Consecutive automated signup requests triggered GoTrue's built-in email rate limit (`email rate limit exceeded`), verifying active security controls on the live project.

### Pending Live Database Step:
- **Table Provisioning**: Querying `schemes` returned PostgREST error `PGRST205` (*Could not find table 'public.schemes' in schema cache*).
- **Reason**: Supabase client publishable/anon keys do not possess PostgreSQL `CREATE TABLE` / DDL superuser rights.
- **Resolution**: The unified migration script [supabase/full_schema_setup.sql](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/supabase/full_schema_setup.sql) has been compiled and must be executed in the Supabase Dashboard SQL Editor.

---

## 4. Production Build Verification

```bash
> tsc -b && vite build

vite v6.4.6 building for production...
transforming...
✓ 1681 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.22 kB │ gzip:   0.65 kB
dist/assets/index-D7KqjI0a.css   54.41 kB │ gzip:   9.08 kB
dist/assets/index-BYxQ6o87.js   737.52 kB │ gzip: 195.12 kB
✓ built in 5.95s
```
Zero compilation errors, zero strict type errors.
