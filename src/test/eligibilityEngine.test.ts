import { describe, it, expect } from 'vitest';
import { assessEligibility, AssessmentAnswers } from '../services/eligibilityEngine';

describe('Eligibility Engine (Bolo Aur Jano)', () => {
  it('State 1: returns "not_assessed" when zero answers are supplied', () => {
    const answers: AssessmentAnswers = {};
    const result = assessEligibility(answers);

    expect(result.status).toBe('not_assessed');
    expect(result.eligibleSchemes).toHaveLength(0);
    expect(result.partialMatchSchemes).toHaveLength(0);
    expect(result.totalAnnualBenefitValue).toBe(0);
    expect(result.disclaimerKey).toBe('disclaimer_not_assessed');
  });

  it('State 2: returns "in_progress" when fewer than 3 answers are provided', () => {
    const answers: AssessmentAnswers = {
      occupation: 'farmer',
      age: 45,
    };
    const result = assessEligibility(answers);

    expect(result.status).toBe('in_progress');
    expect(result.eligibleSchemes).toHaveLength(0);
    expect(result.totalAnnualBenefitValue).toBe(0);
    expect(result.disclaimerKey).toBe('disclaimer_in_progress');
  });

  it('State 3: returns "potentially_eligible" with matching schemes when user meets criteria', () => {
    // Rameshwar: Small farmer, 1.5 acres, non-govt employee, income 1.1L
    const answers: AssessmentAnswers = {
      occupation: 'farmer',
      landholdingAcres: 1.5,
      gender: 'male',
      age: 52,
      annualIncome: 110000,
      socialCategory: 'obc',
      isGovtEmployee: false,
    };
    const result = assessEligibility(answers);

    expect(result.status).toBe('potentially_eligible');
    expect(result.eligibleSchemes.length).toBeGreaterThan(0);

    // Should qualify for PM-KISAN (farmer with <= 5 acres)
    const pmKisan = result.eligibleSchemes.find(s => s.id === 'pm-kisan');
    expect(pmKisan).toBeDefined();

    // Total benefit should include PM-KISAN (₹6000)
    expect(result.totalAnnualBenefitValue).toBeGreaterThanOrEqual(6000);
    expect(result.disclaimerKey).toBe('disclaimer_preliminary_guidance');
    expect(result.assessmentTimestamp).toBeDefined();
  });

  it('State 4: handles government employee statutory exclusion correctly', () => {
    const answers: AssessmentAnswers = {
      occupation: 'farmer',
      landholdingAcres: 2.0,
      gender: 'male',
      age: 48,
      annualIncome: 120000,
      socialCategory: 'general',
      isGovtEmployee: true, // Permanent government employee
    };
    const result = assessEligibility(answers);

    // PM-KISAN, PMMVY, PM-JAY exclude govt employees
    const pmKisan = result.eligibleSchemes.find(s => s.id === 'pm-kisan');
    expect(pmKisan).toBeUndefined();

    // Should list exclusion in partial match
    const pmKisanPartial = result.partialMatchSchemes.find(p => p.scheme.id === 'pm-kisan');
    expect(pmKisanPartial).toBeDefined();
    expect(pmKisanPartial?.missingRequirementKey).toContain('Excludes permanent government employees');
  });

  it('State 5: returns "additional_verification_required" when no schemes match fully but partial matches exist', () => {
    // Non-farmer with zero landholding and no vending certificate answering 3 questions
    const answers: AssessmentAnswers = {
      occupation: 'other',
      landholdingAcres: 0,
      gender: 'male',
      age: 35,
      annualIncome: 450000,
      isGovtEmployee: false,
    };
    const result = assessEligibility(answers);

    // Should require additional verification or not established
    expect(['additional_verification_required', 'not_established']).toContain(result.status);
    if (result.status === 'additional_verification_required') {
      expect(result.eligibleSchemes).toHaveLength(0);
      expect(result.partialMatchSchemes.length).toBeGreaterThan(0);
    }
  });

  it('verifies landholding ceiling rule for PM-KISAN (over 5 acres)', () => {
    const answers: AssessmentAnswers = {
      occupation: 'farmer',
      landholdingAcres: 12.0, // Exceeds ceiling
      gender: 'male',
      age: 50,
      annualIncome: 200000,
      isGovtEmployee: false,
    };
    const result = assessEligibility(answers);

    const pmKisan = result.eligibleSchemes.find(s => s.id === 'pm-kisan');
    expect(pmKisan).toBeUndefined();

    const pmKisanPartial = result.partialMatchSchemes.find(p => p.scheme.id === 'pm-kisan');
    expect(pmKisanPartial?.missingRequirementKey).toContain('Landholding exceeds ceiling');
  });

  it('verifies gender restriction for maternal health schemes (PMMVY)', () => {
    const maleAnswers: AssessmentAnswers = {
      occupation: 'unemployed',
      gender: 'male',
      age: 26,
      annualIncome: 90000,
      isGovtEmployee: false,
    };
    const result = assessEligibility(maleAnswers);

    const pmmvy = result.eligibleSchemes.find(s => s.id === 'pmmvy');
    expect(pmmvy).toBeUndefined();

    const pmmvyPartial = result.partialMatchSchemes.find(p => p.scheme.id === 'pmmvy');
    if (pmmvyPartial) {
      expect(pmmvyPartial.missingRequirementKey).toContain('pregnant women');
    }
  });
});
