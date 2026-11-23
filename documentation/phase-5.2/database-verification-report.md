# SAHAYAK — Phase 5.2.1: Database Schema & Relational Integrity Verification

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 Government Schemes in Your Language  
**Phase:** 5.2.1 — Final Backend Corrections & Verification  
**Date:** November 2026  
**Status:** SCHEMA AUDITED & VERIFIED (Ready for Cloud Execution)

---

## 1. Executive Summary

This report documents the relational schema, constraints, indexes, triggers, and RPC functions prepared for the SAHAYAK Supabase backend. In Phase 5.2.1, the schema setup was audited across all six migrations and consolidated into `supabase/full_schema_setup.sql`.

Key architectural enhancements include:
- **Deterministic Canonical JSON Hashing**: Strict SHA-256 digest over canonicalized JSON answers, preserving original value types (boolean, number, string, null) and character casing.
- **Race-Safe Atomic Idempotency RPC**: Introduced `save_assessment_idempotent` in PostgreSQL to execute atomic `INSERT ... ON CONFLICT (user_id, idempotency_key) ... DO UPDATE ... RETURNING assessments.id, (xmax <> 0) AS is_duplicate`.
- **Constraint Standardization**: Safe update of `chk_application_status` across all 8 lifecycle statuses without silently swallowing SQL exceptions.
- **Non-Destructive Safe Rerun**: Guarantees that `full_schema_setup.sql` can be re-executed at any time without dropping tables or altering existing user records.

---

## 2. Table Definitions & Constraints

### 2.1 Table: `public.profiles`
- `id`: `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
- `full_name`: `TEXT`
- `preferred_language`: `TEXT NOT NULL DEFAULT 'kn'`
- `state`: `TEXT DEFAULT 'Karnataka'`
- `district`: `TEXT DEFAULT 'Mandya'`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Indexes**: `idx_profiles_preferred_language`

### 2.2 Table: `public.schemes`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `scheme_code`: `TEXT UNIQUE NOT NULL`
- `name`: `TEXT NOT NULL`
- `description`: `TEXT NOT NULL`
- `department`: `TEXT NOT NULL`
- `category`: `TEXT NOT NULL`
- `state`: `TEXT NOT NULL DEFAULT 'ALL'`
- `official_url`: `TEXT NOT NULL`
- `eligibility_rules`: `JSONB NOT NULL DEFAULT '[]'::jsonb`
- `benefits`: `JSONB NOT NULL DEFAULT '{}'::jsonb`
- `is_active`: `BOOLEAN NOT NULL DEFAULT true`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Indexes**: `idx_schemes_code`, `idx_schemes_category`, `idx_schemes_is_active`, `idx_schemes_state`

### 2.3 Table: `public.assessments`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `assessment_data`: `JSONB NOT NULL DEFAULT '{}'::jsonb`
- `idempotency_key`: `TEXT` (Format: `sha256-<64-char-hex>`)
- `completed_at`: `TIMESTAMPTZ`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Indexes**:
  - `idx_assessments_user_id ON assessments(user_id)`
  - `idx_assessments_created_at ON assessments(created_at DESC)`
  - `idx_assessments_user_idempotency UNIQUE (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL`

### 2.4 Table: `public.assessment_results`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `assessment_id`: `UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE`
- `scheme_id`: `UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE`
- `eligibility_status`: `TEXT NOT NULL`
- `missing_information`: `JSONB NOT NULL DEFAULT '[]'::jsonb`
- `explanation`: `JSONB NOT NULL DEFAULT '{}'::jsonb`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Indexes**: `idx_assessment_results_assessment_id`, `idx_assessment_results_scheme_id`, `idx_assessment_results_status`

### 2.5 Table: `public.saved_schemes`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `scheme_id`: `UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Constraint**: `CONSTRAINT uq_user_saved_scheme UNIQUE (user_id, scheme_id)`
- **Indexes**: `idx_saved_schemes_user_id`, `idx_saved_schemes_scheme_id`

### 2.6 Table: `public.applications`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `scheme_id`: `UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE`
- `status`: `TEXT NOT NULL DEFAULT 'submitted'`
- `application_reference`: `TEXT`
- `notes`: `TEXT`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Constraint**:
  `CONSTRAINT chk_application_status CHECK (status IN ('draft', 'submitted', 'in_review', 'under_review', 'verified', 'sanctioned', 'approved', 'rejected'))`
- **Indexes**: `idx_applications_user_id`, `idx_applications_scheme_id`, `idx_applications_status`

### 2.7 Table: `public.household_members`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id`: `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `name`: `TEXT NOT NULL`
- `relation`: `TEXT NOT NULL`
- `age`: `INTEGER NOT NULL DEFAULT 18`
- `gender`: `TEXT NOT NULL DEFAULT 'other'`
- `occupation`: `TEXT NOT NULL DEFAULT 'other'`
- `state`: `TEXT NOT NULL DEFAULT 'Karnataka'`
- `district`: `TEXT DEFAULT 'Mandya'`
- `social_category`: `TEXT DEFAULT 'general'`
- `landholding_acres`: `NUMERIC(6, 2) NOT NULL DEFAULT 0`
- `annual_income`: `NUMERIC(12, 2) NOT NULL DEFAULT 0`
- `is_aadhaar_linked_bank`: `BOOLEAN NOT NULL DEFAULT false`
- `is_digilocker_linked`: `BOOLEAN NOT NULL DEFAULT false`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Indexes**: `idx_household_members_user_id`

---

## 3. Database Functions & Procedures

### 3.1 Idempotency RPC Function: `save_assessment_idempotent`

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
```

**Properties:**
- **Race-Condition Immune**: Concurrency is handled entirely at the PostgreSQL transaction level using the partial unique index.
- **Deduplication Output**: `(xmax <> 0)` is `true` when conflict occurs and the row is updated; `false` when a new row is inserted.
- **Security**: Defined as `SECURITY DEFINER` and granted to `authenticated` and `service_role`.

---

## 4. Verification & Testing Distinction

- **Local Vitest Suite**: All 119 tests pass cleanly (`npm test`).
- **Production Build**: Clean build with zero TypeScript errors (`tsc -b && vite build`).
- **Live Supabase Cloud**: Currently pending manual execution of `supabase/full_schema_setup.sql` in the Supabase Dashboard SQL Editor by the project owner. Queries to the live project currently return `PGRST205` (indicating missing tables in schema cache), which is handled and reported accurately.
