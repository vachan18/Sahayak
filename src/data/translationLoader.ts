import { SupportedLanguage } from '../types';
import { translations } from './translations';

const loadedGroups = new Set<string>(['en']);
const loadedUx = new Set<string>(['en']);

// Aangan redesign strings, one lazily-loaded chunk per language
const uxModules = import.meta.glob<{ default: Record<string, string> }>('./ux/regional/*.ts');

async function loadLegacyGroup(lang: SupportedLanguage): Promise<boolean> {
  if (lang === 'kn' || lang === 'hi' || lang === 'bn') {
    if (loadedGroups.has('core')) return false;
    const { coreRegionalTranslations } = await import('./translationsCoreRegional');
    for (const [code, dict] of Object.entries(coreRegionalTranslations)) {
      Object.assign(translations[code as SupportedLanguage], dict);
    }
    loadedGroups.add('core');
    return true;
  }
  if (lang === 'ta' || lang === 'te' || lang === 'ml') {
    if (loadedGroups.has('south')) return false;
    const { southTranslations } = await import('./translationsSouth');
    for (const [code, dict] of Object.entries(southTranslations)) {
      Object.assign(translations[code as SupportedLanguage], dict);
    }
    loadedGroups.add('south');
    return true;
  }
  if (lang === 'ur' || lang === 'as') {
    if (loadedGroups.has('new')) return false;
    const { newLanguageTranslations } = await import('./translationsNew');
    for (const [code, dict] of Object.entries(newLanguageTranslations)) {
      Object.assign(translations[code as SupportedLanguage], dict);
    }
    loadedGroups.add('new');
    return true;
  }
  if (loadedGroups.has('westeast')) return false;
  const { westEastTranslations } = await import('./translationsWestEast');
  for (const [code, dict] of Object.entries(westEastTranslations)) {
    Object.assign(translations[code as SupportedLanguage], dict);
  }
  loadedGroups.add('westeast');
  return true;
}

async function loadUx(lang: SupportedLanguage): Promise<boolean> {
  if (loadedUx.has(lang)) return false;
  const loader = uxModules[`./ux/regional/${lang}.ts`];
  if (!loader) return false;
  const mod = await loader();
  // Applied after legacy strings so redesigned copy wins where keys overlap
  Object.assign(translations[lang], mod.default);
  loadedUx.add(lang);
  return true;
}

export async function loadLanguageTranslations(lang: SupportedLanguage): Promise<boolean> {
  if (lang === 'en') return false;
  const [legacy, ux] = await Promise.all([loadLegacyGroup(lang), loadUx(lang)]);
  return legacy || ux;
}

export async function loadAllTranslations(): Promise<void> {
  const all: SupportedLanguage[] = ['kn', 'hi', 'bn', 'ta', 'te', 'mr', 'ml', 'gu', 'or', 'pa', 'ur', 'as'];
  await Promise.all(all.map((l) => loadLanguageTranslations(l)));
}
