import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Copy, ShareNetwork, Warning, Clock, Buildings, UserCircle, HandCoins, NotePencil, FileText, Lock, CheckCircle } from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import type { ApplicationRecord } from '../types';
import { GrievanceGuidanceModal } from '../components/support/GrievanceGuidanceModal';
import { DeadlineLine, needsAction, isOverdue, isDone, statusSpeech, StageThread } from '../components/tracker/appStatus';
import { shareText } from '../lib/share';
import { haptic } from '../lib/haptics';
import { Tag, ListenButton, LifeGlyph, Button, LinkButton, IconButton, TextArea, Disclosure, EmptyState, formatINR, cx, ease, riseIn, staggerParent } from '../ui';

type T = (k: string, f?: string) => string;

/* ── Timeline that draws itself ─────────────────────────────────────────── */
function Timeline({ app, t }: { app: ApplicationRecord; t: T }) {
  const done = isDone(app);
  const blocked = needsAction(app) || isOverdue(app);
  const ms = [...app.milestones].sort((a, b) => a.stage - b.stage);
  const reached = done ? ms.length : app.currentStage;
  const progress = ms.length > 1 ? (reached - 1) / (ms.length - 1) : 1;

  return (
    <motion.ol variants={staggerParent(0.09, 0.15)} initial="hidden" animate="show" className="relative">
      {/* rail */}
      <span className="absolute start-[19px] top-5 bottom-5 w-[3px] rounded-full bg-sunken" aria-hidden />
      <motion.span
        aria-hidden
        className={cx('absolute start-[19px] top-5 w-[3px] rounded-full origin-top', done ? 'bg-patti' : 'bg-neel')}
        style={{ height: 'calc(100% - 40px)' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress }}
        transition={{ duration: 1.1, ease: ease.out, delay: 0.2 }}
      />
      {ms.map((m) => {
        const complete = done || m.isCompleted || m.stage < app.currentStage;
        const current = !done && m.stage === app.currentStage;
        return (
          <motion.li key={m.stage} variants={riseIn} className="relative flex gap-4 pb-7 last:pb-0">
            <span
              className={cx(
                'relative z-10 w-10 h-10 shrink-0 rounded-full grid place-items-center ring-4 ring-surface',
                complete && (done ? 'bg-patti text-white' : 'bg-neel text-on-neel'),
                current && (blocked ? 'bg-sindoor text-white' : 'bg-ink text-paper'),
                !complete && !current && 'bg-sunken text-ink-3'
              )}
            >
              {current && !blocked && <span className="absolute inset-0 rounded-full bg-ink/25 animate-ring-out" aria-hidden />}
              {complete ? <Check size={18} weight="bold" /> : current && blocked ? <Warning size={18} weight="fill" /> : <span className="num font-semibold">{m.stage}</span>}
            </span>
            <div className={cx('flex-1 min-w-0 pt-1.5', current && 'pb-1')}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className={cx('font-semibold', !complete && !current && 'text-ink-3')}>{t(`tracker.stage.${m.stage}`)}</h3>
                {m.date && (
                  <span className={cx('text-small num', current && blocked ? 'text-sindoor font-semibold' : 'text-ink-3')}>
                    {m.date}
                    {m.timestamp ? ` · ${m.timestamp}` : ''}
                  </span>
                )}
                {!complete && !current && !m.date && <span className="text-small text-ink-3">{t('tracker.detail.pending', 'Waiting')}</span>}
              </div>
              <p className={cx('text-small mt-0.5', complete || current ? 'text-ink-2' : 'text-ink-3')}>{t(m.titleKey, m.titleKey)}</p>
              {(complete || current) && m.handlingOfficer && (
                <p className="mt-2 flex items-start gap-1.5 text-small text-ink-2">
                  <UserCircle size={16} className="shrink-0 mt-1" />
                  <span className="min-w-0">
                    {t('tracker.detail.handledBy', 'Handled by')}: <span className="font-medium text-ink">{t(m.handlingOfficer, m.handlingOfficer)}</span>
                  </span>
                </p>
              )}
              {current && m.remarksKey && (
                <div className={cx('mt-3 p-3 rounded-md text-small', blocked ? 'bg-sindoor-tint' : 'bg-neel-tint')}>
                  <p className={cx('font-semibold', blocked ? 'text-sindoor' : 'text-neel-ink')}>{t('tracker.detail.officeNote', 'Note from the office')}</p>
                  <p className="text-ink mt-0.5">{t(m.remarksKey, m.remarksKey)}</p>
                </div>
              )}
              {m.description && (complete || current) && <p className="mt-2 text-micro text-ink-3">{t(m.description, m.description)}</p>}
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

/* ── Screen ─────────────────────────────────────────────────────────────── */
export const ApplicationTrackerDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { applications, schemes, addCitizenNote, resolveMissingDocument, pushToast } = useAppStore();
  const [grievanceOpen, setGrievanceOpen] = useState(false);
  const [note, setNote] = useState('');

  const app = applications.find((a) => a.id === id);
  if (!app) {
    return (
      <div className="pt-10">
        <EmptyState icon={<FileText size={30} weight="duotone" />} title={t('tracker.detail.notFound', 'We could not find this application.')} action={<LinkButton to="/tracker" variant="secondary">{t('tracker.detail.back', 'Back to all applications')}</LinkButton>} />
      </div>
    );
  }

  const scheme = schemes.find((s) => s.id === app.schemeId);
  const title = scheme ? t(scheme.titleKey, app.schemeTitle) : app.schemeTitle;
  const done = isDone(app);
  const late = isOverdue(app);
  const action = needsAction(app);
  const current = app.milestones.find((m) => m.stage === app.currentStage);
  const nextMilestone = app.milestones.find((m) => m.stage === app.currentStage + 1);
  const missing = app.missingDocuments ?? [];
  const money = app.disbursementDetails;

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* blocked */
    }
    haptic('success');
    pushToast({ message: msg, tone: 'success' });
  };

  const saveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    addCitizenNote(app.id, note.trim());
    setNote('');
    haptic('success');
    pushToast({ message: t('tracker.notes.saved', 'Note saved'), tone: 'success' });
  };

  const share = async () => {
    const res = await shareText({
      title: t('tracker.detail.shareText', 'My application status on Sahayak'),
      text: `${title}\n${t('tracker.token', 'Token')}: ${app.tokenNumber}\n${t('tracker.step', 'Step')} ${app.currentStage}/4 — ${t(`tracker.stage.${app.currentStage}`)}`,
    });
    if (res === 'copied') pushToast({ message: t('shell.toast.copied', 'Copied'), tone: 'success' });
  };

  const missingSection = (hid: string) => (
            <section aria-labelledby={hid} className="rounded-lg bg-surface shadow-hair overflow-hidden">
              <h2 id={hid} className="px-5 pt-5 font-semibold flex items-center gap-2">
                <FileText size={20} weight="duotone" className="text-sindoor" />
                {t('tracker.missing.title', 'The office needs a paper from you')}
              </h2>
              <ul className="p-5 space-y-4">
                {missing.map((d) => (
                  <motion.li key={d.documentId} layout className={cx('rounded-md p-4', d.resolved ? 'bg-patti-tint' : 'bg-sindoor-tint')}>
                    <p className="font-semibold">{t(d.documentName, d.documentName)}</p>
                    <p className="text-small text-ink-2 mt-1">{t(d.reason, d.reason)}</p>
                    <p className="text-micro text-ink-3 mt-2">
                      {t('tracker.missing.requestedBy', 'Asked by')}: {t(d.requestedBy, d.requestedBy)}
                    </p>
                    {!d.resolved && (
                      <>
                        <p className="text-small mt-3">
                          <span className="font-semibold">{t('tracker.missing.how', 'How to send it')}:</span> {t(d.actionRequired, d.actionRequired)}
                        </p>
                        <div className="mt-4 grid grid-cols-1 gap-2">
                          <Button
                            variant="primary"
                            iconStart={<CheckCircle size={20} weight="fill" />}
                            onClick={() => {
                              resolveMissingDocument(app.id, d.documentId);
                              haptic('success');
                              pushToast({ message: t('tracker.missing.resolved', 'Marked as submitted. The office will now continue.'), tone: 'success' });
                            }}
                          >
                            {t('tracker.missing.done', 'I have submitted it')}
                          </Button>
                          <LinkButton to="/documents" variant="ghost" size="sm">
                            {t('tracker.missing.prepare', 'Prepare this paper')}
                          </LinkButton>
                        </div>
                      </>
                    )}
                    {d.resolved && (
                      <p className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-patti">
                        <Check size={16} weight="bold" /> {t('tracker.missing.submitted', 'Submitted')}
                      </p>
                    )}
                  </motion.li>
                ))}
              </ul>
            </section>
  );

  return (
    <div className="pb-4">
      <Link to="/tracker" className="hidden lg:inline-flex items-center gap-1.5 h-10 mb-2 text-small font-semibold text-ink-2 hover:text-ink">
        <ArrowLeft size={16} weight="bold" className="flip-rtl" /> {t('tracker.detail.back', 'Back to all applications')}
      </Link>

      {/* Hero */}
      <motion.header variants={staggerParent(0.06)} initial="hidden" animate="show" className="pt-2 pb-6">
        <motion.div variants={riseIn} className="flex items-start gap-4">
          <LifeGlyph id={scheme?.lifeEventId} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              {action ? (
                <Tag tone="sindoor" icon={<Warning size={14} weight="fill" />}>{t('tracker.actionNeeded', 'Needs your action')}</Tag>
              ) : late ? (
                <Tag tone="sindoor">{t('tracker.overdue', 'Late')}</Tag>
              ) : done ? (
                <Tag tone="patti">{t('tracker.done', 'Done')}</Tag>
              ) : (
                <Tag tone="neel">{t('tracker.onTrack', 'On track')}</Tag>
              )}
            </div>
            <h1 className="text-h1 font-semibold">{title}</h1>
            <button type="button" onClick={() => copy(app.tokenNumber, t('shell.toast.copied', 'Copied'))} className="mt-2 inline-flex items-center gap-2 h-9 px-3 -ms-3 rounded-sm text-small text-ink-2 hover:bg-sunken" aria-label={t('tracker.detail.copyToken', 'Copy token number')}>
              {t('tracker.token', 'Token')} <span className="num font-semibold text-ink">{app.tokenNumber}</span>
              <Copy size={16} />
            </button>
          </div>
        </motion.div>
        <motion.div variants={riseIn} className="mt-4 flex flex-wrap gap-2">
          <ListenButton text={`${statusSpeech(app, t, title)} ${t(app.audioStatusNarrationKey, '')}`} />
          <Button variant="secondary" size="sm" iconStart={<ShareNetwork size={18} />} onClick={share} className="!rounded-full">
            {t('tracker.detail.share', 'Share status')}
          </Button>
        </motion.div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start">
        <div className="min-w-0 space-y-6">
          {/* Where it is now */}
          <section aria-labelledby="now" className={cx('rounded-xl p-6 md:p-7', done ? 'bg-hero-patti text-white' : 'bg-surface shadow-hair')}>
            <p id="now" className={cx('text-small font-semibold', done ? 'text-white/80' : 'text-ink-3')}>
              {t('tracker.detail.whereNow', 'Where it is now')}
            </p>
            <p className="mt-1 text-h2 font-semibold">
              {done ? t('tracker.completed', 'Completed') : t(`tracker.stage.${app.currentStage}`)}
              {!done && <span className="ms-2 text-lead font-medium text-ink-3 num">{app.currentStage}/4</span>}
            </p>
            {!done && <StageThread app={app} t={t} className="mt-5" />}
            <div className={cx('mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t', done ? 'border-white/20' : 'border-line')}>
              <div>
                <p className={cx('text-small font-semibold flex items-center gap-1.5', done ? 'text-white/80' : 'text-ink-3')}>
                  <Clock size={16} /> {t('tracker.detail.whatNext', 'What happens next')}
                </p>
                <p className="mt-1">{t(`tracker.next.${done ? 4 : app.currentStage}`)}</p>
                {!done && nextMilestone?.date && (
                  <p className="mt-1 text-small text-ink-2">
                    {t('tracker.detail.expected', 'Expected')}: <span className="num">{nextMilestone.date.replace(/^Expected by\s*/i, '')}</span>
                  </p>
                )}
              </div>
              <div>
                <p className={cx('text-small font-semibold flex items-center gap-1.5', done ? 'text-white/80' : 'text-ink-3')}>
                  <Buildings size={16} /> {t('tracker.detail.office', 'Office')}
                </p>
                <p className="mt-1">{t(app.handlingOffice, app.handlingOffice)}</p>
                {current?.handlingOfficer && !done && <p className="mt-1 text-small text-ink-2">{t(current.handlingOfficer, current.handlingOfficer)}</p>}
              </div>
            </div>
            {!done && (
              <div className="mt-5 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <DeadlineLine app={app} t={t} />
                <span className="text-small text-ink-3">
                  {t('tracker.detail.timeLimit', 'Official time limit')}: <span className="num">{app.slaDeadlineDays}</span> {t('tracker.detail.days', 'days')}
                </span>
              </div>
            )}
          </section>

          {missing.length > 0 && <div className="lg:hidden">{missingSection('missing-m')}</div>}

          {late && (
            <section aria-labelledby="late" className="rounded-lg bg-sindoor-tint p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <Warning size={32} weight="duotone" className="text-sindoor shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 id="late" className="font-semibold text-sindoor">
                  {t('tracker.detail.lateTitle', 'This application is late')}
                </h2>
                <p className="text-small text-ink mt-0.5">{t('tracker.detail.lateBody')}</p>
              </div>
              <Button variant="danger" onClick={() => setGrievanceOpen(true)}>
                {t('tracker.complain', 'Raise a complaint')}
              </Button>
            </section>
          )}

          <section aria-labelledby="timeline" className="rounded-xl bg-surface shadow-hair p-6 md:p-7">
            <h2 id="timeline" className="text-h3 font-semibold mb-6">
              {t('tracker.detail.timeline', 'Step by step')}
            </h2>
            <Timeline app={app} t={t} />
          </section>

          {/* Notes journal */}
          <section aria-labelledby="notes" className="rounded-xl bg-surface shadow-hair p-6 md:p-7">
            <div className="flex items-start gap-3">
              <NotePencil size={26} weight="duotone" className="text-neel shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h2 id="notes" className="text-h3 font-semibold">
                  {t('tracker.notes.title', 'My notes')}
                </h2>
                <p className="text-small text-ink-2">{t('tracker.notes.subtitle')}</p>
              </div>
            </div>
            <form onSubmit={saveNote} className="mt-5 space-y-3">
              <TextArea label={t('tracker.notes.label', 'Add a note')} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('tracker.notes.placeholder')} className="min-h-[96px]" hint={t('tracker.notes.private', 'Only you can see these notes.')} />
              <Button type="submit" variant="solid" size="sm" disabled={!note.trim()}>
                {t('tracker.notes.add', 'Save note')}
              </Button>
            </form>
            <ol className="mt-6 space-y-3">
              <AnimatePresence initial={false}>
                {(app.citizenNotes ?? []).map((n) => (
                  <motion.li key={n.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ps-4 border-s-2 border-line-strong">
                    <p className="text-micro text-ink-3 num">{n.createdAt}</p>
                    <p className="text-small mt-0.5">{n.text}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
              {(app.citizenNotes ?? []).length === 0 && <li className="text-small text-ink-3">{t('tracker.notes.empty', 'No notes yet.')}</li>}
            </ol>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[calc(var(--topbar-h)+16px)]">
          {missing.length > 0 && <div className="hidden lg:block">{missingSection('missing-d')}</div>}

          {money && (
            <section aria-labelledby="money" className="rounded-lg bg-surface shadow-hair p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 id="money" className="font-semibold flex items-center gap-2">
                  <HandCoins size={20} weight="duotone" className="text-patti" />
                  {t('tracker.money.title', 'Money and benefit')}
                </h2>
                <Tag tone={money.status === 'credited' ? 'patti' : 'neutral'}>{money.status === 'credited' ? t('tracker.money.credited', 'Credited') : t('tracker.money.pending', 'Not sent yet')}</Tag>
              </div>
              <p className={cx('mt-4 text-[2.5rem] leading-none font-semibold num-display', money.status === 'credited' ? 'text-patti' : 'text-ink')}>₹{formatINR(money.amount)}</p>
              <dl className="mt-4 space-y-2 text-small">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-3">{t('tracker.money.account', 'Paid to')}</dt>
                  <dd className="font-medium num text-end min-w-0 break-words">{money.accountMasked}</dd>
                </div>
                {money.disbursedDate && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-3">{t('tracker.money.date', 'Date')}</dt>
                    <dd className="font-medium num">{money.disbursedDate}</dd>
                  </div>
                )}
                {money.utrNumber && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-3">{t('tracker.money.ref', 'Payment reference')}</dt>
                    <dd className="flex items-center gap-1 min-w-0">
                      <span className="font-medium num truncate">{money.utrNumber}</span>
                      <IconButton size="sm" label={t('tracker.money.ref', 'Payment reference')} onClick={() => copy(money.utrNumber!, t('tracker.money.copied', 'Reference copied'))}>
                        <Copy size={18} />
                      </IconButton>
                    </dd>
                  </div>
                )}
              </dl>
              {money.status !== 'credited' && <p className="mt-3 text-micro text-ink-3">{t('tracker.money.pendingBody')}</p>}
            </section>
          )}

          {(app.pendingActions ?? []).length > 0 && (
            <Disclosure summary={t('tracker.detail.todo', 'Things to keep in mind')} defaultOpen={!action}>
              <ul className="space-y-2 text-small">
                {app.pendingActions!.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check size={16} weight="bold" className="text-patti shrink-0 mt-1" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>
          )}

          {!late && (
            <button type="button" onClick={() => setGrievanceOpen(true)} className="w-full flex items-center gap-3 p-4 rounded-lg bg-haldi-tint text-start hover:brightness-[0.98]">
              <Lock size={22} weight="duotone" className="text-haldi-deep shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block font-semibold">{t('tracker.help.title', 'Something wrong?')}</span>
                <span className="block text-small text-ink-2">{t('tracker.complain', 'Raise a complaint')}</span>
              </span>
            </button>
          )}
        </aside>
      </div>

      <GrievanceGuidanceModal isOpen={grievanceOpen} onClose={() => setGrievanceOpen(false)} application={app} initialPath={late ? 'late' : undefined} />
    </div>
  );
};

export default ApplicationTrackerDetailScreen;
