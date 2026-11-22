import { 
  Scheme, 
  EligibilityAssessmentResult, 
  EligibilityAssessmentStatus, 
  SchemeEvaluationOutcome,
  CategorizedBenefitSummary 
} from '../types';
import { verifiedSchemes } from '../data/schemes';

export interface AssessmentAnswers {
  occupation?: string;
  landholdingAcres?: number;
  gender?: string;
  age?: number;
  annualIncome?: number;
  socialCategory?: string;
  isGovtEmployee?: boolean;
  isPregnantOrLactating?: boolean;
  hasBplOrRationCard?: boolean;
  hasStreetVendorCertificate?: boolean;
  isEnrolledStudent?: boolean;
}

/**
 * Evaluates a single scheme against user assessment inputs.
 * Distinguishes confirmed exclusions, missing required information, and satisfied criteria.
 */
export const evaluateSchemeEligibility = (scheme: Scheme, answers: AssessmentAnswers): SchemeEvaluationOutcome => {
  const satisfiedCriteria: string[] = [];
  const missingCriteria: string[] = [];
  const disqualifyingExclusions: string[] = [];

  // ==========================================
  // 1. STATUTORY EXCLUSION CHECKS (Disqualifiers)
  // ==========================================

  // Government Employee / Pensioner / Taxpayer Statutory Exclusion
  if (answers.isGovtEmployee !== undefined) {
    if (answers.isGovtEmployee === true) {
      if (['pm-kisan', 'pmmvy', 'pm-jay'].includes(scheme.id)) {
        disqualifyingExclusions.push(
          "Statutory Exclusion: Serving or retired government/PSU employees and institutional holders are excluded as per Gazette rules."
        );
      }
    } else {
      satisfiedCriteria.push("Verified non-government employee status.");
    }
  } else {
    // Missing government employee question
    if (['pm-kisan', 'pmmvy', 'pm-jay'].includes(scheme.id)) {
      missingCriteria.push("Confirmation of non-government employment status.");
    }
  }

  // ==========================================
  // 2. SCHEME-SPECIFIC RULES & CRITERIA
  // ==========================================

  if (scheme.id === 'pm-kisan') {
    // PM-KISAN: All landholding farmer families with cultivable land in state records
    // Note: 2-hectare (5 acre) ceiling was officially removed on 31.05.2019 by Union Cabinet

    // Occupation check
    if (answers.occupation !== undefined) {
      if (answers.occupation === 'farmer') {
        satisfiedCriteria.push("Primary occupation is farming / agriculture.");
      } else {
        disqualifyingExclusions.push(
          "PM-KISAN is statutorily restricted to cultivator farmer families owning agricultural land."
        );
      }
    } else {
      missingCriteria.push("Primary occupation details.");
    }

    // Land title check (Must possess cultivable land title > 0 acres)
    if (answers.landholdingAcres !== undefined) {
      if (answers.landholdingAcres > 0) {
        satisfiedCriteria.push(`Registered cultivable land ownership title (${answers.landholdingAcres} acres).`);
      } else {
        disqualifyingExclusions.push(
          "Tenant farmers, sharecroppers, and landless agricultural labourers without registered land title are ineligible under central guidelines."
        );
      }
    } else {
      missingCriteria.push("Registered agricultural landholding area in acres.");
    }

  } else if (scheme.id === 'pm-jay') {
    // Ayushman Bharat PM-JAY: Health cover of ₹5 Lakh
    // Beneficiary identification is based on SECC 2011 deprivation / active NFSA ration card, or age 70+

    // Senior citizen 70+ automatic inclusion rule (Ayushman Vay Vandana)
    if (answers.age !== undefined && answers.age >= 70) {
      satisfiedCriteria.push("Senior citizen aged 70+ qualifies under Ayushman Vay Vandana card regardless of income.");
    } else {
      // Income ceiling check
      if (answers.annualIncome !== undefined) {
        if (answers.annualIncome <= (scheme.eligibilityCriteria.maxAnnualIncome || 250000)) {
          satisfiedCriteria.push(`Family annual income below threshold of ₹${((scheme.eligibilityCriteria.maxAnnualIncome || 250000) / 100000).toFixed(1)} Lakh.`);
        } else {
          disqualifyingExclusions.push(
            `Family annual income exceeds PM-JAY threshold of ₹${((scheme.eligibilityCriteria.maxAnnualIncome || 250000) / 100000).toFixed(1)} Lakh.`
          );
        }
      } else {
        missingCriteria.push("Family annual income certification.");
      }

      // Mandatory SECC / Ration card verification
      if (answers.hasBplOrRationCard === true) {
        satisfiedCriteria.push("Active BPL / NFSA Ration Card reported.");
      } else if (answers.hasBplOrRationCard === false) {
        disqualifyingExclusions.push("Not registered under state NFSA BPL/Antyodaya records or SECC deprivation list.");
      } else {
        // Not answered yet - requires verification, NOT a failure
        missingCriteria.push("Cross-verification against official SECC 2011 database or active state NFSA BPL/AAY ration card records.");
      }
    }

  } else if (scheme.id === 'pmmvy') {
    // Pradhan Mantri Matru Vandana Yojana (Maternity Cash Assistance)

    // Gender check: Exclusively for women
    if (answers.gender !== undefined) {
      if (answers.gender === 'female') {
        satisfiedCriteria.push("Beneficiary is female.");
      } else {
        disqualifyingExclusions.push("PMMVY exclusively benefits pregnant women and lactating mothers; male applicants are excluded.");
      }
    } else {
      missingCriteria.push("Gender of applicant.");
    }

    // Age check: Must be at least 19 years old
    if (answers.age !== undefined) {
      if (answers.age >= (scheme.eligibilityCriteria.minAge || 19)) {
        satisfiedCriteria.push(`Applicant age (${answers.age} years) meets minimum threshold of 19 years.`);
      } else {
        disqualifyingExclusions.push("Applicant must be at least 19 years of age as per statutory guidelines.");
      }
    } else {
      missingCriteria.push("Age verification of the mother.");
    }

    // Pregnancy / Lactation condition check
    if (answers.isPregnantOrLactating === true) {
      satisfiedCriteria.push("Active pregnancy or lactating mother status confirmed.");
    } else if (answers.isPregnantOrLactating === false) {
      disqualifyingExclusions.push("Beneficiary is currently not an expectant or lactating mother.");
    } else {
      // Missing info: cannot assume just because user is female
      missingCriteria.push("Mother and Child Protection (MCP) card registration at Anganwadi/PHC for 1st child (or 2nd girl child).");
    }

  } else if (scheme.id === 'pm-svanidhi') {
    // PM SVANidhi: Micro-credit for street vendors

    // Occupation check
    if (answers.occupation !== undefined) {
      if (['street_vendor', 'artisan'].includes(answers.occupation)) {
        satisfiedCriteria.push("Engaged in urban street vending / artisanal micro-trade.");
      } else {
        disqualifyingExclusions.push("PM SVANidhi is restricted to urban street vendors, hawkers, and thelawalas.");
      }
    } else {
      missingCriteria.push("Vending occupation details.");
    }

    // Age requirement (18+)
    if (answers.age !== undefined) {
      if (answers.age >= 18) {
        satisfiedCriteria.push("Applicant meets minimum age of 18 years.");
      } else {
        disqualifyingExclusions.push("Minimum age for institutional credit under PM SVANidhi is 18 years.");
      }
    } else {
      missingCriteria.push("Age proof.");
    }

    // Certificate of Vending verification
    if (answers.hasStreetVendorCertificate === true) {
      satisfiedCriteria.push("Possesses Certificate of Vending (CoV) or ULB Letter of Recommendation.");
    } else if (answers.hasStreetVendorCertificate === false) {
      disqualifyingExclusions.push("Town Vending Committee recommendation or Certificate of Vending is unavailable.");
    } else {
      missingCriteria.push("Certificate of Vending (CoV) or Letter of Recommendation (LoR) from Town Vending Committee / ULB.");
    }

  } else if (scheme.id === 'post-matric-scholarship') {
    // Post-Matric Scholarship for SC/OBC/Minority students

    // Social category check
    if (answers.socialCategory !== undefined) {
      if (['sc', 'st', 'obc', 'minority'].includes(answers.socialCategory)) {
        satisfiedCriteria.push(`Belongs to eligible affirmative category: ${answers.socialCategory.toUpperCase()}.`);
      } else {
        disqualifyingExclusions.push("Post-matric scholarship is restricted to SC, ST, OBC, and minority categories.");
      }
    } else {
      missingCriteria.push("Caste / community category certificate.");
    }

    // Income ceiling check (<= ₹2.5 Lakh)
    if (answers.annualIncome !== undefined) {
      if (answers.annualIncome <= (scheme.eligibilityCriteria.maxAnnualIncome || 250000)) {
        satisfiedCriteria.push(`Annual family income within statutory ceiling of ₹2.50 Lakh.`);
      } else {
        disqualifyingExclusions.push("Family annual income exceeds statutory scholarship ceiling of ₹2.50 Lakh.");
      }
    } else {
      missingCriteria.push("Revenue authority issued family income certificate.");
    }

    // Student enrollment check
    if (answers.isEnrolledStudent === true || answers.occupation === 'student') {
      satisfiedCriteria.push("Actively enrolled in recognized post-matric higher education course.");
    } else if (answers.isEnrolledStudent === false) {
      disqualifyingExclusions.push("Not enrolled in an approved post-matric secondary or degree institution.");
    } else {
      missingCriteria.push("Active enrollment proof in recognized post-matric institution.");
    }

  } else if (scheme.id === 'pm-kcc') {
    // Kisan Credit Card Subsidized Crop Loan

    // Occupation check
    if (answers.occupation !== undefined) {
      if (['farmer'].includes(answers.occupation)) {
        satisfiedCriteria.push("Practicing cultivator / farmer.");
      } else {
        disqualifyingExclusions.push("Kisan Credit Card credit facilities require active engagement in agriculture or allied animal husbandry.");
      }
    } else {
      missingCriteria.push("Agricultural occupation details.");
    }

    // Land record / cultivable tenure check
    if (answers.landholdingAcres !== undefined) {
      if (answers.landholdingAcres > 0) {
        satisfiedCriteria.push(`Cultivable landholding title recorded (${answers.landholdingAcres} acres).`);
      } else {
        disqualifyingExclusions.push("Requires registered cultivable land tenure or recorded tenancy agreement.");
      }
    } else {
      missingCriteria.push("Current season land record (Pahani / RTC).");
    }
  }

  // ==========================================
  // 3. FINAL OUTCOME CLASSIFICATION
  // ==========================================

  // Rule: If any confirmed disqualifying exclusion exists -> NOT ESTABLISHED
  if (disqualifyingExclusions.length > 0) {
    return {
      scheme,
      status: 'not_established',
      explanation: disqualifyingExclusions[0],
      satisfiedCriteria,
      missingCriteria,
      disqualifyingExclusions
    };
  }

  // Rule: If one or more required criteria are missing -> ADDITIONAL VERIFICATION REQUIRED
  if (missingCriteria.length > 0) {
    return {
      scheme,
      status: 'additional_verification_required',
      explanation: `Requires document verification: ${missingCriteria[0]}`,
      satisfiedCriteria,
      missingCriteria,
      disqualifyingExclusions
    };
  }

  // Rule: All required criteria satisfied with zero exclusions -> POTENTIALLY ELIGIBLE
  return {
    scheme,
    status: 'potentially_eligible',
    explanation: "All preliminary self-reported eligibility criteria satisfied.",
    satisfiedCriteria,
    missingCriteria,
    disqualifyingExclusions
  };
};

/**
 * Calculates categorized financial summaries across distinct benefit types.
 * NEVER adds loan limits or health insurance coverage to annual cash income.
 */
export const calculateCategorizedBenefits = (eligibleSchemes: Scheme[]): CategorizedBenefitSummary => {
  let annualCashTransferTotal = 0;
  let oneTimeCashTotal = 0;
  let healthInsuranceCoverTotal = 0;
  let loanCreditFacilityTotal = 0;
  let subsidyTotal = 0;
  let hasNonFinancialBenefits = false;

  for (const scheme of eligibleSchemes) {
    const amount = scheme.financialBenefit.amount || 0;
    switch (scheme.benefitCategory) {
      case 'annual_cash_transfer':
        annualCashTransferTotal += amount;
        break;
      case 'one_time_cash':
        oneTimeCashTotal += amount;
        break;
      case 'health_insurance_cover':
        healthInsuranceCoverTotal += amount;
        break;
      case 'loan_credit_facility':
        loanCreditFacilityTotal += amount;
        break;
      case 'subsidy':
      case 'scholarship':
        subsidyTotal += amount;
        break;
      case 'non_financial':
        hasNonFinancialBenefits = true;
        break;
      default:
        break;
    }
  }

  return {
    annualCashTransferTotal,
    oneTimeCashTotal,
    healthInsuranceCoverTotal,
    loanCreditFacilityTotal,
    subsidyTotal,
    hasNonFinancialBenefits
  };
};

/**
 * Main assessment engine.
 * Evaluates all verified schemes against user inputs and computes structured results.
 */
export const assessEligibility = (answers: AssessmentAnswers): EligibilityAssessmentResult => {
  const answeredKeysCount = Object.keys(answers).filter(k => (answers as any)[k] !== undefined).length;

  // State 1: Not assessed if no inputs provided
  if (answeredKeysCount === 0) {
    return {
      status: 'not_assessed',
      eligibleSchemes: [],
      additionalVerificationSchemes: [],
      notEstablishedSchemes: [],
      partialMatchSchemes: [],
      categorizedBenefits: {
        annualCashTransferTotal: 0,
        oneTimeCashTotal: 0,
        healthInsuranceCoverTotal: 0,
        loanCreditFacilityTotal: 0,
        subsidyTotal: 0,
        hasNonFinancialBenefits: false
      },
      totalAnnualCashBenefit: 0,
      totalAnnualBenefitValue: 0,
      evaluations: {},
      disclaimerKey: "disclaimer_not_assessed"
    };
  }

  // State 2: In progress if fewer than 4 primary questions answered
  // The primary questionnaire contains 5 questions: occupation, landholding, gender, income, isGovtEmployee
  if (answeredKeysCount < 4) {
    return {
      status: 'in_progress',
      eligibleSchemes: [],
      additionalVerificationSchemes: [],
      notEstablishedSchemes: [],
      partialMatchSchemes: [],
      categorizedBenefits: {
        annualCashTransferTotal: 0,
        oneTimeCashTotal: 0,
        healthInsuranceCoverTotal: 0,
        loanCreditFacilityTotal: 0,
        subsidyTotal: 0,
        hasNonFinancialBenefits: false
      },
      totalAnnualCashBenefit: 0,
      totalAnnualBenefitValue: 0,
      evaluations: {},
      disclaimerKey: "disclaimer_in_progress"
    };
  }

  const eligibleSchemes: Scheme[] = [];
  const additionalVerificationSchemes: SchemeEvaluationOutcome[] = [];
  const notEstablishedSchemes: SchemeEvaluationOutcome[] = [];
  const evaluations: Record<string, SchemeEvaluationOutcome> = {};

  for (const scheme of verifiedSchemes) {
    const outcome = evaluateSchemeEligibility(scheme, answers);
    evaluations[scheme.id] = outcome;

    if (outcome.status === 'potentially_eligible') {
      eligibleSchemes.push(scheme);
    } else if (outcome.status === 'additional_verification_required') {
      additionalVerificationSchemes.push(outcome);
    } else {
      notEstablishedSchemes.push(outcome);
    }
  }

  // Compute distinct benefit categories
  const categorizedBenefits = calculateCategorizedBenefits(eligibleSchemes);
  const totalAnnualCashBenefit = categorizedBenefits.annualCashTransferTotal;

  // Backward-compatible partialMatchSchemes mapping
  const partialMatchSchemes = additionalVerificationSchemes.map(outcome => ({
    scheme: outcome.scheme,
    missingRequirementKey: outcome.explanation
  }));

  // Overall status determination:
  // - If at least one scheme is potentially eligible -> potentially_eligible
  // - If 0 eligible, but additional verification schemes exist -> additional_verification_required
  // - If all schemes are confirmed not established -> not_established
  let status: EligibilityAssessmentStatus = 'potentially_eligible';
  if (eligibleSchemes.length === 0 && additionalVerificationSchemes.length > 0) {
    status = 'additional_verification_required';
  } else if (eligibleSchemes.length === 0 && additionalVerificationSchemes.length === 0) {
    status = 'not_established';
  }

  return {
    status,
    eligibleSchemes,
    additionalVerificationSchemes,
    notEstablishedSchemes,
    partialMatchSchemes,
    categorizedBenefits,
    totalAnnualCashBenefit,
    totalAnnualBenefitValue: totalAnnualCashBenefit, // Backward-compatible alias (pure cash transfer)
    evaluations,
    disclaimerKey: "disclaimer_preliminary_guidance",
    assessmentTimestamp: new Date().toISOString()
  };
};
