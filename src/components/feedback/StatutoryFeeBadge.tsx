import { ShieldCheck } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { cx } from '../../ui/cx';

interface StatutoryFeeBadgeProps {
  maxCscCharge?: number;
  className?: string;
  /** 'inline' = one quiet line · 'card' = two clear figures */
  variant?: 'inline' | 'card';
}

/**
 * The fee promise, stated as two numbers people can hold an operator to:
 * government fee ₹0, help-centre charge at most ₹30.
 */
export const StatutoryFeeBadge = ({ maxCscCharge = 30, className, variant = 'card' }: StatutoryFeeBadgeProps) => {
  const { t } = useTranslation();

  if (variant === 'inline') {
    return (
      <p className={cx('inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-ink-2', className)}>
        <ShieldCheck size={18} weight="duotone" className="text-patti shrink-0" />
        <span>
          {t('documents.fee.govShort', 'Government fee')} <strong className="num text-patti">₹0</strong>
        </span>
        <span aria-hidden className="text-line-strong">·</span>
        <span>
          {t('documents.fee.cscShort', 'Centre may charge at most')} <strong className="num text-ink">₹{maxCscCharge}</strong>
        </span>
      </p>
    );
  }

  return (
    <div className={cx('flex items-stretch gap-0 rounded-md bg-surface shadow-hair overflow-hidden', className)}>
      <span className="grid place-items-center px-4 bg-patti-tint text-patti">
        <ShieldCheck size={26} weight="duotone" />
      </span>
      <dl className="flex-1 grid grid-cols-2 divide-x divide-line rtl:divide-x-reverse min-w-0">
        <div className="px-4 py-3 min-w-0">
          <dt className="text-micro text-ink-3">{t('documents.fee.govShort', 'Government fee')}</dt>
          <dd className="text-h3 font-semibold num text-patti">₹0</dd>
        </div>
        <div className="px-4 py-3 min-w-0">
          <dt className="text-micro text-ink-3">{t('documents.fee.cscMax', 'Most a centre can charge')}</dt>
          <dd className="text-h3 font-semibold num">₹{maxCscCharge}</dd>
        </div>
      </dl>
    </div>
  );
};

export default StatutoryFeeBadge;
