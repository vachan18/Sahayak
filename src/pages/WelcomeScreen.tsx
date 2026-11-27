import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, SpeakerHigh, ShieldCheck, Translate, Microphone } from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { speakVernacularText } from '../utils/audioSpeech';
import { LANGUAGE_META } from '../data/languages';
import { SahayakLogo } from '../components/common/SahayakLogo';
import { EntryFrame } from '../components/entry/EntryFrame';
import { Greetings, useGreetingCycle } from '../components/entry/Greetings';
import { Button } from '../ui/Button';
import { riseIn, staggerParent } from '../ui/motion';
import { haptic } from '../lib/haptics';

/**
 * Welcome — the first five seconds.
 * The greeting cycles through every script Sahayak speaks, so each person sees
 * their own language within a few seconds, before reading a single English word.
 */
export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { index, current } = useGreetingCycle(2400);

  const hear = () => {
    haptic('tap');
    speakVernacularText((LANGUAGE_META[current.lang] || LANGUAGE_META.en).welcomeVoice, current.lang);
  };

  const facts = [
    { icon: Translate, label: t('entry.welcome.languages', '13 Indian languages') },
    { icon: Microphone, label: t('shell.nav.speak', 'Speak') },
    { icon: ShieldCheck, label: t('home.promise.fee', 'Government fee') + ' ₹0' },
  ];

  return (
    <EntryFrame
      hideBrand
      greetingIndex={index}
      footer={
        <div className="space-y-2">
          <Button size="lg" block onClick={() => navigate('/language')} iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
            {t('entry.welcome.continue', 'Continue')}
          </Button>
          <Link to="/home" className="flex items-center justify-center h-12 rounded-md text-small font-semibold text-neel-ink hover:bg-sunken">
            {t('entry.welcome.returning', 'I have used Sahayak before')}
          </Link>
        </div>
      }
    >
      <motion.div variants={staggerParent(0.08, 0.1)} initial="hidden" animate="show" className="flex-1 flex flex-col justify-center py-6">
        <motion.div variants={riseIn} className="lg:hidden">
          <motion.div initial={{ scale: 0.6, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="w-fit">
            <SahayakLogo className="h-24 w-auto" />
          </motion.div>
        </motion.div>

        <motion.div variants={riseIn} className="mt-8 min-h-[7.5rem] lg:hidden">
          <Greetings index={index} showLatin className="text-[clamp(3rem,2.2rem+4vw,4.75rem)] font-semibold leading-[1.15] text-ink" />
        </motion.div>

        <motion.h1 variants={riseIn} className="mt-4 text-h1 font-semibold">
          {t('entry.welcome.tagline', 'Government schemes, in your language.')}
        </motion.h1>
        <motion.p variants={riseIn} className="mt-3 text-lead text-ink-2 max-w-md">
          {t('entry.welcome.body')}
        </motion.p>

        <motion.div variants={riseIn} className="mt-6">
          <button type="button" onClick={hear} className="inline-flex items-center gap-2.5 h-12 ps-2 pe-5 rounded-full bg-neel-tint text-neel-ink font-semibold active:scale-95 transition-transform">
            <span className="w-9 h-9 rounded-full bg-neel text-on-neel grid place-items-center">
              <SpeakerHigh size={20} weight="fill" />
            </span>
            {t('entry.welcome.hear', 'Tap to hear')}
            <span lang={current.lang} className="text-ink-3 font-medium">
              · {current.latin}
            </span>
          </button>
        </motion.div>

        <motion.ul variants={riseIn} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-small text-ink-2">
          {facts.map((f) => (
            <li key={f.label} className="flex items-center gap-2">
              <f.icon size={18} weight="duotone" className="text-patti" />
              {f.label}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </EntryFrame>
  );
};

export default WelcomeScreen;
