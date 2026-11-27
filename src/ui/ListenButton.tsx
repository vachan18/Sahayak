import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SpeakerHigh, Stop } from '@phosphor-icons/react';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { useTranslation } from '../hooks/useTranslation';
import { haptic } from '../lib/haptics';
import { cx } from './cx';

interface ListenButtonProps {
  text: string;
  label?: string;
  /** 'pill' shows the word "Listen"; 'icon' is a compact circle */
  variant?: 'pill' | 'icon' | 'inverse';
  className?: string;
}

/** Three bars that dance while audio plays — a universal "this is speaking" signal. */
function Bars() {
  return (
    <span className="inline-flex items-end gap-[3px] h-4" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-current"
          animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

/**
 * "Suniye" — read this aloud in my language.
 * Present on every piece of content that matters, so a person who cannot read
 * comfortably is never locked out of a decision.
 */
export function ListenButton({ text, label, variant = 'pill', className }: ListenButtonProps) {
  const { t, language } = useTranslation();
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => {
    if (playing) stopSpeech();
  }, [playing]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic('tap');
    if (playing) {
      stopSpeech();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speakVernacularText(text, language, () => setPlaying(false));
  };

  const name = playing ? t('voiceCancel', 'Stop') : label || t('listenInLanguage', 'Listen');

  if (variant === 'icon' || variant === 'inverse') {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        aria-label={name}
        aria-pressed={playing}
        title={name}
        className={cx(
          'w-11 h-11 rounded-full grid place-items-center shrink-0 transition-colors duration-short',
          variant === 'inverse' ? 'bg-white/15 text-white hover:bg-white/25' : playing ? 'bg-neel text-on-neel' : 'bg-neel-tint text-neel-ink hover:brightness-95',
          className
        )}
      >
        {playing ? <Bars /> : <SpeakerHigh size={20} weight="duotone" />}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      aria-pressed={playing}
      className={cx(
        'inline-flex items-center gap-2 h-10 ps-3 pe-4 rounded-full text-small font-semibold transition-colors duration-short shrink-0',
        playing ? 'bg-neel text-on-neel' : 'bg-neel-tint text-neel-ink hover:brightness-95',
        className
      )}
    >
      {playing ? <Bars /> : <SpeakerHigh size={18} weight="duotone" />}
      <span>{name}</span>
      {playing && <Stop size={14} weight="fill" className="opacity-70" />}
    </motion.button>
  );
}
