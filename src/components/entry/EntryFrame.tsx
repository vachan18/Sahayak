import React, { useEffect } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { ensureScriptFont } from '../../lib/fonts';
import { SahayakWordmark } from '../common/SahayakLogo';
import { Photo } from '../../ui/Photo';
import { cx } from '../../ui/cx';
import { Greetings } from './Greetings';

interface EntryFrameProps {
  children: React.ReactNode;
  /** Right-aligned control in the phone header (e.g. Skip) */
  headerEnd?: React.ReactNode;
  /** Sticky bottom action area (thumb zone on phones) */
  footer?: React.ReactNode;
  /** Hide the brand on the phone header (Welcome shows a large one in-content) */
  hideBrand?: boolean;
  /** Show the rotating greeting in the desktop story panel */
  panelGreeting?: boolean;
  /** Drive the panel greeting from an external cycle (keeps it in sync with page content) */
  greetingIndex?: number;
  className?: string;
}

/** Woven running-stitch rings — the same motif used on Home's voice hero. */
export function WovenMotif({ className }: { className?: string }) {
  return (
    <svg className={cx('pointer-events-none', className)} viewBox="0 0 200 200" aria-hidden>
      {[18, 36, 54, 72, 90].map((r, i) => (
        <motion.circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="3 5"
          initial={{ rotate: 0 }}
          animate={{ rotate: i % 2 ? -360 : 360 }}
          transition={{ duration: 90 + i * 30, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '100px', originY: '100px' }}
        />
      ))}
    </svg>
  );
}

/**
 * Full-height frame for the first-run flow (outside the app shell).
 * Phone: single column, content in the reading zone, actions pinned in the thumb zone.
 * Desktop: an indigo story panel on the start side, the task on the end side.
 */
export function EntryFrame({ children, headerEnd, footer, hideBrand, panelGreeting = true, greetingIndex, className }: EntryFrameProps) {
  const { t, language } = useTranslation();
  const { isLiteMode } = useAppStore();

  useEffect(() => {
    ensureScriptFont(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <MotionConfig reducedMotion={isLiteMode ? 'always' : 'user'}>
      <div className="min-h-[100dvh] lg:grid lg:grid-cols-[minmax(420px,5fr)_7fr] bg-paper text-ink">
        {/* Story panel — desktop only */}
        <aside className="hidden lg:flex sticky top-0 h-[100dvh] flex-col justify-between overflow-hidden bg-hero-neel text-on-hero p-12 xl:p-16">
          <Photo id="farmer" priority decorative rounded="" sizes="40vw" className="!absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[rgb(9_14_25/0.78)] via-[rgb(9_14_25/0.45)] to-[rgb(9_14_25/0.92)]" />
          <div className="relative flex items-center gap-3">
            <SahayakWordmark tone="dark" label={t('shell.brandWordmark', 'SAHAYAK')} />
          </div>
          <div className="relative">
            {panelGreeting && <Greetings index={greetingIndex} showLatin className="text-[clamp(3rem,2rem+3vw,5.25rem)] font-semibold leading-[1.15] text-haldi" />}
            <p className="mt-6 text-h3 font-medium max-w-md text-on-hero/90">{t('entry.welcome.story', 'Help, offered — in the language you think in.')}</p>
          </div>
          <p className="relative text-small text-on-hero/70">{t('entry.welcome.trust', 'Free · No agent · Works on any phone')}</p>
        </aside>

        {/* Task column */}
        <div className="relative flex flex-col min-h-[100dvh] pt-safe">
          <header className="flex items-center justify-between gap-3 h-16 px-4 sm:px-8 lg:px-12 shrink-0">
            {!hideBrand ? (
              <div className="flex items-center gap-2.5 lg:invisible">
                <SahayakWordmark label={t('shell.brandWordmark', 'SAHAYAK')} />
              </div>
            ) : (
              <span />
            )}
            {headerEnd}
          </header>
          <main className={cx('flex-1 w-full max-w-xl mx-auto px-4 sm:px-8 pb-6 flex flex-col', className)}>{children}</main>
          {footer && (
            <div className="sticky bottom-0 bg-paper/95 backdrop-blur-lg pb-safe">
              <div className="w-full max-w-xl mx-auto px-4 sm:px-8 py-4">{footer}</div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
