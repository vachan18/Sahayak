import {
  Plant,
  Heartbeat,
  BabyCarriage,
  GraduationCap,
  Storefront,
  HouseLine,
  Bank,
  HandCoins,
  FirstAidKit,
  Coins,
  Certificate,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';
import type { LifeEventId, BenefitType, Scheme, SupportedLanguage } from '../types';
import type { Tone } from './Surface';
import { toneTint } from './Surface';
import { cx } from './cx';

/** Each life event owns a hue + icon. Colour is never the only signal — the icon always travels with it. */
export const LIFE_EVENT: Record<LifeEventId, { icon: PhosphorIcon; tone: Tone; titleKey: string; descKey: string }> = {
  farming: { icon: Plant, tone: 'khet', titleKey: 'lifeEvent_farming', descKey: 'lifeEvent_farming_desc' },
  health_elder: { icon: Heartbeat, tone: 'sehat', titleKey: 'lifeEvent_health_elder', descKey: 'lifeEvent_health_elder_desc' },
  women_child: { icon: BabyCarriage, tone: 'mamta', titleKey: 'lifeEvent_women_child', descKey: 'lifeEvent_women_child_desc' },
  education_youth: { icon: GraduationCap, tone: 'vidya', titleKey: 'lifeEvent_education_youth', descKey: 'lifeEvent_education_youth_desc' },
  business_artisan: { icon: Storefront, tone: 'kaarigar', titleKey: 'lifeEvent_business_artisan', descKey: 'lifeEvent_business_artisan_desc' },
  housing_utilities: { icon: HouseLine, tone: 'ghar', titleKey: 'lifeEvent_housing_utilities', descKey: 'lifeEvent_housing_utilities_desc' },
};

export const lifeEventOf = (id?: LifeEventId) => (id && LIFE_EVENT[id]) || { icon: Bank, tone: 'neel' as Tone, titleKey: 'appName', descKey: '' };

/** Rounded tile carrying the life-event icon. Used on cards, lists and detail heroes (shared layoutId). */
export function LifeGlyph({ id, size = 'md', className }: { id?: LifeEventId; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const meta = lifeEventOf(id);
  const Icon = meta.icon;
  const dims = { sm: 'w-9 h-9 rounded-sm', md: 'w-12 h-12 rounded-md', lg: 'w-16 h-16 rounded-lg', xl: 'w-20 h-20 rounded-xl' }[size];
  const iconSize = { sm: 20, md: 26, lg: 34, xl: 42 }[size];
  return (
    <span className={cx('inline-grid place-items-center shrink-0', dims, toneTint[meta.tone], className)} aria-hidden>
      <Icon size={iconSize} weight="duotone" />
    </span>
  );
}

/** How the money actually reaches you — plain words, keyed for translation. */
export const BENEFIT_KIND: Record<BenefitType, { icon: PhosphorIcon; key: string; fallback: string }> = {
  dbt_cash: { icon: HandCoins, key: 'schemes.kind.dbt', fallback: 'Money sent to your bank' },
  health_insurance: { icon: FirstAidKit, key: 'schemes.kind.health', fallback: 'Free hospital treatment' },
  credit_loan: { icon: Coins, key: 'schemes.kind.loan', fallback: 'Low-interest loan' },
  scholarship: { icon: Certificate, key: 'schemes.kind.scholarship', fallback: 'Scholarship for studies' },
  pension: { icon: HandCoins, key: 'schemes.kind.pension', fallback: 'Monthly pension' },
};

/**
 * Splits a scheme's benefit into a big figure + a plain-language unit so the
 * amount can be set in display type ("₹6,000" / "every year").
 */
export function benefitParts(scheme: Scheme, t: (k: string, f?: string) => string, _lang?: SupportedLanguage) {
  const amount = scheme.financialBenefit.amount;
  const unit = t(scheme.financialBenefit.frequencyKey, scheme.financialBenefit.frequencyKey);
  return { amount, unit };
}
