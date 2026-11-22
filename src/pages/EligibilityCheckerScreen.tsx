import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';
import { eligibilityQuestions } from '../data/questions';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { speakVernacularText } from '../utils/audioSpeech';

export const EligibilityCheckerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { eligibilityAnswers, setEligibilityAnswer, resetEligibilityAnswers } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const question = eligibilityQuestions[currentStep];
  const totalSteps = eligibilityQuestions.length;

  const currentAnswer = (eligibilityAnswers as any)[question.fieldName];

  const handleSelectOption = (value: any) => {
    setEligibilityAnswer(question.fieldName, value);
    // Smooth auto-advance after small tactile feedback delay
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleCompleteAssessment();
      }
    }, 200);
  };

  const handleCompleteAssessment = () => {
    navigate('/eligibility/results');
  };

  const handleVoiceAnswer = () => {
    setIsVoiceListening(true);
    // Simulate natural vernacular spoken response extraction
    setTimeout(() => {
      setIsVoiceListening(false);
      if (question.fieldName === 'occupation') {
        handleSelectOption('farmer');
      } else if (question.fieldName === 'landholdingAcres') {
        handleSelectOption(1.5);
      } else if (question.fieldName === 'gender') {
        handleSelectOption('female');
      } else if (question.fieldName === 'annualIncome') {
        handleSelectOption(100000);
      } else if (question.fieldName === 'isGovtEmployee') {
        handleSelectOption(false);
      }
    }, 1800);
  };

  const handleListenQuestion = () => {
    speakVernacularText(t(question.textKey), language);
  };

  return (
    <div className="max-w-lg mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Step Indicator & Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-1 rounded-full">
            ಹಂತ {currentStep + 1} / {totalSteps}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t('eligibilityTitle', 'Eligibility Questionnaire')}
          </span>
        </div>

        <button
          type="button"
          onClick={handleListenQuestion}
          className="p-1.5 rounded-full text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40"
          title="Listen to question"
          aria-label="Listen to question"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-amber-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Conversational Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-crisp-md mb-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug mb-5">
          {t(question.textKey)}
        </h2>

        {/* Options Stack */}
        <div className="space-y-3">
          {question.options?.map((opt, idx) => {
            const isSelected = currentAnswer === opt.value;
            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(opt.value)}
                className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between group active:scale-98 ${
                  isSelected
                    ? 'border-brand-navy-900 dark:border-sky-500 bg-slate-50 dark:bg-slate-800/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {opt.labelKey}
                  </div>
                  {opt.sublabelKey && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {opt.sublabelKey}
                    </div>
                  )}
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? 'border-brand-navy-900 dark:border-sky-500 bg-brand-navy-900 dark:bg-sky-500 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Voice Trigger Pill */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={handleVoiceAnswer}
            disabled={isVoiceListening}
            className={`w-full py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
              isVoiceListening
                ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
            }`}
          >
            <Mic className={`w-4 h-4 ${isVoiceListening ? 'animate-bounce text-red-600' : 'text-amber-600'}`} />
            <span>
              {isVoiceListening
                ? 'ಮಾತನಾಡಿ, ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... (Listening)'
                : 'बोलकर उत्तर दें / ಮಾತನಾಡಿ ಉತ್ತರಿಸಿ (Voice Input)'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Footers */}
      <div className="flex items-center justify-between gap-3">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('navPrevious', 'Previous')}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={resetEligibilityAnswers}
            className="px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('navReset', 'Reset')}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (currentStep < totalSteps - 1) {
              setCurrentStep(prev => prev + 1);
            } else {
              handleCompleteAssessment();
            }
          }}
          className="flex-1 py-3 px-5 rounded-xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>{currentStep === totalSteps - 1 ? t('resultsTitle', 'View My Results') : t('navNext', 'Next Question')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
