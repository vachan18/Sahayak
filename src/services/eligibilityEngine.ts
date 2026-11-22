import { 
  Scheme, 
  EligibilityAssessmentResult, 
  EligibilityAssessmentStatus, 
  SchemeEvaluationOutcome,
  CategorizedBenefitSummary 
} from '../types';
import { verifiedSchemes } from '../data/schemes';

export interface AssessmentAnswers {
  // Core Demographics
  age?: number;
  gender?: 'male' | 'female' | 'other' | string;
  occupation?: 'farmer' | 'street_vendor' | 'student' | 'daily_wage' | 'homemaker' | 'artisan' | 'other' | string;
  annualIncome?: number;
  socialCategory?: 'general' | 'obc' | 'sc' | 'st' | 'minority' | string;

  // Land & Agriculture
  landholdingAcres?: number;
  farmerTenureType?: 'owner_cultivator' | 'tenant_farmer' | 'sharecropper' | 'oral_lessee' | 'animal_husbandry_dairy' | 'fisheries' | 'none' | string;
  hasLandOrTenureRecord?: boolean;
  isLandMutationPending?: boolean;

  // Employment & Statutory Exclusions
  isGovtEmployee?: boolean;
  govtEmploymentType?: 'none' | 'central_state_regular' | 'psu_autonomous' | 'group_d_mts' | 'pensioner_above_10k' | 'pensioner_below_10k' | string;
  isIncomeTaxPayee?: boolean;
  isConstitutionalPostOrMinister?: boolean;
  isRegisteredProfessional?: boolean; // Doctor, Lawyer, CA, Engineer, Architect
  isInstitutionalLandholder?: boolean;

  // Maternity & Family
  isPregnantOrLactating?: boolean;
  maternityParity?: 'first_child' | 'second_child' | 'third_or_more' | string;
  childGender?: 'female' | 'male' | 'unborn' | string;
  hasMcpCard?: boolean;

  // Health & Entitlement Documents
  hasBplOrRationCard?: boolean;
  isSeccDeprivedHousehold?: boolean;
  isEnrolledArogyaKarnataka?: boolean;

  // Street Vending & Trade
  hasStreetVendorCertificate?: boolean; // Certificate of Vending or Letter of Recommendation
  isUrbanStreetVendor?: boolean;

  // Education & Scholarship
  isEnrolledStudent?: boolean;
  studentCourseLevel?: 'post_matric_secondary' | 'iti_diploma' | 'undergraduate' | 'postgraduate' | 'doctoral' | 'none' | string;
  isRecognizedInstitution?: boolean;
  qualifyingExamMarksPercent?: number;
}

/**
 * Evaluates scheme-specific eligibility with zero shared blanket assumptions.
 * Every exclusion and condition directly reflects official Gazette and operational rules.
 */
export const evaluateSchemeEligibility = (scheme: Scheme, answers: AssessmentAnswers): SchemeEvaluationOutcome => {
  const satisfiedCriteria: string[] = [];
  const missingCriteria: string[] = [];
  const disqualifyingExclusions: string[] = [];

  // =========================================================================
  // 1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
  // Source: Operational Guidelines (Revised 31.05.2019), Min of Agriculture
  // =========================================================================
  if (scheme.id === 'pm-kisan') {
    // 1.1 Statutory Exclusion: Institutional landholders (Clause 2.a)
    if (answers.isInstitutionalLandholder === true) {
      disqualifyingExclusions.push(
        "PM-KISAN Clause 2(a): Institutional landholders are excluded from benefits."
      );
    }

    // 1.2 Statutory Exclusion: Income-tax payees in the last assessment year (Clause 2.b.iv)
    if (answers.isIncomeTaxPayee === true || (answers.annualIncome !== undefined && answers.annualIncome > 800000)) {
      disqualifyingExclusions.push(
        "PM-KISAN Statutory Exclusion Clause 2(b)(iv): All persons who paid Income Tax in the last assessment year or fall into the taxable bracket (> ₹8 Lakh) are excluded."
      );
    } else if (answers.isIncomeTaxPayee === false || (answers.annualIncome !== undefined && answers.annualIncome <= 250000)) {
      satisfiedCriteria.push("Confirmed non-income tax payee status (annual income within tax-exempt bracket).");
    } else if (answers.annualIncome !== undefined && answers.annualIncome <= 800000) {
      satisfiedCriteria.push("Reported annual income within standard non-excluded bracket.");
    } else {
      missingCriteria.push("Confirmation of non-income tax payee status.");
    }

    // 1.3 Statutory Exclusion: Constitutional post holders, Ministers, MPs, MLAs, Mayors (Clause 2.b.i-ii)
    if (answers.isConstitutionalPostOrMinister === true) {
      disqualifyingExclusions.push(
        "PM-KISAN Clause 2(b)(i-ii): Former and present constitutional post holders, Ministers, and MPs/MLAs are excluded."
      );
    }

    // 1.4 Statutory Exclusion: Registered professionals (Clause 2.b.v)
    if (answers.isRegisteredProfessional === true) {
      disqualifyingExclusions.push(
        "PM-KISAN Clause 2(b)(v): Doctors, Engineers, Lawyers, Chartered Accountants, and Architects registered with professional bodies are excluded."
      );
    }

    // 1.5 Statutory Exclusion: Government & PSU employment (Clause 2.b.iii)
    // Note: Multi-Tasking Staff / Class IV / Group D employees are explicitly EXEMPTED from exclusion!
    if (answers.govtEmploymentType === 'central_state_regular' || answers.govtEmploymentType === 'psu_autonomous') {
      disqualifyingExclusions.push(
        "PM-KISAN Statutory Exclusion Clause 2(b)(iii): Regular serving or retired officers and employees of Central/State Govt and PSUs are excluded."
      );
    } else if (answers.govtEmploymentType === 'group_d_mts') {
      satisfiedCriteria.push("Group D / Multi-Tasking Staff (MTS) employee: Explicitly exempt from government exclusion under Clause 2(b)(iii).");
    } else if (answers.govtEmploymentType === 'pensioner_above_10k') {
      disqualifyingExclusions.push(
        "PM-KISAN Statutory Exclusion Clause 2(b)(iv): Superannuated/retired pensioners whose monthly pension is ₹10,000 or more are excluded."
      );
    } else if (answers.govtEmploymentType === 'pensioner_below_10k' || answers.govtEmploymentType === 'none' || answers.isGovtEmployee === false) {
      satisfiedCriteria.push("Confirmed non-excluded employment/pension status.");
    } else if (answers.isGovtEmployee === true) {
      // Legacy flag without subtype specified
      disqualifyingExclusions.push(
        "PM-KISAN Statutory Exclusion Clause 2(b)(iii): Serving or retired government/PSU employees are excluded (unless verified as Group D/MTS)."
      );
    } else {
      missingCriteria.push("Confirmation of government/PSU employment and pension bracket.");
    }

    // 1.6 Occupation Requirement: Must be a cultivator farmer
    if (answers.occupation !== undefined) {
      if (answers.occupation === 'farmer') {
        satisfiedCriteria.push("Primary occupation is farming / cultivation.");
      } else {
        disqualifyingExclusions.push(
          "PM-KISAN Clause 2: Restricted to cultivator farmer families owning agricultural land."
        );
      }
    } else {
      missingCriteria.push("Primary occupation details.");
    }

    // 1.7 Landholding Requirement: Must have registered cultivable land in state records (RTC/Khatauni)
    // Universal landholder coverage: 5-acre ceiling was officially abolished on 31.05.2019!
    if (answers.landholdingAcres !== undefined) {
      if (answers.landholdingAcres > 0) {
        satisfiedCriteria.push(`Registered cultivable land ownership title (${answers.landholdingAcres} acres; universal coverage under 2019 Cabinet revision).`);
      } else {
        disqualifyingExclusions.push(
          "PM-KISAN Clause 2: Tenant farmers and landless agricultural labourers without registered land title in state records are ineligible."
        );
      }
    } else {
      missingCriteria.push("Registered agricultural landholding title (RTC / Pahani / Khatauni).");
    }

    // 1.8 Pending Mutation / Inherited Land check
    if (answers.isLandMutationPending === true) {
      missingCriteria.push("Pending land mutation / inherited title in Bhoomi revenue portal requires updated RTC endorsement.");
    }
  }

  // =========================================================================
  // 2. AYUSHMAN BHARAT PM-JAY (Pradhan Mantri Jan Arogya Yojana)
  // Source: NHA Operational Guidelines & Ayushman Vay Vandana Gazette (2024)
  // =========================================================================
  else if (scheme.id === 'pm-jay') {
    // 2.1 Route A: Ayushman Vay Vandana for Senior Citizens (70+ years)
    // Notification S.O. 4668(E): Universal coverage for citizens aged 70+, regardless of income
    if (answers.age !== undefined && answers.age >= 70) {
      satisfiedCriteria.push("Ayushman Vay Vandana: Senior citizen aged 70+ qualifies for ₹5 Lakh hospital coverage irrespective of household income.");
      
      // CGHS/ECHS option notice (not a disqualifier)
      if (answers.govtEmploymentType === 'central_state_regular' || answers.isGovtEmployee === true) {
        satisfiedCriteria.push("Senior citizens with CGHS/ECHS coverage can opt for Ayushman Vay Vandana card as per NHA protocol.");
      }
    } 
    // 2.2 Route B: Vulnerable Households (under 70 years)
    else {
      // Government servant CGHS/ECHS notice (under 70 years)
      if (answers.govtEmploymentType === 'central_state_regular' || (answers.isGovtEmployee === true && answers.govtEmploymentType !== 'group_d_mts')) {
        disqualifyingExclusions.push(
          "PM-JAY Operational Guidelines: Regular government employees covered under statutory CGHS/ECHS or State Medical Attendance Rules are served by respective departmental health schemes."
        );
      }

      // Beneficiary Identification: SECC 2011 / State NFSA Ration Card
      // Important: Self-reported income alone does NOT disqualify or certify an applicant!
      if (answers.hasBplOrRationCard === true || answers.isSeccDeprivedHousehold === true) {
        satisfiedCriteria.push("Reported active state NFSA / BPL ration card or SECC deprivation status.");
        missingCriteria.push("Official biometric e-KYC authentication on NHA Beneficiary Identification System (BIS) / Ayushman Mitra desk.");
      } else if (answers.hasBplOrRationCard === false && answers.isSeccDeprivedHousehold === false) {
        // Confirmed neither SECC nor BPL cardholder
        disqualifyingExclusions.push(
          "PM-JAY Guidelines Section 3: Household is not mapped in SECC 2011 deprivation list (D1-D7 rural, 11 occupational categories urban) or active state NFSA food security records."
        );
      } else {
        // Unverified status: requires official database verification, NOT an automatic disqualification
        missingCriteria.push("Beneficiary verification against NHA SECC 2011 database or active state NFSA BPL/Antyodaya ration records.");
      }

      // State Convergence Context (Karnataka AB-ArK): APL co-payment tier
      if (answers.isEnrolledArogyaKarnataka === true) {
        satisfiedCriteria.push("Ayushman Bharat - Arogya Karnataka (AB-ArK) convergence verified.");
      }
    }
  }

  // =========================================================================
  // 3. PMMVY (Pradhan Mantri Matru Vandana Yojana)
  // Source: Mission Shakti Operational Guidelines (Effective 01.04.2022)
  // =========================================================================
  else if (scheme.id === 'pmmvy') {
    // 3.1 Gender check: Exclusively for women
    if (answers.gender !== undefined) {
      if (answers.gender === 'female') {
        satisfiedCriteria.push("Beneficiary applicant is female.");
      } else {
        disqualifyingExclusions.push(
          "PMMVY Section 3.1: Exclusively benefits pregnant women and lactating mothers; male applicants are excluded and disqualified."
        );
      }
    } else {
      missingCriteria.push("Gender of the applicant.");
    }

    // 3.2 Age check: Minimum 19 years at date of registration
    if (answers.age !== undefined) {
      if (answers.age >= 19) {
        satisfiedCriteria.push(`Beneficiary age (${answers.age} years) meets statutory minimum of 19 years.`);
      } else {
        disqualifyingExclusions.push(
          "PMMVY Section 3.1: Beneficiary mother must be at least 19 years of age at the time of pregnancy registration."
        );
      }
    } else {
      missingCriteria.push("Age proof of the mother.");
    }

    // 3.3 Statutory Exclusion: Government / PSU employment with paid maternity leave (Section 3.2)
    if (answers.govtEmploymentType === 'central_state_regular' || answers.govtEmploymentType === 'psu_autonomous' || answers.isGovtEmployee === true) {
      disqualifyingExclusions.push(
        "PMMVY Section 3.2: Women in regular service with Central/State Govt or PSUs receiving statutory paid maternity leave are excluded."
      );
    } else if (answers.govtEmploymentType === 'none' || answers.isGovtEmployee === false) {
      satisfiedCriteria.push("Confirmed non-government regular employment status.");
    } else {
      missingCriteria.push("Confirmation of non-government employment status.");
    }

    // 3.4 Parity & Benefit Pathway Evaluation (Section 3.1)
    if (answers.maternityParity !== undefined) {
      if (answers.maternityParity === 'first_child') {
        satisfiedCriteria.push("PMMVY Pathway 1: First living child benefit (₹5,000 in two installments).");
      } else if (answers.maternityParity === 'second_child') {
        // Second child is conditional on female sex to discourage female foeticide
        if (answers.childGender === 'female') {
          satisfiedCriteria.push("PMMVY Pathway 2: Second girl child benefit (₹6,000 in single installment upon birth).");
        } else if (answers.childGender === 'male') {
          disqualifyingExclusions.push(
            "PMMVY Section 3.1: Second child benefit of ₹6,000 is exclusively available if the second child is a girl, to counter female foeticide."
          );
        } else {
          missingCriteria.push("Confirmation of female child gender for second child benefit (₹6,000).");
        }
      } else if (answers.maternityParity === 'third_or_more') {
        disqualifyingExclusions.push(
          "PMMVY Section 3.1: Maternity benefits under Mission Shakti are statutorily capped at the first two children."
        );
      }
    } else {
      missingCriteria.push("Maternity parity details (1st living child vs 2nd girl child).");
    }

    // 3.5 Mother & Child Protection (MCP) Card and Active Maternity Status
    if (answers.isPregnantOrLactating === true) {
      satisfiedCriteria.push("Active pregnancy or lactating mother status confirmed.");
    } else if (answers.isPregnantOrLactating === false) {
      disqualifyingExclusions.push(
        "PMMVY Section 3.1: Beneficiary is currently neither an expectant mother nor a nursing mother."
      );
    } else {
      missingCriteria.push("Confirmation of active pregnancy / lactation status.");
    }

    if (answers.hasMcpCard === true) {
      satisfiedCriteria.push("Mother and Child Protection (MCP) card registered with early ANC stamp.");
    } else {
      missingCriteria.push("Mother and Child Protection (MCP) card registration at local Anganwadi / Primary Health Centre (PHC).");
    }
  }

  // =========================================================================
  // 4. PM SVANIDHI (Micro-Credit for Street Vendors)
  // Source: MoHUA Scheme Guidelines (Extended to December 2024)
  // =========================================================================
  else if (scheme.id === 'pm-svanidhi') {
    // 4.1 Occupation check: Strictly urban street vendors / hawkers
    // Note: Artisans and general traders are NOT automatically eligible street vendors!
    if (answers.occupation !== undefined) {
      if (answers.occupation === 'street_vendor' || answers.isUrbanStreetVendor === true) {
        satisfiedCriteria.push("Primary occupation is urban street vending / mobile vending.");
      } else {
        disqualifyingExclusions.push(
          "PM SVANidhi Section 2.1: Scheme is strictly intended for urban street vendors, hawkers, and thelawalas. Artisans/craftspersons are covered under PM Vishwakarma, not SVANidhi."
        );
      }
    } else {
      missingCriteria.push("Vending occupation details.");
    }

    // 4.2 Age check: Minimum 18 years for institutional credit
    if (answers.age !== undefined) {
      if (answers.age >= 18) {
        satisfiedCriteria.push("Applicant meets minimum age of 18 years.");
      } else {
        disqualifyingExclusions.push(
          "PM SVANidhi Guidelines: Minimum age for institutional credit under PM SVANidhi is 18 years."
        );
      }
    } else {
      missingCriteria.push("Age proof.");
    }

    // 4.3 Certificate of Vending (CoV) / Letter of Recommendation (LoR)
    if (answers.hasStreetVendorCertificate === true) {
      satisfiedCriteria.push("Possesses Certificate of Vending (CoV) or ULB/TVC Letter of Recommendation.");
    } else if (answers.hasStreetVendorCertificate === false) {
      disqualifyingExclusions.push(
        "PM SVANidhi Section 2.1: Certificate of Vending or Letter of Recommendation from Town Vending Committee / Municipality is unavailable."
      );
    } else {
      missingCriteria.push("Certificate of Vending (CoV) or Letter of Recommendation (LoR) from Town Vending Committee / Urban Local Body.");
    }
  }

  // =========================================================================
  // 5. POST-MATRIC SCHOLARSHIP (SC/ST/OBC Students)
  // Source: MoSJE Centrally Sponsored PMS Guidelines (Clause 4)
  // =========================================================================
  else if (scheme.id === 'post-matric-scholarship') {
    // 5.1 Affirmative Category check: SC, ST, or OBC
    if (answers.socialCategory !== undefined) {
      if (['sc', 'st', 'obc'].includes(answers.socialCategory)) {
        satisfiedCriteria.push(`Belongs to eligible affirmative community: ${answers.socialCategory.toUpperCase()}.`);
      } else if (answers.socialCategory === 'minority') {
        disqualifyingExclusions.push(
          "Minority students are covered under the dedicated Ministry of Minority Affairs Post-Matric Scholarship Scheme."
        );
      } else {
        disqualifyingExclusions.push(
          "MoSJE PMS Guidelines Clause 4: Centrally sponsored Post-Matric Scholarship is restricted to SC, ST, and OBC/EBC/DNT categories."
        );
      }
    } else {
      missingCriteria.push("Caste / community category certificate.");
    }

    // 5.2 Income Ceiling check: Family annual income <= ₹2,50,000 per annum
    if (answers.annualIncome !== undefined) {
      if (answers.annualIncome <= 250000) {
        satisfiedCriteria.push("Family annual income within statutory scholarship ceiling of ₹2.50 Lakh.");
      } else {
        disqualifyingExclusions.push(
          "MoSJE PMS Guidelines Clause 4.2: Family annual income from all sources exceeds statutory ceiling of ₹2.50 Lakh."
        );
      }
    } else {
      missingCriteria.push("Current financial year family income certificate.");
    }

    // 5.3 Academic Enrollment check
    if (answers.isEnrolledStudent === true || answers.occupation === 'student' || answers.studentCourseLevel !== undefined) {
      satisfiedCriteria.push("Actively enrolled in recognized post-matric secondary or degree course.");
    } else if (answers.isEnrolledStudent === false) {
      disqualifyingExclusions.push(
        "MoSJE PMS Guidelines Clause 4.1: Applicant is not enrolled in a recognized post-matric educational institution."
      );
    } else {
      missingCriteria.push("Active enrollment proof from recognized post-matric institution.");
    }
  }

  // =========================================================================
  // 6. POST-MATRIC SCHOLARSHIP FOR MINORITIES
  // Source: Ministry of Minority Affairs Operational Guidelines (Clause 3)
  // =========================================================================
  else if (scheme.id === 'post-matric-scholarship-minority') {
    // 6.1 Minority Community check
    if (answers.socialCategory !== undefined) {
      if (answers.socialCategory === 'minority') {
        satisfiedCriteria.push("Belongs to notified minority community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).");
      } else {
        disqualifyingExclusions.push(
          "Ministry of Minority Affairs Guidelines Clause 3: Scheme is restricted to notified minority communities."
        );
      }
    } else {
      missingCriteria.push("Minority community declaration / certificate.");
    }

    // 6.2 Income Ceiling check: Family annual income <= ₹2,00,000 per annum (Distinct from ₹2.5L SC ceiling!)
    if (answers.annualIncome !== undefined) {
      if (answers.annualIncome <= 200000) {
        satisfiedCriteria.push("Family annual income within minority scholarship ceiling of ₹2.00 Lakh.");
      } else {
        disqualifyingExclusions.push(
          "Ministry of Minority Affairs Guidelines Clause 3.2: Parental/family annual income exceeds scheme ceiling of ₹2.00 Lakh."
        );
      }
    } else {
      missingCriteria.push("Revenue authority issued income certificate (ceiling ₹2.00 Lakh).");
    }

    // 6.3 Academic Merit: Minimum 50% marks in previous final examination
    if (answers.qualifyingExamMarksPercent !== undefined) {
      if (answers.qualifyingExamMarksPercent >= 50) {
        satisfiedCriteria.push(`Academic merit satisfied (${answers.qualifyingExamMarksPercent}% marks in qualifying exam; minimum 50% required).`);
      } else {
        disqualifyingExclusions.push(
          "Ministry of Minority Affairs Guidelines Clause 3.1: Minimum 50% marks required in the previous final examination."
        );
      }
    } else {
      missingCriteria.push("Qualifying examination marksheet (confirming ≥ 50% marks).");
    }

    // 6.4 Student Enrollment check
    if (answers.isEnrolledStudent === true || answers.occupation === 'student') {
      satisfiedCriteria.push("Actively enrolled in recognized Class 11 to Ph.D. course.");
    } else {
      missingCriteria.push("Active enrollment certificate from approved educational institution.");
    }
  }

  // =========================================================================
  // 7. KISAN CREDIT CARD (KCC) Subsidized Crop & Allied Credit
  // Source: RBI Master Direction FIDD.CO.FSD.BC.No.12/05.05.010/2018-19 (Section 3)
  // =========================================================================
  else if (scheme.id === 'pm-kcc') {
    // 7.1 Multi-Pathway Eligibility: Owner cultivators, tenant farmers, oral lessees, sharecroppers, animal husbandry, fisheries
    let hasValidTenureOrActivity = false;

    if (answers.farmerTenureType !== undefined) {
      if (['owner_cultivator', 'tenant_farmer', 'sharecropper', 'oral_lessee'].includes(answers.farmerTenureType)) {
        hasValidTenureOrActivity = true;
        satisfiedCriteria.push(`KCC Cultivation Pathway: ${answers.farmerTenureType.replace(/_/g, ' ')} recognized under RBI guidelines.`);
      } else if (['animal_husbandry_dairy', 'fisheries'].includes(answers.farmerTenureType)) {
        hasValidTenureOrActivity = true;
        satisfiedCriteria.push(`KCC Allied Activity Pathway: Working capital credit up to ₹2 Lakh for ${answers.farmerTenureType.replace(/_/g, ' ')}.`);
      } else if (answers.farmerTenureType === 'none') {
        disqualifyingExclusions.push(
          "RBI KCC Master Direction Section 3: Applicant is not engaged in agriculture, recorded tenancy, animal husbandry, or fisheries."
        );
      }
    } else {
      // Check landholding fallback
      if (answers.landholdingAcres !== undefined && answers.landholdingAcres > 0) {
        hasValidTenureOrActivity = true;
        satisfiedCriteria.push(`Owner cultivator with registered landholding (${answers.landholdingAcres} acres).`);
      } else if (answers.occupation === 'farmer') {
        // Occupation is farmer but tenure type not specified
        missingCriteria.push("Farmer tenure category (owner cultivator, recorded tenant, sharecropper, animal husbandry, or fisheries).");
      } else {
        disqualifyingExclusions.push(
          "KCC credit facilities require active engagement in agriculture, recorded tenancy, animal husbandry, or fisheries."
        );
      }
    }

    if (hasValidTenureOrActivity) {
      if (answers.hasLandOrTenureRecord === false) {
        disqualifyingExclusions.push(
          "RBI KCC Master Direction: Unable to substantiate cultivation rights, recorded tenancy, or allied animal husbandry/fishery activity."
        );
      } else if (answers.hasLandOrTenureRecord === true) {
        satisfiedCriteria.push("Tenure agreement / land record / allied activity verification confirmed.");
      }
    }
  }

  // ==========================================
  // FINAL OUTCOME CLASSIFICATION
  // ==========================================

  // Rule: Confirmed statutory exclusion -> NOT ESTABLISHED
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

  // Rule: One or more required criteria missing -> ADDITIONAL VERIFICATION REQUIRED
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
 * Separately isolates scholarships from generic subsidies.
 */
export const calculateCategorizedBenefits = (eligibleSchemes: Scheme[]): CategorizedBenefitSummary => {
  let annualCashTransferTotal = 0;
  let oneTimeCashTotal = 0;
  let healthInsuranceCoverTotal = 0;
  let loanCreditFacilityTotal = 0;
  let scholarshipTotal = 0;
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
      case 'scholarship':
        scholarshipTotal += amount;
        break;
      case 'subsidy':
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
    scholarshipTotal,
    subsidyTotal,
    hasNonFinancialBenefits
  };
};

/**
 * Main assessment engine.
 * Evaluates verified schemes using scheme-specific required field logic rather than arbitrary global question counting.
 */
export const assessEligibility = (answers: AssessmentAnswers): EligibilityAssessmentResult => {
  const answeredKeys = Object.keys(answers).filter(k => (answers as any)[k] !== undefined);
  const answeredKeysCount = answeredKeys.length;

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
        scholarshipTotal: 0,
        subsidyTotal: 0,
        hasNonFinancialBenefits: false
      },
      totalAnnualCashBenefit: 0,
      totalAnnualBenefitValue: 0,
      evaluations: {},
      disclaimerKey: "disclaimer_not_assessed"
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

  // Compute distinct categorized benefits
  const categorizedBenefits = calculateCategorizedBenefits(eligibleSchemes);
  const totalAnnualCashBenefit = categorizedBenefits.annualCashTransferTotal;

  // Backward-compatible partialMatchSchemes mapping
  const partialMatchSchemes = additionalVerificationSchemes.map(outcome => ({
    scheme: outcome.scheme,
    missingRequirementKey: outcome.explanation
  }));

  // Overall status determination based on scheme-specific results & completeness:
  // - If at least one scheme is potentially eligible -> potentially_eligible
  // - If 0 eligible, and user has not answered the basic demographic set (occupation, income, and age/gender) -> in_progress
  // - If 0 eligible, but additional verification schemes exist -> additional_verification_required
  // - If all schemes evaluate to not established -> not_established
  const hasCoreDemographics = (
    answers.occupation !== undefined &&
    answers.annualIncome !== undefined &&
    (answers.age !== undefined || answers.gender !== undefined)
  );

  let status: EligibilityAssessmentStatus = 'potentially_eligible';
  let disclaimerKey = "disclaimer_preliminary_guidance";

  if (eligibleSchemes.length === 0) {
    if (!hasCoreDemographics) {
      status = 'in_progress';
      disclaimerKey = "disclaimer_in_progress";
    } else if (additionalVerificationSchemes.length > 0) {
      status = 'additional_verification_required';
    } else {
      status = 'not_established';
    }
  }

  return {
    status,
    eligibleSchemes,
    additionalVerificationSchemes,
    notEstablishedSchemes,
    partialMatchSchemes,
    categorizedBenefits,
    totalAnnualCashBenefit,
    totalAnnualBenefitValue: totalAnnualCashBenefit,
    evaluations,
    disclaimerKey,
    assessmentTimestamp: new Date().toISOString()
  };
};
