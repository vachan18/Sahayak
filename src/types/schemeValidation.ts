import { z } from 'zod';
import { Scheme } from './index';

export const BenefitCategoryEnum = z.enum([
  'annual_cash_transfer',
  'one_time_cash',
  'health_insurance_cover',
  'loan_credit_facility',
  'subsidy',
  'scholarship',
  'non_financial'
]);

export const VerificationStatusEnum = z.enum([
  'VERIFIED',
  'NEEDS_REVIEW',
  'DEMONSTRATION'
]);

export const DocumentSpecSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
  nameKey: z.string().min(1, "Document name is required"),
  descriptionKey: z.string().min(1, "Document description is required"),
  isMandatory: z.boolean(),
  acceptableFormats: z.array(z.string()).min(1, "At least one format required"),
  maxSizeMb: z.number().positive("Max size must be positive"),
  digiLockerSupported: z.boolean(),
  sampleCorrectUrl: z.string().optional(),
  sampleWrongUrl: z.string().optional(),
  commonErrorKey: z.string().optional(),
  status: z.enum(['verified', 'uploaded', 'pending', 'rejected']).optional()
});

export const SchemeSchema = z.object({
  id: z.string().min(1, "Scheme ID is required"),
  slug: z.string().min(1, "Slug is required"),
  titleKey: z.string().min(1, "Title is required"),
  shortDescKey: z.string().min(1, "Short description is required"),
  fullDescKey: z.string().min(1, "Full description is required"),
  lifeEventId: z.enum([
    'farming',
    'women_child',
    'health_elder',
    'education_youth',
    'business_artisan',
    'housing_utilities'
  ]),
  ministryKey: z.string().min(1, "Ministry is required"),
  benefitType: z.enum(['dbt_cash', 'health_insurance', 'credit_loan', 'scholarship', 'pension']),
  benefitCategory: BenefitCategoryEnum,
  verificationStatus: VerificationStatusEnum,
  financialBenefit: z.object({
    amount: z.number().min(0, "Benefit amount must be non-negative"),
    frequencyKey: z.string().min(1, "Frequency is required"),
    formattedDisplay: z.string().min(1, "Formatted display is required")
  }),
  statutoryFee: z.object({
    amount: z.number().min(0, "Fee amount must be non-negative"),
    isFree: z.boolean(),
    statutoryRuleCitation: z.string().min(1, "Rule citation is required"),
    cscAuthorizedCharge: z.string().optional()
  }),
  feeStructure: z.object({
    governmentFee: z.number().min(0),
    isStatutoryFree: z.boolean(),
    statutoryRuleCitation: z.string().optional(),
    cscAssistanceServiceCharge: z.object({
      standardRate: z.number().min(0),
      description: z.string()
    }).optional()
  }).optional(),
  processingTimeline: z.object({
    slaDays: z.number().positive(),
    isStatutoryGuarantee: z.boolean(),
    timelineType: z.enum(['statutory_citizen_charter', 'administrative_estimate']),
    authorityCitation: z.string().optional()
  }).optional(),
  sourceAttribution: z.string().min(5, "Source attribution must be documented"),
  lastVerifiedDate: z.string().regex(/^[A-Za-z]+\s\d{4}$/, "Date format must be 'Month YYYY'"),
  processingSlaDays: z.number().positive("SLA days must be positive"),
  handlingAuthorityKey: z.string().min(1, "Handling authority is required"),
  helplinePhone: z.string().min(1, "Helpline phone is required"),
  officialPortalUrl: z.string().url("Must be a valid official URL"),
  documents: z.array(DocumentSpecSchema).min(1, "At least one document is required"),
  eligibilityCriteria: z.object({
    minAge: z.number().optional(),
    maxAge: z.number().optional(),
    genderAllowed: z.array(z.enum(['male', 'female', 'other', 'all'])).optional(),
    occupations: z.array(z.string()).optional(),
    maxAnnualIncome: z.number().optional(),
    maxLandholdingAcres: z.number().optional(),
    socialCategories: z.array(z.enum(['general', 'obc', 'sc', 'st', 'minority', 'all'])).optional(),
    stateSpecific: z.array(z.string()).optional(),
    requiresLandTitle: z.boolean().optional(),
    requiresSeccOrBplRationCard: z.boolean().optional(),
    requiresMaternityStatus: z.boolean().optional(),
    requiresStreetVendorCertificate: z.boolean().optional(),
    requiresStudentEnrollment: z.boolean().optional()
  }),
  keyBenefitsListKeys: z.array(z.string()).min(1),
  whoIsEligibleListKeys: z.array(z.string()).min(1),
  whoIsNotEligibleListKeys: z.array(z.string()).min(1),
  rulesRegistry: z.array(z.object({
    ruleId: z.string().min(1),
    ruleDescription: z.string().min(1),
    issuingAuthority: z.string().min(1),
    officialDocumentTitle: z.string().min(1),
    exactSourceUrl: z.string().url(),
    applicableClauseOrSection: z.string().optional(),
    notificationDate: z.string().optional(),
    lastVerifiedDate: z.string(),
    verificationStatus: VerificationStatusEnum
  })).optional()
});

export const validateSchemeRecord = (scheme: unknown): Scheme => {
  return SchemeSchema.parse(scheme) as Scheme;
};

export const validateSchemes = (schemes: Scheme[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  schemes.forEach((scheme, idx) => {
    const result = SchemeSchema.safeParse(scheme);
    if (!result.success) {
      result.error.errors.forEach(err => {
        errors.push(`Scheme[${idx}] ${scheme.id || 'unknown'}: ${err.path.join('.')} - ${err.message}`);
      });
    }
  });
  return {
    valid: errors.length === 0,
    errors
  };
};
