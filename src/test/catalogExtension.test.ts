import { describe, it, expect } from 'vitest';
import { catalogExtensionSchemes, allSchemes, verifiedSchemes } from '../data/schemes';
import { validateSchemes } from '../types/schemeValidation';

describe('Catalogue extension schemes', () => {
  it('validate against the strict scheme schema', () => {
    const result = validateSchemes(catalogExtensionSchemes);
    expect(result.valid, result.errors.join('; ')).toBe(true);
  });

  it('fill the Housing life-event and keep ids unique', () => {
    expect(allSchemes.filter((s) => s.lifeEventId === 'housing_utilities').length).toBeGreaterThanOrEqual(2);
    expect(new Set(allSchemes.map((s) => s.id)).size).toBe(allSchemes.length);
  });

  it('stay outside the engine-evaluated set until their rules are encoded', () => {
    expect(verifiedSchemes.some((s) => catalogExtensionSchemes.some((e) => e.id === s.id))).toBe(false);
    catalogExtensionSchemes.forEach((s) => expect(s.verificationStatus).toBe('NEEDS_REVIEW'));
  });

  it('keep the government application fee at ₹0', () => {
    catalogExtensionSchemes.forEach((s) => {
      expect(s.statutoryFee.amount).toBe(0);
      expect(s.feeStructure?.governmentFee).toBe(0);
    });
  });
});
