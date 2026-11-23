import { describe, it, expect } from 'vitest';
import { translations } from '../data/translations';
import { SupportedLanguage } from '../types';

describe('Localization & Translation System', () => {
  const languages: SupportedLanguage[] = ['en', 'kn', 'hi', 'bn'];

  it('supports all required official languages (English, Kannada, Hindi, Bengali)', () => {
    languages.forEach(lang => {
      expect(translations[lang]).toBeDefined();
      expect(typeof translations[lang]).toBe('object');
    });
  });

  it('ensures core brand and navigation keys exist in all languages', () => {
    const requiredKeys = [
      'appName',
      'tagline',
      'navHome',
      'navEligibility',
      'navDocuments',
      'navTracker',
      'navProfile',
      'navNotifications',
      'statutoryFreeFee',
      'officialSla',
      'days',
      'perYear',
      'directDbtBank',
      'sourceAttributionLabel',
      'lastVerifiedLabel',
      'demoDataBadge'
    ];

    languages.forEach(lang => {
      requiredKeys.forEach(key => {
        expect(translations[lang][key], `Missing key "${key}" in language "${lang}"`).toBeDefined();
        expect(translations[lang][key].length).toBeGreaterThan(0);
      });
    });
  });

  it('verifies translation key parity between English and Indic languages', () => {
    const enKeys = Object.keys(translations.en);
    const knKeys = new Set(Object.keys(translations.kn));
    const hiKeys = new Set(Object.keys(translations.hi));
    const bnKeys = new Set(Object.keys(translations.bn));

    const missingInKn = enKeys.filter(k => !knKeys.has(k));
    const missingInHi = enKeys.filter(k => !hiKeys.has(k));
    const missingInBn = enKeys.filter(k => !bnKeys.has(k));

    expect(missingInKn, `Kannada missing keys: ${missingInKn.join(', ')}`).toEqual([]);
    expect(missingInHi, `Hindi missing keys: ${missingInHi.join(', ')}`).toEqual([]);
    expect(missingInBn, `Bengali missing keys: ${missingInBn.join(', ')}`).toEqual([]);
  });

  it('verifies no empty string values in translations', () => {
    languages.forEach(lang => {
      Object.entries(translations[lang]).forEach(([key, value]) => {
        expect(value.trim().length, `Empty translation for "${key}" in "${lang}"`).toBeGreaterThan(0);
      });
    });
  });
});
