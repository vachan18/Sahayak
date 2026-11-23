import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, ArrowLeft, CheckCircle2, RotateCcw, Volume2, 
  Wheat, Store, GraduationCap, Hammer, Heart, Scissors, User, Users, 
  XCircle, AlertTriangle, HelpCircle, Loader2, StopCircle
} from 'lucide-react';
import { eligibilityQuestions } from '../data/questions';
import { QuestionOption } from '../types';
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
  const [voiceMode, setVoiceMode] = useState<'live' | 'simulation'>('simulation');
  const [recognizedTranscript, setRecognizedTranscript] = useState<string>('');
  const [candidateOption, setCandidateOption] = useState<QuestionOption | null>(null);
  const [voiceErrorMsg, setVoiceErrorMsg] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const simulationTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (simulationTimerRef.current) {
        clearTimeout(simulationTimerRef.current);
      }
    };
  }, []);

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

  const speechLangMap: Record<string, string> = {
    kn: 'kn-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    en: 'en-IN',
  };

  const findBestOptionMatch = (transcript: string): QuestionOption | null => {
    const clean = transcript.toLowerCase().trim();
    if (!question.options || question.options.length === 0) return null;

    // 1. Direct match on labelKey or sublabelKey text
    for (const opt of question.options) {
      const label = (opt.labelKey || '').toLowerCase();
      const sublabel = (opt.sublabelKey || '').toLowerCase();
      if (clean.includes(label) || (label.length > 2 && label.includes(clean))) return opt;
      if (sublabel && (clean.includes(sublabel) || (sublabel.length > 2 && sublabel.includes(clean)))) return opt;
    }

    // 2. Vernacular keyword intent matching per field
    if (question.fieldName === 'occupation') {
      if (clean.includes('farmer') || clean.includes('farm') || clean.includes('ರೈತ') || clean.includes('ಕೃಷಿ') || clean.includes('किसान') || clean.includes('কৃষক')) {
        return question.options.find(o => o.value === 'farmer') || question.options[0];
      }
      if (clean.includes('vendor') || clean.includes('street') || clean.includes('ವ್ಯಾಪಾರ') || clean.includes('दुकान') || clean.includes('ব্যবসায়ী')) {
        return question.options.find(o => o.value === 'street_vendor') || question.options[1];
      }
      if (clean.includes('artisan') || clean.includes('weaver') || clean.includes('ಕುಶಲಕರ್ಮಿ') || clean.includes('ಕಾರಿಗರ') || clean.includes('ਕਾਰੀಗರ್') || clean.includes('শিল্পী')) {
        return question.options.find(o => o.value === 'artisan') || question.options[2];
      }
      if (clean.includes('student') || clean.includes('college') || clean.includes('ವಿದ್ಯಾರ್ಥಿ') || clean.includes('छात्र') || clean.includes('ছাত্র')) {
        return question.options.find(o => o.value === 'student') || question.options[3];
      }
    }

    // Boolean questions
    if (clean.includes('yes') || clean.includes('ಹೌದು') || clean.includes('हाँ') || clean.includes('হ্যাঁ') || clean.includes('true')) {
      return question.options.find(o => o.value === true) || question.options[0];
    }
    if (clean.includes('no') || clean.includes('ಇಲ್ಲ') || clean.includes('नहीं') || clean.includes('না') || clean.includes('false')) {
      return question.options.find(o => o.value === false) || question.options[1];
    }

    // Numeric scales
    if (question.fieldName === 'landholdingAcres') {
      if (clean.includes('small') || clean.includes('ಕಡಿಮೆ') || clean.includes('कम') || clean.includes('কম') || clean.includes('1') || clean.includes('2')) {
        return question.options.find(o => o.value === 1.5) || question.options[0];
      }
    }
    if (question.fieldName === 'annualIncome') {
      if (clean.includes('bpl') || clean.includes('low') || clean.includes('ಕಡಿಮೆ') || clean.includes('कम') || clean.includes('লাখ')) {
        return question.options.find(o => o.value === 100000) || question.options[0];
      }
    }

    return question.options[0];
  };

  // Voice Interaction Logic with browser speech recognition & explicit user confirmation
  const handleStartVoice = () => {
    stopSpeech();
    setVoiceErrorMsg('');
    setCandidateOption(null);
    setRecognizedTranscript('');

    const SpeechRecognitionClass = 
      typeof window !== 'undefined' 
        ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) 
        : null;

    if (SpeechRecognitionClass) {
      try {
        setVoiceMode('live');
        setVoiceState('listening');

        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.lang = speechLangMap[language] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setVoiceState('listening');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript || '';
          setRecognizedTranscript(transcript);
          setVoiceState('processing');

          setTimeout(() => {
            const matched = findBestOptionMatch(transcript);
            if (matched) {
              setCandidateOption(matched);
              setVoiceState('recognized');
            } else {
              setVoiceErrorMsg(t('voiceFallbackNote', 'Could not match speech to an option. Please select an option above.'));
              setVoiceState('error');
            }
          }, 500);
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setVoiceErrorMsg(t('voicePermDenied', 'Microphone permission was denied. Please tap an option above.'));
          } else {
            setVoiceErrorMsg(t('voiceFallbackNote', 'Could not detect clear speech. Please tap an option above.'));
          }
          setVoiceState('error');
        };

        recognition.onend = () => {
          // If ended without transcript and still listening, transition to error
          if (voiceState === 'listening' && !candidateOption) {
            setVoiceState('idle');
          }
        };

        recognition.start();
        return;
      } catch {
        // Fall back to prototype simulation mode if speech recognition fails to initialize
      }
    }

    // Fallback: Clear, honest demo simulation with REQUIRED manual confirmation
    setVoiceMode('simulation');
    setVoiceState('listening');

    simulationTimerRef.current = setTimeout(() => {
      setVoiceState('processing');

      simulationTimerRef.current = setTimeout(() => {
        let simulatedText = '';
        let matchedOption: QuestionOption | null = null;

        if (question.fieldName === 'occupation') {
          matchedOption = question.options?.find(o => o.value === 'farmer') || question.options?.[0] || null;
          simulatedText = language === 'kn' ? 'ನಾನು ಸಣ್ಣ ರೈತ (Farmer)' : language === 'hi' ? 'मैं किसान हूँ (Farmer)' : language === 'bn' ? 'আমি কৃষক (Farmer)' : 'I am a farmer';
        } else if (question.fieldName === 'landholdingAcres') {
          matchedOption = question.options?.find(o => o.value === 1.5) || question.options?.[0] || null;
          simulatedText = language === 'kn' ? '2.5 ಎಕರೆಗಿಂತ ಕಡಿಮೆ ಜಮೀನು' : language === 'hi' ? '2.5 एकड़ से कम' : 'Small holding under 2.5 acres';
        } else if (question.fieldName === 'gender') {
          matchedOption = question.options?.find(o => o.value === 'female') || question.options?.[0] || null;
          simulatedText = language === 'kn' ? 'ಮಹಿಳೆ (Female)' : language === 'hi' ? 'महिला (Female)' : 'Female';
        } else if (question.fieldName === 'annualIncome') {
          matchedOption = question.options?.find(o => o.value === 100000) || question.options?.[0] || null;
          simulatedText = language === 'kn' ? '₹1.2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ಆದಾಯ' : language === 'hi' ? '₹1.2 लाख से कम' : 'Income below ₹1.2 Lakh';
        } else if (question.fieldName === 'isGovtEmployee') {
          matchedOption = question.options?.find(o => o.value === false) || question.options?.[0] || null;
          simulatedText = language === 'kn' ? 'ಯಾರೂ ಇಲ್ಲ (No Govt Job)' : language === 'hi' ? 'कोई सरकारी नौकरी नहीं' : 'No Government Job';
        } else {
          matchedOption = question.options?.[0] || null;
          simulatedText = language === 'kn' ? 'ಹೌದು, ಅನ್ವಯಿಸುತ್ತದೆ' : language === 'hi' ? 'हाँ, यह सही है' : 'Yes, this applies';
        }

        if (matchedOption) {
          setRecognizedTranscript(simulatedText);
          setCandidateOption(matchedOption);
          setVoiceState('recognized');
          // Audible read of candidate answer for low-literacy clarity
          speakVernacularText(matchedOption.labelKey.split('(')[0], language);
          // NOTE: We DO NOT auto-select or auto-advance. Explicit citizen confirmation is required!
        } else {
          setVoiceState('error');
        }
      }, 900);
    }, 1800);
  };

  const handleConfirmVoiceAnswer = () => {
    if (candidateOption) {
      handleSelectOption(candidateOption);
      handleCancelVoice();
    }
  };

  const handleCancelVoice = () => {
    stopSpeech();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    if (simulationTimerRef.current) {
      clearTimeout(simulationTimerRef.current);
    }
    setVoiceState('idle');
    setRecognizedTranscript('');
    setCandidateOption(null);
    setVoiceErrorMsg('');
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

          {/* State 4: RECOGNIZED / CONFIRMATION REQUIRED (Integrity Safeguard: Never auto-advances) */}
          {voiceState === 'recognized' && candidateOption && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-700 space-y-3.5 animate-fadeIn shadow-crisp-sm">
              <div className="flex items-center justify-between gap-2 border-b border-emerald-200 dark:border-emerald-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                    {t('voiceRecognized', 'Voice Input Detected')}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  voiceMode === 'live' 
                    ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200' 
                    : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                }`}>
                  {voiceMode === 'live' ? t('voiceLiveBadge', 'Live Speech') : t('voiceSimBadge', 'Demo Simulation')}
                </span>
              </div>

              {/* Spoken Transcript display */}
              <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  {t('voiceSpokenText', 'Spoken Words')}:
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm italic">
                  "{recognizedTranscript}"
                </div>
              </div>

              {/* Matched Option Preview */}
              <div className="text-xs text-emerald-900 dark:text-emerald-100 font-medium">
                {t('voiceManualPrompt', 'Review and confirm this answer before proceeding:')}
                <div className="mt-1.5 p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center justify-between">
                  <span>{candidateOption.labelKey}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                </div>
              </div>

              {/* Explicit User Confirmation Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmVoiceAnswer}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm min-h-[48px] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('voiceConfirmBtn', 'Confirm This Answer')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelVoice}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-semibold transition-all min-h-[44px]"
                >
                  {t('voiceCancel', 'Cancel / Change')}
                </button>
              </div>
            </div>
          )}

          {/* State 5: ERROR (Speech not detected or permission error) */}
          {voiceState === 'error' && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs space-y-2 animate-fadeIn">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{voiceErrorMsg || t('voiceFallbackNote', 'Could not detect clear speech. Please tap an option above.')}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleStartVoice}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
                >
                  {t('voiceTryAgain', 'Try Again')}
                </button>
                <button
                  type="button"
                  onClick={handleCancelVoice}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 font-medium text-xs hover:bg-slate-100 transition-colors"
                >
                  {t('voiceCancel', 'Dismiss')}
                </button>
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
