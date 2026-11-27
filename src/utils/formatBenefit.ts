import { Scheme, SupportedLanguage } from '../types';

export function formatSchemeBenefit(
  scheme: Scheme,
  language: SupportedLanguage,
  t: (key: string, fallback?: string) => string
): string {
  if (language === 'kn') {
    return scheme.financialBenefit.formattedDisplay;
  }
  return `₹${scheme.financialBenefit.amount.toLocaleString('en-IN')} / ${t(
    scheme.financialBenefit.frequencyKey,
    scheme.financialBenefit.frequencyKey
  )}`;
}
