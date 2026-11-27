import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, CircleHalf, SunDim, Lightning, SpeakerHigh } from '@phosphor-icons/react';
import { useAppStore, TextSize } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Sheet } from '../../ui/Sheet';
import { Segmented } from '../../ui/Chip';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';
import { bestVoice, speakVernacularText } from '../../utils/audioSpeech';
import { LANGUAGE_META } from '../../data/languages';
import { Play, SealCheck, Info } from '@phosphor-icons/react';

/** Shows which voice will read aloud, whether it's a natural (neural) one, and how to get a better one. */
function VoiceQuality() {
  const { t, language } = useTranslation();
  const [, setTick] = useState(0);
  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    const on = () => setTick((n) => n + 1);
    synth?.addEventListener?.('voiceschanged', on);
    return () => synth?.removeEventListener?.('voiceschanged', on);
  }, []);
  const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
  const voice = bestVoice(meta.speechLang);
  const natural = !!voice && /natural|neural|online|enhanced|premium|google|wavenet/i.test(voice.name);
  return (
    <div className="mt-1 mb-3 rounded-md bg-sunken p-4">
      <div className="flex items-start gap-3">
        {natural ? <SealCheck size={22} weight="fill" className="text-patti shrink-0 mt-0.5" /> : <Info size={22} weight="fill" className="text-kesar shrink-0 mt-0.5" />}
        <div className="min-w-0 flex-1">
          <p className="text-small font-semibold">
            {voice ? (natural ? t('shell.comfort.voiceNatural', 'Natural voice') : t('shell.comfort.voiceBasic', 'Basic voice')) : t('shell.comfort.voiceMissing', 'No voice installed for this language')}
          </p>
          {voice && <p className="text-micro text-ink-3 truncate">{voice.name}</p>}
          {!natural && <p className="mt-1 text-micro text-ink-2">{t('shell.comfort.voiceTip', 'For a clearer, more human voice, open your phone Settings → Text-to-speech, choose “Speech Services by Google” and download your language.')}</p>}
        </div>
        <button
          type="button"
          onClick={() => speakVernacularText(meta.greeting, language)}
          className="shrink-0 inline-flex items-center gap-1.5 h-10 px-3 rounded-sm bg-surface shadow-hair text-small font-semibold hover:shadow-lift"
        >
          <Play size={16} weight="fill" /> {t('shell.comfort.voiceSample', 'Hear it')}
        </button>
      </div>
    </div>
  );
}

function Switch({ checked, onChange, label, hint, icon }: { checked: boolean; onChange: () => void; label: string; hint: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => {
        haptic('select');
        onChange();
      }}
      className="w-full flex items-center gap-4 py-4 text-start"
    >
      <span className={cx('w-11 h-11 rounded-md grid place-items-center shrink-0 transition-colors', checked ? 'bg-neel text-on-neel' : 'bg-sunken text-ink-2')}>{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold">{label}</span>
        <span className="block text-small text-ink-2">{hint}</span>
      </span>
      <span className={cx('relative w-[52px] h-8 rounded-full shrink-0 transition-colors duration-short', checked ? 'bg-patti' : 'bg-line-strong')}>
        <motion.span
          className="absolute top-1 start-1 w-6 h-6 rounded-full bg-white shadow"
          animate={{ x: checked ? (document.documentElement.dir === 'rtl' ? -20 : 20) : 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 36 }}
        />
      </span>
    </button>
  );
}

/**
 * Reading comfort — every accessibility affordance in one place, in plain words.
 * Live preview: the sample sentence reflows as you change text size.
 */
export function ComfortSheet() {
  const { t } = useTranslation();
  const s = useAppStore();
  const sizes: { value: TextSize; label: React.ReactNode }[] = [
    { value: 'md', label: <span className="text-[15px] font-semibold">A</span> },
    { value: 'lg', label: <span className="text-[19px] font-semibold">A</span> },
    { value: 'xl', label: <span className="text-[23px] font-semibold">A</span> },
  ];

  return (
    <Sheet open={s.isComfortOpen} onClose={() => s.setComfortOpen(false)} title={t('shell.comfort.title', 'Reading comfort')} description={t('shell.comfort.subtitle')} closeLabel={t('navClose', 'Close')} size="sm" desktop="side">
      <section className="pt-2">
        <h3 className="font-semibold">{t('shell.comfort.textSize', 'Text size')}</h3>
        <p className="text-small text-ink-2 mb-3">{t('shell.comfort.textSizeHint')}</p>
        <Segmented value={s.textSize} onChange={s.setTextSize} options={sizes} label={t('shell.comfort.textSize', 'Text size')} className="w-full" layoutKey="textsize" />
        <motion.p layout className="mt-4 p-4 rounded-md bg-sunken text-lead font-medium">
          {t('shell.comfort.preview', 'Your benefits, in your language.')}
        </motion.p>
      </section>

      <section className="pt-6">
        <h3 className="font-semibold mb-3">{t('shell.comfort.theme', 'Appearance')}</h3>
        <Segmented
          value={s.theme}
          onChange={s.setTheme}
          label={t('shell.comfort.theme', 'Appearance')}
          className="w-full"
          layoutKey="theme"
          options={[
            { value: 'system', label: t('shell.comfort.themeSystem', 'Auto'), icon: <CircleHalf size={18} /> },
            { value: 'light', label: t('shell.comfort.themeLight', 'Day'), icon: <Sun size={18} /> },
            { value: 'dark', label: t('shell.comfort.themeDark', 'Night'), icon: <Moon size={18} /> },
          ]}
        />
      </section>

      <section className="pt-4 divide-y divide-line">
        <Switch checked={s.isHighSunlightMode} onChange={s.toggleHighSunlightMode} label={t('shell.comfort.sunlight', 'Sunlight mode')} hint={t('shell.comfort.sunlightHint')} icon={<SunDim size={22} weight="duotone" />} />
        <Switch checked={s.isLiteMode} onChange={s.toggleLiteMode} label={t('shell.comfort.lite', 'Data saver')} hint={t('shell.comfort.liteHint')} icon={<Lightning size={22} weight="duotone" />} />
        <Switch checked={s.isAudioAssistanceEnabled} onChange={s.toggleAudioAssistance} label={t('shell.comfort.voice', 'Read aloud')} hint={t('shell.comfort.voiceHint')} icon={<SpeakerHigh size={22} weight="duotone" />} />
        <VoiceQuality />
      </section>
    </Sheet>
  );
}
