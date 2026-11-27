import { describe, it, expect, beforeAll } from 'vitest';
import { translations, loadAllTranslations } from '../data/translations';
import { SUPPORTED_LANGUAGES } from '../data/languages';

describe('Localization & Translation System', () => {
  const languages = SUPPORTED_LANGUAGES;

  beforeAll(async () => {
    await loadAllTranslations();
  });

  it('supports all required official languages (11 Indian languages)', () => {
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

  it('verifies translation key parity between English and all regional languages', () => {
    const enKeys = Object.keys(translations.en);
    languages.filter((l) => l !== 'en').forEach((lang) => {
      const langKeys = new Set(Object.keys(translations[lang]));
      const missing = enKeys.filter((k) => !langKeys.has(k));
      expect(missing, `${lang} missing keys: ${missing.join(', ')}`).toEqual([]);
    });
  });

  it('verifies no empty string values in translations', () => {
    languages.forEach(lang => {
      Object.entries(translations[lang]).forEach(([key, value]) => {
        expect(value.trim().length, `Empty translation for "${key}" in "${lang}"`).toBeGreaterThan(0);
      });
    });
  });
});
