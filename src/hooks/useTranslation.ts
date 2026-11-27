import { useAppStore } from '../store/useAppStore';
import { translations } from '../data/translations';

export const useTranslation = () => {
  const { language, setLanguage, translationsVersion } = useAppStore();

  const t = (key: string, fallback?: string): string => {
    void translationsVersion;
    const langDict = translations[language] || translations.en;
    if (langDict[key]) {
      return langDict[key];
    }
    // Fallback to English if translation key missing in regional dialect
    if (translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return { t, language, setLanguage };
};
