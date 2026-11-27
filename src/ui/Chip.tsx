import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from '@phosphor-icons/react';
import { cx } from './cx';
import { haptic } from '../lib/haptics';

interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  className?: string;
  /** Show a check when selected (multi-select filters) */
  checkable?: boolean;
}

/** Filter / suggestion chip. 40px tall so it is a comfortable thumb target. */
export function Chip({ selected, onClick, children, icon, count, className, checkable }: ChipProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        haptic('select');
        onClick?.();
      }}
      className={cx(
        'inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-small font-medium whitespace-nowrap shrink-0',
        'transition-colors duration-short ease-out',
        selected ? 'bg-ink text-paper' : 'bg-surface text-ink shadow-hair hover:bg-sunken',
        className
      )}
    >
      {checkable && selected ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="-ms-1">
          <Check size={16} weight="bold" />
        </motion.span>
      ) : (
        icon
      )}
      <span>{children}</span>
      {count !== undefined && <span className={cx('num text-micro', selected ? 'text-paper/70' : 'text-ink-3')}>{count}</span>}
    </motion.button>
  );
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode; icon?: React.ReactNode }[];
  label: string;
  className?: string;
  size?: 'sm' | 'md';
  layoutKey?: string;
}

/**
 * Segmented control with a sliding indicator.
 * The pill is positioned from measured button geometry (not a shared layoutId), so it never
 * holds up a parent's exit animation — e.g. a Sheet closing right after you change a setting.
 */
export function Segmented<T extends string>({ value, onChange, options, label, className, size = 'md' }: SegmentedProps<T>) {
  const wrap = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const activeIndex = Math.max(0, options.findIndex((o) => o.value === value));

  useLayoutEffect(() => {
    const measure = () => {
      const btn = wrap.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[activeIndex];
      if (btn) setPill({ x: btn.offsetLeft, w: btn.offsetWidth });
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && wrap.current) ro.observe(wrap.current);
    return () => ro?.disconnect();
  }, [activeIndex, options.length]);

  return (
    <div ref={wrap} role="radiogroup" aria-label={label} className={cx('relative inline-flex p-1 rounded-md bg-sunken gap-1', className)}>
      {pill && (
        <motion.span
          aria-hidden
          className="absolute top-1 bottom-1 rounded-sm bg-surface shadow-lift"
          initial={false}
          animate={{ x: pill.x, width: pill.w }}
          transition={{ type: 'spring', stiffness: 520, damping: 40 }}
          style={{ left: 0 }}
        />
      )}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              haptic('select');
              onChange(o.value);
            }}
            className={cx(
              'relative z-[1] flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm font-medium transition-colors duration-short',
              size === 'sm' ? 'h-9 px-3 text-small' : 'h-11 px-4 text-body',
              active ? 'text-ink' : 'text-ink-2 hover:text-ink'
            )}
          >
            {o.icon}
            <span className="truncate">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
