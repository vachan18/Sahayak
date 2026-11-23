import { SupportedLanguage } from '../types';

export const speakVernacularText = (text: string, language: SupportedLanguage, onEnd?: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("SpeechSynthesis not supported on this device.");
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set accurate Bhashini language tags
  switch (language) {
    case 'kn':
      utterance.lang = 'kn-IN';
      utterance.rate = 0.9; // Slightly slower, measured cadence for elderly rural citizens
      break;
    case 'hi':
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      break;
    case 'bn':
      utterance.lang = 'bn-IN';
      utterance.rate = 0.95;
      break;
    default:
      utterance.lang = 'en-IN';
      utterance.rate = 1.0;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn("Speech synthesis error:", e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
