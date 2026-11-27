import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { cx } from './cx';
import { ease } from './motion';
import type { Tone } from './Surface';

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('skeleton rounded-sm', className)} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg bg-surface shadow-hair p-5 space-y-4" aria-hidden>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-9 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

/* ── Money / numbers ──────────────────────────────────────────────────────── */
/** Indian digit grouping: 5,00,000 */
export const formatINR = (n: number) => Math.round(n).toLocaleString('en-IN');

/** Short form for big figures: ₹5 lakh, ₹1.5 crore */
export function formatINRShort(n: number): string {
  if (n >= 1e7) return `${+(n / 1e7).toFixed(n % 1e7 ? 1 : 0)} Cr`;
  if (n >= 1e5) return `${+(n / 1e5).toFixed(n % 1e5 ? 1 : 0)} L`;
  return formatINR(n);
}

/**
 * Counts up to a rupee value when it scrolls into view.
 * Used for entitlement totals — the moment a family sees what is theirs.
 */
export function AnimatedNumber({ value, prefix = '₹', className, duration = 1.1, short = false }: { value: number; prefix?: string; className?: string; duration?: number; short?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce || document.documentElement.classList.contains('lite')) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, { duration, ease: ease.out, onUpdate: (v) => setDisplay(v) });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  return (
    <span ref={ref} className={cx('num', className)} aria-label={`${prefix}${formatINR(value)}`}>
      <span aria-hidden>
        {prefix}
        {short ? formatINRShort(display) : formatINR(display)}
      </span>
    </span>
  );
}

/* ── Progress ─────────────────────────────────────────────────────────────── */
const barTone: Partial<Record<Tone, string>> = { neel: 'bg-neel', patti: 'bg-patti', haldi: 'bg-haldi', kesar: 'bg-kesar', sindoor: 'bg-sindoor' };

export function ProgressBar({ value, max = 100, tone = 'neel', label, className }: { value: number; max?: number; tone?: Tone; label: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} className={cx('h-2 rounded-full bg-sunken overflow-hidden', className)}>
      <motion.div
        className={cx('h-full rounded-full', barTone[tone] ?? 'bg-neel')}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: ease.out }}
      />
    </div>
  );
}

const ringTone: Partial<Record<Tone, string>> = { neel: 'stroke-neel', patti: 'stroke-patti', haldi: 'stroke-haldi', kesar: 'stroke-kesar', sindoor: 'stroke-sindoor' };

export function ProgressRing({ value, size = 64, stroke = 6, tone = 'patti', children, label }: { value: number; size?: number; stroke?: number; tone?: Tone; children?: React.ReactNode; label: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${Math.round(pct)}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-sunken fill-none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cx('fill-none', ringTone[tone] ?? 'stroke-patti')}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ duration: 0.9, ease: ease.out }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, body, action, className }: { icon: React.ReactNode; title: React.ReactNode; body?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cx('text-center py-12 px-6 rounded-lg border border-dashed border-line-strong', className)}>
      <div className="mx-auto w-16 h-16 rounded-full bg-sunken grid place-items-center text-ink-2 mb-4">{icon}</div>
      <h3 className="text-h3 font-semibold">{title}</h3>
      {body && <p className="text-ink-2 mt-2 max-w-sm mx-auto">{body}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
