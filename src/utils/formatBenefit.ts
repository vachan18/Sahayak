import { Scheme, SupportedLanguage } from '../types';

/** Frequency keys that live in the redesign namespace (others are legacy keys like 'perYear'). */
const FREQUENCY_FALLBACK: Record<string, string> = {
  perYear: 'per year',
  oneTime: 'one-time',
  perMonth: 'per month',
  'schemes.freq.perMonth': 'per month',
  'schemes.freq.minDeposit': 'to start',
};

const FREQUENCY_KEY: Record<string, string> = {
  perMonth: 'schemes.freq.perMonth',
};

/** Translated frequency word for a scheme ("per year", "ಪ್ರತಿ ತಿಂಗಳು", …). */
export function schemeFrequency(scheme: Scheme, t: (key: string, fallback?: string) => string): string {
  const raw = scheme.financialBenefit.frequencyKey;
  const key = FREQUENCY_KEY[raw] ?? raw;
  return t(key, FREQUENCY_FALLBACK[raw] ?? raw);
}

/**
 * Language-neutral benefit line: "₹6,000 / per year".
 * The ₹ figure uses Indian digit grouping in every language; only the unit is translated.
 * (Previously Kannada `formattedDisplay` text leaked into every non-English UI.)
 */
export function formatSchemeBenefit(
  scheme: Scheme,
  _language: SupportedLanguage,
  t: (key: string, fallback?: string) => string
): string {
  return `₹${scheme.financialBenefit.amount.toLocaleString('en-IN')} / ${schemeFrequency(scheme, t)}`;
}
