-- =============================================================================
-- Migration 005: Permissions, Household Members, and Status Standardization
-- Phase: 5.1 — Backend Security & Persistence Corrections
-- Description: 
--   1. Adds explicit least-privilege PostgreSQL GRANT statements for anon and authenticated roles.
--   2. Introduces public.household_members table with RLS for multi-family profiles.
--   3. Standardizes application status check constraint.
--   4. Adds idempotency_key to public.assessments to prevent duplicate records.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Explicit Least-Privilege Schema & Table Grants
-- -----------------------------------------------------------------------------

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Schemes directory: public read-only for both unauthenticated (anon) and authenticated citizens
GRANT SELECT ON public.schemes TO anon, authenticated;

-- User-owned tables: authenticated citizens only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_schemes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;

-- Revoke all write permissions on public.schemes from anon and authenticated
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.schemes FROM anon, authenticated;

-- -----------------------------------------------------------------------------
-- 2. Household Members Table (Multi-Family Profile Cloud Persistence)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relation TEXT NOT NULL,
    age INTEGER NOT NULL DEFAULT 18,
    gender TEXT NOT NULL DEFAULT 'other',
    occupation TEXT NOT NULL DEFAULT 'other',
    state TEXT NOT NULL DEFAULT 'Karnataka',
    district TEXT DEFAULT 'Mandya',
    social_category TEXT DEFAULT 'general',
    landholding_acres NUMERIC(6, 2) NOT NULL DEFAULT 0,
    annual_income NUMERIC(12, 2) NOT NULL DEFAULT 0,
    is_aadhaar_linked_bank BOOLEAN NOT NULL DEFAULT false,
    is_digilocker_linked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on household member owner
CREATE INDEX IF NOT EXISTS idx_household_members_user_id ON public.household_members(user_id);

-- Updated_at trigger
CREATE TRIGGER trg_household_members_updated_at
    BEFORE UPDATE ON public.household_members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;

-- Grants for household_members
GRANT SELECT, INSERT, UPDATE, DELETE ON public.household_members TO authenticated;

-- RLS Policy: Users can only read and manage their own household members
CREATE POLICY "Users can manage own household members"
    ON public.household_members
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. Application Status Check Constraint Standardization
-- -----------------------------------------------------------------------------
-- Update application status check to accept all standardized lifecycle statuses
DO $$
BEGIN
    ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS chk_application_status;
    ALTER TABLE public.applications ADD CONSTRAINT chk_application_status 
        CHECK (status IN ('draft', 'submitted', 'in_review', 'under_review', 'verified', 'sanctioned', 'approved', 'rejected'));
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 4. Assessment Deduplication: Idempotency Key
-- -----------------------------------------------------------------------------
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_assessments_user_idempotency 
    ON public.assessments(user_id, idempotency_key) 
    WHERE idempotency_key IS NOT NULL;
