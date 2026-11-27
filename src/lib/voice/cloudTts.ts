import type { SupportedLanguage } from '../../types';

/**
 * Neural cloud voice (optional).
 * Device voices vary wildly between phones; a neural Indian-language voice sounds
 * like a person. Set VITE_TTS_URL to a server endpoint (see supabase/functions/tts)
 * that accepts { text, lang } and returns { audio: base64, mime }.
 * API keys never reach the browser. If unset or failing, the device voice is used.
 */
const ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
const URL_ = ENV.VITE_TTS_URL;
const ANON = ENV.VITE_SUPABASE_ANON_KEY;

// Languages the configured neural provider covers (Sarvam Bulbul: 10 Indic + Indian English)
const SUPPORTED = new Set<SupportedLanguage>(['en', 'hi', 'bn', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'gu']);

const cache = new Map<string, string>(); // `${lang}|${text}` → object URL
let current: HTMLAudioElement | null = null;
let failures = 0;

export function isCloudVoiceAvailable(lang: SupportedLanguage): boolean {
  if (!URL_ || failures >= 3) return false;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('lite')) return false;
  return SUPPORTED.has(lang);
}

export function stopCloudAudio() {
  if (current) {
    current.pause();
    current = null;
  }
}

/** Resolves true when playback finished, false if the caller should fall back to the device voice. */
export async function speakWithCloud(text: string, lang: SupportedLanguage, stillWanted: () => boolean): Promise<boolean> {
  const key = `${lang}|${text}`;
  try {
    let src = cache.get(key);
    if (!src) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(URL_ as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(ANON ? { Authorization: `Bearer ${ANON}`, apikey: ANON } : {}) },
        body: JSON.stringify({ text, lang }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`tts ${res.status}`);
      const { audio, mime = 'audio/wav' } = (await res.json()) as { audio: string; mime?: string };
      const bytes = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));
      src = URL.createObjectURL(new Blob([bytes], { type: mime }));
      cache.set(key, src);
    }
    if (!stillWanted()) return true;
    failures = 0;
    return await new Promise<boolean>((resolve) => {
      const el = new Audio(src);
      current = el;
      el.onended = () => resolve(true);
      el.onerror = () => resolve(false);
      el.onpause = () => {
        if (current !== el) resolve(true);
      };
      el.play().catch(() => resolve(false));
    });
  } catch {
    failures += 1;
    return false;
  }
}
