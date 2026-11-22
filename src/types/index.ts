export type SupportedLanguage = 'en' | 'kn' | 'hi';

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
  financialBenefit: {
    amount: number;
    frequencyKey: string;
    formattedDisplay: string;
  };
  statutoryFee: {
    amount: number;
    isFree: boolean;
  };
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
  };
  keyBenefitsListKeys: string[];
  whoIsEligibleListKeys: string[];
  whoIsNotEligibleListKeys: string[];
}

export interface EligibilityQuestion {
  id: string;
  order: number;
  textKey: string;
  audioVoiceKey: string;
  helpKey?: string;
  type: 'single_choice' | 'number' | 'boolean';
  fieldName: 'occupation' | 'landholdingAcres' | 'gender' | 'age' | 'socialCategory' | 'annualIncome' | 'isGovtEmployee';
  options?: {
    value: string | number | boolean;
    labelKey: string;
    iconName?: string;
    sublabelKey?: string;
  }[];
}

export interface EligibilityAssessmentResult {
  eligibleSchemes: Scheme[];
  partialMatchSchemes: {
    scheme: Scheme;
    missingRequirementKey: string;
  }[];
  totalAnnualBenefitValue: number;
}

export type ApplicationStage = 1 | 2 | 3 | 4;

export interface ApplicationMilestone {
  stage: ApplicationStage;
  titleKey: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
  handlingOfficer?: string;
  remarksKey?: string;
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
