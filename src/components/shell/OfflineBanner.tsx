import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiSlash, WifiHigh } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * Connectivity is patchy in rural India. Instead of failing silently we say so,
 * and tell people what still works — then confirm when they're back.
 */
export function OfflineBanner() {
  const { t } = useTranslation();
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const up = () => {
      setOnline(true);
      setShowBack(true);
      setTimeout(() => setShowBack(false), 2600);
    };
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  const visible = !online || showBack;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={online ? 'bg-patti text-white overflow-hidden' : 'bg-ink text-paper overflow-hidden'}
        >
          <div className="flex items-center gap-3 px-4 lg:px-8 py-2.5 text-small">
            {online ? <WifiHigh size={20} weight="bold" /> : <WifiSlash size={20} weight="bold" />}
            <span className="font-semibold">{online ? t('shell.online.back', 'Back online') : t('shell.offline.title', 'You are offline')}</span>
            {!online && <span className="opacity-80 hidden sm:inline">{t('shell.offline.body')}</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
