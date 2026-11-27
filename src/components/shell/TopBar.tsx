import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowLeft, Bell, MagnifyingGlass, TextAa } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGE_META } from '../../data/languages';
import { SahayakWordmark } from '../common/SahayakLogo';
import { IconButton } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { ROOT_PATHS } from './nav';
import { Avatar } from './FamilySwitcher';

/**
 * Top bar.
 * Phone: logo or Back on the start side; language, comfort, alerts, family on the end side.
 *        Slides away while you read (scroll down) and returns the moment you scroll up.
 * Desktop: a wide search field that opens the command palette (Ctrl/⌘ K).
 */
export function TopBar() {
  const { t, language } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { notifications, setLanguageSheetOpen, setComfortOpen, setNotificationsOpen, setCommandOpen, profiles, activeProfileId } = useAppStore();
  const unread = notifications.filter((n) => !n.isRead).length;
  const isRoot = ROOT_PATHS.includes(pathname);
  const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
  const activeIndex = Math.max(0, profiles.findIndex((p) => p.id === activeProfileId));

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 140 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
      className={cx(
        'sticky top-0 z-40 pt-safe no-print transition-[background-color,box-shadow] duration-medium lg:!transform-none',
        scrolled ? 'bg-paper/90 backdrop-blur-xl shadow-[0_1px_0_rgb(var(--c-line))]' : 'bg-paper'
      )}
    >
      <div className="h-[var(--topbar-h)] flex items-center gap-2 px-3 sm:px-5 lg:px-8">
        {/* Start: brand / back (phones). Desktop shows search instead — brand lives in the rail. */}
        <div className="flex items-center min-w-0 lg:hidden">
          {isRoot ? (
            <Link to="/home" className="flex items-center gap-2.5 ps-1 pe-2 h-11 rounded-md">
              <SahayakWordmark label={t('shell.brandWordmark', 'SAHAYAK')} />
            </Link>
          ) : (
            <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 h-11 ps-2 pe-3 rounded-md font-semibold hover:bg-sunken">
              <ArrowLeft size={22} weight="bold" className="flip-rtl" />
              <span>{t('shell.nav.back', 'Back')}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden lg:flex items-center gap-3 h-12 flex-1 max-w-xl px-4 rounded-md bg-surface shadow-hair text-ink-3 hover:shadow-lift transition-shadow text-start"
        >
          <MagnifyingGlass size={20} weight="bold" />
          <span className="flex-1 truncate">{t('shell.search.placeholder', 'Search schemes, papers or help…')}</span>
          <kbd className="num text-micro px-2 py-0.5 rounded-xs bg-sunken text-ink-2 font-semibold">Ctrl K</kbd>
        </button>

        <div className="flex-1" />

        {/* End: global controls */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <IconButton label={t('shell.search.open', 'Search')} onClick={() => setCommandOpen(true)} className="lg:hidden hidden xs:inline-flex">
            <MagnifyingGlass size={22} />
          </IconButton>
          <button
            type="button"
            onClick={() => setLanguageSheetOpen(true)}
            aria-label={`${t('shell.language.change', 'Change language')} — ${meta.label}`}
            className="h-11 ps-2.5 pe-3 rounded-md flex items-center gap-2 hover:bg-sunken transition-colors"
          >
            <span className="w-7 h-7 rounded-xs bg-ink text-paper grid place-items-center text-[0.95rem] font-semibold leading-none">{meta.shortCode}</span>
            <span className="hidden sm:inline text-small font-semibold">{meta.label}</span>
          </button>
          <IconButton label={t('shell.comfort.open', 'Reading comfort settings')} onClick={() => setComfortOpen(true)}>
            <TextAa size={22} />
          </IconButton>
          <IconButton label={`${t('navNotifications', 'Notifications')}${unread ? ` (${unread})` : ''}`} badge={unread} onClick={() => setNotificationsOpen(true)}>
            <Bell size={22} />
          </IconButton>
          <Link to="/profile" aria-label={t('navProfile', 'Profile')} className="ms-1 rounded-full">
            <Avatar profile={profiles[activeIndex]} index={activeIndex} size={38} />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
