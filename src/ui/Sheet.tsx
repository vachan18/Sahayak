import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, PanInfo, useDragControls } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { cx } from './cx';
import { ease, dur, spring } from './motion';
import { useMediaQuery } from './useMediaQuery';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Desktop presentation. 'dialog' = centred card, 'side' = right-hand panel. Mobile is always a bottom sheet. */
  desktop?: 'dialog' | 'side';
  size?: 'sm' | 'md' | 'lg';
  /** Hide the visible title row (still labelled for screen readers) */
  bare?: boolean;
  closeLabel?: string;
  className?: string;
}

/**
 * One overlay, three postures:
 *  • phone  → bottom sheet in the thumb zone, drag the grabber (or flick) down to dismiss
 *  • desktop dialog → centred card that scales in from 96%
 *  • desktop side → slides in from the inline-end edge (respects RTL)
 * Focus is trapped, Esc closes, background scroll is locked, focus returns to the opener.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  desktop = 'dialog',
  size = 'md',
  bare,
  closeLabel = 'Close',
  className,
}: SheetProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);
  const drag = useDragControls();
  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  // Scroll lock + focus management
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>('[data-autofocus], input, textarea, select, button:not([data-sheet-close])');
      (el ?? panelRef.current)?.focus({ preventScroll: true });
    }, 60);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      (openerRef.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  };

  const widths = { sm: 'md:max-w-md', md: 'md:max-w-xl', lg: 'md:max-w-3xl' };
  const sideWidths = { sm: 'md:w-[400px]', md: 'md:w-[480px]', lg: 'md:w-[640px]' };

  const mode: 'sheet' | 'dialog' | 'side' = !isDesktop ? 'sheet' : desktop;
  const sideFrom = isRtl ? '-100%' : '100%';

  const panelMotion =
    mode === 'sheet'
      ? { initial: { y: '100%' }, animate: { y: 0, transition: spring.gentle }, exit: { y: '100%', transition: { duration: dur.short, ease: ease.in } } }
      : mode === 'side'
        ? { initial: { x: sideFrom }, animate: { x: 0, transition: spring.gentle }, exit: { x: sideFrom, transition: { duration: dur.short, ease: ease.in } } }
        : {
            initial: { opacity: 0, scale: 0.96, y: 8 },
            animate: { opacity: 1, scale: 1, y: 0, transition: { duration: dur.medium, ease: ease.out } },
            exit: { opacity: 0, scale: 0.98, transition: { duration: dur.micro, ease: ease.in } },
          };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cx(
            'fixed inset-0 z-[60] flex',
            mode === 'sheet' && 'items-end',
            mode === 'dialog' && 'items-center justify-center p-6',
            mode === 'side' && 'justify-end'
          )}
        >
          <motion.div
            className="absolute inset-0 bg-[rgb(9_14_25/0.45)] dark:bg-black/60 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: dur.short } }}
            exit={{ opacity: 0, transition: { duration: dur.short } }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            {...panelMotion}
            drag={mode === 'sheet' ? 'y' : false}
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
            className={cx(
              'relative bg-surface text-ink flex flex-col outline-none',
              mode === 'sheet' && 'w-full max-h-[92dvh] rounded-t-xl shadow-float pb-safe',
              mode === 'dialog' && cx('w-full max-h-[86vh] rounded-xl shadow-float', widths[size]),
              mode === 'side' && cx('h-full w-full shadow-float', sideWidths[size]),
              className
            )}
          >
            {mode === 'sheet' && (
              <div
                className="pt-2.5 pb-1 grid place-items-center cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => drag.start(e)}
                aria-hidden
              >
                <span className="w-10 h-1.5 rounded-full bg-line-strong" />
              </div>
            )}
            {!bare && (title || description) ? (
              <div className="flex items-start gap-3 px-5 md:px-7 pt-3 md:pt-6 pb-3">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2 id={titleId} className="text-h3 font-semibold">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descId} className="text-small text-ink-2 mt-1">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  data-sheet-close
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="-me-2 -mt-1 w-11 h-11 shrink-0 grid place-items-center rounded-md text-ink-2 hover:bg-sunken hover:text-ink transition-colors"
                >
                  <X size={22} weight="bold" />
                </button>
              </div>
            ) : (
              title && (
                <h2 id={titleId} className="sr-only">
                  {title}
                </h2>
              )
            )}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-7 pb-5 md:pb-7">{children}</div>
            {footer && <div className="border-t border-line px-5 md:px-7 py-4 bg-surface rounded-b-xl">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
