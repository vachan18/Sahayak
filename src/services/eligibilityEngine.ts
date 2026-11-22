import { Scheme, EligibilityAssessmentResult } from '../types';
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
  const eligible: Scheme[] = [];
  const partial: { scheme: Scheme; missingRequirementKey: string }[] = [];

  for (const scheme of verifiedSchemes) {
    let isFullyEligible = true;
    let missingReason: string | null = null;

    // Check Government Employee exclusion
    if (answers.isGovtEmployee && (scheme.id === 'pm-kisan' || scheme.id === 'pmmvy' || scheme.id === 'pm-jay')) {
      isFullyEligible = false;
      missingReason = "Excludes permanent government employees and their families.";
    }

    // Check occupation
    if (scheme.eligibilityCriteria.occupations && answers.occupation) {
      if (!scheme.eligibilityCriteria.occupations.includes(answers.occupation)) {
        if (scheme.id === 'pm-kisan' && answers.occupation !== 'farmer') {
          isFullyEligible = false;
          missingReason = "Requires registered agricultural cultivation.";
        } else if (scheme.id === 'pm-svanidhi' && answers.occupation !== 'street_vendor') {
          isFullyEligible = false;
          missingReason = "Restricted to urban street vendors and micro-merchants.";
        }
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
        missingReason = "Requires registered cultivable land ownership title in state records.";
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
        missingReason = `Family annual income must be below ₹${(scheme.eligibilityCriteria.maxAnnualIncome / 100000).toFixed(1)} Lakh.`;
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

  return {
    eligibleSchemes: eligible,
    partialMatchSchemes: partial,
    totalAnnualBenefitValue
  };
};
