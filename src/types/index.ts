export type SupportedLanguage = 'en' | 'kn' | 'hi' | 'bn';

export type LifeEventId = 
  | 'farming'
  | 'women_child'
  | 'health_elder'
  | 'education_youth'
  | 'business_artisan'
  | 'housing_utilities';

export interface LifeEvent {
  id: LifeEventId;
  iconName: string;
  schemeCount: number;
  titleKey: string;
  descriptionKey: string;
}

export type BenefitType = 'dbt_cash' | 'health_insurance' | 'credit_loan' | 'scholarship' | 'pension';

export type BenefitCategory = 
  | 'annual_cash_transfer'
  | 'one_time_cash'
  | 'health_insurance_cover'
  | 'loan_credit_facility'
  | 'subsidy'
  | 'scholarship'
  | 'non_financial';

export type SchemeVerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'DEMONSTRATION';

export interface SchemeFeeStructure {
  governmentFee: number;
  isStatutoryFree: boolean;
  statutoryRuleCitation?: string;
  cscAssistanceServiceCharge?: {
    standardRate: number;
    description: string;
  };
}

export interface SchemeProcessingTimeline {
  slaDays: number;
  isStatutoryGuarantee: boolean;
  timelineType: 'statutory_citizen_charter' | 'administrative_estimate';
  authorityCitation?: string;
}

export interface SchemeEligibilityRule {
  ruleId: string;
  ruleDescription: string;
  issuingAuthority: string;
  officialDocumentTitle: string;
  exactSourceUrl: string;
  applicableClauseOrSection?: string;
  notificationDate?: string;
  lastVerifiedDate: string;
  verificationStatus: SchemeVerificationStatus;
}

export interface CategorizedBenefitSummary {
  annualCashTransferTotal: number;
  oneTimeCashTotal: number;
  healthInsuranceCoverTotal: number;
  loanCreditFacilityTotal: number;
  scholarshipTotal: number;
  subsidyTotal: number;
  hasNonFinancialBenefits: boolean;
}

export interface DocumentSpec {
  id: string;
  nameKey: string;
  descriptionKey: string;
  isMandatory: boolean;
  acceptableFormats: string[];
  maxSizeMb: number;
  digiLockerSupported: boolean;
  sampleCorrectUrl?: string;
  sampleWrongUrl?: string;
  commonErrorKey?: string;
  status?: 'verified' | 'uploaded' | 'pending' | 'rejected';
}

export interface Scheme {
  id: string;
  slug: string;
  titleKey: string;
  shortDescKey: string;
  fullDescKey: string;
  lifeEventId: LifeEventId;
  ministryKey: string;
  benefitType: BenefitType;
  benefitCategory: BenefitCategory;
  verificationStatus: SchemeVerificationStatus;
  financialBenefit: {
    amount: number;
    frequencyKey: string;
    formattedDisplay: string;
  };
  statutoryFee: {
    amount: number;
    isFree: boolean;
    statutoryRuleCitation: string;
    cscAuthorizedCharge?: string;
  };
  feeStructure?: SchemeFeeStructure;
  processingTimeline?: SchemeProcessingTimeline;
  sourceAttribution: string;
  lastVerifiedDate: string;
  processingSlaDays: number;
  handlingAuthorityKey: string;
  helplinePhone: string;
  officialPortalUrl: string;
  documents: DocumentSpec[];
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    genderAllowed?: ('male' | 'female' | 'other' | 'all')[];
    occupations?: string[];
    maxAnnualIncome?: number;
    maxLandholdingAcres?: number;
    socialCategories?: ('general' | 'obc' | 'sc' | 'st' | 'minority' | 'all')[];
    stateSpecific?: string[];
    requiresLandTitle?: boolean;
    requiresSeccOrBplRationCard?: boolean;
    requiresMaternityStatus?: boolean;
    requiresStreetVendorCertificate?: boolean;
    requiresStudentEnrollment?: boolean;
  };
  keyBenefitsListKeys: string[];
  whoIsEligibleListKeys: string[];
  whoIsNotEligibleListKeys: string[];
  rulesRegistry?: SchemeEligibilityRule[];
}

export interface SchemeEvaluationOutcome {
  scheme: Scheme;
  status: 'potentially_eligible' | 'additional_verification_required' | 'not_established';
  explanation: string;
  satisfiedCriteria: string[];
  missingCriteria: string[];
  disqualifyingExclusions: string[];
}

export interface EligibilityQuestion {
  id: string;
  order: number;
  textKey: string;
  audioVoiceKey: string;
  helpKey?: string;
  type: 'single_choice' | 'number' | 'boolean';
  fieldName: 'occupation' | 'landholdingAcres' | 'gender' | 'age' | 'socialCategory' | 'annualIncome' | 'isGovtEmployee' | string;
  condition?: (answers: any) => boolean;
  options?: {
    value: string | number | boolean;
    labelKey: string;
    iconName?: string;
    sublabelKey?: string;
    payload?: Record<string, any>;
  }[];
}

export type EligibilityAssessmentStatus = 
  | 'not_assessed'
  | 'in_progress'
  | 'potentially_eligible'
  | 'not_established'
  | 'additional_verification_required';

export interface EligibilityAssessmentResult {
  status: EligibilityAssessmentStatus;
  eligibleSchemes: Scheme[];
  additionalVerificationSchemes: SchemeEvaluationOutcome[];
  notEstablishedSchemes: SchemeEvaluationOutcome[];
  partialMatchSchemes: {
    scheme: Scheme;
    missingRequirementKey: string;
  }[];
  categorizedBenefits: CategorizedBenefitSummary;
  totalAnnualCashBenefit: number;
  totalAnnualBenefitValue: number;
  evaluations: Record<string, SchemeEvaluationOutcome>;
  disclaimerKey: string;
  assessmentTimestamp?: string;
}

export type ApplicationStage = 1 | 2 | 3 | 4;

export interface CitizenNote {
  id: string;
  createdAt: string;
  text: string;
  author: string;
}

export interface MissingDocumentAlert {
  documentId: string;
  documentName: string;
  reason: string;
  requestedBy: string;
  actionRequired: string;
  resolved: boolean;
}

export interface ApplicationMilestone {
  stage: ApplicationStage;
  titleKey: string;
  date?: string;
  timestamp?: string;
  description?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  handlingOfficer?: string;
  remarksKey?: string;
  isOfficial?: boolean;
}

export interface ApplicationRecord {
  id: string;
  tokenNumber: string;
  schemeId: string;
  schemeTitle: string;
  submittedAt: string;
  currentStage: ApplicationStage;
  statusBadge: 'submitted' | 'under_review' | 'sanctioned' | 'disbursed' | 'action_needed';
  isDelayed: boolean;
  slaDeadlineDays: number;
  slaDaysRemaining: number;
  milestones: ApplicationMilestone[];
  submittedVia: 'self_online' | 'csc_assisted';
  handlingOffice: string;
  audioStatusNarrationKey: string;
  pendingActions?: string[];
  missingDocuments?: MissingDocumentAlert[];
  citizenNotes?: CitizenNote[];
  disbursementDetails?: {
    amount: number;
    accountMasked: string;
    utrNumber?: string;
    disbursedDate?: string;
    status: 'pending' | 'credited' | 'na';
  };
}

export interface UserProfile {
  id: string;
  name: string;
  relation: 'self' | 'father' | 'mother' | 'spouse' | 'child' | 'other';
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  state: string;
  district: string;
  socialCategory: 'general' | 'obc' | 'sc' | 'st' | 'minority';
  landholdingAcres: number;
  annualIncome: number;
  isAadhaarLinkedBank: boolean;
  isDigiLockerLinked: boolean;
}

export interface NotificationItem {
  id: string;
  titleKey: string;
  summaryKey: string;
  timestamp: string;
  type: 'status_update' | 'urgent_deadline' | 'new_scheme' | 'document_alert';
  isRead: boolean;
  audioKey?: string;
  actionUrl?: string;
}

export interface AssessmentHistoryRecord {
  id: string;
  completedAt: string;
  profileId?: string;
  profileName?: string;
  status: EligibilityAssessmentStatus;
  eligibleCount: number;
  totalAnnualBenefitValue: number;
  answers: Record<string, any>;
}
