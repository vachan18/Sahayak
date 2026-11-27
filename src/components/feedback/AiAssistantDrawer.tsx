import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mic, MicOff, Send, Bot, Volume2, VolumeX, ArrowRight, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { speakVernacularText, stopSpeech } from '../../utils/audioSpeech';
import { SupportedLanguage } from '../../types';
import { LANGUAGE_META } from '../../data/languages';
import { useSpeechRecognition, SpeechErrorCode } from '../../hooks/useSpeechRecognition';
import { buildAssistantReply, AssistantReply } from '../../utils/assistantResponder';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  actionLink?: AssistantReply['actionLink'];
}

function getInitialGreeting(language: SupportedLanguage): string {
  return (LANGUAGE_META[language] || LANGUAGE_META.en).aiGreeting;
}

function getSpeechErrorMessage(error: SpeechErrorCode, t: (key: string, fallback?: string) => string): string {
  switch (error) {
    case 'not-allowed':
      return t('voicePermDenied', 'Microphone permission was denied. Please allow mic access or type below.');
    case 'no-speech':
      return t('voiceFallbackNote', 'No speech detected clearly. Please tap the mic and try again, or type below.');
    case 'audio-capture':
      return 'No microphone detected on this device. You can type your question below.';
    case 'unsupported':
      return 'Live voice recognition is not supported in this browser. Please use Chrome/Edge or type below.';
    case 'network':
      return 'Network issue while recognizing speech. Please check your connection or type below.';
    default:
      return 'Could not capture voice clearly. Please try again or type below.';
  }
}

export const AiAssistantDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isAiDrawerOpen, setAiDrawerOpen, language } = useAppStore();
  const { t } = useTranslation();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: getInitialGreeting(language),
      time: 'Just now',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { sender: 'user', text: trimmed, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    setTimeout(() => {
      const reply = buildAssistantReply(trimmed, language);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply.text,
          time: 'Just now',
          actionLink: reply.actionLink,
        },
      ]);
      speakVernacularText(reply.text, language);
    }, 350);
  };

  const {
    isListening,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    reset: resetSpeech,
  } = useSpeechRecognition({
    language,
    onFinalResult: (spoken) => {
      setInputQuery(spoken);
      handleSend(spoken);
    },
  });

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'assistant') {
        return [{ ...prev[0], text: getInitialGreeting(language) }];
      }
      return prev;
    });
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, interimTranscript]);

  if (!isAiDrawerOpen) return null;

  const quickPrompts = [
    t('promptChip1', 'When will the next PM-KISAN installment arrive?'),
    t('promptChip2', 'What documents are needed for Ayushman Bharat?'),
    t('promptChip3', 'Can a tenant farmer get crop assistance?'),
  ];

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      resetSpeech();
      startListening();
    }
  };

  const handleClose = () => {
    stopListening();
    stopSpeech();
    setAiDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-crisp-xl border border-slate-200 dark:border-slate-800 h-[88vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 id="ai-drawer-title" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{t('aiAssistantTitle', 'Sahayak Sathi')}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                  {(LANGUAGE_META[language] || LANGUAGE_META.en).label}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('aiAssistantSubtitle', 'Grounded strictly in government rules')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={stopSpeech}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Stop speaking"
              title="Stop voice playback"
            >
              <VolumeX className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close voice assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-brand-navy-900 dark:bg-sky-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
                {m.actionLink && (
                  <button
                    type="button"
                    onClick={() => {
                      const dest = m.actionLink!.to;
                      handleClose();
                      navigate(dest);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <span>{m.actionLink.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {m.sender === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => speakVernacularText(m.text, language)}
                    className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    aria-label="Replay audio"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{t('listenInLanguage', 'Listen')}</span>
                  </button>
                )}
                <span className="text-[10px] text-slate-400">{m.time}</span>
              </div>
            </div>
          ))}

          {isListening && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Mic className="w-5 h-5 text-red-600 animate-pulse flex-shrink-0" />
                  <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                    {t('aiListening', 'Listening... speak now in your mother tongue')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={stopListening}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  {t('voiceCancel', 'Stop')}
                </button>
              </div>
              {interimTranscript && (
                <p className="text-xs text-slate-700 dark:text-slate-200 italic pl-7">
                  “{interimTranscript}”
                </p>
              )}
            </div>
          )}

          {speechError && !isListening && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{getSpeechErrorMessage(speechError, t)}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-950/60 dark:hover:text-amber-300 transition-colors border border-slate-200 dark:border-slate-700 flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-full transition-all active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 ${
              isListening
                ? 'bg-red-600 text-white ring-4 ring-red-200 dark:ring-red-900'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
            }`}
            title={isListening ? 'Stop listening' : 'Speak into microphone'}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={isListening && interimTranscript ? interimTranscript : inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
            placeholder={t('aiPlaceholder', 'Ask anything about government schemes...')}
            className="flex-1 px-4 py-2.5 text-base sm:text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px]"
          />
          <button
            type="button"
            onClick={() => handleSend(inputQuery)}
            disabled={!inputQuery.trim()}
            className="p-3 rounded-full bg-brand-navy-900 dark:bg-sky-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-navy-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
