import { describe, it, expect } from 'vitest';
import { verifiedSchemes } from '../data/schemes';

describe('Scheme Catalog & Search Engine', () => {
  it('contains verified schemes with all mandatory metadata fields', () => {
    expect(verifiedSchemes.length).toBeGreaterThan(0);

    verifiedSchemes.forEach(scheme => {
      expect(scheme.id).toBeDefined();
      expect(scheme.titleKey).toBeDefined();
      expect(scheme.shortDescKey).toBeDefined();
      expect(scheme.lifeEventId).toBeDefined();
      expect(scheme.ministryKey).toBeDefined();
      expect(scheme.benefitType).toBeDefined();
      expect(scheme.financialBenefit).toBeDefined();
      expect(scheme.financialBenefit.amount).toBeGreaterThan(0);
      expect(scheme.statutoryFee).toBeDefined();
      expect(scheme.statutoryFee.amount).toBe(0); // All 6 primary schemes are statutory free applications
      expect(scheme.processingSlaDays).toBeGreaterThan(0);
      expect(scheme.sourceAttribution).toBeDefined();
      expect(scheme.lastVerifiedDate).toBeDefined();
      expect(scheme.documents.length).toBeGreaterThan(0);
    });
  });

  it('filters schemes by life event category', () => {
    const farmingSchemes = verifiedSchemes.filter(s => s.lifeEventId === 'farming');
    expect(farmingSchemes.length).toBeGreaterThan(0);
    expect(farmingSchemes.some(s => s.id === 'pm-kisan')).toBe(true);

    const healthSchemes = verifiedSchemes.filter(s => s.lifeEventId === 'health_elder');
    expect(healthSchemes.length).toBeGreaterThan(0);
    expect(healthSchemes.some(s => s.id === 'pm-jay')).toBe(true);
  });

  it('searches schemes by keyword query across title and description', () => {
    const query = 'Kisan';
    const matches = verifiedSchemes.filter(s => 
      s.titleKey.toLowerCase().includes(query.toLowerCase()) || 
      s.shortDescKey.toLowerCase().includes(query.toLowerCase())
    );

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some(s => s.id === 'pm-kisan')).toBe(true);
  });

  it('sorts schemes by processing SLA turnaround time', () => {
    const sorted = [...verifiedSchemes].sort((a, b) => a.processingSlaDays - b.processingSlaDays);

    expect(sorted[0].processingSlaDays).toBeLessThanOrEqual(sorted[sorted.length - 1].processingSlaDays);
  });

  it('ensures every scheme has official statutory fee citation and source attribution', () => {
    verifiedSchemes.forEach(scheme => {
      expect(scheme.statutoryFee.statutoryRuleCitation).toBeDefined();
      expect(scheme.statutoryFee.statutoryRuleCitation.length).toBeGreaterThan(5);
      expect(scheme.sourceAttribution.length).toBeGreaterThan(5);
      expect(scheme.officialPortalUrl).toMatch(/^https?:\/\//);
    });
  });
});
