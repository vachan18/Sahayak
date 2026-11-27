import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import {
  Camera,
  CloudArrowDown,
  ImageSquare,
  CheckCircle,
  Warning,
  Circle,
  ArrowRight,
  Lightbulb,
  ArrowClockwise,
  Confetti,
} from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import type { DocumentSpec, Scheme } from '../types';
import {
  PageHeader,
  Surface,
  Tag,
  Chip,
  Button,
  LinkButton,
  ProgressRing,
  ListenButton,
  toneTint,
  cx,
  spring,
  ease,
} from '../ui';
import { VisualDosAndDontsModal } from '../components/documents/VisualDosAndDontsModal';
import { DigiLockerSimulationModal } from '../components/documents/DigiLockerSimulationModal';
import { UploadConfirmationModal } from '../components/documents/UploadConfirmationModal';
import { collectPapers, paperInfo, paperState, PaperRow, PaperState, SampleKind } from '../components/documents/paperInfo';

const shortTitle = (s: Scheme, t: (k: string, f?: string) => string) => t(s.titleKey, s.titleKey).split('(')[0].trim();

const GROUPS: { state: PaperState; key: string; fallback: string; tone: 'sindoor' | 'neutral' | 'patti' }[] = [
  { state: 'attention', key: 'documents.group.attention', fallback: 'Needs a new photo', tone: 'sindoor' },
  { state: 'todo', key: 'documents.group.todo', fallback: 'Not started', tone: 'neutral' },
  { state: 'ready', key: 'documents.group.ready', fallback: 'Ready', tone: 'patti' },
];

/* ── One paper ────────────────────────────────────────────────────────────── */
function PaperCard({
  row,
  state,
  onScan,
  onDigiLocker,
  onExample,
}: {
  row: PaperRow;
  state: PaperState;
  onScan: () => void;
  onDigiLocker: () => void;
  onExample: () => void;
}) {
  const { t } = useTranslation();
  const { doc, schemes } = row;
  const info = paperInfo(doc.id);
  const Icon = info.icon;
  const name = t(doc.nameKey, doc.nameKey);
  const why = t(info.whyKey, info.why);
  const mistake = t(info.mistakeKey, info.mistake);

  return (
    <motion.li
      layout
      layoutId={`paper-${doc.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ layout: spring.gentle, duration: 0.3, ease: ease.out }}
      className={cx(
        'min-w-0 rounded-lg bg-surface p-5 flex flex-col',
        state === 'attention' ? 'shadow-[0_0_0_2px_rgb(var(--c-sindoor)/0.55)]' : 'shadow-hair'
      )}
    >
      <div className="flex items-start gap-4">
        <span className={cx('relative w-12 h-12 rounded-md grid place-items-center shrink-0', toneTint[info.tone])}>
          <Icon size={26} weight="duotone" />
          {state === 'ready' && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.bouncy} className="absolute -bottom-1 -end-1 rounded-full bg-surface">
              <CheckCircle size={22} weight="fill" className="text-patti" />
            </motion.span>
          )}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-snug">{name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {doc.isMandatory ? (
              <Tag tone="neutral" dot={false}>
                {t('documents.card.mustHave', 'Must have')}
              </Tag>
            ) : (
              <Tag tone="neutral" dot={false}>
                {t('documents.card.optional', 'Optional')}
              </Tag>
            )}
            {doc.digiLockerSupported && <Tag tone="neel">{t('documents.card.inDigiLocker', 'In DigiLocker')}</Tag>}
          </div>
        </div>
        <ListenButton variant="icon" text={`${name}. ${why} ${mistake}`} />
      </div>

      <p className="mt-4 text-ink-2">{why}</p>

      <p className="mt-3 flex gap-2 text-small text-ink-2">
        <Lightbulb size={18} weight="duotone" className="text-kesar shrink-0 mt-0.5" />
        <span>
          <span className="font-semibold text-ink">{t('documents.card.commonMistake', 'Common mistake')}: </span>
          {mistake}
        </span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-micro text-ink-3">
        <span>
          {t('documents.card.neededFor', 'Needed for')}: <span className="text-ink-2 font-medium">{schemes.map((s) => shortTitle(s, t)).join(' · ')}</span>
        </span>
        <span className="num">
          {doc.acceptableFormats.join(', ')} · {t('documents.card.upTo', 'up to')} {doc.maxSizeMb} MB
        </span>
      </div>

      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center gap-2">
        {state === 'ready' ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-small font-semibold text-patti me-auto">
              <CheckCircle size={20} weight="fill" />
              {t('documents.card.readyNote', 'Ready to submit')}
            </span>
            <Button variant="ghost" size="sm" onClick={onScan} iconStart={<ArrowClockwise size={18} />}>
              {t('documents.card.replace', 'Replace')}
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={onScan} iconStart={<Camera size={18} weight="fill" />}>
              {state === 'attention' ? t('documents.card.retake', 'Take a new photo') : t('documents.card.scan', 'Scan paper')}
            </Button>
            {doc.digiLockerSupported && (
              <Button variant="secondary" size="sm" onClick={onDigiLocker} iconStart={<CloudArrowDown size={18} />}>
                DigiLocker
              </Button>
            )}
            <Button variant="quiet" size="sm" onClick={onExample} iconStart={<ImageSquare size={18} />}>
              {t('documents.card.example', 'See example')}
            </Button>
          </>
        )}
      </div>
    </motion.li>
  );
}

/* ── Screen ───────────────────────────────────────────────────────────────── */
export const DocumentChecklistScreen = () => {
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();
  const { schemes, savedSchemeIds, applications, documentUploadStatus, setDocumentStatus, pushToast } = useAppStore();

  const selectedId = params.get('scheme') ?? 'mine';
  const mySchemeIds = useMemo(() => {
    const ids = new Set([...savedSchemeIds, ...applications.map((a) => a.schemeId)]);
    return schemes.filter((s) => ids.has(s.id)).map((s) => s.id);
  }, [schemes, savedSchemeIds, applications]);

  const activeSchemes = useMemo(() => {
    if (selectedId !== 'mine') {
      const s = schemes.find((x) => x.id === selectedId);
      return s ? [s] : schemes;
    }
    const mine = schemes.filter((s) => mySchemeIds.includes(s.id));
    return mine.length ? mine : schemes;
  }, [selectedId, schemes, mySchemeIds]);

  const rows = useMemo(() => collectPapers(activeSchemes), [activeSchemes]);
  const statusOf = (doc: DocumentSpec) => documentUploadStatus[doc.id] ?? doc.status ?? 'pending';
  const stateOf = (doc: DocumentSpec) => paperState(statusOf(doc));
  const readyCount = rows.filter((r) => stateOf(r.doc) === 'ready').length;
  const total = rows.length;
  const allReady = total > 0 && readyCount === total;

  const [guideKind, setGuideKind] = useState<SampleKind | null>(null);
  const [dlDocs, setDlDocs] = useState<DocumentSpec[] | null>(null);
  const [scanRow, setScanRow] = useState<PaperRow | null>(null);
  const [failedOnce, setFailedOnce] = useState<string[]>([]);

  const markReady = (ids: string[]) => {
    ids.forEach((id) => setDocumentStatus(id, 'verified'));
    const names = ids.map((id) => rows.find((r) => r.doc.id === id)?.doc.nameKey ?? id).map((n) => t(n, n).split('(')[0].trim());
    pushToast({ message: `${names.join(', ')} — ${t('documents.toast.ready', 'ready')}`, tone: 'success' });
  };

  const singleScheme = activeSchemes.length === 1 ? activeSchemes[0] : null;

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow={t('shell.nav.papers', 'Papers')}
        title={t('documents.title', 'Get your papers ready')}
        description={t('documents.subtitle', 'Most applications are turned back for one missing or blurry paper. Check each one here, at home, before you go.')}
        actions={
          <Surface padded="sm" className="w-full md:w-auto flex items-center gap-4 pe-6">
            <ProgressRing value={total ? (readyCount / total) * 100 : 0} size={72} stroke={7} tone={allReady ? 'patti' : 'haldi'} label={t('documents.readiness', 'Paper readiness')}>
              <span className="num font-semibold text-lead">
                {readyCount}/{total}
              </span>
            </ProgressRing>
            <div>
              <p className="font-semibold">{t('documents.readiness', 'Paper readiness')}</p>
              <p className="text-small text-ink-2">
                <span className="num">{readyCount}</span> {t('documents.readyOf', 'of')} <span className="num">{total}</span> {t('documents.readyLabel', 'ready')}
              </p>
            </div>
          </Surface>
        }
      />

      {/* Which scheme are we preparing for? */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex lg:flex-wrap gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-1 mb-6" role="group" aria-label={t('documents.filterLabel', 'Show papers for')}>
        <Chip selected={selectedId === 'mine'} onClick={() => setParams({})}>
          {t('documents.filterMine', 'My schemes')}
        </Chip>
        {schemes.map((s) => (
          <Chip key={s.id} selected={selectedId === s.id} onClick={() => setParams({ scheme: s.id })}>
            {shortTitle(s, t)}
          </Chip>
        ))}
      </div>

      {/* Two fast paths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        <button
          type="button"
          onClick={() => setDlDocs(rows.map((r) => r.doc))}
          className="group flex items-center gap-4 p-5 rounded-lg bg-neel-tint text-start hover:brightness-[0.98] active:scale-[0.99] transition-[filter,transform]"
        >
          <span className="w-12 h-12 rounded-md bg-surface grid place-items-center shrink-0 text-neel-ink">
            <CloudArrowDown size={26} weight="duotone" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold text-ink">{t('documents.tool.dlTitle', 'Fetch from DigiLocker')}</span>
            <span className="block text-small text-ink-2">{t('documents.tool.dlBody', 'Already verified by the government. Fastest way.')}</span>
          </span>
          <ArrowRight size={20} className="text-ink-2 flip-rtl transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          type="button"
          onClick={() => setGuideKind('passbook')}
          className="group flex items-center gap-4 p-5 rounded-lg bg-haldi-tint text-start hover:brightness-[0.98] active:scale-[0.99] transition-[filter,transform]"
        >
          <span className="w-12 h-12 rounded-md bg-surface grid place-items-center shrink-0 text-haldi-deep">
            <ImageSquare size={26} weight="duotone" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold text-ink">{t('documents.tool.guideTitle', 'See good and bad photos')}</span>
            <span className="block text-small text-ink-2">{t('documents.tool.guideBody', 'One look saves a second trip.')}</span>
          </span>
          <ArrowRight size={20} className="text-ink-2 flip-rtl transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <AnimatePresence>
        {allReady && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={spring.gentle}
            className="mb-10 rounded-xl bg-hero-patti text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5"
          >
            <Confetti size={44} weight="duotone" className="shrink-0" />
            <div className="flex-1">
              <h2 className="text-h3 font-semibold">{t('documents.allReady.title', 'All your papers are ready')}</h2>
              <p className="text-white/85 mt-1">{t('documents.allReady.body', 'You can apply now — on your own, or at a help centre with your slip.')}</p>
            </div>
            <LinkButton to={singleScheme ? `/guidance/${singleScheme.id}` : '/schemes'} iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
              {t('documents.allReady.cta', 'Apply now')}
            </LinkButton>
          </motion.div>
        )}
      </AnimatePresence>

      <LayoutGroup>
        <div className="space-y-10">
          {GROUPS.map((g) => {
            const groupRows = rows.filter((r) => stateOf(r.doc) === g.state);
            if (!groupRows.length) return null;
            const GroupIcon = g.state === 'ready' ? CheckCircle : g.state === 'attention' ? Warning : Circle;
            return (
              <motion.section layout="position" key={g.state} aria-labelledby={`grp-${g.state}`}>
                <h2 id={`grp-${g.state}`} className="flex items-center gap-2.5 text-h3 font-semibold mb-4">
                  <GroupIcon size={24} weight={g.state === 'todo' ? 'regular' : 'fill'} className={g.state === 'ready' ? 'text-patti' : g.state === 'attention' ? 'text-sindoor' : 'text-ink-3'} />
                  {t(g.key, g.fallback)}
                  <Tag tone={g.tone} dot={false} className="num">
                    {groupRows.length}
                  </Tag>
                </h2>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence initial={false}>
                    {groupRows.map((row) => (
                      <PaperCard
                        key={row.doc.id}
                        row={row}
                        state={g.state}
                        onScan={() => setScanRow(row)}
                        onDigiLocker={() => setDlDocs([row.doc])}
                        onExample={() => setGuideKind(paperInfo(row.doc.id).sample)}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            );
          })}
        </div>
      </LayoutGroup>

      {singleScheme && !allReady && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 p-5 rounded-lg bg-sunken">
          <p className="text-ink-2 max-w-lg">{t('documents.nextHint', 'Missing a paper? A help centre can often get it for you the same day.')}</p>
          <LinkButton to="/help-centres" variant="secondary" iconEnd={<ArrowRight size={18} weight="bold" className="flip-rtl" />}>
            {t('shell.nav.helpCentres', 'Help centres')}
          </LinkButton>
        </div>
      )}

      <VisualDosAndDontsModal isOpen={guideKind !== null} onClose={() => setGuideKind(null)} initialKind={guideKind ?? 'passbook'} />
      <DigiLockerSimulationModal isOpen={dlDocs !== null} onClose={() => setDlDocs(null)} documents={dlDocs ?? []} onCompleteVerification={markReady} />
      <UploadConfirmationModal
        isOpen={scanRow !== null}
        onClose={() => setScanRow(null)}
        documentId={scanRow?.doc.id ?? ''}
        documentName={scanRow ? t(scanRow.doc.nameKey, scanRow.doc.nameKey) : ''}
        sampleKind={scanRow ? paperInfo(scanRow.doc.id).sample : 'certificate'}
        failFirstAttempt={!!scanRow && scanRow.doc.id === 'bank_passbook' && !failedOnce.includes('bank_passbook')}
        onQualityFail={(id) => {
          setFailedOnce((f) => [...f, id]);
          setDocumentStatus(id, 'rejected');
        }}
        onConfirmUpload={(id) => markReady([id])}
      />
    </div>
  );
};

export default DocumentChecklistScreen;
