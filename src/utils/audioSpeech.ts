import { SupportedLanguage } from '../types';
import { LANGUAGE_META } from '../data/languages';

function findVoiceForLocale(voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice | undefined {
  const normalized = locale.toLowerCase();
  const prefix = normalized.split('-')[0];
  return (
    voices.find((v) => v.lang.toLowerCase() === normalized) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
  );
}

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

  const synth = window.speechSynthesis;
  const wasActive = Boolean(synth.speaking || synth.pending);
  synth.cancel();

  const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
  const voices = typeof synth.getVoices === 'function' ? synth.getVoices() : [];
  const nativeVoice = findVoiceForLocale(voices, meta.speechLang);

  // If the OS/browser has no native Indic TTS voice installed, fall back to
  // speaking the phonetic greeting in English so the user always hears audio.
  const hasNonLatinChars = /[^\u0000-\u007F]/.test(text);
  const usePhoneticFallback =
    language !== 'en' && voices.length > 0 && !nativeVoice && hasNonLatinChars;

  const spokenText = usePhoneticFallback ? meta.phoneticGreeting : text;
  const utterance = new SpeechSynthesisUtterance(spokenText);

  if (usePhoneticFallback) {
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    const enVoice = findVoiceForLocale(voices, 'en-IN') || findVoiceForLocale(voices, 'en');
    if (enVoice) utterance.voice = enVoice;
  } else {
    utterance.lang = meta.speechLang;
    utterance.rate = meta.speechRate;
    if (nativeVoice) utterance.voice = nativeVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
    console.warn("Speech synthesis error:", e);
    if (onError) onError(e?.error);
    if (onEnd) onEnd();
  };

  // Chromium silently drops speak() if called synchronously right after cancelling active speech
  if (wasActive) {
    setTimeout(() => synth.speak(utterance), 40);
  } else {
    synth.speak(utterance);
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
