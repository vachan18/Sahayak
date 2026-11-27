import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { EntryFrame } from '../components/entry/EntryFrame';
import { LifeOrbitArt, QuickCheckArt, FeePromiseArt } from '../components/entry/OnboardingArt';
import { Button, IconButton } from '../ui/Button';
import { ListenButton } from '../ui/ListenButton';
import { cx } from '../ui/cx';
import { haptic } from '../lib/haptics';

const SLIDES = [
  { art: LifeOrbitArt, title: 'entry.onboard.1.title', body: 'entry.onboard.1.body' },
  { art: QuickCheckArt, title: 'entry.onboard.2.title', body: 'entry.onboard.2.body' },
  { art: FeePromiseArt, title: 'entry.onboard.3.title', body: 'entry.onboard.3.body' },
];

const variants = {
  enter: (dir: number) => ({ x: dir * 64, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.36, ease: [0.2, 0, 0, 1] } },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0, transition: { duration: 0.18, ease: [0.3, 0, 1, 1] } }),
};

/**
 * Three ideas, one per screen, each with a moving picture that explains it
 * without words. Swipe, tap Next, or skip — and every panel can be heard aloud.
 */
export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeOnboarding } = useAppStore();
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const last = index === SLIDES.length - 1;

  const finish = () => {
    haptic('success');
    completeOnboarding();
    navigate('/home');
  };
  const go = (delta: number) => {
    const next = index + delta;
    if (next < 0) return;
    if (next >= SLIDES.length) return finish();
    haptic('select');
    setPage([next, delta]);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (Math.abs(swipe) < 70) return;
    const forward = rtl ? swipe > 0 : swipe < 0;
    go(forward ? 1 : -1);
  };

  const slide = SLIDES[index];
  const Art = slide.art;
  const title = t(slide.title);
  const body = t(slide.body);
  const visualDir = rtl ? -dir : dir;

  return (
    <EntryFrame
      headerEnd={
        <button type="button" onClick={finish} className="h-11 px-3 rounded-md text-small font-semibold text-ink-2 hover:bg-sunken">
          {t('entry.onboard.skip', 'Skip')}
        </button>
      }
      footer={
        <div className="flex items-center gap-3">
          <AnimatePresence initial={false}>
            {index > 0 && (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden shrink-0">
                <IconButton label={t('entry.onboard.back', 'Previous')} variant="secondary" size="lg" onClick={() => go(-1)}>
                  <ArrowLeft size={22} weight="bold" className="flip-rtl" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
          <Button size="lg" block onClick={() => go(1)} iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
            {last ? t('entry.onboard.start', 'Start using Sahayak') : t('entry.onboard.next', 'Next')}
          </Button>
        </div>
      }
    >
      <p className="pt-2 lg:pt-10 text-small font-semibold text-ink-3">{t('entry.onboard.step', 'Step 2 of 2')}</p>

      <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} onDragEnd={onDragEnd} className="flex-1 flex flex-col touch-pan-y cursor-grab active:cursor-grabbing select-none" aria-roledescription="carousel">
        <AnimatePresence mode="wait" custom={visualDir} initial={false}>
          <motion.section
            key={index}
            custom={visualDir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            aria-roledescription="slide"
            aria-label={`${t('entry.onboard.slide', 'Slide')} ${index + 1} / ${SLIDES.length}`}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 min-h-[330px] grid place-items-center py-8">
              <Art />
            </div>
            <h1 className="text-h1 font-semibold">{title}</h1>
            <p className="mt-3 text-lead text-ink-2">{body}</p>
            <div className="mt-5">
              <ListenButton text={`${title}. ${body}`} />
            </div>
          </motion.section>
        </AnimatePresence>
      </motion.div>

      {/* Progress dots — the active one stretches into a pill */}
      <div className="mt-8 flex items-center gap-2" role="tablist" aria-label={t('entry.onboard.swipe', 'Swipe to see more')}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${t('entry.onboard.slide', 'Slide')} ${i + 1}`}
            onClick={() => i !== index && setPage([i, i > index ? 1 : -1])}
            className="h-11 px-1 grid place-items-center"
          >
            <motion.span layout className={cx('block h-2 rounded-full', i === index ? 'bg-ink' : 'bg-line-strong')} animate={{ width: i === index ? 28 : 8 }} transition={{ type: 'spring', stiffness: 500, damping: 36 }} />
          </button>
        ))}
      </div>
    </EntryFrame>
  );
};

export default OnboardingScreen;
