import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeOnboarding } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Compass,
      title: t('onboard1Title', 'Discover Schemes by Life Events'),
      desc: t('onboard1Desc', 'Find genuine welfare entitlements for your family organized by life stages like farming, education, and health, instead of complicated ministry names.'),
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      icon: CheckCircle2,
      title: t('onboard2Title', 'Check Eligibility in 2 Minutes'),
      desc: t('onboard2Desc', 'Answer 3 to 4 simple questions via voice or tap. No 20-page forms, no confusion, zero dead ends.'),
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: ShieldCheck,
      title: t('onboard3Title', 'Zero Middlemen & Statutory Fee Transparency'),
      desc: t('onboard3Desc', 'Official government application fee is ₹0.00. Generate a pre-verified CSC slip with statutory fee limits so no agent can overcharge you.'),
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      completeOnboarding();
      navigate('/home');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home');
  };

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div className="min-h-[82vh] flex flex-col justify-between max-w-md mx-auto px-4 py-6 animate-fadeIn">
      {/* Top Bar: Slide Indicators & Skip */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-amber-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          {t('navSkip', 'Skip')}
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-8 text-center flex flex-col items-center">
        <div className={`w-28 h-28 rounded-3xl ${current.bgColor} ${current.iconColor} flex items-center justify-center mb-6 shadow-sm`}>
          <Icon className="w-14 h-14" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 max-w-xs leading-snug">
          {current.title}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mb-4">
          {current.desc}
        </p>

        <AudioListenButton textToSpeak={`${current.title}. ${current.desc}`} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        {currentSlide > 0 && (
          <button
            type="button"
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3.5 px-6 rounded-xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
        >
          <span>{currentSlide === slides.length - 1 ? t('getStarted', 'Get Started Now') : t('navNext', 'Next')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
