import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ensureScriptFont } from '../../lib/fonts';
import { cx } from '../../ui/cx';
import type { SupportedLanguage } from '../../types';

/** "Hello" as people actually say it — one per language Sahayak speaks. */
export const GREETINGS: { text: string; lang: SupportedLanguage; latin: string }[] = [
  { text: 'नमस्ते', lang: 'hi', latin: 'Namaste' },
  { text: 'ನಮಸ್ಕಾರ', lang: 'kn', latin: 'Namaskara' },
  { text: 'வணக்கம்', lang: 'ta', latin: 'Vanakkam' },
  { text: 'নমস্কার', lang: 'bn', latin: 'Nomoshkar' },
  { text: 'నమస్కారం', lang: 'te', latin: 'Namaskaram' },
  { text: 'آداب', lang: 'ur', latin: 'Adaab' },
  { text: 'नमस्कार', lang: 'mr', latin: 'Namaskar' },
  { text: 'നമസ്കാരം', lang: 'ml', latin: 'Namaskaram' },
  { text: 'નમસ્તે', lang: 'gu', latin: 'Namaste' },
  { text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', lang: 'pa', latin: 'Sat Sri Akal' },
  { text: 'ନମସ୍କାର', lang: 'or', latin: 'Namaskar' },
  { text: 'নমস্কাৰ', lang: 'as', latin: 'Nomoskar' },
  { text: 'Welcome', lang: 'en', latin: 'Welcome' },
];

export function useGreetingCycle(interval = 2200) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % GREETINGS.length), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  // Stream the next script's font a beat early so it never flashes in a fallback face
  useEffect(() => {
    ensureScriptFont(GREETINGS[(i + 1) % GREETINGS.length].lang);
  }, [i]);
  return { index: i, current: GREETINGS[i] };
}

/** A greeting that changes script every couple of seconds — rising in, blurring out. */
export function Greetings({ className, showLatin = false, index: controlled }: { className?: string; showLatin?: boolean; index?: number }) {
  const own = useGreetingCycle();
  const g = controlled !== undefined ? GREETINGS[controlled] : own.current;
  return (
    <div className={cx('relative grid', className)} aria-live="off">
      {/* Stacked in one grid cell so the outgoing and incoming words crossfade — never a blank frame */}
      <AnimatePresence initial={false}>
        <motion.div
          key={g.lang}
          style={{ gridArea: '1 / 1' }}
          initial={{ opacity: 0, y: '0.3em', filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, delay: 0.08, ease: [0.2, 0, 0, 1] } }}
          exit={{ opacity: 0, y: '-0.2em', filter: 'blur(4px)', transition: { duration: 0.28, ease: [0.3, 0, 1, 1] } }}
        >
          <span lang={g.lang} dir={g.lang === 'ur' ? 'rtl' : 'ltr'} className="block" style={g.lang === 'ur' ? { fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1.7 } : undefined}>
            {g.text}
          </span>
          {showLatin && g.lang !== 'en' && <span className="block text-small font-medium opacity-70 mt-2 tracking-normal" lang="en" dir="ltr">{g.latin}</span>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
