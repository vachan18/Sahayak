import { motion, type Variants } from 'framer-motion';
import { cx } from './cx';

const word: Variants = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } },
};

/**
 * Headline reveal — words rise into place and come into focus, one after another.
 * Screen readers get the sentence once (aria-label); the animated words are hidden from them.
 * Works for every script: Indic and Urdu words are split on spaces, never mid-cluster.
 */
export function SplitText({ text, className, delay = 0, stagger = 0.045 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const words = text.split(/(\s+)/).filter(Boolean);
  return (
    <motion.span
      aria-label={text}
      className={cx('inline', className)}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((w, i) =>
        /\s+/.test(w) ? (
          <span key={i} aria-hidden> </span>
        ) : (
          <motion.span key={i} aria-hidden variants={word} className="inline-block will-change-transform">
            {w}
          </motion.span>
        )
      )}
    </motion.span>
  );
}
