import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';
import { useAppStore } from '../store/useAppStore';
import { cx } from './cx';
import { spring, ease } from './motion';

const ICON = { neutral: Info, success: CheckCircle, warning: Warning, error: XCircle };
const ICON_TONE = { neutral: 'text-haldi', success: 'text-[rgb(112_200_150)]', warning: 'text-haldi', error: 'text-[rgb(242_142_118)]' };

/**
 * Toasts sit above the dock on phones and bottom-start on desktop.
 * Always dark ink on light themes (and vice versa) so they read as "system voice", not content.
 * Announced politely to screen readers; actions (Undo) get 6s instead of ~4s.
 */
export function Toaster() {
  const { toasts, dismissToast } = useAppStore();
  return (
    <div
      aria-live="polite"
      className="fixed z-[70] inset-x-3 bottom-[calc(var(--dock-h)+var(--safe-b)+12px)] lg:bottom-6 lg:start-[calc(var(--rail-w)+24px)] lg:end-auto lg:w-[420px] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICON[toast.tone];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: spring.gentle }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: ease.in } }}
              className="pointer-events-auto flex items-center gap-3 rounded-md bg-[#111E33] dark:bg-[#ECF0F6] text-[#F6F7FA] dark:text-[#111E33] ps-4 pe-2 py-2 min-h-[56px] shadow-float"
            >
              <Icon size={22} weight="fill" className={cx('shrink-0', ICON_TONE[toast.tone])} />
              <p className="flex-1 text-small font-medium">{toast.message}</p>
              {toast.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    dismissToast(toast.id);
                  }}
                  className="h-10 px-3 rounded-sm text-small font-bold text-haldi dark:text-neel hover:bg-white/10 dark:hover:bg-black/5"
                >
                  {toast.actionLabel}
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
