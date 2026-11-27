import { useMemo } from 'react';
import { HandCoins, FirstAidKit, Coins, Certificate, SolarPanel, PiggyBank, type Icon } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { allSchemes } from '../../data/schemes';
import type { Scheme } from '../../types';
import { schemeFrequency } from '../../utils/formatBenefit';

type T = (key: string, fallback?: string) => string;

/**
 * The browsable catalogue. Merges the store's schemes (which may be synced from the
 * database) with the full local catalogue, so extension schemes are always reachable.
 */
export function useCatalog(): Scheme[] {
  const storeSchemes = useAppStore((s) => s.schemes);
  return useMemo(() => {
    const seen = new Set(storeSchemes.map((s) => s.id));
    return [...storeSchemes, ...allSchemes.filter((s) => !seen.has(s.id))];
  }, [storeSchemes]);
}

export function useScheme(id?: string): Scheme | undefined {
  const catalog = useCatalog();
  return catalog.find((s) => s.id === id || s.slug === id);
}

export interface BenefitHeadline {
  /** Small word before the figure, e.g. "Up to" */
  prefix?: string;
  amount: number;
  /** Plain-language meaning of the figure: "every year, into your bank" */
  unit: string;
  kindIcon: Icon;
  kindLabel: string;
}

/**
 * Turns a scheme's benefit into one sentence a first-time reader understands:
 * a big ₹ figure, then what that money actually is and how it reaches you.
 */
export function benefitHeadline(scheme: Scheme, t: T): BenefitHeadline {
  const { amount, frequencyKey } = scheme.financialBenefit;
  const upTo = t('schemes.upTo', 'Up to');

  if (scheme.benefitCategory === 'non_financial') {
    return { amount, unit: t('schemes.unit.savings', 'is enough to open her savings account'), kindIcon: PiggyBank, kindLabel: t('schemes.kind.savings', 'Savings for your daughter') };
  }
  if (scheme.benefitCategory === 'subsidy') {
    return { prefix: upTo, amount, unit: t('schemes.unit.subsidy', 'towards the cost, paid to your bank'), kindIcon: SolarPanel, kindLabel: t('schemes.kind.subsidy', 'Help with the cost') };
  }
  switch (scheme.benefitType) {
    case 'health_insurance':
      return { prefix: upTo, amount, unit: t('schemes.unit.health', 'of free hospital treatment, every year'), kindIcon: FirstAidKit, kindLabel: t('schemes.kind.health', 'Free hospital treatment') };
    case 'credit_loan':
      return { prefix: upTo, amount, unit: t('schemes.unit.loan', 'as a low-interest loan'), kindIcon: Coins, kindLabel: t('schemes.kind.loan', 'Low-interest loan') };
    case 'scholarship':
      return { amount, unit: t('schemes.unit.scholarship', 'a year for your studies'), kindIcon: Certificate, kindLabel: t('schemes.kind.scholarship', 'Scholarship for studies') };
    case 'pension':
      return { amount, unit: t('schemes.unit.pension', 'every month as pension'), kindIcon: HandCoins, kindLabel: t('schemes.kind.pension', 'Monthly pension') };
    default: {
      const unit =
        frequencyKey === 'perYear'
          ? t('schemes.unit.cashYear', 'every year, into your bank')
          : frequencyKey === 'perMonth'
            ? t('schemes.unit.cashMonth', 'every month, into your bank')
            : frequencyKey === 'oneTime'
              ? t('schemes.unit.cashOnce', 'one time, into your bank')
              : schemeFrequency(scheme, t);
      return { amount, unit, kindIcon: HandCoins, kindLabel: t('schemes.kind.dbt', 'Money sent to your bank') };
    }
  }
}

/** Highest CSC help charge for this scheme (falls back to the ₹30 national cap). */
export function cscCap(scheme: Scheme): number {
  return scheme.feeStructure?.cscAssistanceServiceCharge?.standardRate ?? 30;
}

export const isStateScheme = (s: Scheme) => (s.eligibilityCriteria.stateSpecific?.length ?? 0) > 0;
export const isEngineChecked = (s: Scheme) => s.verificationStatus === 'VERIFIED';

/** Text read aloud by the Listen button on a card. */
export function schemeSpokenSummary(scheme: Scheme, t: T): string {
  const h = benefitHeadline(scheme, t);
  return [
    t(scheme.titleKey, scheme.titleKey),
    `${h.prefix ? `${h.prefix} ` : ''}₹${h.amount.toLocaleString('en-IN')} ${h.unit}.`,
    t(scheme.shortDescKey, scheme.shortDescKey),
    t('schemes.spoken.free', 'The government fee to apply is zero rupees.'),
  ].join(' ');
}
