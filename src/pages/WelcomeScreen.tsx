import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { speakVernacularText } from '../utils/audioSpeech';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useAppStore();
  const { t } = useTranslation();

  const handleSelectAndProceed = (langCode: 'kn' | 'hi' | 'en') => {
    setLanguage(langCode);
    const greeting = langCode === 'kn'
      ? "ಸ್ವಾಗತ! ಸರ್ಕಾರದ ಯೋಜನೆಗಳನ್ನು ತಿಳಿಯಲು ಇದು ನಿಮ್ಮ ಸಹಾಯಕ."
      : langCode === 'hi'
      ? "स्वागत है! सरकारी योजनाओं को समझने में सहायक आपकी मदद करेगा."
      : "Welcome to SAHAYAK. Your official government welfare guide.";
    speakVernacularText(greeting, langCode);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between items-center max-w-md mx-auto py-6 text-center animate-fadeIn">
      {/* Top Sovereign Seal */}
      <div className="w-full flex flex-col items-center pt-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-navy-900 dark:bg-sky-500 text-white flex items-center justify-center font-bold text-3xl shadow-crisp-md ring-4 ring-amber-500/40 mb-4">
          <span>ಸ</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 mb-2">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('statutoryBadge', 'Official Sovereign Welfare Guide • 100% Free')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          {t('appName', 'SAHAYAK')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xs leading-relaxed">
          {t('tagline', 'Government Schemes in Your Language')}
        </p>
      </div>

      {/* Language Selection Gate Cards */}
      <div className="w-full space-y-3.5 my-8">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          {t('langSelectTitle', 'Choose Your Language / ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ')}
        </p>

        {/* Kannada */}
        <button
          type="button"
          onClick={() => handleSelectAndProceed('kn')}
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 shadow-crisp-sm hover:shadow-crisp-md transition-all flex items-center justify-between group active:scale-98 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-lg">
              ಕ
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                ಕನ್ನಡ
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Hindi */}
        <button
          type="button"
          onClick={() => handleSelectAndProceed('hi')}
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 shadow-crisp-sm hover:shadow-crisp-md transition-all flex items-center justify-between group active:scale-98 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-bold flex items-center justify-center text-lg">
              हि
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                हिन्दी
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                हिन्दी में जारी रखें
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* English */}
        <button
          type="button"
          onClick={() => handleSelectAndProceed('en')}
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 shadow-crisp-sm hover:shadow-crisp-md transition-all flex items-center justify-between group active:scale-98 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-lg">
              En
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                English
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Continue in English
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer Assurance */}
      <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
        {t('sovereignMotto', 'Empowering 800M+ Citizens with Radical Dignity')}
      </div>
    </div>
  );
};
