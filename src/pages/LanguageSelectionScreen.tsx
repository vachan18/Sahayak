import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Volume2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { speakVernacularText } from '../utils/audioSpeech';
import { LANGUAGE_LIST, LANGUAGE_META } from '../data/languages';

export const LanguageSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, dialect, setDialect } = useAppStore();
  const { t } = useTranslation();

  const languageList = LANGUAGE_LIST;

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    speakVernacularText(LANGUAGE_META[code].greeting, code);
  };

  return (
    <div className="max-w-md mx-auto py-4 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {t('langSelectTitle', 'Choose Your Language')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t('langSelectSubtitle', 'Select how you would like SAHAYAK to talk and display information to you.')}
        </p>
      </div>

      {/* Language Options */}
      <div className="space-y-3.5 mb-6">
        {languageList.map((item) => {
          const isSelected = language === item.code;
          return (
            <div
              key={item.code}
              onClick={() => handleSelectLanguage(item.code)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                isSelected
                  ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{item.label}</span>
                  {isSelected && (
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                      ಸಕ್ರಿಯ (Active)
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
                  aria-label={`Test voice greeting in ${item.label}`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialect Tuning Card */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
          {t('dialectTitle', 'Dialect / Regional Accent (Optional)')}
        </label>
        <select
          value={dialect}
          onChange={(e) => setDialect(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="standard">{t('dialectStandard', 'Standard / Literary')}</option>
          <option value="bhojpuri">{t('dialectBhojpuri', 'Bhojpuri / Awadhi Tone')}</option>
          <option value="north_karnataka">{t('dialectNorthKarnataka', 'North Karnataka (Uttara Kannada)')}</option>
        </select>
      </div>

      {/* Confirm CTA */}
      <button
        type="button"
        onClick={() => navigate('/home')}
        className="w-full py-3.5 px-4 rounded-xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 text-white font-bold text-base shadow-sm active:scale-98 transition-all"
      >
        {t('confirmLanguage', 'Confirm Language & Continue')}
      </button>
    </div>
  );
};
