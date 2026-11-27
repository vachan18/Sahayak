import { describe, it, expect, beforeAll } from 'vitest';
import { translations } from '../data/translations';
import { loadAllTranslations } from '../data/translationLoader';
import { SUPPORTED_LANGUAGES, LANGUAGE_META } from '../data/languages';
import { eligibilityEn } from '../data/eligibilityTranslations';
import { uxEn } from '../data/ux';

describe('Localization & Translation System', () => {
  const languages = SUPPORTED_LANGUAGES;

  beforeAll(async () => {
    await loadAllTranslations();
  });

  it('supports all 13 languages (English + 12 Indian languages incl. Urdu & Assamese)', () => {
    expect(languages).toHaveLength(13);
    expect(languages).toEqual(expect.arrayContaining(['ur', 'as']));
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

  it('verifies legacy key parity between English and all regional languages', () => {
    // Namespaced redesign keys ("home.*", "shell.*" …) are covered by the dedicated test below.
    const enKeys = Object.keys(translations.en).filter((k) => !k.includes('.'));
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

  it('marks Urdu as right-to-left and every other language as left-to-right', () => {
    languages.forEach((lang) => {
      expect(LANGUAGE_META[lang].dir ?? 'ltr').toBe(lang === 'ur' ? 'rtl' : 'ltr');
    });
  });

  it('translates the eligibility flow in every regional language (no English fallback)', () => {
    // Proper nouns / acronyms / short tokens may legitimately match English.
    const allowSame = (v: string) => v.length <= 3 || /^[\s\d₹,./%()+\-–:]*$/.test(v);
    const keys = Object.keys(eligibilityEn) as (keyof typeof eligibilityEn)[];
    languages.filter((l) => l !== 'en').forEach((lang) => {
      const untranslated = keys.filter((k) => translations[lang][k] === eligibilityEn[k] && !allowSame(eligibilityEn[k]));
      expect(untranslated, `${lang} shows English for: ${untranslated.join(', ')}`).toEqual([]);
    });
  });

  it('has every Aangan redesign string (src/data/ux) in every regional language', () => {
    const uxKeys = Object.keys(uxEn);
    languages.filter((l) => l !== 'en').forEach((lang) => {
      const missing = uxKeys.filter((k) => !translations[lang][k] || !translations[lang][k].trim());
      expect(missing, `${lang} missing redesign keys: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ` … (+${missing.length - 12})` : ''}`).toEqual([]);
    });
  });
});
