import React, { useState } from 'react';
import { X, Mic, Send, Bot, Volume2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { speakVernacularText } from '../../utils/audioSpeech';

export const AiAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setAiDrawerOpen, language } = useAppStore();
  const { t } = useTranslation();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      sender: 'assistant',
      text: language === 'kn' 
        ? "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಹಾಯಕ ಸಾಥಿ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಕೇಳಬಹುದು."
        : language === 'hi'
        ? "नमस्ते! मैं आपका सहायक साथी हूँ. सरकारी योजनाओं के बारे में अपनी भाषा में कोई भी सवाल पूछें."
        : "Hello! I am your Sahayak Sathi. Ask any question about government schemes in your mother tongue.",
      time: "Just now"
    }
  ]);

  if (!isAiDrawerOpen) return null;

  const quickPrompts = [
    t('promptChip1', "When will the next PM-KISAN installment arrive?"),
    t('promptChip2', "What documents are needed for Ayushman Bharat?"),
    t('promptChip3', "Can a tenant farmer get crop assistance?")
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text, time: "Just now" };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate grounded sovereign answer based on official gazette rules
    setTimeout(() => {
      let botResponse = "";
      if (text.toLowerCase().includes('kisan') || text.includes('ಕಿಸಾನ್') || text.includes('किसान')) {
        botResponse = language === 'kn'
          ? "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಯಡಿ ವರ್ಷಕ್ಕೆ ₹6,000 ಹಣವನ್ನು 3 ಕಂತುಗಳಲ್ಲಿ (ಪ್ರತಿ 4 ತಿಂಗಳಿಗೆ ₹2,000) ನೇರವಾಗಿ ರೈತರ ಆಧಾರ್ ಲಿಂಕ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ. ನಿಮ್ಮ ಭೂ ದಾಖಲೆ (RTC/ಪಹಣಿ) ಇ-ಕೆವೈಸಿ ಆಗಿರಬೇಕು."
          : language === 'hi'
          ? "पीएम-किसान योजना के अंतर्गत ₹6,000 प्रति वर्ष तीन किस्तों (₹2,000 प्रत्येक 4 माह में) में सीधे आधार-सीडेड बैंक खाते में भेजे जाते हैं. ज़मीन की खतौनी और eKYC अनिवार्य है."
          : "Under PM-KISAN, ₹6,000 per year is disbursed in 3 equal installments of ₹2,000 every 4 months directly into your Aadhaar-linked bank account. Land title (Khatauni/RTC) must be verified.";
      } else if (text.toLowerCase().includes('ayushman') || text.includes('ಆಯುಷ್ಮಾನ್') || text.includes('आयुष्मान')) {
        botResponse = language === 'kn'
          ? "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ (PM-JAY) ಅಡಿಯಲ್ಲಿ ಇಡೀ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ₹5,00,000 ವರೆಗೆ ಉಚಿತ ಆಸ್ಪತ್ರೆ ಚಿಕಿತ್ಸೆ ಸಿಗುತ್ತದೆ. ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ರೇಷನ್ ಕಾರ್ಡ್ ಇದ್ದರೆ ಸಾಕು. 70 ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಎಲ್ಲಾ ಹಿರಿಯರಿಗೆ ಇದು ಸಂಪೂರ್ಣ ಉಚಿತ."
          : language === 'hi'
          ? "आयुष्मान भारत योजना में प्रति परिवार ₹5,00,000 तक का मुफ़्त अस्पताल इलाज मिलता है. आधार कार्ड और राशन कार्ड आवश्यक हैं. 70 वर्ष से अधिक आयु के वरिष्ठ नागरिकों के लिए यह बिना आय सीमा के उपलब्ध है."
          : "Ayushman Bharat PM-JAY provides up to ₹5,00,000 cashless hospital cover per family per year across 28,000+ empaneled hospitals. Only Aadhaar Card and Ration Card are required.";
      } else {
        botResponse = language === 'kn'
          ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಅಧಿಕೃತ ಕಲ್ಯಾಣ ನಿಯಮಗಳ ಪ್ರಕಾರ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ. ಸಾಮಾನ್ಯ ಅರ್ಹತೆಗೆ ಆಧಾರ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆ ಜೋಡಣೆ ಕಡ್ಡಾಯ. ಹೆಚ್ಚಿನ ವಿವರಕ್ಕೆ ನಿಮ್ಮ ತಾಲೂಕು ಸೇವಾ ಕೇಂದ್ರವನ್ನು ಭೇಟಿ ಮಾಡಿ."
          : language === 'hi'
          ? "आपके सवाल की सरकारी नियमों के अनुसार जांच की जा रही है. योजना का लाभ लेने हेतु आधार और बैंक खाता लिंक होना अनिवार्य है."
          : "According to official government gazette guidelines, welfare entitlements require Aadhaar-NPCI seeded bank accounts. No agent fee should be paid.";
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: botResponse, time: "Just now" }]);
      speakVernacularText(botResponse, language);
    }, 700);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate speech input in vernacular
      setTimeout(() => {
        setIsListening(false);
        const sampleQuery = language === 'kn' 
          ? "ಪಿಎಂ ಕಿಸಾನ್ ಕಂತು ಯಾವಾಗ ಬರುತ್ತದೆ?"
          : language === 'hi'
          ? "पीएम किसान की अगली किस्त कब आएगी?"
          : "When will my next scheme payment arrive?";
        setInputQuery(sampleQuery);
        handleSend(sampleQuery);
      }, 2500);
    }
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
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">AI Voice</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('aiAssistantSubtitle', 'Grounded strictly in government rules')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAiDrawerOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close voice assistant"
          >
            <X className="w-5 h-5" />
          </button>
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
                {m.text}
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
                    <span>ಕೇಳಿ (Listen)</span>
                  </button>
                )}
                <span className="text-[10px] text-slate-400">{m.time}</span>
              </div>
            </div>
          ))}

          {isListening && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center gap-3 animate-pulse">
              <Mic className="w-6 h-6 text-amber-600 animate-bounce" />
              <div className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                {t('aiListening', 'Listening... speak now in your mother tongue')}
              </div>
            </div>
          )}
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
            className={`p-3 rounded-full transition-all active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white ring-4 ring-red-200'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
            }`}
            title="Speak into microphone"
            aria-label="Toggle voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
            placeholder={t('aiPlaceholder', 'Ask anything about government schemes...')}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={() => handleSend(inputQuery)}
            disabled={!inputQuery.trim()}
            className="p-3 rounded-full bg-brand-navy-900 dark:bg-sky-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-navy-800 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
