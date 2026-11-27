import type { SupportedLanguage } from '../types';

/**
 * Script-aware font streaming.
 * A budget phone on 4G should never download ten Indic fonts to read one.
 * Plus Jakarta Sans (Latin) ships with the page; the matching Noto Sans script is fetched only
 * when that language is chosen (≈30–60 KB woff2 per script, cached by the browser).
 */
const FAMILY: Partial<Record<SupportedLanguage, string>> = {
  hi: 'Noto+Sans+Devanagari:wght@400..700',
  mr: 'Noto+Sans+Devanagari:wght@400..700',
  kn: 'Noto+Sans+Kannada:wght@400..700',
  bn: 'Noto+Sans+Bengali:wght@400..700',
  as: 'Noto+Sans+Bengali:wght@400..700',
  ta: 'Noto+Sans+Tamil:wght@400..700',
  te: 'Noto+Sans+Telugu:wght@400..700',
  ml: 'Noto+Sans+Malayalam:wght@400..700',
  gu: 'Noto+Sans+Gujarati:wght@400..700',
  or: 'Noto+Sans+Oriya:wght@400..700',
  pa: 'Noto+Sans+Gurmukhi:wght@400..700',
  ur: 'Noto+Nastaliq+Urdu:wght@400..700',
};

const loaded = new Set<string>();

export function ensureScriptFont(lang: SupportedLanguage): void {
  if (typeof document === 'undefined') return;
  const family = FAMILY[lang];
  if (!family || loaded.has(family)) return;
  loaded.add(family);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  link.dataset.script = lang;
  document.head.appendChild(link);
}

/** Warm the cache for a script the user is hovering in the language picker. */
export function prefetchScriptFont(lang: SupportedLanguage): void {
  ensureScriptFont(lang);
}
