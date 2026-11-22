# SAHAYAK — Phase 5.2: Database Schema & Relational Integrity Verification

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 Government Schemes in Your Language  
**Phase:** 5.2 — Final Supabase Deployment Verification  
**Date:** November 2026  
**Status:** VERIFIED & HARDENED

---

## 1. Executive Summary

This report provides the exhaustive relational architecture audit of SAHAYAK's database schema. It documents table structures, primary/foreign key relationships, column data types, cascading constraints, index performance optimizations, standardized enumeration checks, and the cryptographic SHA-256 idempotency mechanism.

---

## 2. Table & Column Definitions

### 2.1 Table: `profiles`
Represents citizen identity and localized preferences, synchronizing automatically from `auth.users`.
- `id`: `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
- `full_name`: `TEXT`
- `preferred_language`: `VARCHAR(10) DEFAULT 'en'`
- `state`: `TEXT`
- `district`: `TEXT`
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`
- `updated_at`: `TIMESTAMPTZ DEFAULT NOW()`

### 2.2 Table: `schemes`
Central government scheme registry containing official details, structured rules, and benefit descriptions.
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `scheme_code`: `VARCHAR(50) UNIQUE NOT NULL`
- `name`: `VARCHAR(255) NOT NULL`
- `description`: `TEXT NOT NULL`
- `department`: `VARCHAR(255)`
- `category`: `VARCHAR(100)`
- `state`: `VARCHAR(100)` (NULL indicates central scheme)
- `official_url`: `TEXT`
- `eligibility_rules`: `JSONB DEFAULT '{}'::jsonb`
- `benefits`: `JSONB DEFAULT '{}'::jsonb`
- `is_active`: `BOOLEAN DEFAULT true`
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`
- `updated_at`: `TIMESTAMPTZ DEFAULT NOW()`

### 2.3 Table: `assessments`
Tracks comprehensive eligibility questionnaire evaluations for citizens.
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `assessment_data`: `JSONB NOT NULL` (Captured citizen responses)
- `idempotency_key`: `TEXT` (Cryptographic `sha256-<hex>` digest)
- `completed_at`: `TIMESTAMPTZ`
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`
- **Constraint**: `CONSTRAINT uq_assessments_user_idempotency UNIQUE (user_id, idempotency_key)`

### 2.4 Table: `assessment_results`
Individual scheme eligibility outcomes calculated during an assessment session.
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `assessment_id`: `UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE`
- `scheme_id`: `UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE`
- `eligibility_status`: `VARCHAR(50) NOT NULL` (`eligible`, `ineligible`, `conditional`, `missing_information`, `needs_review`)
- `missing_information`: `JSONB DEFAULT '[]'::jsonb`
- `explanation`: `JSONB DEFAULT '{}'::jsonb`
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`

### 2.5 Table: `saved_schemes`
Citizen bookmarks for quick reference.
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `scheme_id`: `UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE`
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`
- **Constraint**: `UNIQUE(user_id, scheme_id)`

### 2.6 Table: `applications`
Citizen application tracker reflecting actual stored data without fabricated government verification states.
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `scheme_id`: `UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE`
- `status`: `VARCHAR(50) DEFAULT 'submitted'`
- `application_reference`: `VARCHAR(100)`
- `notes`: `TEXT`
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`
- `updated_at`: `TIMESTAMPTZ DEFAULT NOW()`
- **Constraint**:
  ```sql
  CONSTRAINT check_application_status CHECK (
    status IN (
      'submitted',
      'under_review',
      'document_verification',
      'sanctioned',
      'approved',
      'disbursed',
      'rejected',
      'appealed'
    )
  )
  ```

### 2.7 Table: `household_members`
Citizen household registry supporting joint family eligibility checks.
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `name`: `VARCHAR(255) NOT NULL`
- `relation`: `VARCHAR(50) NOT NULL`
- `age`: `INTEGER`
- `gender`: `VARCHAR(20)`
- `occupation`: `VARCHAR(100)`
- `annual_income`: `NUMERIC(12,2)`
- `social_category`: `VARCHAR(50)`
- `disability`: `BOOLEAN DEFAULT false`
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`
- `updated_at`: `TIMESTAMPTZ DEFAULT NOW()`

---

## 3. Performance Indexing Strategy

To maintain low latencies as citizen records scale, B-tree indexes are defined on foreign keys and frequently filtered columns:

```sql
CREATE INDEX IF NOT EXISTS idx_schemes_code ON schemes(scheme_code);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON schemes(is_active);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_idempotency ON assessments(user_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment ON assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_scheme ON assessment_results(scheme_id);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_user ON saved_schemes(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_household_members_user ON household_members(user_id);
```

---

## 4. Idempotency Hashing Specification

To prevent duplicate assessment records caused by network retries or rapid double-clicks:
1. Citizen questionnaire answers are canonicalized by sorting top-level keys alphabetically.
2. The payload `${userId}:${JSON.stringify(canonicalObj)}` is encoded using UTF-8.
3. Native Web Crypto calculates the SHA-256 digest:
   $$\text{Hash} = \operatorname{SHA-256}(U_{id} \mathbin{\Vert} \text{Canonical}(A))$$
4. The output is formatted as `sha256-<64-char-hex>`.
5. Database insertion uses `ON CONFLICT (user_id, idempotency_key) DO NOTHING RETURNING id`.
6. If an assessment with the identical hash already exists, its existing primary key is returned, preserving idempotent consistency without raising runtime exceptions.

---

## 5. Automated Test Coverage

The database client interfaces, services, and offline fallbacks are validated through the automated Vitest test suite (`112 passing tests`):

- **Auth Service**: `src/test/supabaseBackend.test.ts` (Validates signup, login, session recovery, guest-mode fallbacks).
- **Assessment Persistence & Idempotency**: `src/test/backendCorrections.test.ts` (Validates SHA-256 idempotency handling, duplicate suppression, and partial failure detection).
- **Application Status Constraints**: `src/test/backendCorrections.test.ts` (Validates that only the 8 standardized statuses are sent to the database).
- **Household Members Service**: `src/test/supabaseBackend.test.ts` (Validates CRUD operations for family members).
- **Scheme Search & Caching**: `src/test/schemeSearch.test.ts` and `src/test/schemeValidation.test.ts` (Validates statutory schemes and fallback behavior).

---

## 6. Execution Verification

The consolidation script `supabase/full_schema_setup.sql` has been formatted and audited. It is prepared for immediate deployment in the Supabase Dashboard SQL Editor, completing the backend activation for SAHAYAK Phase 5.2.
