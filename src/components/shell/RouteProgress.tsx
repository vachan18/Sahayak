import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/** A thin brand-orange line that sweeps across the top on every navigation — "something is happening". */
export function RouteProgress() {
  const { pathname } = useLocation();
  return (
    <div className="fixed top-0 inset-x-0 z-[75] h-[3px] pointer-events-none no-print" aria-hidden>
      <AnimatePresence>
        <motion.div
          key={pathname}
          className="absolute inset-y-0 start-0 bg-haldi rounded-e-full shadow-[0_0_8px_rgb(var(--c-haldi)/0.6)]"
          initial={{ width: '0%', opacity: 1 }}
          animate={{ width: '100%', opacity: [1, 1, 0], transition: { width: { duration: 0.55, ease: [0.2, 0, 0, 1] }, opacity: { duration: 0.8, times: [0, 0.7, 1] } } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        />
      </AnimatePresence>
    </div>
  );
}
