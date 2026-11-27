import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Scales, X, ArrowRight } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { LifeGlyph } from '../../ui/domain';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { formatINR } from '../../ui/Feedback';
import { spring, ease } from '../../ui/motion';
import { benefitHeadline, cscCap, useCatalog } from './catalog';

/**
 * Compare tray.
 * Floats above the phone dock (and bottom-centre on desktop) once a scheme is added to compare.
 * Opens a side-by-side sheet so a family can weigh money, cost, time and paperwork at a glance.
 */
export const SchemeComparisonTray: React.FC = () => {
  const { t } = useTranslation();
  const { compareSchemeIds, toggleCompareScheme, clearCompareSchemes } = useAppStore();
  const catalog = useCatalog();
  const [open, setOpen] = useState(false);
  const selected = compareSchemeIds.map((id) => catalog.find((s) => s.id === id)).filter(Boolean) as typeof catalog;

  const rows: { key: string; label: string; render: (s: (typeof catalog)[number]) => React.ReactNode }[] = [
    {
      key: 'benefit',
      label: t('schemes.compare.benefit', 'You get'),
      render: (s) => {
        const h = benefitHeadline(s, t);
        return (
          <>
            {h.prefix && <span className="block text-micro text-ink-3">{h.prefix}</span>}
            <span className="block text-h3 font-semibold num-display">₹{formatINR(h.amount)}</span>
            <span className="block text-micro text-ink-2">{h.unit}</span>
          </>
        );
      },
    },
    { key: 'kind', label: t('schemes.compare.kind', 'Type of help'), render: (s) => benefitHeadline(s, t).kindLabel },
    { key: 'fee', label: t('schemes.detail.govFee', 'Government fee'), render: () => <span className="num font-semibold text-patti">₹0</span> },
    { key: 'csc', label: t('schemes.detail.cscCap', 'Most a CSC can charge'), render: (s) => <span className="num font-semibold">₹{cscCap(s)}</span> },
    {
      key: 'time',
      label: t('schemes.detail.timeLimit', 'Time to decide'),
      render: (s) => (
        <span>
          <span className="num font-semibold">{s.processingSlaDays}</span> {t('schemes.detail.days', 'days')}
        </span>
      ),
    },
    {
      key: 'papers',
      label: t('schemes.compare.papers', 'Papers needed'),
      render: (s) => (
        <ul className="space-y-1">
          {s.documents
            .filter((d) => d.isMandatory)
            .map((d) => (
              <li key={d.id} className="text-small">
                {t(d.nameKey, d.nameKey)}
              </li>
            ))}
        </ul>
      ),
    },
    { key: 'office', label: t('schemes.compare.office', 'Office'), render: (s) => <span className="text-small">{t(s.handlingAuthorityKey, s.handlingAuthorityKey)}</span> },
  ];

  return (
    <>
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: spring.gentle }}
            exit={{ y: 120, opacity: 0, transition: { duration: 0.2, ease: ease.in } }}
            className="fixed z-30 inset-x-3 bottom-[calc(var(--dock-h)+var(--safe-b)+12px)] lg:bottom-6 lg:start-[calc(var(--rail-w)+24px)] lg:end-6 flex justify-center pointer-events-none no-print"
          >
            <div className="pointer-events-auto w-full max-w-xl flex items-center gap-3 ps-3 pe-2 py-2 rounded-lg bg-ink text-paper shadow-float">
              <div className="flex -space-x-2 rtl:space-x-reverse shrink-0">
                <AnimatePresence initial={false}>
                  {selected.map((s) => (
                    <motion.span key={s.id} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="rounded-sm ring-2 ring-ink">
                      <LifeGlyph id={s.lifeEventId} size="sm" />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <p className="flex-1 min-w-0 text-small">
                <span className="num font-semibold">{selected.length}</span>/3 <span className="opacity-75 hidden xs:inline">· {selected.length < 2 ? t('schemes.compare.addMore', 'Add one more scheme to compare') : t('schemes.compare.title', 'Compare schemes')}</span>
              </p>
              <button type="button" onClick={clearCompareSchemes} className="h-11 px-3 rounded-sm text-small font-semibold opacity-80 hover:opacity-100 hover:bg-white/10 dark:hover:bg-black/10">
                {t('schemes.compare.clear', 'Clear')}
              </button>
              <Button size="sm" onClick={() => setOpen(true)} disabled={selected.length < 2} iconStart={<Scales size={18} weight="bold" />} className="h-11">
                {t('schemes.compare.open', 'Compare')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={open && selected.length > 0} onClose={() => setOpen(false)} title={t('schemes.compare.title', 'Compare schemes')} closeLabel={t('navClose', 'Close')} size="lg">
        <div className="-mx-5 md:mx-0 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0 text-start">
            <thead>
              <tr>
                <th scope="col" className="w-36 sticky start-0 bg-surface" />
                {selected.map((s) => (
                  <th key={s.id} scope="col" className="align-top text-start p-3 min-w-[150px]">
                    <div className="flex items-start justify-between gap-2">
                      <LifeGlyph id={s.lifeEventId} size="sm" />
                      <button type="button" onClick={() => toggleCompareScheme(s.id)} aria-label={`${t('schemes.compare.remove', 'Remove from compare')}: ${t(s.titleKey, s.titleKey)}`} className="w-9 h-9 -me-2 -mt-1 rounded-full grid place-items-center text-ink-3 hover:bg-sunken">
                        <X size={16} weight="bold" />
                      </button>
                    </div>
                    <Link to={`/schemes/${s.id}`} onClick={() => setOpen(false)} className="mt-2 block font-semibold leading-snug hover:underline underline-offset-4">
                      {t(s.titleKey, s.titleKey)}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <th scope="row" className="sticky start-0 bg-surface text-start align-top p-3 text-small font-medium text-ink-3 border-t border-line">
                    {r.label}
                  </th>
                  {selected.map((s) => (
                    <td key={s.id} className="align-top p-3 border-t border-line text-ink">
                      {r.render(s)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="sticky start-0 bg-surface" />
                {selected.map((s) => (
                  <td key={s.id} className="p-3">
                    <Link to={`/schemes/${s.id}`} onClick={() => setOpen(false)} className="inline-flex items-center gap-1 h-10 text-small font-semibold text-neel-ink">
                      {t('schemes.card.details', 'See details')}
                      <ArrowRight size={16} weight="bold" className="flip-rtl" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Sheet>
    </>
  );
};

export default SchemeComparisonTray;
