import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cx } from './cx';
import { pressSoft } from './motion';

export type Tone = 'neutral' | 'neel' | 'haldi' | 'patti' | 'kesar' | 'sindoor' | 'khet' | 'sehat' | 'mamta' | 'vidya' | 'kaarigar' | 'ghar';

/** Literal class maps — Tailwind JIT needs full class names in source. */
export const toneTint: Record<Tone, string> = {
  neutral: 'bg-sunken text-ink',
  neel: 'bg-neel-tint text-neel-ink',
  haldi: 'bg-haldi-tint text-haldi-deep',
  patti: 'bg-patti-tint text-patti',
  kesar: 'bg-kesar-tint text-kesar',
  sindoor: 'bg-sindoor-tint text-sindoor',
  khet: 'bg-khet-tint text-khet',
  sehat: 'bg-sehat-tint text-sehat',
  mamta: 'bg-mamta-tint text-mamta',
  vidya: 'bg-vidya-tint text-vidya',
  kaarigar: 'bg-kaarigar-tint text-kaarigar',
  ghar: 'bg-ghar-tint text-ghar',
};
export const toneText: Record<Tone, string> = {
  neutral: 'text-ink-2',
  neel: 'text-neel-ink',
  haldi: 'text-haldi-deep',
  patti: 'text-patti',
  kesar: 'text-kesar',
  sindoor: 'text-sindoor',
  khet: 'text-khet',
  sehat: 'text-sehat',
  mamta: 'text-mamta',
  vidya: 'text-vidya',
  kaarigar: 'text-kaarigar',
  ghar: 'text-ghar',
};
export const toneDot: Record<Tone, string> = {
  neutral: 'bg-ink-3',
  neel: 'bg-neel',
  haldi: 'bg-haldi',
  patti: 'bg-patti',
  kesar: 'bg-kesar',
  sindoor: 'bg-sindoor',
  khet: 'bg-khet',
  sehat: 'bg-sehat',
  mamta: 'bg-mamta',
  vidya: 'bg-vidya',
  kaarigar: 'bg-kaarigar',
  ghar: 'bg-ghar',
};

interface SurfaceProps extends HTMLMotionProps<'div'> {
  /** 'flat' = hairline only · 'raised' = soft lift · 'sunken' = recessed well */
  elevation?: 'flat' | 'raised' | 'sunken';
  interactive?: boolean;
  padded?: boolean | 'sm' | 'lg';
  as?: 'div' | 'article' | 'section' | 'li';
}

/** The paper card. Deliberately quiet: hairline edge, warm shadow, 20px radius. */
export function Surface({ elevation = 'flat', interactive, padded = true, className, as = 'div', children, ...rest }: SurfaceProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      whileTap={interactive ? pressSoft : undefined}
      className={cx(
        'rounded-lg',
        elevation === 'flat' && 'bg-surface shadow-hair',
        elevation === 'raised' && 'bg-surface shadow-lift',
        elevation === 'sunken' && 'bg-sunken',
        interactive && 'transition-[box-shadow,transform] duration-short ease-out hover:shadow-lift hover:-translate-y-px cursor-pointer',
        padded === true && 'p-5 md:p-6',
        padded === 'sm' && 'p-4',
        padded === 'lg' && 'p-6 md:p-8',
        className as string
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Static status label. Sentence case, a dot for colour-blind redundancy. */
export function Tag({ tone = 'neutral', children, className, dot = true, icon }: { tone?: Tone; children: React.ReactNode; className?: string; dot?: boolean; icon?: React.ReactNode }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-micro font-semibold whitespace-nowrap', toneTint[tone], className)}>
      {icon ?? (dot && <span className={cx('w-1.5 h-1.5 rounded-full', toneDot[tone])} aria-hidden />)}
      {children}
    </span>
  );
}

/** Small uppercase-free eyebrow label used above headings. */
export function Eyebrow({ children, className, tone = 'neutral' }: { children: React.ReactNode; className?: string; tone?: Tone }) {
  return <p className={cx('text-small font-semibold', tone === 'neutral' ? 'text-ink-3' : toneText[tone], className)}>{children}</p>;
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx('border-0 h-px bg-line', className)} />;
}
