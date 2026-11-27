import { motion } from 'framer-motion';
import { Check, SpeakerHigh } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGE_LIST } from '../../data/languages';
import { speakVernacularText } from '../../utils/audioSpeech';
import { prefetchScriptFont } from '../../lib/fonts';
import { Sheet } from '../../ui/Sheet';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';
import { staggerParent, riseIn } from '../../ui/motion';
import type { SupportedLanguage } from '../../types';

/**
 * Language picker. Each language is written in its own script (never "Hindi" in English),
 * with its English name small underneath for proxies helping someone else.
 * A speaker button lets a non-reader *hear* each option before choosing.
 */
export function LanguagePicker({ onChosen, columns = 2 }: { onChosen?: (l: SupportedLanguage) => void; columns?: 2 | 3 }) {
  const { language, setLanguage } = useTranslation();
  const choose = (code: SupportedLanguage) => {
    haptic('success');
    setLanguage(code);
    onChosen?.(code);
  };
  return (
    <motion.ul variants={staggerParent(0.025)} initial="hidden" animate="show" className={cx('grid gap-2.5', columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2')}>
      {LANGUAGE_LIST.map((l) => {
        const selected = l.code === language;
        return (
          <motion.li key={l.code} variants={riseIn} className="relative" dir={l.dir ?? 'ltr'}>
            <button
              type="button"
              lang={l.code}
              onPointerEnter={() => prefetchScriptFont(l.code)}
              onFocus={() => prefetchScriptFont(l.code)}
              onClick={() => choose(l.code)}
              aria-pressed={selected}
              className={cx(
                'w-full min-h-[76px] rounded-md ps-4 pe-12 py-3 text-start transition-[box-shadow,background-color] duration-short',
                selected ? 'bg-neel text-on-neel shadow-lift' : 'bg-surface shadow-hair hover:shadow-lift'
              )}
            >
              <span className="block text-h3 font-semibold leading-snug">{l.label}</span>
              <span className={cx('block text-micro', selected ? 'opacity-80' : 'text-ink-3')} lang="en" dir="ltr">
                {l.sublabel.split('(')[0].trim()}
              </span>
            </button>
            <span className="absolute top-1/2 -translate-y-1/2 end-2 flex items-center">
              {selected ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-9 h-9 rounded-full bg-haldi text-[#111E33] grid place-items-center">
                  <Check size={18} weight="bold" />
                </motion.span>
              ) : (
                <button
                  type="button"
                  aria-label={`${l.sublabel} — ${l.welcomeVoice}`}
                  onClick={() => {
                    haptic('tap');
                    speakVernacularText(l.greeting, l.code);
                  }}
                  className="w-9 h-9 rounded-full grid place-items-center text-ink-3 hover:bg-sunken hover:text-neel-ink"
                >
                  <SpeakerHigh size={18} weight="duotone" />
                </button>
              )}
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export function LanguageSheet() {
  const { t } = useTranslation();
  const { isLanguageSheetOpen, setLanguageSheetOpen, pushToast } = useAppStore();
  return (
    <Sheet open={isLanguageSheetOpen} onClose={() => setLanguageSheetOpen(false)} title={t('shell.language.title', 'Choose your language')} description={t('shell.language.subtitle')} closeLabel={t('navClose', 'Close')} size="lg">
      <LanguagePicker
        columns={3}
        onChosen={() => {
          setTimeout(() => setLanguageSheetOpen(false), 260);
          setTimeout(() => pushToast({ message: t('shell.toast.languageChanged', 'Language changed'), tone: 'success' }), 500);
        }}
      />
    </Sheet>
  );
}
