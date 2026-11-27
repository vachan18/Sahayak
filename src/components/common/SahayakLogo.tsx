import React from 'react';
import { cx } from '../../ui/cx';

interface SahayakLogoProps {
  className?: string;
  /** 'light' = for light surfaces (navy shield) · 'dark' = for navy/dark surfaces (white shield) · 'auto' follows theme */
  tone?: 'auto' | 'light' | 'dark';
  /** Kept for backwards compatibility — ignored */
  bare?: boolean;
}

/**
 * Sahayak emblem — a shield (protection, the State's guarantee) holding a speech bubble
 * (voice, your language) with two people celebrating (the family that receives).
 * Navy = trust · Teal = conversation & help · Orange = people & warmth.
 */
export const SahayakLogo: React.FC<SahayakLogoProps> = ({ className = 'w-10 h-10', tone = 'auto' }) => (
  <svg viewBox="0 0 100 114" className={cx(className, 'shrink-0')} role="img" aria-label="Sahayak" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50.5 3.5C38 10.5 22 16 4.5 19 3.5 46 6.5 71 19.5 88.5M27.5 96.5C34.5 102.5 42 106.5 50.5 110.5 61 106 72 100 81 89 95 72 98 46 96.5 19 79 16 63 10.5 50.5 3.5"
      fill="none"
      strokeWidth="5.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={tone === 'dark' ? 'stroke-white' : tone === 'light' ? 'stroke-[#111E33]' : 'stroke-[#111E33] dark:stroke-white'}
    />
    <g fill="none" stroke="#1DAF8F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 42A35 35 0 0 1 83.5 42" />
      <path d="M15.6 58A35 35 0 0 0 26 79L19 92.5 35.5 87.5Q45 91 54.5 89.5" />
      <path d="M73.5 82A35 35 0 0 0 85.4 58" />
    </g>
    <g fill="#FC7C24">
      <circle cx="35.5" cy="46.5" r="5.6" />
      <circle cx="66.5" cy="47.5" r="5.6" />
      <path d="M13.5 43.5C20 51 27 55.5 33 56.5 36.5 57 40 56.5 42.5 54.5 47 50.5 49.5 43 50.5 32.5 53 41 52.5 50 49 58 47 63 47.5 70 49 77 50 81 49 84 47 86L36 86C37.5 80 37.5 74 35 68 33 64.5 29.5 62 26 60 21 57 16.5 51.5 13.5 43.5Z" />
      <path d="M87.5 44.5C82 52 76 56.5 70.5 57.5 67 58 63.5 57.5 60.5 55.5 57.5 53 56 48.5 55 42 53.5 48 53 55 55 60.5 57 65.5 57.5 70 57 75 56.5 79.5 57 83.5 59 87.5L66.5 85.5C67 80 68 74 71 69 73.5 65 77 62.5 80 60 84 56.5 86.5 51 87.5 44.5Z" />
    </g>
  </svg>
);

/** Emblem + wordmark lock-up, matching the brand sheet ("SAHAYAK" in heavy geometric caps). */
export const SahayakWordmark: React.FC<{ className?: string; label?: string; tone?: 'auto' | 'light' | 'dark' }> = ({ className, label = 'SAHAYAK', tone = 'auto' }) => (
  <span className={cx('inline-flex items-center gap-2.5', className)}>
    <SahayakLogo className="h-9 w-auto" tone={tone} />
    <span className={cx('font-display font-extrabold tracking-[0.02em] text-[1.3rem] leading-none', tone === 'dark' ? 'text-white' : 'text-ink')}>{label}</span>
  </span>
);

export default SahayakLogo;
