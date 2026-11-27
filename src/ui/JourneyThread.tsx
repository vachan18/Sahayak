import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Compass, ListChecks, Files, PaperPlaneRight, Path } from '@phosphor-icons/react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { cx } from './cx';
import { ease } from './motion';

export type JourneyStepId = 'discover' | 'check' | 'prepare' | 'apply' | 'track';
type StepState = 'done' | 'current' | 'todo';

const STEPS: { id: JourneyStepId; to: string; key: string; fallback: string; icon: typeof Compass }[] = [
  { id: 'discover', to: '/schemes', key: 'shell.journey.discover', fallback: 'Find', icon: Compass },
  { id: 'check', to: '/eligibility', key: 'shell.journey.check', fallback: 'Check', icon: ListChecks },
  { id: 'prepare', to: '/documents', key: 'shell.journey.prepare', fallback: 'Papers', icon: Files },
  { id: 'apply', to: '/schemes', key: 'shell.journey.apply', fallback: 'Apply', icon: PaperPlaneRight },
  { id: 'track', to: '/tracker', key: 'shell.journey.track', fallback: 'Track', icon: Path },
];

/** Derives where this household is in the welfare journey from real app state. */
export function useJourney() {
  const { savedSchemeIds, recentlyViewedSchemeIds, eligibilityStatus, documentUploadStatus, applications } = useAppStore();
  const docs = Object.values(documentUploadStatus);
  const done: Record<JourneyStepId, boolean> = {
    discover: savedSchemeIds.length > 0 || recentlyViewedSchemeIds.length > 0,
    check: eligibilityStatus !== 'not_assessed' && eligibilityStatus !== 'in_progress',
    prepare: docs.length > 0 && docs.every((s) => s === 'verified' || s === 'uploaded'),
    apply: applications.length > 0,
    track: applications.some((a) => a.statusBadge === 'sanctioned' || a.statusBadge === 'disbursed'),
  };
  const firstOpen = STEPS.findIndex((s) => !done[s.id]);
  const currentIndex = firstOpen === -1 ? STEPS.length - 1 : firstOpen;
  const steps = STEPS.map((s, i) => ({
    ...s,
    state: (done[s.id] && i !== currentIndex ? 'done' : i === currentIndex ? 'current' : done[s.id] ? 'done' : 'todo') as StepState,
  }));
  return { steps, currentIndex };
}

/**
 * THE JOURNEY THREAD — Sahayak's signature element.
 * Government welfare is a five-knot journey: Find → Check → Papers → Apply → Track.
 * Most portals hide this; we draw it. A single thread is tied off at each knot you
 * complete, so a family always knows what is done and what comes next.
 */
export function JourneyThread({ compact = false, className, tone = 'default' }: { compact?: boolean; className?: string; tone?: 'default' | 'inverse' }) {
  const { t } = useTranslation();
  const { steps, currentIndex } = useJourney();
  const progress = currentIndex / (steps.length - 1);
  const inverse = tone === 'inverse';

  // A soft running stitch between knot centres (10%, 30% … 90% of the width)
  const d = 'M100 20 C150 6 250 34 300 20 S450 6 500 20 S650 34 700 20 S850 6 900 20';

  return (
    <nav aria-label={t('shell.journey.label', 'Your welfare journey')} className={cx('relative', className)}>
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className={cx('absolute inset-x-0 w-full pointer-events-none flip-rtl', compact ? 'top-[6px] h-7' : 'top-[10px] h-9')} aria-hidden>
        <path d={d} fill="none" strokeWidth="2" strokeDasharray="6 7" vectorEffect="non-scaling-stroke" className={inverse ? 'stroke-white/30' : 'stroke-line-strong'} />
        <motion.path
          d={d}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={inverse ? 'stroke-haldi' : 'stroke-patti'}
          pathLength={1}
          strokeDasharray="1 1"
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 1 - progress }}
          transition={{ duration: 1.1, ease: ease.out, delay: 0.2 }}
        />
      </svg>
      <ol className="relative grid grid-cols-5">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.id} className="flex flex-col items-center text-center min-w-0">
              <Link
                to={s.to}
                aria-current={s.state === 'current' ? 'step' : undefined}
                className="group flex flex-col items-center gap-1.5 min-w-0 px-1 rounded-md focus-visible:outline-offset-4"
              >
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 420, damping: 22 }}
                  className={cx(
                    'relative grid place-items-center rounded-full transition-colors duration-short',
                    compact ? 'w-8 h-8' : 'w-11 h-11',
                    s.state === 'done' && (inverse ? 'bg-haldi text-[#111E33]' : 'bg-patti text-white'),
                    s.state === 'current' && (inverse ? 'bg-white text-neel' : 'bg-ink text-paper'),
                    s.state === 'todo' && (inverse ? 'bg-white/10 text-white/70 ring-1 ring-white/25' : 'bg-surface text-ink-3 shadow-hair')
                  )}
                >
                  {s.state === 'current' && (
                    <span className={cx('absolute inset-0 rounded-full animate-ring-out', inverse ? 'bg-white/40' : 'bg-ink/25')} aria-hidden />
                  )}
                  {s.state === 'done' ? <Check size={compact ? 14 : 18} weight="bold" /> : <Icon size={compact ? 15 : 20} weight={s.state === 'current' ? 'fill' : 'regular'} />}
                </motion.span>
                <span
                  className={cx(
                    'truncate max-w-full',
                    compact ? 'text-micro' : 'text-small',
                    s.state === 'current' ? 'font-semibold' : 'font-medium',
                    inverse ? (s.state === 'todo' ? 'text-white/65' : 'text-white') : s.state === 'todo' ? 'text-ink-3' : 'text-ink'
                  )}
                >
                  {t(s.key, s.fallback)}
                </span>
                <span className="sr-only">
                  {s.state === 'done' ? t('shell.journey.done', 'done') : s.state === 'current' ? t('shell.journey.now', 'you are here') : t('shell.journey.next', 'not started')}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
