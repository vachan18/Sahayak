import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CaretDown } from '@phosphor-icons/react';
import { cx } from './cx';
import { riseIn, staggerParent, ease, dur } from './motion';
import { SplitText } from './SplitText';

/**
 * Page header. Large, editorial title — the single most important line on the screen.
 * On phones the title sits under the top bar; there is no duplicate "screen name" chrome.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.header variants={staggerParent(0.06)} initial="hidden" animate="show" className={cx('pt-2 md:pt-4 pb-6 md:pb-8', className)}>
      <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <motion.div variants={riseIn} className="mb-2 text-small font-semibold text-ink-3">
              {eyebrow}
            </motion.div>
          )}
          <h1 className="text-h1 font-semibold text-ink">{typeof title === 'string' ? <SplitText text={title} delay={0.05} /> : title}</h1>
          {description && (
            <motion.p variants={riseIn} className="text-lead text-ink-2 mt-3 max-w-2xl">
              {description}
            </motion.p>
          )}
        </div>
        {actions && (
          <motion.div variants={riseIn} className="flex flex-wrap gap-2 md:justify-end shrink-0">
            {actions}
          </motion.div>
        )}
      </div>
      {children && <motion.div variants={riseIn} className="mt-6">{children}</motion.div>}
    </motion.header>
  );
}

export function SectionHeader({ title, description, to, linkLabel, id, className }: { title: React.ReactNode; description?: React.ReactNode; to?: string; linkLabel?: string; id?: string; className?: string }) {
  return (
    <div className={cx('flex items-end justify-between gap-4 mb-4 md:mb-5', className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-h2 font-semibold">
          {title}
        </h2>
        {description && <p className="text-ink-2 mt-1">{description}</p>}
      </div>
      {to && linkLabel && (
        <Link to={to} className="group shrink-0 inline-flex items-center gap-1.5 h-10 px-1 text-small font-semibold text-neel-ink hover:underline underline-offset-4">
          {linkLabel}
          <ArrowRight size={16} weight="bold" className="flip-rtl transition-transform duration-short group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/** Stagger children into view once, as they scroll in. */
export function Reveal({ children, className, stagger = 0.06, as = 'div' }: { children: React.ReactNode; className?: string; stagger?: number; as?: 'div' | 'ul' | 'section' | 'ol' }) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={staggerParent(stagger)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={riseIn}>
      {children}
    </Comp>
  );
}

/** Animated disclosure — height animates, chevron rotates, content stays in the DOM order. */
export function Disclosure({ summary, children, defaultOpen = false, className }: { summary: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cx('rounded-md bg-surface shadow-hair', className)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 text-start px-4 min-h-[56px] py-3 font-semibold">
        <span className="flex-1 min-w-0">{summary}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: dur.short, ease: ease.out }} className="text-ink-3">
          <CaretDown size={18} weight="bold" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: dur.medium, ease: ease.out } }}
            exit={{ height: 0, opacity: 0, transition: { duration: dur.short, ease: ease.in } }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-ink-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
