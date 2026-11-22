-- =============================================================================
-- Migration 001: Initial Schema for SAHAYAK Government Welfare Discovery
-- Timestamp: 20261122000001
-- Description: Creates profiles, schemes, assessments, assessment_results,
--              saved_schemes, and applications tables with triggers & indexes.
-- =============================================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PROFILES Table (Extends Supabase auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'kn',
    state TEXT DEFAULT 'Karnataka',
    district TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_language ON public.profiles(preferred_language);

-- -----------------------------------------------------------------------------
-- 2. SCHEMES Table (Government Welfare Schemes Master Directory)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'ALL',
    official_url TEXT NOT NULL,
    eligibility_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    benefits JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for scheme catalog discovery and filtering
CREATE INDEX IF NOT EXISTS idx_schemes_code ON public.schemes(scheme_code);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_is_active ON public.schemes(is_active);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON public.schemes(state);

-- -----------------------------------------------------------------------------
-- 3. ASSESSMENTS Table (User Welfare Assessments)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for user assessment lookups
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);

-- -----------------------------------------------------------------------------
-- 4. ASSESSMENT_RESULTS Table (Individual Scheme Outcomes for each Assessment)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    eligibility_status TEXT NOT NULL,
    missing_information JSONB NOT NULL DEFAULT '[]'::jsonb,
    explanation JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for assessment result joins
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON public.assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_scheme_id ON public.assessment_results(scheme_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_status ON public.assessment_results(eligibility_status);

-- -----------------------------------------------------------------------------
-- 5. SAVED_SCHEMES Table (Bookmarked Schemes per Citizen)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_saved_scheme UNIQUE (user_id, scheme_id)
);

-- Indexes for saved schemes lookup
CREATE INDEX IF NOT EXISTS idx_saved_schemes_user_id ON public.saved_schemes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_scheme_id ON public.saved_schemes(scheme_id);

-- -----------------------------------------------------------------------------
-- 6. APPLICATIONS Table (Assisted Application Lifecycle Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft',
    application_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_application_status CHECK (status IN ('draft', 'submitted', 'in_review', 'verified', 'approved', 'rejected'))
);

-- Indexes for applications
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_scheme_id ON public.applications(scheme_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- -----------------------------------------------------------------------------
-- 7. TRIGGERS: Automatic updated_at Timestamps
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_schemes_updated_at
    BEFORE UPDATE ON public.schemes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 8. TRIGGER: Automatic Profile Creation on auth.users Sign Up
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'kn')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
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
-- =============================================================================
-- Migration 003: Storage Bucket Configuration & Policies for SAHAYAK
-- Timestamp: 20261122000003
-- Description: Configures private user-documents storage bucket with RLS policies.
--              Enforces private signed URLs. Prohibits public document exposure.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Create Private Storage Bucket
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-documents',
    'user-documents',
    false, -- Strictly PRIVATE; requires signed URLs
    5242880, -- 5MB file size limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png'];

-- -----------------------------------------------------------------------------
-- 2. Storage RLS Policies (Folder-Based Isolation: {user_id}/{document_name})
-- -----------------------------------------------------------------------------

-- Authenticated users can upload documents only into their designated {user_id} folder
CREATE POLICY "Users can upload own documents"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Authenticated users can view/download only their own documents
CREATE POLICY "Users can view own documents"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Authenticated users can update/replace only their own documents
CREATE POLICY "Users can update own documents"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Authenticated users can delete only their own documents
CREATE POLICY "Users can delete own documents"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
-- =============================================================================
-- Migration 004: Seed Verified Government Schemes
-- Timestamp: 20261122000004
-- Description: Inserts verified primary government welfare schemes into public.schemes
-- =============================================================================

INSERT INTO public.schemes (
    scheme_code,
    name,
    description,
    department,
    category,
    state,
    official_url,
    eligibility_rules,
    benefits,
    is_active
) VALUES
(
    'pm-kisan',
    'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    '₹6,000 yearly income support transferred directly in 3 equal installments of ₹2,000 to landholding farmer families via DBT.',
    'Ministry of Agriculture & Farmers Welfare',
    'farming',
    'ALL',
    'https://pmkisan.gov.in',
    jsonb_build_array(
        jsonb_build_object(
            'rule_id', 'PMK-R01',
            'description', 'Universal landholder coverage: All farmer families owning cultivable land in state revenue records are eligible regardless of landholding size.',
            'clause', 'Clause 2 (Definition of Beneficiary)'
        ),
        jsonb_build_object(
            'rule_id', 'PMK-R02',
            'description', 'Statutory Exclusion: Institutional landholders, regular serving/retired govt/PSU employees (excluding MTS/Group D), pensioners >= ₹10,000/mo, and income tax payees are excluded.',
            'clause', 'Clause 2(b) (Exclusion Categories)'
        )
    ),
    jsonb_build_object(
        'benefit_category', 'annual_cash_transfer',
        'amount', 6000,
        'frequency', 'perYear',
        'display', '₹6,000 / year cash DBT'
    ),
    true
),
(
    'pm-jay',
    'Ayushman Bharat (PM-JAY)',
    'Secondary and tertiary hospital treatment cover of up to ₹5,00,000 per family per year across 28,000+ empaneled hospitals.',
    'National Health Authority (NHA), MoHFW',
    'health_elder',
    'ALL',
    'https://pmjay.gov.in',
    jsonb_build_array(
        jsonb_build_object(
            'rule_id', 'PMJ-R01',
            'description', 'SECC 2011 & NFSA Beneficiary Identification: Target families identified based on SECC 2011 deprivation criteria or active state NFSA BPL cards.',
            'clause', 'Section 3.1'
        ),
        jsonb_build_object(
            'rule_id', 'PMJ-R02',
            'description', 'Ayushman Vay Vandana: All senior citizens aged 70 and above are eligible for ₹5 Lakh hospitalization coverage regardless of household income.',
            'clause', 'Gazette Notification S.O. 4668(E)'
        )
    ),
    jsonb_build_object(
        'benefit_category', 'health_insurance_cover',
        'amount', 500000,
        'frequency', 'perYear',
        'display', '₹5 Lakh hospital cover/year'
    ),
    true
),
(
    'pmmvy',
    'PMMVY (Pradhan Mantri Matru Vandana Yojana)',
    'Direct maternity cash assistance of ₹5,000 for 1st child and ₹6,000 for 2nd girl child to support maternal nutrition and institutional health.',
    'Ministry of Women & Child Development',
    'women_child',
    'ALL',
    'https://pmmvy.wcd.gov.in',
    jsonb_build_array(
        jsonb_build_object(
            'rule_id', 'PMM-R01',
            'description', 'First Child & Second Girl Child Benefit: ₹5,000 in two installments for the first child; ₹6,000 in single installment for the second child only if female.',
            'clause', 'Section 3.1 (Beneficiary Entitlements)'
        ),
        jsonb_build_object(
            'rule_id', 'PMM-R02',
            'description', 'Statutory Exclusion: Women in regular service with Central/State Govt or PSUs receiving statutory maternity leave are excluded.',
            'clause', 'Section 3.2 (Exclusions)'
        )
    ),
    jsonb_build_object(
        'benefit_category', 'one_time_cash',
        'amount', 5000,
        'frequency', 'oneTime',
        'display', '₹5,000 (1st child) / ₹6,000 (2nd girl child)'
    ),
    true
),
(
    'pm-svanidhi',
    'PM SVANidhi (Micro-Credit for Street Vendors)',
    'Collateral-free working capital loan of ₹10,000 to ₹50,000 with 7% interest subsidy and digital cashback for urban hawkers and vendors.',
    'Ministry of Housing & Urban Affairs (MoHUA)',
    'business_artisan',
    'ALL',
    'https://pmsvanidhi.mohua.gov.in',
    jsonb_build_array(
        jsonb_build_object(
            'rule_id', 'PMS-R01',
            'description', 'Street Vendor Eligibility: Strictly restricted to urban vendors possessing Certificate of Vending (CoV) or Letter of Recommendation (LoR). Artisans are covered under PM Vishwakarma.',
            'clause', 'Section 2.1'
        )
    ),
    jsonb_build_object(
        'benefit_category', 'loan_credit_facility',
        'amount', 10000,
        'frequency', 'oneTime',
        'display', '₹10,000 - ₹50,000 (Working Capital Loan)'
    ),
    true
),
(
    'post-matric-scholarship',
    'Post-Matric Scholarship for SC/ST/OBC Students',
    'Compulsory non-refundable fee reimbursement plus monthly maintenance allowance for SC/ST/OBC students in higher education.',
    'Ministry of Social Justice & Empowerment',
    'education_youth',
    'ALL',
    'https://scholarships.gov.in',
    jsonb_build_array(
        jsonb_build_object(
            'rule_id', 'PMS-SC01',
            'description', 'SC/ST/OBC Scholarship Criteria: Indian national, enrolled in recognized post-matric course, family annual income <= ₹2.50 Lakh.',
            'clause', 'Clause 4 (Eligibility)'
        )
    ),
    jsonb_build_object(
        'benefit_category', 'scholarship',
        'amount', 14000,
        'frequency', 'perYear',
        'display', '₹14,000+ / year (Tuition + Maintenance)'
    ),
    true
),
(
    'post-matric-scholarship-minority',
    'Post-Matric Scholarship for Minority Communities',
    'Tuition fee reimbursement and maintenance allowance for minority community students with family income <= ₹2.00 Lakh and >= 50% marks.',
    'Ministry of Minority Affairs',
    'education_youth',
    'ALL',
    'https://scholarships.gov.in',
    jsonb_build_array(
        jsonb_build_object(
            'rule_id', 'PMS-MIN01',
            'description', 'Minority Scholarship Income Ceiling: Parental annual income must not exceed ₹2.00 Lakh, and student must secure >= 50% marks in previous exam.',
            'clause', 'Clause 3 (Eligibility Criteria)'
        )
    ),
    jsonb_build_object(
        'benefit_category', 'scholarship',
        'amount', 10000,
        'frequency', 'perYear',
        'display', '₹10,000 / year (Tuition + Maintenance)'
    ),
    true
),
(
    'pm-kcc',
    'Kisan Credit Card (KCC) Subsidized Crop Credit',
    'Concessional credit limit up to ₹3,00,000 at an effective interest rate of just 4% per annum with prompt repayment incentive.',
    'Ministry of Agriculture & NABARD',
    'farming',
    'ALL',
    'https://rbi.org.in',
    jsonb_build_array(
        jsonb_build_object(
            'rule_id', 'KCC-R01',
            'description', 'Tenure & Allied Activity Inclusivity: Owner cultivators, tenant farmers, oral lessees, sharecroppers, and farmers engaged in animal husbandry or fisheries are eligible under RBI guidelines.',
            'clause', 'Section 3 (Beneficiary Categories)'
        )
    ),
    jsonb_build_object(
        'benefit_category', 'loan_credit_facility',
        'amount', 150000,
        'frequency', 'oneTime',
        'display', '₹1,50,000 (Credit limit at 4%)'
    ),
    true
)
ON CONFLICT (scheme_code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    department = EXCLUDED.department,
    category = EXCLUDED.category,
    state = EXCLUDED.state,
    official_url = EXCLUDED.official_url,
    eligibility_rules = EXCLUDED.eligibility_rules,
    benefits = EXCLUDED.benefits,
    is_active = EXCLUDED.is_active,
    updated_at = now();
