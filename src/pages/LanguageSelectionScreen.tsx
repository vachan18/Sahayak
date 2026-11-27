import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, SpeakerHigh } from '@phosphor-icons/react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { speakVernacularText } from '../utils/audioSpeech';
import { LANGUAGE_META } from '../data/languages';
import { EntryFrame } from '../components/entry/EntryFrame';
import { LanguagePicker } from '../components/shell/LanguageSheet';
import { Button } from '../ui/Button';
import { Disclosure } from '../ui/Layout';
import { SelectField } from '../ui/Field';
import { riseIn, staggerParent } from '../ui/motion';

/**
 * "Which language do you speak?" — asked out loud, answered with one tap.
 * Each option is written in its own script and can be heard before choosing.
 */
export const LanguageSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { dialect, setDialect, isAudioAssistanceEnabled } = useAppStore();
  const { t, language } = useTranslation();
  const title = t('entry.language.title', 'Which language do you speak?');

  // Ask the question aloud (we arrive here from a tap, so audio is allowed)
  useEffect(() => {
    if (!isAudioAssistanceEnabled) return;
    const id = window.setTimeout(() => speakVernacularText(title, language), 450);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EntryFrame
      headerEnd={
        <Link to="/home" className="h-11 px-3 rounded-md grid place-items-center text-small font-semibold text-ink-2 hover:bg-sunken">
          {t('entry.onboard.skip', 'Skip')}
        </Link>
      }
      footer={
        <Button size="lg" block onClick={() => navigate('/onboarding')} iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
          <span>{t('entry.language.continue', 'Continue in this language')}</span>
          <span className="opacity-70 font-medium"> · {(LANGUAGE_META[language] || LANGUAGE_META.en).label}</span>
        </Button>
      }
    >
      <motion.div variants={staggerParent(0.06)} initial="hidden" animate="show" className="pt-2 lg:pt-10">
        <motion.p variants={riseIn} className="text-small font-semibold text-ink-3">
          {t('entry.language.step', 'Step 1 of 2')}
        </motion.p>
        <motion.div variants={riseIn} className="mt-2 flex items-start gap-3">
          <h1 className="flex-1 text-h1 font-semibold">{title}</h1>
          <button
            type="button"
            onClick={() => speakVernacularText(title, language)}
            aria-label={t('listenInLanguage', 'Listen')}
            className="mt-1 w-12 h-12 shrink-0 rounded-full bg-neel-tint text-neel-ink grid place-items-center active:scale-90 transition-transform"
          >
            <SpeakerHigh size={22} weight="duotone" />
          </button>
        </motion.div>
        <motion.p variants={riseIn} className="mt-2 text-ink-2">
          {t('entry.language.body', 'Tap your language. Tap the speaker to hear it first.')}
        </motion.p>

        <motion.div variants={riseIn} className="mt-6">
          <LanguagePicker columns={2} />
        </motion.div>

        <motion.div variants={riseIn} className="mt-6">
          <Disclosure summary={t('entry.language.more', 'More options')}>
            <SelectField label={t('entry.language.dialect', 'Accent for voice')} hint={t('entry.language.dialectHint')} value={dialect} onChange={(e) => setDialect(e.target.value)}>
              <option value="standard">{t('dialectStandard', 'Standard')}</option>
              <option value="bhojpuri">{t('dialectBhojpuri', 'Bhojpuri / Awadhi')}</option>
              <option value="north_karnataka">{t('dialectNorthKarnataka', 'North Karnataka')}</option>
            </SelectField>
          </Disclosure>
        </motion.div>
      </motion.div>
    </EntryFrame>
  );
};

export default LanguageSelectionScreen;
