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
