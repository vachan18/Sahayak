import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Files, PaperPlaneRight, Warning } from '@phosphor-icons/react';
import type { Scheme, SchemeEvaluationOutcome } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { LifeGlyph, LinkButton, formatINR, cx } from '../../ui';

/** Amount + plain unit for a scheme, never mixing cash with cover or credit. */
export function useAmountLabel() {
  const { t } = useTranslation();
  return (s: Scheme) => {
    const amount = `₹${formatINR(s.financialBenefit.amount)}`;
    if (s.benefitCategory === 'health_insurance_cover') return { amount, unit: t('eligibility.row.cover', 'cover') };
    if (s.benefitCategory === 'loan_credit_facility') return { amount, unit: t('eligibility.row.limit', 'loan limit') };
    return { amount, unit: t(s.financialBenefit.frequencyKey, '') };
  };
}

/**
 * One scheme in the results. Scannable left-to-right: what it is → how much → what to do.
 * "verify" rows show what is still needed, in the department's words, with a fix path.
 */
export function ResultRow({ outcome, scheme, kind }: { outcome?: SchemeEvaluationOutcome; scheme: Scheme; kind: 'likely' | 'verify' }) {
  const { t } = useTranslation();
  const amountOf = useAmountLabel();
  const { amount, unit } = amountOf(scheme);
  const missing = outcome?.missingCriteria ?? [];

  return (
    <article className="rounded-lg bg-surface shadow-hair p-4 sm:p-5 hover:shadow-lift transition-shadow">
      <div className="flex items-start gap-4">
        <LifeGlyph id={scheme.lifeEventId} size="md" />
        <div className="flex-1 min-w-0">
          <Link to={`/schemes/${scheme.id}`} className="group inline-flex items-start gap-1.5 font-semibold leading-snug hover:underline underline-offset-4">
            {t(scheme.titleKey, scheme.titleKey)}
            <ArrowRight size={16} weight="bold" className="mt-1 shrink-0 text-ink-3 flip-rtl transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-1 flex items-baseline gap-1.5 flex-wrap">
            <span className="num text-h3 font-semibold">{amount}</span>
            <span className="text-small text-ink-2">{unit}</span>
          </p>
          <p className={cx('mt-2 flex items-center gap-1.5 text-small font-medium', kind === 'likely' ? 'text-patti' : 'text-kesar')}>
            {kind === 'likely' ? <CheckCircle size={18} weight="fill" /> : <Warning size={18} weight="fill" />}
            {kind === 'likely' ? t('eligibility.row.matched', 'Matches your answers') : t('eligibility.row.whatsNeeded', 'What is still needed')}
          </p>
          {kind === 'verify' && missing.length > 0 && (
            <>
              <ul className="mt-2 space-y-1.5 text-small text-ink-2">
                {missing.slice(0, 3).map((m) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-kesar shrink-0" aria-hidden />
                    <span>{t(m, m)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-small text-ink-3">{t('eligibility.row.howToFix')}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:ps-16">
        <LinkButton to={`/guidance/${scheme.id}`} variant={kind === 'likely' ? 'solid' : 'secondary'} size="sm" iconStart={<PaperPlaneRight size={18} weight="duotone" />}>
          {t('eligibility.row.apply', 'How to apply')}
        </LinkButton>
        <LinkButton to="/documents" variant="secondary" size="sm" iconStart={<Files size={18} weight="duotone" />}>
          {t('eligibility.row.papers', 'Papers needed')}
        </LinkButton>
      </div>
    </article>
  );
}
