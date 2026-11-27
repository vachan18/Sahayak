import type { Transition, Variants } from 'framer-motion';

/**
 * AANGAN MOTION SYSTEM
 * ────────────────────
 * Motion here has one job: explain where things came from and where they went.
 * - Enter = decelerate (things arrive and settle).  Exit = accelerate (things leave quickly).
 * - Spatial: pushing deeper slides in from the reading-direction end; going back reverses.
 * - Nothing loops forever except the "listening" state, which is a live signal.
 * - Reduced-motion & Lite mode collapse everything to opacity-only, ≤120ms.
 */

export const ease = {
  /** Emphasised decelerate — for anything entering */
  out: [0.2, 0, 0, 1] as const,
  /** Accelerate — for anything leaving */
  in: [0.3, 0, 1, 1] as const,
  /** Standard — for things moving on-screen */
  inOut: [0.4, 0, 0.2, 1] as const,
};

export const dur = {
  micro: 0.12,
  short: 0.2,
  medium: 0.32,
  long: 0.48,
};

export const spring = {
  /** Toggles, pills, tab indicators */
  snappy: { type: 'spring', stiffness: 520, damping: 40, mass: 0.8 } as Transition,
  /** Sheets, cards expanding */
  gentle: { type: 'spring', stiffness: 280, damping: 32 } as Transition,
  /** Playful confirmation (eligibility success) */
  bouncy: { type: 'spring', stiffness: 400, damping: 18 } as Transition,
};

/** Route transitions — direction comes from AnimatedOutlet (1 = deeper, -1 = back, 0 = lateral tab switch) */
export const pageVariants: Variants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir === 0 ? 0 : dir > 0 ? 28 : -28,
    y: dir === 0 ? 10 : 0,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: dur.medium, ease: ease.out },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir === 0 ? 0 : dir > 0 ? -16 : 16,
    transition: { duration: dur.short * 0.8, ease: ease.in },
  }),
};

/** Parent that staggers its children in */
export const staggerParent = (stagger = 0.05, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: dur.medium, ease: ease.out } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: dur.medium, ease: ease.out } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: spring.gentle },
};

/** Standard press feedback for tappable surfaces */
export const press = { scale: 0.97 };
export const pressSoft = { scale: 0.985 };
