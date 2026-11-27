import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Microphone, ShieldCheck } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { SahayakWordmark } from '../common/SahayakLogo';
import { cx } from '../../ui/cx';
import { RAIL_ITEMS, isActive } from './nav';
import { FamilySwitcher } from './FamilySwitcher';

/**
 * Desktop rail. Kiosk operators and family "tech proxies" use Sahayak on laptops at CSCs;
 * a persistent rail keeps every hub one click away and leaves the full width for content.
 */
export function SideRail() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { setAiDrawerOpen } = useAppStore();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 start-0 z-30 w-[var(--rail-w)] flex-col bg-paper border-e border-line no-print">
      <Link to="/home" className="flex items-center gap-3 px-6 h-[var(--topbar-h)] shrink-0">
        <SahayakWordmark label={t('shell.brandWordmark', 'SAHAYAK')} />
      </Link>

      <nav aria-label={t('shell.nav.main', 'Main navigation')} className="px-3 pt-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {RAIL_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cx('relative flex items-center gap-3 h-12 px-3.5 rounded-md text-body transition-colors duration-short', active ? 'text-ink font-semibold' : 'text-ink-2 hover:text-ink hover:bg-sunken/70')}
                >
                  {active && <motion.span layoutId="rail-active" className="absolute inset-0 rounded-md bg-surface shadow-lift" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
                  <Icon size={22} weight={active ? 'fill' : 'regular'} className={cx('relative', active ? 'text-neel' : '')} />
                  <span className="relative truncate">{t(item.key, item.fallback)}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setAiDrawerOpen(true)}
          className="mt-6 w-full flex items-center gap-3 p-3 rounded-lg bg-hero-neel text-on-hero text-start hover:brightness-110 transition-colors group"
        >
          <span className="relative w-11 h-11 rounded-full bg-haldi text-[#111E33] grid place-items-center shrink-0">
            <span className="absolute inset-0 rounded-full border-2 border-haldi animate-ring-out" aria-hidden />
            <Microphone size={22} weight="fill" className="relative" />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">{t('shell.nav.speak', 'Speak')}</span>
            <span className="block text-micro opacity-80 truncate">{t('shell.assistantHint', 'Ask anything, in your language')}</span>
          </span>
        </button>
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-line space-y-2">
        <p className="flex items-center gap-2 px-3 text-micro text-ink-3">
          <ShieldCheck size={16} weight="duotone" className="text-patti shrink-0" />
          {t('shell.free', 'Free. Always. No agent needed.')}
        </p>
        <FamilySwitcher placement="up" />
      </div>
    </aside>
  );
}
