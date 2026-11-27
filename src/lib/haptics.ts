/**
 * Tiny haptic vocabulary. Android Chrome supports navigator.vibrate; iOS ignores it silently.
 * Haptics confirm actions for users who may not be looking at (or able to read) the screen.
 */
type Pattern = 'tap' | 'select' | 'success' | 'warning' | 'error';

const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 6,
  select: 10,
  success: [12, 60, 18],
  warning: [20, 80, 20],
  error: [30, 60, 30, 60, 30],
};

export function haptic(kind: Pattern = 'tap'): void {
  try {
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    if (document.documentElement.classList.contains('lite')) return;
    navigator.vibrate(PATTERNS[kind]);
  } catch {
    /* no-op */
  }
}
