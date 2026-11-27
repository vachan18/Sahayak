import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Warning, Path, HandCoins, Clock, Storefront, UserCircle } from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import type { ApplicationRecord } from '../types';
import { GrievanceGuidanceModal, GrievancePath } from '../components/support/GrievanceGuidanceModal';
import { StageThread, DeadlineLine, matchesFilter, priority, needsAction, isOverdue, isDone, appTone, statusSpeech, AppFilter } from '../components/tracker/appStatus';
import { PageHeader, Segmented, Tag, ListenButton, LifeGlyph, EmptyState, LinkButton, Button, cx, ease } from '../ui';

function AppCard({ app, onComplain, index }: { app: ApplicationRecord; onComplain: (a: ApplicationRecord) => void; index: number }) {
  const { t } = useTranslation();
  const { schemes } = useAppStore();
  const scheme = schemes.find((s) => s.id === app.schemeId);
  const title = scheme ? t(scheme.titleKey, app.schemeTitle) : app.schemeTitle;
  const action = needsAction(app);
  const late = isOverdue(app);
  const done = isDone(app);
  const tone = appTone(app);
  const openDoc = (app.missingDocuments ?? []).find((d) => !d.resolved);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: ease.out, delay: index * 0.05 } }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.14 } }}
      className="relative rounded-lg bg-surface shadow-hair overflow-hidden"
    >
      {(action || late) && <span className={cx('absolute inset-y-0 start-0 w-1', tone === 'sindoor' ? 'bg-sindoor' : 'bg-kesar')} aria-hidden />}
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <LifeGlyph id={scheme?.lifeEventId} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
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
            <h2 className="text-h3 font-semibold leading-snug">
              <Link to={`/tracker/${app.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                {title}
              </Link>
            </h2>
            <p className="mt-1 text-small text-ink-3 flex flex-wrap gap-x-3 gap-y-0.5">
              <span>
                {t('tracker.token', 'Token')} <span className="num text-ink-2">{app.tokenNumber}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                {app.submittedVia === 'csc_assisted' ? <Storefront size={14} /> : <UserCircle size={14} />}
                {t('tracker.submittedOn', 'Submitted')} {app.submittedAt} · {app.submittedVia === 'csc_assisted' ? t('tracker.via.csc', 'at a help centre') : t('tracker.via.self', 'on your own')}
              </span>
            </p>
          </div>
        </div>

        <StageThread app={app} t={t} className="mt-6" />

        {openDoc && (
          <div className="mt-5 p-4 rounded-md bg-sindoor-tint">
            <p className="text-small font-semibold text-sindoor">{t('tracker.missing.title', 'The office needs a paper from you')}</p>
            <p className="text-small text-ink mt-0.5">{t(openDoc.documentName, openDoc.documentName)}</p>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center gap-3">
          <DeadlineLine app={app} t={t} className="flex-1 min-w-[12rem]" />
          <div className="relative z-10 flex items-center gap-2 ms-auto">
            <ListenButton variant="icon" text={statusSpeech(app, t, title)} />
            {late && (
              <Button variant="secondary" size="sm" onClick={() => onComplain(app)}>
                {t('tracker.complain', 'Raise a complaint')}
              </Button>
            )}
            <LinkButton to={`/tracker/${app.id}`} variant={action ? 'primary' : 'quiet'} size="sm" iconEnd={<ArrowRight size={16} weight="bold" className="flip-rtl" />}>
              {t('tracker.open', 'Open')}
            </LinkButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export const ApplicationTrackerScreen: React.FC = () => {
  const { t } = useTranslation();
  const { applications } = useAppStore();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<AppFilter>('all');
  const [grievance, setGrievance] = useState<{ open: boolean; app?: ApplicationRecord; path?: GrievancePath }>({ open: false });

  // Deep link from Home: /tracker?report=fee opens straight onto the overcharge path
  useEffect(() => {
    const report = params.get('report');
    if (report === 'fee' || report === 'late') {
      setGrievance({ open: true, path: report });
    }
  }, [params]);

  const closeGrievance = () => {
    setGrievance((g) => ({ ...g, open: false }));
    if (params.get('report')) {
      const next = new URLSearchParams(params);
      next.delete('report');
      setParams(next, { replace: true });
    }
  };

  const sorted = useMemo(() => [...applications].sort((a, b) => priority(a) - priority(b)), [applications]);
  const visible = sorted.filter((a) => matchesFilter(a, filter));
  const counts: Record<AppFilter, number> = {
    all: applications.length,
    action: applications.filter((a) => matchesFilter(a, 'action')).length,
    progress: applications.filter((a) => matchesFilter(a, 'progress')).length,
    done: applications.filter((a) => matchesFilter(a, 'done')).length,
  };

  const filterLabel = (k: AppFilter, fallback: string) => (
    <span className="inline-flex items-center gap-1.5">
      {t(`tracker.filter.${k}`, fallback)}
      {counts[k] > 0 && <span className={cx('num text-micro', k === 'action' ? 'text-sindoor font-semibold' : 'text-ink-3')}>{counts[k]}</span>}
    </span>
  );

  return (
    <div>
      <PageHeader eyebrow={t('tracker.eyebrow', 'Your applications')} title={t('tracker.title', 'Where is my application?')} description={t('tracker.subtitle')} />

      {applications.length === 0 ? (
        <EmptyState icon={<Path size={30} weight="duotone" />} title={t('tracker.empty.title', 'No applications yet')} body={t('tracker.empty.body')} action={<LinkButton to="/schemes">{t('tracker.empty.cta', 'Find a scheme')}</LinkButton>} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
          <div className="min-w-0">
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar mb-5">
              <Segmented
                value={filter}
                onChange={setFilter}
                label={t('tracker.filter.label', 'Show applications')}
                layoutKey="tracker-filter"
                className="min-w-max sm:min-w-0"
                options={[
                  { value: 'all', label: filterLabel('all', 'All') },
                  { value: 'action', label: filterLabel('action', 'Needs action') },
                  { value: 'progress', label: filterLabel('progress', 'In progress') },
                  { value: 'done', label: filterLabel('done', 'Done') },
                ]}
              />
            </div>

            <motion.div layout className="grid grid-cols-1 gap-4">
              <AnimatePresence initial={false}>
                {visible.map((a, i) => (
                  <AppCard key={a.id} app={a} index={i} onComplain={(app) => setGrievance({ open: true, app, path: 'late' })} />
                ))}
              </AnimatePresence>
              {visible.length === 0 && <p className="py-10 text-center text-ink-2 rounded-lg border border-dashed border-line-strong">{t('tracker.filterEmpty', 'Nothing here right now.')}</p>}
            </motion.div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[calc(var(--topbar-h)+16px)]">
            <div className="rounded-lg bg-surface shadow-hair p-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[2.25rem] leading-none font-semibold num-display">{applications.length}</p>
                <p className="mt-1 text-small text-ink-2">{t('tracker.summary.count', 'applications')}</p>
              </div>
              <div>
                <p className={cx('text-[2.25rem] leading-none font-semibold num-display', counts.action ? 'text-sindoor' : 'text-patti')}>{counts.action}</p>
                <p className="mt-1 text-small text-ink-2">{t('tracker.summary.actions', 'need your action')}</p>
              </div>
            </div>

            <div className="rounded-lg bg-haldi-tint p-5">
              <h2 className="text-h3 font-semibold">{t('tracker.help.title', 'Something wrong?')}</h2>
              <p className="mt-1.5 text-small text-ink-2">{t('tracker.help.body')}</p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {[
                  { icon: <Clock size={22} weight="duotone" />, label: t('tracker.g.pathLate', 'My application is late'), run: () => setGrievance({ open: true, path: 'late', app: sorted.find(isOverdue) }) },
                  { icon: <HandCoins size={22} weight="duotone" />, label: t('tracker.reportFee', 'Someone asked me for money'), run: () => setGrievance({ open: true, path: 'fee' }) },
                ].map((b) => (
                  <motion.button key={b.label} type="button" whileTap={{ scale: 0.98 }} onClick={b.run} className="flex items-center gap-3 min-h-[52px] px-4 py-3 rounded-md bg-surface shadow-hair hover:shadow-lift transition-shadow text-start font-semibold">
                    <span className="text-haldi-deep shrink-0">{b.icon}</span>
                    <span className="flex-1 min-w-0">{b.label}</span>
                    <ArrowRight size={16} weight="bold" className="text-ink-3 flip-rtl shrink-0" />
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      <GrievanceGuidanceModal isOpen={grievance.open} onClose={closeGrievance} application={grievance.app} initialPath={grievance.path} />
    </div>
  );
};

export default ApplicationTrackerScreen;
