import { SupportedLanguage } from '../types';
import { LANGUAGE_META } from '../data/languages';

export const speakVernacularText = (
  text: string,
  language: SupportedLanguage,
  onEnd?: () => void,
  onError?: (reason?: string) => void
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("SpeechSynthesis not supported on this device.");
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
  utterance.lang = meta.speechLang;
  utterance.rate = meta.speechRate;

  // Prefer a matching installed voice if available
  const voices = typeof window.speechSynthesis.getVoices === 'function'
    ? window.speechSynthesis.getVoices()
    : [];
  if (voices.length > 0) {
    const langPrefix = utterance.lang.split('-')[0].toLowerCase();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase() === utterance.lang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
    console.warn("Speech synthesis error:", e);
    if (onError) onError(e?.error);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
