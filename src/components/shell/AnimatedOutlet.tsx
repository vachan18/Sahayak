import React, { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants } from '../../ui/motion';

const depthOf = (path: string) => path.split('/').filter(Boolean).length;

/**
 * Direction-aware route transitions.
 *  • deeper (list → detail)  → new page slides in from the reading-end edge
 *  • back   (detail → list)  → reverses
 *  • lateral (tab → tab)     → quiet rise + fade, no sideways motion
 * The outgoing page is "frozen" so it can animate out with its own content.
 */
export function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const prev = useRef(location.pathname);
  const dirRef = useRef(0);

  if (prev.current !== location.pathname) {
    const a = depthOf(prev.current);
    const b = depthOf(location.pathname);
    const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    const raw = b > a ? 1 : b < a ? -1 : 0;
    dirRef.current = rtl ? -raw : raw;
    prev.current = location.pathname;
  }

  // Keep the element for the exiting route stable
  const frozen = useRef<{ key: string; el: React.ReactNode }>({ key: location.pathname, el: outlet });
  if (frozen.current.key !== location.pathname) frozen.current = { key: location.pathname, el: outlet };
  else frozen.current.el = outlet;

  return (
    <AnimatePresence mode="wait" initial={false} custom={dirRef.current} onExitComplete={() => window.scrollTo({ top: 0 })}>
      <motion.div key={location.pathname} custom={dirRef.current} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        {frozen.current.el}
      </motion.div>
    </AnimatePresence>
  );
}
