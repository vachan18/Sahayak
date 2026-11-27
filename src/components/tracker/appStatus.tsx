import { motion } from 'framer-motion';
import { Check, Warning } from '@phosphor-icons/react';
import type { ApplicationRecord } from '../../types';
import type { Tone } from '../../ui/Surface';
import { cx } from '../../ui/cx';
import { ease } from '../../ui/motion';

export type AppFilter = 'all' | 'action' | 'progress' | 'done';

export const hasOpenMissingDocs = (a: ApplicationRecord) => (a.missingDocuments ?? []).some((d) => !d.resolved);
export const isDone = (a: ApplicationRecord) => a.statusBadge === 'disbursed';
export const isOverdue = (a: ApplicationRecord) => !isDone(a) && a.slaDaysRemaining < 0;
export const needsAction = (a: ApplicationRecord) => !isDone(a) && (a.statusBadge === 'action_needed' || hasOpenMissingDocs(a));

export function appTone(a: ApplicationRecord): Tone {
  if (isDone(a)) return 'patti';
  if (needsAction(a) || isOverdue(a)) return 'sindoor';
  return 'neel';
}

export function matchesFilter(a: ApplicationRecord, f: AppFilter) {
  if (f === 'all') return true;
  if (f === 'done') return isDone(a);
  if (f === 'action') return needsAction(a) || isOverdue(a);
  return !isDone(a) && !needsAction(a) && !isOverdue(a);
}

/** Priority order: things that need you first, then late, then in progress, then done. */
export function priority(a: ApplicationRecord) {
  if (needsAction(a)) return 0;
  if (isOverdue(a)) return 1;
  if (!isDone(a)) return 2;
  return 3;
}

/**
 * Four knots on a thread — the application lifecycle at a glance.
 * Echoes the app-wide Journey Thread so the visual language is consistent.
 */
export function StageThread({ app, t, className }: { app: ApplicationRecord; t: (k: string, f?: string) => string; className?: string }) {
  const done = isDone(app);
  const blocked = needsAction(app) || isOverdue(app);
  const progress = done ? 1 : (app.currentStage - 1) / 3;
  return (
    <div className={cx('relative', className)} role="img" aria-label={`${t('tracker.stage.label', 'Application steps')}: ${t('tracker.step', 'Step')} ${app.currentStage}/4 — ${t(`tracker.stage.${app.currentStage}`)}`}>
      <div className="absolute top-[13px] inset-x-[12.5%] h-[3px] rounded-full bg-sunken" aria-hidden />
      <motion.div
        aria-hidden
        className={cx('absolute top-[13px] start-[12.5%] h-[3px] rounded-full origin-[0%_50%] rtl:origin-[100%_50%]', done ? 'bg-patti' : 'bg-neel')}
        style={{ width: '75%' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 0.8, ease: ease.out, delay: 0.1 }}
      />
      <ol className="relative grid grid-cols-4">
        {[1, 2, 3, 4].map((s) => {
          const complete = done || s < app.currentStage;
          const current = !done && s === app.currentStage;
          return (
            <li key={s} className="flex flex-col items-center gap-1.5 min-w-0">
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + s * 0.07, type: 'spring', stiffness: 420, damping: 24 }}
                className={cx(
                  'w-[29px] h-[29px] rounded-full grid place-items-center ring-4 ring-surface',
                  complete && (done ? 'bg-patti text-white' : 'bg-neel text-on-neel'),
                  current && (blocked ? 'bg-sindoor text-white' : 'bg-ink text-paper'),
                  !complete && !current && 'bg-sunken text-ink-3'
                )}
              >
                {complete ? (
                  <Check size={14} weight="bold" />
                ) : current && blocked ? (
                  <Warning size={14} weight="fill" />
                ) : (
                  <span className="num text-micro font-semibold">{s}</span>
                )}
              </motion.span>
              <span className={cx('text-micro text-center leading-tight line-clamp-2 break-words max-w-full px-0.5', current ? 'font-semibold text-ink' : complete ? 'text-ink-2' : 'text-ink-3')}>
                {t(`tracker.stage.${s}`)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Plain-language deadline line: "5 days left …" / "11 days past …" / "Completed". */
export function DeadlineLine({ app, t, className }: { app: ApplicationRecord; t: (k: string, f?: string) => string; className?: string }) {
  if (isDone(app)) {
    return (
      <p className={cx('text-small font-semibold text-patti flex items-center gap-1.5', className)}>
        <Check size={16} weight="bold" /> {t('tracker.completed', 'Completed')}
      </p>
    );
  }
  if (app.slaDaysRemaining < 0) {
    return (
      <p className={cx('text-small font-semibold text-sindoor', className)}>
        <span className="num">{Math.abs(app.slaDaysRemaining)}</span> {t('tracker.daysOverdue', 'days past the official time limit')}
      </p>
    );
  }
  if (app.slaDaysRemaining === 0) {
    return <p className={cx('text-small font-semibold text-kesar', className)}>{t('tracker.dueToday', 'The official time limit ends today')}</p>;
  }
  return (
    <p className={cx('text-small text-ink-2', className)}>
      <span className="num font-semibold text-ink">{app.slaDaysRemaining}</span> {t('tracker.daysLeft', 'days left in the official time limit')}
    </p>
  );
}

export function statusSpeech(app: ApplicationRecord, t: (k: string, f?: string) => string, title: string) {
  if (needsAction(app)) return `${title} ${t('tracker.listen.action', 'needs your action.')} ${t('tracker.missing.title', '')}`;
  if (isOverdue(app)) return `${title} ${t('tracker.listen.late', 'is late. You can raise a complaint.')}`;
  if (isDone(app)) return `${title}. ${t('tracker.completed', 'Completed')}.`;
  return `${title} ${t('tracker.listen.onTrack', 'is on track. It is at step')} ${app.currentStage} ${t('tracker.listen.of4', 'of 4.')} ${app.slaDaysRemaining} ${t('tracker.daysLeft', '')}.`;
}
