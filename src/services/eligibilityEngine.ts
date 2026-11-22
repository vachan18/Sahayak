import { Scheme, EligibilityAssessmentResult, EligibilityAssessmentStatus } from '../types';
import { verifiedSchemes } from '../data/schemes';

export interface AssessmentAnswers {
  occupation?: string;
  landholdingAcres?: number;
  gender?: string;
  age?: number;
  annualIncome?: number;
  socialCategory?: string;
  isGovtEmployee?: boolean;
}

export const assessEligibility = (answers: AssessmentAnswers): EligibilityAssessmentResult => {
  const answeredKeysCount = Object.keys(answers).filter(k => (answers as any)[k] !== undefined).length;

  // State 1: Not assessed if no inputs provided
  if (answeredKeysCount === 0) {
    return {
      status: 'not_assessed',
      eligibleSchemes: [],
      partialMatchSchemes: [],
      totalAnnualBenefitValue: 0,
      disclaimerKey: "disclaimer_not_assessed"
    };
  }

  // State 2: In progress if only 1-2 questions answered
  if (answeredKeysCount < 3) {
    return {
      status: 'in_progress',
      eligibleSchemes: [],
      partialMatchSchemes: [],
      totalAnnualBenefitValue: 0,
      disclaimerKey: "disclaimer_in_progress"
    };
  }

  const eligible: Scheme[] = [];
  const partial: { scheme: Scheme; missingRequirementKey: string }[] = [];

  for (const scheme of verifiedSchemes) {
    let isFullyEligible = true;
    let missingReason: string | null = null;

    // Check Government Employee exclusion
    if (answers.isGovtEmployee && (scheme.id === 'pm-kisan' || scheme.id === 'pmmvy' || scheme.id === 'pm-jay')) {
      isFullyEligible = false;
      missingReason = "Excludes permanent government employees and their families as per gazette rules.";
    }

    // Check occupation
    if (scheme.eligibilityCriteria.occupations && answers.occupation) {
      if (!scheme.eligibilityCriteria.occupations.includes(answers.occupation)) {
        isFullyEligible = false;
        if (scheme.id === 'pm-kisan') {
          missingReason = "Requires registered agricultural land cultivation title.";
        } else if (scheme.id === 'pm-svanidhi') {
          missingReason = "Restricted to urban street vendors holding Certificate of Vending or ULB recommendation.";
        } else {
          missingReason = `Scheme is intended for: ${scheme.eligibilityCriteria.occupations.join(', ')}.`;
        }
      }
    }

    // Check age limits
    if (answers.age !== undefined) {
      if (scheme.eligibilityCriteria.minAge !== undefined && answers.age < scheme.eligibilityCriteria.minAge) {
        isFullyEligible = false;
        missingReason = `Minimum eligible age is ${scheme.eligibilityCriteria.minAge} years.`;
      }
      if (scheme.eligibilityCriteria.maxAge !== undefined && answers.age > scheme.eligibilityCriteria.maxAge) {
        isFullyEligible = false;
        missingReason = `Maximum eligible age is ${scheme.eligibilityCriteria.maxAge} years.`;
      }
    }

    // Check social category if restricted
    if (scheme.eligibilityCriteria.socialCategories && answers.socialCategory) {
      if (!scheme.eligibilityCriteria.socialCategories.includes('all') &&
          !scheme.eligibilityCriteria.socialCategories.includes(answers.socialCategory as any)) {
        isFullyEligible = false;
        missingReason = `Scheme restricted to categories: ${scheme.eligibilityCriteria.socialCategories.join(', ').toUpperCase()}.`;
      }
    }

    // Check landholding
    if (scheme.eligibilityCriteria.maxLandholdingAcres !== undefined && answers.landholdingAcres !== undefined) {
      if (answers.landholdingAcres > scheme.eligibilityCriteria.maxLandholdingAcres) {
        isFullyEligible = false;
        missingReason = `Landholding exceeds ceiling of ${scheme.eligibilityCriteria.maxLandholdingAcres} acres.`;
      }
      if (scheme.id === 'pm-kisan' && answers.landholdingAcres <= 0) {
        isFullyEligible = false;
        missingReason = "Requires registered cultivable land ownership title in state records (RTC/Khatauni).";
      }
    }

    // Check gender
    if (scheme.eligibilityCriteria.genderAllowed && answers.gender) {
      if (!scheme.eligibilityCriteria.genderAllowed.includes(answers.gender as any) && !scheme.eligibilityCriteria.genderAllowed.includes('all')) {
        isFullyEligible = false;
        missingReason = "Scheme exclusively benefits pregnant women and lactating mothers.";
      }
    }

    // Check income ceiling
    if (scheme.eligibilityCriteria.maxAnnualIncome !== undefined && answers.annualIncome !== undefined) {
      if (answers.annualIncome > scheme.eligibilityCriteria.maxAnnualIncome) {
        isFullyEligible = false;
        missingReason = `Family annual income must be below ₹${(scheme.eligibilityCriteria.maxAnnualIncome / 100000).toFixed(1)} Lakh as certified by revenue authority.`;
      }
    }

    if (isFullyEligible) {
      eligible.push(scheme);
    } else if (missingReason) {
      partial.push({ scheme, missingRequirementKey: missingReason });
    }
  }

  // Calculate total potential financial value
  const totalAnnualBenefitValue = eligible.reduce((acc, s) => acc + s.financialBenefit.amount, 0);

  // Determine state
  let status: EligibilityAssessmentStatus = 'potentially_eligible';
  if (eligible.length === 0 && partial.length > 0) {
    status = 'additional_verification_required';
  } else if (eligible.length === 0 && partial.length === 0) {
    status = 'not_established';
  }

  return {
    status,
    eligibleSchemes: eligible,
    partialMatchSchemes: partial,
    totalAnnualBenefitValue,
    disclaimerKey: "disclaimer_preliminary_guidance",
    assessmentTimestamp: new Date().toISOString()
  };
};
