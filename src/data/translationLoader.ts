import { SupportedLanguage } from '../types';
import { translations } from './translations';

const loadedGroups = new Set<string>(['en']);

export async function loadLanguageTranslations(lang: SupportedLanguage): Promise<boolean> {
  if (lang === 'en') return false;
  if (lang === 'kn' || lang === 'hi' || lang === 'bn') {
    if (loadedGroups.has('core')) return false;
    const { coreRegionalTranslations } = await import('./translationsCoreRegional');
    Object.assign(translations, coreRegionalTranslations);
    loadedGroups.add('core');
    return true;
  }
  if (lang === 'ta' || lang === 'te' || lang === 'ml') {
    if (loadedGroups.has('south')) return false;
    const { southTranslations } = await import('./translationsSouth');
    Object.assign(translations, southTranslations);
    loadedGroups.add('south');
    return true;
  }
  if (loadedGroups.has('westeast')) return false;
  const { westEastTranslations } = await import('./translationsWestEast');
  Object.assign(translations, westEastTranslations);
  loadedGroups.add('westeast');
  return true;
}

export async function loadAllTranslations(): Promise<void> {
  await Promise.all([
    loadLanguageTranslations('kn'),
    loadLanguageTranslations('ta'),
    loadLanguageTranslations('mr'),
  ]);
}
