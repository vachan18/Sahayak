-- =============================================================================
-- Migration 002: Row Level Security (RLS) Policies for SAHAYAK
-- Timestamp: 20261122000002
-- Description: Enforces zero-trust database security across all user-related
--              tables. Never relies on frontend-only authorization.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Enable RLS on All Tables
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. SCHEMES Policies (Public Read, Admin Write Only)
-- -----------------------------------------------------------------------------
-- Anyone (authenticated or guest/anonymous) can view active official schemes
CREATE POLICY "Allow public read of active schemes"
    ON public.schemes
    FOR SELECT
    USING (is_active = true);

-- Only service_role / administrative superusers can insert/update/delete schemes
CREATE POLICY "Allow service_role full management of schemes"
    ON public.schemes
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 3. PROFILES Policies (Users own their profile strictly)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 4. ASSESSMENTS Policies (Private to the user)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own assessments"
    ON public.assessments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
    ON public.assessments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
    ON public.assessments
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
    ON public.assessments
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 5. ASSESSMENT_RESULTS Policies (Private via parent assessment ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own assessment results"
    ON public.assessment_results
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assessments
            WHERE assessments.id = assessment_results.assessment_id
              AND assessments.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own assessment results"
    ON public.assessment_results
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.assessments
            WHERE assessments.id = assessment_results.assessment_id
              AND assessments.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own assessment results"
    ON public.assessment_results
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assessments
            WHERE assessments.id = assessment_results.assessment_id
              AND assessments.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- 6. SAVED_SCHEMES Policies (Private to the user)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own saved schemes"
    ON public.saved_schemes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved schemes"
    ON public.saved_schemes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved schemes"
    ON public.saved_schemes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 7. APPLICATIONS Policies (Private to the user)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own applications"
    ON public.applications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
    ON public.applications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
    ON public.applications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
    ON public.applications
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
