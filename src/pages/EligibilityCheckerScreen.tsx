import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, ArrowLeft, CheckCircle2, RotateCcw, Volume2, 
  Wheat, Store, GraduationCap, Hammer, Heart, Scissors, User, Users, 
  XCircle, AlertTriangle, HelpCircle, Loader2, StopCircle
} from 'lucide-react';
import { eligibilityQuestions } from '../data/questions';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';

type VoiceState = 'idle' | 'listening' | 'processing' | 'recognized' | 'error';

export const EligibilityCheckerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { eligibilityAnswers, setEligibilityAnswer, resetEligibilityAnswers } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [recognizedTranscript, setRecognizedTranscript] = useState<string>('');

  // Dynamically filter active questions based on conditional criteria
  const activeQuestions = useMemo(() => {
    return eligibilityQuestions.filter(q => {
      if (!q.condition) return true;
      return q.condition(eligibilityAnswers);
    });
  }, [eligibilityAnswers]);

  // Ensure current step stays in valid range
  const safeStep = Math.min(currentStep, Math.max(0, activeQuestions.length - 1));
  const question = activeQuestions[safeStep] || eligibilityQuestions[0];
  const totalSteps = activeQuestions.length;

  const currentAnswer = (eligibilityAnswers as any)[question.fieldName];

  // Helper icon resolver
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wheat': return Wheat;
      case 'Store': return Store;
      case 'GraduationCap': return GraduationCap;
      case 'Hammer': return Hammer;
      case 'Heart': return Heart;
      case 'Scissors': return Scissors;
      case 'User': return User;
      case 'Users': return Users;
      case 'XCircle': return XCircle;
      case 'AlertTriangle': return AlertTriangle;
      default: return CheckCircle2;
    }
  };

  const handleSelectOption = (opt: any) => {
    setEligibilityAnswer(question.fieldName, opt.value);
    
    // If option has auxiliary payload, set those values as well
    if (opt.payload) {
      Object.entries(opt.payload).forEach(([k, v]) => {
        setEligibilityAnswer(k, v);
      });
    }

    // Advance after smooth tactile feedback
    setTimeout(() => {
      if (safeStep < totalSteps - 1) {
        setCurrentStep(safeStep + 1);
      } else {
        handleCompleteAssessment();
      }
    }, 240);
  };

  const handlePreviousStep = () => {
    if (safeStep > 0) {
      setCurrentStep(safeStep - 1);
    }
  };

  const handleCompleteAssessment = () => {
    stopSpeech();
    navigate('/eligibility/results');
  };

  const handleListenQuestion = () => {
    const questionText = t(question.textKey);
    const helpText = question.helpKey ? `. ${question.helpKey}` : '';
    speakVernacularText(`${questionText}${helpText}`, language);
  };

  // Voice Interaction Logic with discrete states
  const handleStartVoice = () => {
    stopSpeech();
    setVoiceState('listening');
    setRecognizedTranscript('');

    // Simulate natural speech detection window (2 seconds of audio listening)
    setTimeout(() => {
      setVoiceState('processing');

      // Processing & intent mapping (1 second)
      setTimeout(() => {
        // Find best matching option based on current field
        let matchedOption = question.options?.[0];

        if (question.fieldName === 'occupation') {
          matchedOption = question.options?.find(o => o.value === 'farmer') || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? 'ರೈತ (Farmer)' : language === 'hi' ? 'किसान (Farmer)' : 'Farmer / Cultivator');
        } else if (question.fieldName === 'landholdingAcres') {
          matchedOption = question.options?.find(o => o.value === 1.5) || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? '2.5 ಎಕರೆಗಿಂತ ಕಡಿಮೆ' : 'Small Farmer (1.5 Acres)');
        } else if (question.fieldName === 'gender') {
          matchedOption = question.options?.find(o => o.value === 'female') || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? 'ಮಹಿಳೆ (Female)' : 'Female (ಮಹಿಳೆ)');
        } else if (question.fieldName === 'isPregnantOrLactating') {
          matchedOption = question.options?.find(o => o.value === true) || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? 'ಹೌದು, ಗರ್ಭಿಣಿ' : 'Yes, Pregnant/Nursing');
        } else if (question.fieldName === 'isUrbanStreetVendor') {
          matchedOption = question.options?.find(o => o.value === true) || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? 'ಹೌದು, ನಗರ ವ್ಯಾಪಾರಿ' : 'Yes, Urban Vendor');
        } else if (question.fieldName === 'isEnrolledStudent') {
          matchedOption = question.options?.find(o => o.value === true) || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? 'ಹೌದು, ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿ' : 'Yes, College Student');
        } else if (question.fieldName === 'annualIncome') {
          matchedOption = question.options?.find(o => o.value === 100000) || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? '₹1.2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ (BPL)' : 'Below ₹1.2 Lakh (BPL)');
        } else if (question.fieldName === 'isGovtEmployee') {
          matchedOption = question.options?.find(o => o.value === false) || question.options?.[0];
          setRecognizedTranscript(language === 'kn' ? 'ಯಾರೂ ಇಲ್ಲ (No Govt Job)' : 'No Government Job');
        }

        if (matchedOption) {
          setVoiceState('recognized');
          // Speak audible confirmation
          speakVernacularText(matchedOption.labelKey.split('(')[0], language);

          // Select option after brief visual recognition display
          setTimeout(() => {
            setVoiceState('idle');
            handleSelectOption(matchedOption);
          }, 800);
        } else {
          setVoiceState('error');
          setTimeout(() => setVoiceState('idle'), 2500);
        }
      }, 1000);
    }, 2000);
  };

  const handleCancelVoice = () => {
    stopSpeech();
    setVoiceState('idle');
    setRecognizedTranscript('');
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-6 animate-fadeIn pb-24">
      {/* Top Navigation & Step Counter */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {safeStep > 0 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-bold min-h-[44px]"
              aria-label={t('backQuestion', 'Previous Question')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('backQuestion', 'Previous')}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-brand-navy-900 dark:text-sky-300 bg-brand-navy-900/10 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-brand-navy-900/20 dark:border-sky-800/40">
              {t('questionProgress', 'Question')} {safeStep + 1} {t('ofProgress', 'of')} {totalSteps}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              {Math.round(((safeStep + 1) / totalSteps) * 100)}% {t('readinessMeter', 'Completed')}
            </span>
          </div>
        </div>

        {/* Audio Question Listen Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleListenQuestion}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors min-h-[44px]"
            title="Listen to question spoken aloud"
            aria-label="Listen to question spoken aloud"
          >
            <Volume2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="hidden sm:inline">{t('listenInLanguage', 'Listen')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetEligibilityAnswers();
              setCurrentStep(0);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t('navReset', 'Reset questionnaire')}
            aria-label="Reset questionnaire"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Accessible Progress Bar */}
      <div 
        className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden" 
        role="progressbar" 
        aria-valuenow={safeStep + 1} 
        aria-valuemin={1} 
        aria-valuemax={totalSteps}
        aria-label="Assessment Questionnaire Progress"
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
          style={{ width: `${((safeStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Conversational Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-crisp-md mb-6">
        {/* Conversational Question Heading */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-2 break-words">
          {t(question.textKey)}
        </h1>

        {/* Question Help Context / Rationale */}
        {question.helpKey && (
          <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{question.helpKey}</p>
          </div>
        )}

        {/* Large Selectable Answer Cards Stack */}
        <div 
          className="space-y-3" 
          role="radiogroup" 
          aria-label={t(question.textKey)}
        >
          {question.options?.map((opt, idx) => {
            const isSelected = currentAnswer === opt.value;
            const OptionIcon = getIcon(opt.iconName);

            return (
              <div
                key={idx}
                role="radio"
                tabIndex={0}
                aria-checked={isSelected}
                onClick={() => handleSelectOption(opt)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectOption(opt);
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between gap-3 group focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 min-h-[56px] active:scale-98 ${
                  isSelected
                    ? 'border-brand-navy-900 dark:border-sky-500 bg-brand-navy-900/5 dark:bg-sky-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-brand-navy-900 text-white dark:bg-sky-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-amber-100 group-hover:text-amber-800'
                  }`}>
                    <OptionIcon className="w-5 h-5 flex-shrink-0" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug break-words">
                      {opt.labelKey}
                    </div>
                    {opt.sublabelKey && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {opt.sublabelKey}
                      </div>
                    )}
                  </div>
                </div>

                {/* Radio check indicator */}
                <div 
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'border-brand-navy-900 dark:border-sky-500 bg-brand-navy-900 dark:bg-sky-500 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Voice Interaction Section ("Bolo Aur Jano") */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          {/* State 1: IDLE (Ready to Listen, not pulsing) */}
          {voiceState === 'idle' && (
            <div className="space-y-2 text-center">
              <button
                type="button"
                onClick={handleStartVoice}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all min-h-[48px] shadow-crisp-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50"
              >
                <Mic className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{t('voiceTapToSpeak', 'Tap to Speak (Bolo Aur Jano)')}</span>
              </button>
              <p className="text-[11px] text-slate-400">
                You can speak in Kannada, Hindi, Bengali, or English, or simply select an option above.
              </p>
            </div>
          )}

          {/* State 2: LISTENING (Active Microphone) */}
          {voiceState === 'listening' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 space-y-3 text-center animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-xs sm:text-sm">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span>{t('voiceListening', 'Listening... Speak your answer now')}</span>
              </div>

              {/* Animated waveform bars */}
              <div className="flex items-center justify-center gap-1.5 h-6">
                {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleCancelVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-700 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>{t('voiceCancel', 'Cancel Listening')}</span>
              </button>
            </div>
          )}

          {/* State 3: PROCESSING (Transcribing speech) */}
          {voiceState === 'processing' && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold animate-fadeIn">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
              <span>{t('voiceProcessing', 'Analyzing speech...')}</span>
            </div>
          )}

          {/* State 4: RECOGNIZED (Speech matched) */}
          {voiceState === 'recognized' && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-2 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t('voiceRecognized', 'Voice Recognized')}: <strong>{recognizedTranscript}</strong></span>
            </div>
          )}

          {/* State 5: ERROR (Speech not detected) */}
          {voiceState === 'error' && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium text-center space-y-1 animate-fadeIn">
              <div className="font-bold text-amber-700 dark:text-amber-400">
                {t('voiceFallbackNote', 'Could not detect clear speech. Please tap an option above.')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Answers summary pill */}
      {safeStep > 0 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setCurrentStep(0)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
          >
            {t('reviewAnswers', 'Start Over / Review All Answers')}
          </button>
        </div>
      )}
    </div>
  );
};
