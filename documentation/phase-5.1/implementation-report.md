# SAHAYAK — Phase 5.1 Implementation Report
**Phase:** 5.1 — Backend Security, Permissions & Persistence Corrections  
**Product:** SAHAYAK (DS-02 Government Schemes in Your Language)  
**Date:** November 2026  
**Status:** Completed & Validated

---

## 1. Executive Summary

Phase 5.1 audits and resolves backend security, persistence, and tracking discrepancies identified after Phase 5. The implementation adds explicit least-privilege PostgreSQL `GRANT` statements, standardizes application lifecycle statuses between frontend and database layers, prevents duplicate assessment records and handles partial persistence failures, removes fabricated application tracking attributes, introduces the `public.household_members` table for multi-family profiles, and preserves 100% of Sovereign Guest Mode functionality.

---

## 2. Key Corrections & Technical Deliverables

### 2.1 Least-Privilege PostgreSQL Permissions (`GRANT` Statements)
In [supabase/migrations/20261122000005_permissions_and_household.sql](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/supabase/migrations/20261122000005_permissions_and_household.sql):
- **Schema Usage**: Explicitly granted `GRANT USAGE ON SCHEMA public TO anon, authenticated;`.
- **Public Schemes Catalog**: Restricted public (`anon`) and `authenticated` roles to read-only queries (`GRANT SELECT ON public.schemes TO anon, authenticated;`). Explicitly revoked write mutations (`REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.schemes FROM anon, authenticated;`).
- **User-Owned Tables**: Restricted data modifications to `authenticated` users only:
  - `profiles`: `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated;`
  - `assessments`: `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated;`
  - `assessment_results`: `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated;`
  - `saved_schemes`: `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated;`
  - `applications`: `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated;`
  - `household_members`: `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated;`
- **Zero RLS Bypass**: All grants operate strictly under PostgreSQL Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

### 2.2 Application Status Standardization & Bidirectional Mapping
In [src/services/applicationDbService.ts](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/src/services/applicationDbService.ts):
- **Database Status Check Constraint**: Updated in PostgreSQL to accept canonical statuses:
  `CHECK (status IN ('draft', 'submitted', 'in_review', 'under_review', 'verified', 'sanctioned', 'approved', 'rejected'))`.
- **Bidirectional Sanitization**:
  - `mapFrontendStatusToDatabase()`: Normalizes frontend values (`under_review` ➔ `in_review`, `sanctioned`/`disbursed` ➔ `approved`, `action_needed` ➔ `draft`). Unknown or malformed inputs default safely to `submitted`.
  - `mapDatabaseStatusToFrontend()`: Maps database records to frontend badge models (`in_review`/`verified` ➔ `under_review`, `approved` ➔ `sanctioned`, `rejected` ➔ `action_needed`).
  - `calculateStageFromStatus()`: Computes linear stage (1 to 4) strictly from recorded database status without guesswork.
- **Defense in Depth**: Invalid status strings are intercepted before reaching the database, preventing PostgreSQL constraint violations.

### 2.3 Assessment Persistence & Failure Handling
In [src/services/assessmentDbService.ts](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/src/services/assessmentDbService.ts):
- **Deterministic Deduplication**: Computes an idempotency fingerprint from citizen ID and sorted questionnaire answers (`asm-{userId}-{answersFingerprint}`). Checks for existing records before inserting to prevent accidental duplicate assessments.
- **Idempotency Column**: Added `idempotency_key` with a partial unique index in [20261122000005_permissions_and_household.sql](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/supabase/migrations/20261122000005_permissions_and_household.sql).
- **Rollback on Partial Failure**: Previously, failures during `assessment_results` insertion logged a warning while falsely returning `{ success: true }`. The engine now detects insert failures, deletes the orphaned parent assessment record (`ROLLBACK`), and reports `{ success: false, error: ... }`.
- **Component Deduplication**: Integrated a ref tracker in [src/pages/EligibilityResultsScreen.tsx](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/src/pages/EligibilityResultsScreen.tsx) to prevent redundant network invocations during component re-renders.

### 2.4 Application Tracking Authenticity
In [src/pages/ApplicationTrackerScreen.tsx](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/src/pages/ApplicationTrackerScreen.tsx) and [src/pages/ApplicationTrackerDetailScreen.tsx](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/src/pages/ApplicationTrackerDetailScreen.tsx):
- **Removed Fabricated Data**: Removed synthetic SLA countdown dates, hardcoded 14-day delays, and fictional officer names from live application queries.
- **Display Real Stored Attributes**: Displays only data actually persisted in the database (`application_reference`, `status`, `notes`, `created_at`, and official department name).
- **Statutory Notice Banner**: Added persistent citizen disclosure:
  > *"Citizen Self-Tracking Disclosure: The progress records displayed here reflect application tokens generated during citizen self-filing or CSC kiosk assistance. Official government processing and final benefit disbursals are determined exclusively by the respective nodal ministry upon statutory verification."*

### 2.5 Multi-Family Household Members Persistence
In [src/services/householdMembersDbService.ts](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/src/services/householdMembersDbService.ts):
- Created `public.household_members` table with user ownership foreign key (`REFERENCES auth.users(id) ON DELETE CASCADE`) and full RLS policies (`auth.uid() = user_id`).
- Implemented `fetchHouseholdMembersFromDb()`, `createHouseholdMemberInDb()`, and `deleteHouseholdMemberFromDb()`.
- Integrated with [src/store/useAppStore.ts](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/src/store/useAppStore.ts) to automatically hydrate family profiles (`state.profiles`) upon login, while preserving complete local state functionality for Guest Mode.
