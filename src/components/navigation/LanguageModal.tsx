import React from 'react';
import { Check, Volume2, X } from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { speakVernacularText } from '../../utils/audioSpeech';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, dialect, setDialect } = useAppStore();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const languages: { code: SupportedLanguage; label: string; sublabel: string; greeting: string }[] = [
    {
      code: 'kn',
      label: 'ಕನ್ನಡ',
      sublabel: 'Kannada (Karnataka)',
      greeting: 'ನಮಸ್ಕಾರ! ಸರ್ಕಾರದ ಯೋಜನೆಗಳನ್ನು ತಿಳಿಯಲು ಇದು ನಿಮ್ಮ ಸಹಾಯಕ.'
    },
    {
      code: 'hi',
      label: 'हिन्दी',
      sublabel: 'Hindi (National / Central)',
      greeting: 'नमस्ते! मैं आपकी सरकारी योजनाओं में सहायता करूँगा.'
    },
    {
      code: 'bn',
      label: 'বাংলা',
      sublabel: 'Bengali (West Bengal / Pan-India)',
      greeting: 'নমস্কার! সরকারি প্রকল্প জানতে এটি আপনার সহায়ক।'
    },
    {
      code: 'en',
      label: 'English',
      sublabel: 'English (Pan-India)',
      greeting: 'Welcome! I am your official welfare guide.'
    }
  ];

  const handleSelectLang = (code: SupportedLanguage) => {
    setLanguage(code);
    speakVernacularText(languages.find(l => l.code === code)?.greeting || '', code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-crisp-xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h2 id="lang-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {t('langSelectTitle', 'Choose Your Language')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('langSelectSubtitle', 'Select how SAHAYAK should speak and write')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Options Grid */}
        <div className="space-y-3 mb-5">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <div
                key={item.code}
                onClick={() => handleSelectLang(item.code)}
                className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-1 ring-amber-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{item.label}</span>
                    {isSelected && (
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                        {language === 'kn' ? 'ಸಕ್ರಿಯ' : language === 'hi' ? 'सक्रिय' : language === 'bn' ? 'সক্রিয়' : 'Active'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{item.sublabel}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakVernacularText(item.greeting, item.code);
                    }}
                    className="p-2 rounded-full text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                    title="Test audio greeting"
                    aria-label={`Test voice greeting in ${item.label}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dialect / Accent Selector */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-5">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            {t('dialectTitle', 'Dialect / Regional Accent (Optional)')}
          </label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="standard">{t('dialectStandard', 'Standard / Literary')}</option>
            <option value="bhojpuri">{t('dialectBhojpuri', 'Bhojpuri / Awadhi Tone')}</option>
            <option value="north_karnataka">{t('dialectNorthKarnataka', 'North Karnataka (Uttara Kannada)')}</option>
          </select>
        </div>

        {/* Confirm CTA */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 dark:hover:bg-sky-500 text-white font-bold text-sm shadow-sm transition-all"
        >
          {t('confirmLanguage', 'Confirm Language & Continue')}
        </button>
      </div>
    </div>
  );
};
