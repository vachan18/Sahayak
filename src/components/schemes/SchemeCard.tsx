import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookmarkSimple, Scales, Clock, Files, ArrowRight, ShieldCheck, Check } from '@phosphor-icons/react';
import type { Scheme } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { haptic } from '../../lib/haptics';
import { LifeGlyph, lifeEventOf } from '../../ui/domain';
import { ListenButton } from '../../ui/ListenButton';
import { formatINR } from '../../ui/Feedback';
import { toneText } from '../../ui/Surface';
import { cx } from '../../ui/cx';
import { pressSoft } from '../../ui/motion';
import { benefitHeadline, isStateScheme, schemeSpokenSummary } from './catalog';

interface SchemeCardProps {
  scheme: Scheme;
  /** 'compact' = a single dense row for lists and trays */
  variant?: 'default' | 'compact';
  className?: string;
}

/** Save + compare toggles shared by card variants. Save confirms with an Undo toast. */
export function useSchemeActions(scheme: Scheme) {
  const { t } = useTranslation();
  const { savedSchemeIds, toggleSaveScheme, compareSchemeIds, toggleCompareScheme, pushToast } = useAppStore();
  const isSaved = savedSchemeIds.includes(scheme.id);
  const isCompared = compareSchemeIds.includes(scheme.id);

  const toggleSave = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    haptic(isSaved ? 'tap' : 'success');
    toggleSaveScheme(scheme.id);
    pushToast({
      message: isSaved ? t('shell.toast.unsaved', 'Removed from saved') : t('shell.toast.saved', 'Saved. Find it any time on your Home screen.'),
      tone: isSaved ? 'neutral' : 'success',
      actionLabel: t('shell.toast.undo', 'Undo'),
      onAction: () => useAppStore.getState().toggleSaveScheme(scheme.id),
    });
  };

  const toggleCompare = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!isCompared && compareSchemeIds.length >= 3) {
      haptic('warning');
      pushToast({ message: t('schemes.card.compareFull', 'You can compare up to 3 schemes at a time'), tone: 'warning' });
      return;
    }
    haptic('select');
    toggleCompareScheme(scheme.id);
  };

  return { isSaved, isCompared, toggleSave, toggleCompare };
}

function ToggleIcon({ active, label, activeLabel, onClick, children, activeClass }: { active: boolean; label: string; activeLabel: string; onClick: (e: React.MouseEvent) => void; children: React.ReactNode; activeClass: string }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.86 }}
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? activeLabel : label}
      title={active ? activeLabel : label}
      className={cx('relative z-10 w-11 h-11 rounded-full grid place-items-center transition-colors duration-short', active ? activeClass : 'text-ink-3 hover:bg-sunken hover:text-ink')}
    >
      {children}
    </motion.button>
  );
}

/**
 * Scheme card — editorial, money first.
 * The benefit figure is the headline because it answers the only question a family is asking:
 * "what would this mean for us?" Everything else is quiet supporting fact.
 * The whole card is one link (stretched title); save / compare / listen sit above it.
 */
export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, variant = 'default', className }) => {
  const { t } = useTranslation();
  const life = lifeEventOf(scheme.lifeEventId);
  const head = benefitHeadline(scheme, t);
  const { isSaved, isCompared, toggleSave, toggleCompare } = useSchemeActions(scheme);
  const title = t(scheme.titleKey, scheme.titleKey);
  const papers = scheme.documents.filter((d) => d.isMandatory).length;

  if (variant === 'compact') {
    return (
      <motion.article whileTap={pressSoft} className={cx('group relative flex items-center gap-3 p-3 rounded-md bg-surface shadow-hair hover:shadow-lift transition-shadow', className)}>
        <LifeGlyph id={scheme.lifeEventId} size="sm" />
        <div className="flex-1 min-w-0">
          <Link to={`/schemes/${scheme.id}`} className="block font-semibold truncate after:absolute after:inset-0 after:rounded-md">
            {title}
          </Link>
          <p className="text-small text-ink-2 truncate">
            {head.prefix && <span>{head.prefix} </span>}
            <span className="num font-semibold text-ink">₹{formatINR(head.amount)}</span> {head.unit}
          </p>
        </div>
        <ToggleIcon active={isSaved} label={t('schemes.card.save', 'Save scheme')} activeLabel={t('schemes.card.saved', 'Saved')} onClick={toggleSave} activeClass="text-haldi-deep bg-haldi-tint">
          <BookmarkSimple size={20} weight={isSaved ? 'fill' : 'regular'} />
        </ToggleIcon>
      </motion.article>
    );
  }

  const KindIcon = head.kindIcon;

  return (
    <motion.article
      whileTap={pressSoft}
      className={cx(
        'group relative h-full flex flex-col rounded-lg bg-surface shadow-hair hover:shadow-lift transition-[box-shadow,transform] duration-short ease-out hover:-translate-y-0.5',
        isCompared && 'ring-2 ring-neel',
        className
      )}
    >
      <div className="p-5 pb-4 flex-1 flex flex-col">
        {/* Top: life event + quiet toggles */}
        <div className="flex items-center gap-3">
          <motion.span layoutId={`glyph-${scheme.id}`} className="shrink-0">
            <LifeGlyph id={scheme.lifeEventId} size="sm" />
          </motion.span>
          <p className={cx('flex-1 min-w-0 text-small font-semibold truncate', toneText[life.tone])}>{t(life.titleKey)}</p>
          <div className="flex items-center -me-2">
            <ToggleIcon active={isCompared} label={t('schemes.card.compare', 'Add to compare')} activeLabel={t('schemes.card.comparing', 'In compare')} onClick={toggleCompare} activeClass="text-neel-ink bg-neel-tint">
              {isCompared ? <Check size={20} weight="bold" /> : <Scales size={20} />}
            </ToggleIcon>
            <ToggleIcon active={isSaved} label={t('schemes.card.save', 'Save scheme')} activeLabel={t('schemes.card.saved', 'Saved')} onClick={toggleSave} activeClass="text-haldi-deep bg-haldi-tint">
              <motion.span key={String(isSaved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                <BookmarkSimple size={20} weight={isSaved ? 'fill' : 'regular'} />
              </motion.span>
            </ToggleIcon>
          </div>
        </div>

        {/* Title — stretched link makes the whole card tappable */}
        <h3 className="mt-4 text-h3 font-semibold leading-snug">
          <Link to={`/schemes/${scheme.id}`} className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:shadow-[0_0_0_3px_rgb(var(--c-neel))]">
            {title}
          </Link>
        </h3>
        {isStateScheme(scheme) && <p className="mt-1 text-micro text-ink-3">{t('schemes.card.state', 'State scheme')} · {scheme.eligibilityCriteria.stateSpecific?.join(', ')}</p>}

        {/* The money */}
        <motion.div layoutId={`amount-${scheme.id}`} className="mt-5">
          {head.prefix && <p className="text-small text-ink-2">{head.prefix}</p>}
          <p className="text-[2.25rem] leading-none font-semibold num-display text-ink">₹{formatINR(head.amount)}</p>
          <p className="mt-2 flex items-center gap-1.5 text-small text-ink-2">
            <KindIcon size={18} weight="duotone" className="shrink-0 text-ink-3" />
            <span className="min-w-0">{head.unit}</span>
          </p>
        </motion.div>

        <p className="mt-4 text-small text-ink-2 line-clamp-2">{t(scheme.shortDescKey, scheme.shortDescKey)}</p>
      </div>

      {/* Quiet facts */}
      <dl className="mx-5 py-3 border-t border-line grid grid-cols-3 gap-2 text-small">
        <div className="min-w-0">
          <dt className="sr-only">{t('schemes.card.timeLimit', 'Time to decide')}</dt>
          <dd className="flex items-center gap-1.5 text-ink-2">
            <Clock size={16} className="shrink-0 text-ink-3" />
            <span className="truncate">
              <span className="num font-semibold text-ink">{scheme.processingSlaDays}</span> {t('schemes.card.days', 'days')}
            </span>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="sr-only">{t('schemes.card.fee', 'Govt fee')}</dt>
          <dd className="flex items-center gap-1.5 text-ink-2">
            <ShieldCheck size={16} weight="duotone" className="shrink-0 text-patti" />
            <span className="truncate">
              <span className="num font-semibold text-patti">₹0</span> {t('schemes.card.fee', 'Govt fee')}
            </span>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="sr-only">{t('schemes.card.papers', 'papers')}</dt>
          <dd className="flex items-center gap-1.5 text-ink-2">
            <Files size={16} className="shrink-0 text-ink-3" />
            <span className="truncate">
              <span className="num font-semibold text-ink">{papers}</span> {t('schemes.card.papers', 'papers')}
            </span>
          </dd>
        </div>
      </dl>

      <div className="relative z-10 flex items-center justify-between gap-2 px-5 pb-4 pt-1">
        <ListenButton text={schemeSpokenSummary(scheme, t)} />
        <span className="inline-flex items-center gap-1 text-small font-semibold text-neel-ink pointer-events-none" aria-hidden>
          {t('schemes.card.details', 'See details')}
          <ArrowRight size={16} weight="bold" className="flip-rtl transition-transform duration-short group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.article>
  );
};

export default SchemeCard;
