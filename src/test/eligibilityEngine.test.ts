import { describe, it, expect } from 'vitest';
import { 
  assessEligibility, 
  evaluateSchemeEligibility, 
  calculateCategorizedBenefits, 
  AssessmentAnswers 
} from '../services/eligibilityEngine';
import { verifiedSchemes } from '../data/schemes';

describe('Eligibility Engine Phase 4.6 — Hardened Rules & Primary Source Verification', () => {

  // ==========================================
  // SECTION A: MISSING INFORMATION HANDLING
  // ==========================================
  describe('A. Missing Information Handling', () => {
    it('returns "not_assessed" when zero questions are answered', () => {
      const answers: AssessmentAnswers = {};
      const result = assessEligibility(answers);

      expect(result.status).toBe('not_assessed');
      expect(result.eligibleSchemes).toHaveLength(0);
      expect(result.additionalVerificationSchemes).toHaveLength(0);
      expect(result.totalAnnualCashBenefit).toBe(0);
      expect(result.disclaimerKey).toBe('disclaimer_not_assessed');
    });

    it('returns "in_progress" when questionnaire is incomplete (core demographic set missing)', () => {
      const answers: AssessmentAnswers = {
        occupation: 'farmer',
        age: 45
      };
      const result = assessEligibility(answers);

      expect(result.status).toBe('in_progress');
      expect(result.eligibleSchemes).toHaveLength(0);
      expect(result.totalAnnualCashBenefit).toBe(0);
      expect(result.disclaimerKey).toBe('disclaimer_in_progress');
    });

    it('flags "additional_verification_required" when scheme criteria are missing rather than falsely qualifying', () => {
      const pmKisan = verifiedSchemes.find(s => s.id === 'pm-kisan')!;
      
      // Farmer answered occupation and non-govt employee, but landholding is missing
      const outcome = evaluateSchemeEligibility(pmKisan, {
        occupation: 'farmer',
        isGovtEmployee: false
        // landholdingAcres is missing!
      });

      expect(outcome.status).toBe('additional_verification_required');
      expect(outcome.missingCriteria.some(c => c.toLowerCase().includes('landholding'))).toBe(true);
    });

    it('flags PMMVY as "additional_verification_required" when pregnancy/maternity status is unconfirmed', () => {
      const pmmvy = verifiedSchemes.find(s => s.id === 'pmmvy')!;
      
      // Female, 24 years old, non-govt employee, but pregnancy condition is unknown
      const outcome = evaluateSchemeEligibility(pmmvy, {
        gender: 'female',
        age: 24,
        isGovtEmployee: false
        // isPregnantOrLactating is undefined!
      });

      expect(outcome.status).toBe('additional_verification_required');
      expect(outcome.missingCriteria.some(c => c.toLowerCase().includes('mcp'))).toBe(true);
    });
  });

  // ==========================================
  // SECTION B: 5 ELIGIBILITY OUTCOME STATES
  // ==========================================
  describe('B. 5 Eligibility Outcome States', () => {
    it('State 1: "not_assessed" when empty', () => {
      const result = assessEligibility({});
      expect(result.status).toBe('not_assessed');
    });

    it('State 2: "in_progress" when partially filled', () => {
      const result = assessEligibility({ occupation: 'farmer', gender: 'male', age: 30 });
      expect(result.status).toBe('in_progress');
    });

    it('State 3: "potentially_eligible" when citizen satisfies all affirmative criteria with zero exclusions', () => {
      const result = assessEligibility({
        occupation: 'farmer',
        landholdingAcres: 3.5,
        gender: 'male',
        age: 48,
        annualIncome: 120000,
        socialCategory: 'obc',
        isGovtEmployee: false
      });

      expect(result.status).toBe('potentially_eligible');
      expect(result.eligibleSchemes.some(s => s.id === 'pm-kisan')).toBe(true);
      expect(result.totalAnnualCashBenefit).toBe(6000);
    });

    it('State 4: "not_established" when confirmed exclusion applies to all assessed schemes', () => {
      // Permanent government employee with no land and non-vendor occupation
      const result = assessEligibility({
        occupation: 'other',
        landholdingAcres: 0,
        gender: 'male',
        age: 42,
        annualIncome: 950000,
        isGovtEmployee: true
      });

      expect(result.status).toBe('not_established');
      expect(result.eligibleSchemes).toHaveLength(0);
    });

    it('State 5: "additional_verification_required" when no schemes match fully but document checks are needed', () => {
      // Female daily wage earner with income < 2.5L and non-govt employee
      const result = assessEligibility({
        occupation: 'daily_wage',
        landholdingAcres: 0,
        gender: 'female',
        age: 28,
        annualIncome: 110000,
        isGovtEmployee: false
      });

      expect(result.status).toBe('additional_verification_required');
      expect(result.eligibleSchemes).toHaveLength(0);
      expect(result.additionalVerificationSchemes.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // SECTION C: SCHEME-SPECIFIC RULES & VERIFICATION
  // ==========================================
  describe('C. Scheme-Specific Rules', () => {

    describe('PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', () => {
      const pmKisan = verifiedSchemes.find(s => s.id === 'pm-kisan')!;

      it('does NOT arbitrarily exclude farmers with > 5 acres (revised 31.05.2019 Cabinet guidelines)', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 12.0, // 12 acres large landholder
          annualIncome: 200000,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.disqualifyingExclusions).toHaveLength(0);
      });

      it('excludes landless farmers and agricultural labourers (landholding = 0)', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 0,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('registered land title');
      });

      it('enforces statutory regular government employee exclusion', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 2.0,
          isGovtEmployee: true
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('Statutory Exclusion');
      });

      it('exempts Group D / MTS employees from government exclusion under Clause 2(b)(iii)', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 2.5,
          annualIncome: 220000,
          isGovtEmployee: true,
          govtEmploymentType: 'group_d_mts'
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('Group D'))).toBe(true);
      });

      it('excludes pensioners with monthly pension >= ₹10,000 under Clause 2(b)(iv)', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 3.0,
          annualIncome: 250000,
          isGovtEmployee: true,
          govtEmploymentType: 'pensioner_above_10k'
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.disqualifyingExclusions.some(e => e.includes('₹10,000'))).toBe(true);
      });

      it('exempts pensioners with monthly pension < ₹10,000', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 3.0,
          annualIncome: 180000,
          isGovtEmployee: true,
          govtEmploymentType: 'pensioner_below_10k'
        });

        expect(outcome.status).toBe('potentially_eligible');
      });

      it('excludes income-tax payees under Clause 2(b)(iv)', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 2.0,
          isIncomeTaxPayee: true,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('Clause 2(b)(iv)');
      });
    });

    describe('Ayushman Bharat PM-JAY', () => {
      const pmJay = verifiedSchemes.find(s => s.id === 'pm-jay')!;

      it('qualifies all senior citizens aged 70+ under expanded Ayushman Vay Vandana card regardless of income', () => {
        const outcome = evaluateSchemeEligibility(pmJay, {
          age: 72,
          annualIncome: 800000, // High income does not disqualify 70+ senior citizen
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('Vay Vandana'))).toBe(true);
      });

      it('does NOT assume eligibility from income alone for under-70 citizens; requires SECC / BPL card verification', () => {
        const outcome = evaluateSchemeEligibility(pmJay, {
          age: 45,
          annualIncome: 120000,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('additional_verification_required');
        expect(outcome.missingCriteria.some(c => c.includes('SECC 2011'))).toBe(true);
      });

      it('does NOT auto-disqualify families with income > 2.5L; flags additional_verification_required if SECC unconfirmed', () => {
        const outcome = evaluateSchemeEligibility(pmJay, {
          age: 45,
          annualIncome: 650000,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('additional_verification_required');
        expect(outcome.missingCriteria.some(c => c.includes('SECC 2011'))).toBe(true);
      });

      it('excludes under-70 applicants when confirmed non-SECC and non-BPL', () => {
        const outcome = evaluateSchemeEligibility(pmJay, {
          age: 45,
          annualIncome: 350000,
          hasBplOrRationCard: false,
          isSeccDeprivedHousehold: false,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.disqualifyingExclusions.some(e => e.includes('SECC 2011'))).toBe(true);
      });

      it('excludes regular government employees covered under CGHS/ECHS', () => {
        const outcome = evaluateSchemeEligibility(pmJay, {
          age: 40,
          annualIncome: 450000,
          hasBplOrRationCard: true,
          isGovtEmployee: true,
          govtEmploymentType: 'central_state_regular'
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.disqualifyingExclusions.some(e => e.includes('CGHS/ECHS'))).toBe(true);
      });
    });

    describe('PMMVY (Pradhan Mantri Matru Vandana Yojana)', () => {
      const pmmvy = verifiedSchemes.find(s => s.id === 'pmmvy')!;

      it('excludes male applicants with a clear statutory explanation', () => {
        const outcome = evaluateSchemeEligibility(pmmvy, {
          gender: 'male',
          age: 30,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('male applicants are excluded');
      });

      it('excludes applicants under 19 years of age', () => {
        const outcome = evaluateSchemeEligibility(pmmvy, {
          gender: 'female',
          age: 17,
          isPregnantOrLactating: true,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('19 years of age');
      });

      it('qualifies eligible expectant mother for 1st child (₹5,000) when all conditions are affirmatively satisfied', () => {
        const outcome = evaluateSchemeEligibility(pmmvy, {
          gender: 'female',
          age: 24,
          isPregnantOrLactating: true,
          maternityParity: 'first_child',
          hasMcpCard: true,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('First living child'))).toBe(true);
      });

      it('qualifies eligible mother for 2nd girl child (₹6,000) under Mission Shakti guidelines', () => {
        const outcome = evaluateSchemeEligibility(pmmvy, {
          gender: 'female',
          age: 26,
          isPregnantOrLactating: true,
          maternityParity: 'second_child',
          childGender: 'female',
          hasMcpCard: true,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('Second girl child'))).toBe(true);
      });

      it('excludes 2nd boy child with statutory reasoning countering female foeticide', () => {
        const outcome = evaluateSchemeEligibility(pmmvy, {
          gender: 'female',
          age: 26,
          isPregnantOrLactating: true,
          maternityParity: 'second_child',
          childGender: 'male',
          hasMcpCard: true,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.disqualifyingExclusions.some(e => e.includes('second child is a girl'))).toBe(true);
      });

      it('excludes 3rd or subsequent children under statutory cap', () => {
        const outcome = evaluateSchemeEligibility(pmmvy, {
          gender: 'female',
          age: 30,
          isPregnantOrLactating: true,
          maternityParity: 'third_or_more',
          hasMcpCard: true,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('first two children');
      });
    });

    describe('PM SVANidhi (Micro-Credit for Street Vendors)', () => {
      const svanidhi = verifiedSchemes.find(s => s.id === 'pm-svanidhi')!;

      it('qualifies verified street vendor with Certificate of Vending (CoV)', () => {
        const outcome = evaluateSchemeEligibility(svanidhi, {
          occupation: 'street_vendor',
          age: 32,
          hasStreetVendorCertificate: true
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('urban street vending'))).toBe(true);
      });

      it('excludes artisans and directs to PM Vishwakarma', () => {
        const outcome = evaluateSchemeEligibility(svanidhi, {
          occupation: 'artisan',
          age: 35,
          hasStreetVendorCertificate: false
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('PM Vishwakarma');
      });

      it('flags additional_verification_required when CoV / LoR status is unconfirmed', () => {
        const outcome = evaluateSchemeEligibility(svanidhi, {
          occupation: 'street_vendor',
          age: 28
        });

        expect(outcome.status).toBe('additional_verification_required');
        expect(outcome.missingCriteria.some(c => c.includes('Certificate of Vending'))).toBe(true);
      });
    });

    describe('Kisan Credit Card (KCC)', () => {
      const kcc = verifiedSchemes.find(s => s.id === 'pm-kcc')!;

      it('qualifies owner cultivators with agricultural land', () => {
        const outcome = evaluateSchemeEligibility(kcc, {
          occupation: 'farmer',
          landholdingAcres: 4.5,
          farmerTenureType: 'owner_cultivator'
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('owner cultivator'))).toBe(true);
      });

      it('qualifies tenant farmers without requiring land ownership title', () => {
        const outcome = evaluateSchemeEligibility(kcc, {
          occupation: 'farmer',
          landholdingAcres: 0,
          farmerTenureType: 'tenant_farmer'
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('tenant farmer'))).toBe(true);
      });

      it('qualifies sharecroppers under RBI KCC Master Direction', () => {
        const outcome = evaluateSchemeEligibility(kcc, {
          occupation: 'farmer',
          landholdingAcres: 0,
          farmerTenureType: 'sharecropper'
        });

        expect(outcome.status).toBe('potentially_eligible');
      });

      it('qualifies animal husbandry / dairy farmers for working capital up to ₹2 Lakh', () => {
        const outcome = evaluateSchemeEligibility(kcc, {
          occupation: 'farmer',
          landholdingAcres: 0,
          farmerTenureType: 'animal_husbandry_dairy'
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.satisfiedCriteria.some(c => c.includes('Allied Activity Pathway'))).toBe(true);
      });

      it('qualifies fisheries applicants without cultivable land ownership', () => {
        const outcome = evaluateSchemeEligibility(kcc, {
          occupation: 'farmer',
          landholdingAcres: 0,
          farmerTenureType: 'fisheries'
        });

        expect(outcome.status).toBe('potentially_eligible');
      });

      it('flags additional_verification_required when tenure type is unconfirmed', () => {
        const outcome = evaluateSchemeEligibility(kcc, {
          occupation: 'farmer',
          landholdingAcres: 0
        });

        expect(outcome.status).toBe('additional_verification_required');
      });
    });

    describe('Post-Matric Scholarships Separation (SC/ST/OBC vs Minority)', () => {
      const pms = verifiedSchemes.find(s => s.id === 'post-matric-scholarship')!;
      const pmsMin = verifiedSchemes.find(s => s.id === 'post-matric-scholarship-minority')!;

      it('qualifies SC student with family income ₹2.20 Lakh under MoSJE scheme (ceiling ₹2.5L)', () => {
        const outcome = evaluateSchemeEligibility(pms, {
          socialCategory: 'sc',
          annualIncome: 220000,
          isEnrolledStudent: true
        });

        expect(outcome.status).toBe('potentially_eligible');
        expect(outcome.disqualifyingExclusions).toHaveLength(0);
      });

      it('excludes minority student with family income ₹2.20 Lakh because Minority ceiling is ₹2.0L', () => {
        const outcome = evaluateSchemeEligibility(pmsMin, {
          socialCategory: 'minority',
          annualIncome: 220000,
          isEnrolledStudent: true,
          qualifyingExamMarksPercent: 65
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('₹2.00 Lakh');
      });

      it('qualifies minority student with income ₹1.80 Lakh and 55% marks', () => {
        const outcome = evaluateSchemeEligibility(pmsMin, {
          socialCategory: 'minority',
          annualIncome: 180000,
          isEnrolledStudent: true,
          qualifyingExamMarksPercent: 55
        });

        expect(outcome.status).toBe('potentially_eligible');
      });

      it('excludes minority student with 45% marks (< 50% statutory threshold)', () => {
        const outcome = evaluateSchemeEligibility(pmsMin, {
          socialCategory: 'minority',
          annualIncome: 180000,
          isEnrolledStudent: true,
          qualifyingExamMarksPercent: 45
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('50% marks');
      });

      it('excludes General category non-minority from affirmative scholarship schemes', () => {
        const scOutcome = evaluateSchemeEligibility(pms, {
          socialCategory: 'general',
          annualIncome: 150000,
          isEnrolledStudent: true
        });
        expect(scOutcome.status).toBe('not_established');

        const minOutcome = evaluateSchemeEligibility(pmsMin, {
          socialCategory: 'general',
          annualIncome: 150000,
          isEnrolledStudent: true,
          qualifyingExamMarksPercent: 75
        });
        expect(minOutcome.status).toBe('not_established');
      });
    });
  });

  // ==========================================
  // SECTION D: BENEFIT CALCULATION INTEGRITY
  // ==========================================
  describe('D. Benefit Calculation Integrity', () => {
    it('NEVER combines health insurance coverage or loans into annual cash income', () => {
      const pmKisan = verifiedSchemes.find(s => s.id === 'pm-kisan')!; // 6,000 cash
      const pmJay = verifiedSchemes.find(s => s.id === 'pm-jay')!;     // 500,000 insurance
      const pmSvanidhi = verifiedSchemes.find(s => s.id === 'pm-svanidhi')!; // 10,000 loan

      const categorized = calculateCategorizedBenefits([pmKisan, pmJay, pmSvanidhi]);

      // Direct cash transfer must strictly be ₹6,000
      expect(categorized.annualCashTransferTotal).toBe(6000);

      // Hospital health cover must be isolated
      expect(categorized.healthInsuranceCoverTotal).toBe(500000);

      // Loan facility must be isolated
      expect(categorized.loanCreditFacilityTotal).toBe(10000);

      // Total annual cash must not equal ₹5,16,000!
      expect(categorized.annualCashTransferTotal).not.toBe(516000);
    });

    it('does not assume that one-time maternity grants repeat annually', () => {
      const pmmvy = verifiedSchemes.find(s => s.id === 'pmmvy')!; // 5,000 one-time
      const categorized = calculateCategorizedBenefits([pmmvy]);

      expect(categorized.annualCashTransferTotal).toBe(0);
      expect(categorized.oneTimeCashTotal).toBe(5000);
    });

    it('isolates scholarships from generic subsidies', () => {
      const pms = verifiedSchemes.find(s => s.id === 'post-matric-scholarship')!;
      const categorized = calculateCategorizedBenefits([pms]);

      expect(categorized.scholarshipTotal).toBe(14000);
      expect(categorized.subsidyTotal).toBe(0);
      expect(categorized.annualCashTransferTotal).toBe(0);
    });
  });

  // ==========================================
  // SECTION E: BOUNDARY CONDITIONS
  // ==========================================
  describe('E. Boundary Conditions', () => {
    it('handles exact income threshold boundaries (₹2,50,000)', () => {
      const scholarship = verifiedSchemes.find(s => s.id === 'post-matric-scholarship')!;

      // Exactly 250,000 -> allowed
      const atCeiling = evaluateSchemeEligibility(scholarship, {
        socialCategory: 'sc',
        annualIncome: 250000,
        isEnrolledStudent: true
      });
      expect(atCeiling.disqualifyingExclusions).toHaveLength(0);

      // 250,001 -> excluded
      const aboveCeiling = evaluateSchemeEligibility(scholarship, {
        socialCategory: 'sc',
        annualIncome: 250001,
        isEnrolledStudent: true
      });
      expect(aboveCeiling.status).toBe('not_established');
    });

    it('handles exact minimum age boundaries (18 for PM SVANidhi, 19 for PMMVY)', () => {
      const svanidhi = verifiedSchemes.find(s => s.id === 'pm-svanidhi')!;

      // Age 17 -> disqualified
      const age17 = evaluateSchemeEligibility(svanidhi, {
        occupation: 'street_vendor',
        age: 17,
        hasStreetVendorCertificate: true
      });
      expect(age17.status).toBe('not_established');

      // Age 18 -> allowed
      const age18 = evaluateSchemeEligibility(svanidhi, {
        occupation: 'street_vendor',
        age: 18,
        hasStreetVendorCertificate: true
      });
      expect(age18.status).toBe('potentially_eligible');
    });
  });
});
