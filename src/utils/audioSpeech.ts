import { SupportedLanguage } from '../types';
import { LANGUAGE_META } from '../data/languages';
import { speakWithCloud, isCloudVoiceAvailable, stopCloudAudio } from '../lib/voice/cloudTts';

/* ════════════════════════════════════════════════════════════════════════════
   Sahayak voice engine
   Why browser speech often sounds "like a computer", and what we do about it:
   1. The first matching voice is usually the oldest, most robotic one.
      → rankVoices() prefers neural / natural / online voices (Edge "Natural",
        Google network voices, Apple "Enhanced/Premium").
   2. Raw UI text ("₹6,000 / year", "PM-KISAN", "•") is read symbol by symbol.
      → prepareForSpeech() rewrites it the way a person would say it.
   3. One long utterance is read in a flat breath (and Chrome cuts it off ~15 s).
      → chunk() speaks sentence by sentence, giving natural pauses.
   4. Device voices are limited by what the phone has installed.
      → an optional neural cloud voice (see src/lib/voice/cloudTts.ts) is used
        first when configured, with the device voice as an instant fallback.
   ════════════════════════════════════════════════════════════════════════════ */

const NATURAL = /natural|neural|online|enhanced|premium|wavenet|studio|siri/i;
const ROBOTIC = /compact|espeak|robot|eloquence|novelty/i;
// Well-known natural Indian voices (Edge/Azure, Google, Apple)
const KNOWN_GOOD = /swara|madhur|neerja|prabhat|aarav|ananya|kavya|pallavi|valluvar|shruti|mohan|sapna|gagan|sobhana|midhun|aarohi|manohar|dhwani|niranjan|tanishaa|bashkar|subhasini|sukant|ojas|vaani|gul|salman|priyom|yashica|heera|rishi|lekha|veena/i;

let cachedVoices: SpeechSynthesisVoice[] = [];
function voices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const list = typeof window.speechSynthesis.getVoices === 'function' ? window.speechSynthesis.getVoices() : [];
  if (list && list.length) cachedVoices = list;
  return list && list.length ? list : cachedVoices;
}
// Voices load asynchronously in Chromium — warm the cache as early as possible.
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    voices();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => voices());
  } catch {
    /* ignore */
  }
}

function scoreVoice(v: SpeechSynthesisVoice, locale: string): number {
  const lang = v.lang.toLowerCase().replace('_', '-');
  const want = locale.toLowerCase();
  let s = 0;
  if (lang === want) s += 40;
  else if (lang.startsWith(want.split('-')[0])) s += 25;
  else return -Infinity;
  if (NATURAL.test(v.name)) s += 50;
  if (KNOWN_GOOD.test(v.name)) s += 15;
  if (/google/i.test(v.name)) s += 25;
  if (v.localService === false) s += 10;
  if (ROBOTIC.test(v.name)) s -= 60;
  return s;
}

/** Best available voice for a locale, or undefined. */
export function bestVoice(locale: string, list: SpeechSynthesisVoice[] = voices()): SpeechSynthesisVoice | undefined {
  let best: SpeechSynthesisVoice | undefined;
  let bestScore = -Infinity;
  for (const v of list) {
    const sc = scoreVoice(v, locale);
    if (sc > bestScore) {
      best = v;
      bestScore = sc;
    }
  }
  return bestScore === -Infinity ? undefined : best;
}

/**
 * Same-script siblings: when the OS has no voice for a language, a voice for a
 * language sharing its script still reads it intelligibly.
 *  • Assamese → Bengali voice · Marathi → Hindi voice
 */
const SAME_SCRIPT_SIBLING: Partial<Record<SupportedLanguage, string>> = { as: 'bn-IN', mr: 'hi-IN' };

const RUPEE_WORD: Record<SupportedLanguage, string> = {
  en: 'rupees', hi: 'रुपये', mr: 'रुपये', kn: 'ರೂಪಾಯಿ', ta: 'ரூபாய்', te: 'రూపాయలు', ml: 'രൂപ',
  gu: 'રૂપિયા', bn: 'টাকা', as: 'টকা', or: 'ଟଙ୍କା', pa: 'ਰੁਪਏ', ur: 'روپے',
};

// Acronyms that should be said as words, not letters
const SAY_AS_WORD = new Set(['KISAN', 'MUDRA', 'JAY', 'AADHAAR', 'NABARD', 'SAKALA', 'AYUSHMAN', 'SVANIDHI']);

/** Rewrites interface text into something a person would actually say. */
export function prepareForSpeech(text: string, language: SupportedLanguage): string {
  let s = text;
  // ₹6,000 → "6,000 rupees" (in the listener's language)
  s = s.replace(/₹\s?([\d,]+(?:\.\d+)?)(\s?(?:lakh|crore|L|Cr)\b)?/gi, (_m, n: string, unit: string | undefined) => {
    const u = unit ? (unit.trim().toLowerCase().startsWith('l') ? ' lakh' : ' crore') : '';
    return `${n}${u} ${RUPEE_WORD[language] ?? 'rupees'}`;
  });
  // Separators and decorative symbols become pauses
  s = s.replace(/\s*[•·|]\s*/g, ', ').replace(/\s+[—–]\s+/g, ', ').replace(/\s\/\s/g, ', ');
  s = s.replace(/[“”"«»*#_~]/g, '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');
  // PM-KISAN → PM KISAN ; hyphenated Latin acronyms
  s = s.replace(/\b([A-Z]{2,})-([A-Z][A-Za-z]+)\b/g, '$1 $2');
  // Acronyms: short ones are spelled ("CSC" → "C S C"), pronounceable long ones become words
  s = s.replace(/\b[A-Z]{2,8}\b/g, (w) => {
    if (SAY_AS_WORD.has(w) || (w.length >= 5 && /[AEIOU]/.test(w.slice(1)))) return w.charAt(0) + w.slice(1).toLowerCase();
    return w.split('').join(' ');
  });
  return s.replace(/\s{2,}/g, ' ').trim();
}

/** Split into speakable sentences (≤ ~220 chars), honouring Indic and Urdu full stops. */
export function chunk(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?।॥۔؟])\s+|\n+/u)
    .map((p) => p.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    if (p.length <= 220) {
      out.push(p);
      continue;
    }
    let buf = '';
    for (const piece of p.split(/(?<=[,،;:])\s+/u)) {
      if ((buf + ' ' + piece).trim().length > 220 && buf) {
        out.push(buf.trim());
        buf = piece;
      } else buf = `${buf} ${piece}`;
    }
    if (buf.trim()) out.push(buf.trim());
  }
  return out.length ? out : [text];
}

let session = 0;

export const speakVernacularText = (
  text: string,
  language: SupportedLanguage,
  onEnd?: () => void,
  onError?: (reason?: string) => void
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported on this device.');
    if (onEnd) onEnd();
    return;
  }

  const synth = window.speechSynthesis;
  const wasActive = Boolean(synth.speaking || synth.pending);
  synth.cancel();
  stopCloudAudio();
  const mySession = ++session;

  const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
  const list = voices();
  const ownVoice = bestVoice(meta.speechLang, list);
  const siblingLocale = SAME_SCRIPT_SIBLING[language];
  const siblingVoice = !ownVoice && siblingLocale ? bestVoice(siblingLocale, list) : undefined;
  const nativeVoice = ownVoice || siblingVoice;
  const spoken = prepareForSpeech(text, language);

  const speakOnDevice = () => {
    if (mySession !== session) return;
    // No voice for this script at all: say the phonetic greeting in Indian English
    // rather than silence (the listener still gets an audible, understandable cue).
    const hasNonLatin = /[^\u0000-\u007F₹]/.test(text);
    const usePhonetic = language !== 'en' && list.length > 0 && !nativeVoice && hasNonLatin;

    const sentences = usePhonetic ? [meta.phoneticGreeting] : chunk(spoken);
    const enVoice = usePhonetic ? bestVoice('en-IN', list) || bestVoice('en', list) : undefined;
    let i = 0;

    const next = () => {
      if (mySession !== session) return;
      if (i >= sentences.length) {
        onEnd?.();
        return;
      }
      const u = new SpeechSynthesisUtterance(sentences[i++]);
      if (usePhonetic) {
        u.lang = 'en-IN';
        u.rate = 0.95;
        if (enVoice) u.voice = enVoice;
      } else {
        u.lang = siblingVoice && siblingLocale ? siblingLocale : meta.speechLang;
        // Natural voices sound best near 1.0; older voices need slowing down to be clear.
        u.rate = nativeVoice && NATURAL.test(nativeVoice.name) ? Math.min(1, meta.speechRate + 0.05) : meta.speechRate;
        u.pitch = 1;
        if (nativeVoice) u.voice = nativeVoice;
      }
      u.onend = () => {
        // A short breath between sentences
        if (i < sentences.length) setTimeout(next, 140);
        else next();
      };
      u.onerror = (e: SpeechSynthesisErrorEvent) => {
        if (e?.error === 'interrupted' || e?.error === 'canceled') return;
        console.warn('Speech synthesis error:', e);
        onError?.(e?.error);
        onEnd?.();
      };
      synth.speak(u);
    };

    // Chromium silently drops speak() if called synchronously right after cancel()
    if (wasActive) setTimeout(next, 40);
    else next();
  };

  // Prefer the neural cloud voice when configured; fall back instantly to the device.
  if (isCloudVoiceAvailable(language)) {
    speakWithCloud(spoken, language, () => mySession === session)
      .then((ok) => {
        if (mySession !== session) return;
        if (ok) onEnd?.();
        else speakOnDevice();
      })
      .catch(() => speakOnDevice());
    return;
  }
  speakOnDevice();
};

export const stopSpeech = () => {
  session++;
  stopCloudAudio();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
