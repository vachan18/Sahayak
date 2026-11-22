import { describe, it, expect } from 'vitest';
import { 
  assessEligibility, 
  evaluateSchemeEligibility, 
  calculateCategorizedBenefits, 
  AssessmentAnswers 
} from '../services/eligibilityEngine';
import { verifiedSchemes } from '../data/schemes';

describe('Eligibility Engine Phase 4.5 — Government Integrity & Rules Verification', () => {

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

    it('returns "in_progress" when questionnaire is incomplete (< 4 questions answered)', () => {
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
  // SECTION B: 5 ELIGIBILITY RESULT STATES
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

    describe('PM-KISAN', () => {
      const pmKisan = verifiedSchemes.find(s => s.id === 'pm-kisan')!;

      it('does NOT arbitrarily exclude farmers with > 5 acres (revised 31.05.2019 Cabinet guidelines)', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 12.0, // 12 acres large landholder
          isGovtEmployee: false
        });

        // Must be potentially eligible — no 5-acre ceiling exists in official revised scheme guidelines!
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

      it('enforces statutory government employee exclusion', () => {
        const outcome = evaluateSchemeEligibility(pmKisan, {
          occupation: 'farmer',
          landholdingAcres: 2.0,
          isGovtEmployee: true
        });

        expect(outcome.status).toBe('not_established');
        expect(outcome.explanation).toContain('Statutory Exclusion');
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
          // hasBplOrRationCard is undefined!
        });

        expect(outcome.status).toBe('additional_verification_required');
        expect(outcome.missingCriteria.some(c => c.includes('SECC 2011'))).toBe(true);
      });

      it('excludes families with income exceeding PM-JAY threshold', () => {
        const outcome = evaluateSchemeEligibility(pmJay, {
          age: 45,
          annualIncome: 650000,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('not_established');
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

      it('qualifies eligible expectant mother when all conditions are affirmatively satisfied', () => {
        const outcome = evaluateSchemeEligibility(pmmvy, {
          gender: 'female',
          age: 24,
          isPregnantOrLactating: true,
          isGovtEmployee: false
        });

        expect(outcome.status).toBe('potentially_eligible');
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
