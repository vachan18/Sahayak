import { describe, it, expect } from 'vitest';
import { verifiedSchemes } from '../data/schemes';
import { validateSchemes, validateSchemeRecord } from '../types/schemeValidation';

describe('Scheme Data Validation & Integrity (Zod Schema)', () => {
  it('validates all verified scheme records against strict Zod schema', () => {
    const result = validateSchemes(verifiedSchemes);
    expect(result.valid, `Validation failed with errors: ${result.errors.join('; ')}`).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('ensures each scheme has an official verificationStatus of VERIFIED, NEEDS_REVIEW, or DEMONSTRATION', () => {
    verifiedSchemes.forEach(scheme => {
      expect(['VERIFIED', 'NEEDS_REVIEW', 'DEMONSTRATION']).toContain(scheme.verificationStatus);
    });
  });

  it('ensures benefitCategory is strictly defined and distinguished from plain cash', () => {
    const categories = verifiedSchemes.map(s => s.benefitCategory);
    expect(categories).toContain('annual_cash_transfer');
    expect(categories).toContain('health_insurance_cover');
    expect(categories).toContain('loan_credit_facility');
    expect(categories).toContain('one_time_cash');
    expect(categories).toContain('scholarship');
  });

  it('ensures statutory fee structure distinguishes government fee from CSC charges', () => {
    verifiedSchemes.forEach(scheme => {
      expect(scheme.statutoryFee).toBeDefined();
      expect(scheme.statutoryFee.amount).toBe(0); // Official government fee is ₹0
      expect(scheme.feeStructure).toBeDefined();
      expect(scheme.feeStructure?.governmentFee).toBe(0);
    });
  });

  it('catches invalid scheme records missing required fields or having negative amounts', () => {
    const invalidRecord = {
      id: "invalid-scheme",
      // missing titleKey
      financialBenefit: {
        amount: -500 // Invalid negative amount
      }
    };

    expect(() => validateSchemeRecord(invalidRecord)).toThrow();
  });
});
