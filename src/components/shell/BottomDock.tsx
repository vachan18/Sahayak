import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Microphone } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { haptic } from '../../lib/haptics';
import { cx } from '../../ui/cx';
import { DOCK_LEFT, DOCK_RIGHT, isActive, NavItem } from './nav';

function DockTab({ item }: { item: NavItem }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const active = isActive(pathname, item);
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={() => haptic('select')}
      aria-current={active ? 'page' : undefined}
      className="relative flex flex-col items-center justify-center gap-0.5 h-full min-w-0 px-1"
    >
      {active && (
        <motion.span layoutId="dock-indicator" className="absolute top-0 h-[3px] w-8 rounded-b-full bg-haldi" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />
      )}
      <motion.span animate={{ y: active ? -1 : 0, scale: active ? 1.06 : 1 }} transition={{ type: 'spring', stiffness: 520, damping: 30 }}>
        <Icon size={26} weight={active ? 'fill' : 'regular'} className={active ? 'text-ink' : 'text-ink-3'} />
      </motion.span>
      <span className={cx('text-micro truncate max-w-full', active ? 'text-ink font-semibold' : 'text-ink-3 font-medium')}>{t(item.key, item.fallback)}</span>
    </NavLink>
  );
}

/**
 * Phone dock. Four destinations sit in the thumb arc; the Speak button sits in the
 * middle, raised out of the bar, because voice is the primary input for most users.
 */
export function BottomDock() {
  const { t } = useTranslation();
  const { setAiDrawerOpen, isAiDrawerOpen } = useAppStore();

  return (
    <nav aria-label={t('shell.nav.main', 'Main navigation')} className="lg:hidden fixed inset-x-0 bottom-0 z-40 no-print">
      <div className="relative bg-surface/95 backdrop-blur-xl shadow-dock pb-safe">
        <div className="grid grid-cols-5 h-[var(--dock-h)] max-w-lg mx-auto">
          {DOCK_LEFT.map((i) => (
            <DockTab key={i.to} item={i} />
          ))}
          <div className="relative flex flex-col items-center justify-end pb-1.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                haptic('select');
                setAiDrawerOpen(true);
              }}
              aria-label={t('openAssistantAria', 'Open voice assistant')}
              aria-expanded={isAiDrawerOpen}
              className="absolute -top-6 w-[62px] h-[62px] rounded-full bg-haldi text-[#111E33] grid place-items-center shadow-[0_10px_24px_-8px_rgb(var(--c-haldi-deep)/0.6),0_0_0_5px_rgb(var(--c-surface))]"
            >
              <Microphone size={28} weight="fill" />
            </motion.button>
            <span className="text-micro font-semibold text-ink">{t('shell.nav.speak', 'Speak')}</span>
          </div>
          {DOCK_RIGHT.map((i) => (
            <DockTab key={i.to} item={i} />
          ))}
        </div>
      </div>
    </nav>
  );
}
