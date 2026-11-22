import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Bell, Sun, Moon, Volume2, User, ChevronLeft, LogIn } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';

interface TopUtilityBarProps {
  onOpenLanguageModal: () => void;
  onOpenNotifications: () => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  onOpenLanguageModal,
  onOpenNotifications
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { 
    isDarkMode, 
    toggleDarkMode, 
    isAudioAssistanceEnabled, 
    toggleAudioAssistance,
    notifications,
    authUser,
    openAuthModal
  } = useAppStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isRootScreen = ['/', '/home', '/schemes', '/eligibility', '/documents', '/tracker'].includes(location.pathname);

  const getLanguageLabel = () => {
    switch (language) {
      case 'kn': return 'ಕನ್ನಡ';
      case 'hi': return 'हिन्दी';
      default: return 'English';
    }
  };

  const desktopNavItems = [
    { to: '/home', label: t('navHome', 'Home') },
    { to: '/schemes', label: t('catalogTitle', 'All Schemes') },
    { to: '/eligibility', label: t('navEligibility', 'Check Eligibility') },
    { to: '/documents', label: t('navDocuments', 'Documents') },
    { to: '/tracker', label: t('navTracker', 'Tracker') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="layout-container h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand or Back Button */}
        <div className="flex items-center gap-3">
          {!isRootScreen ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Go back to previous screen"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>{t('navBack', 'Back')}</span>
            </button>
          ) : (
            <Link to="/home" className="flex items-center gap-2.5 group">
              {/* Sovereign Tricolor Accent Emblem */}
              <div className="w-9 h-9 rounded-xl bg-brand-navy-900 dark:bg-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm ring-2 ring-amber-500/50 group-hover:scale-105 transition-transform">
                <span>ಸ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl leading-tight tracking-tight text-slate-900 dark:text-white">
                  {t('appName', 'SAHAYAK')}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold tracking-wider uppercase">
                  {language === 'kn' ? 'ಸಹಾಯಕ • ಭಾರತ' : language === 'hi' ? 'सहायक • भारत' : 'Bharat Welfare'}
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav aria-label="Desktop primary navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
          {desktopNavItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/home' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-navy-900 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Global Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
            aria-label="Change application language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{getLanguageLabel()}</span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>

          {/* Audio Assistance Toggle */}
          <button
            type="button"
            onClick={toggleAudioAssistance}
            title={isAudioAssistanceEnabled ? "Audio voiceover ON" : "Audio voiceover OFF"}
            className={`p-2 rounded-full text-xs font-semibold transition-all active:scale-90 ${
              isAudioAssistanceEnabled 
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 ring-2 ring-amber-400/50' 
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Toggle spoken audio assistance"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title="Toggle theme"
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Center */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile or Cloud Login Button */}
          {authUser ? (
            <Link
              to="/profile"
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:ring-2 hover:ring-amber-500 text-slate-700 dark:text-slate-200 transition-all ml-0.5"
              aria-label="View user profile"
              title={authUser.email || "Authenticated Citizen"}
            >
              <div className="w-5 h-5 rounded-full bg-brand-navy-900 text-white text-[10px] font-bold flex items-center justify-center">
                {authUser.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[90px] truncate">
                {authUser.user_metadata?.full_name || authUser.email?.split('@')[0]}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Cloud Synced" />
            </Link>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 dark:hover:bg-sky-500 shadow-crisp-xs active:scale-95 transition-all"
                aria-label="Sign in to your account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'kn' ? 'ಲಾಗಿನ್' : language === 'hi' ? 'लॉग इन' : 'Sign In'}</span>
              </button>
              <Link
                to="/profile"
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:ring-2 hover:ring-amber-500 text-slate-700 dark:text-slate-200 transition-all ml-0.5"
                aria-label="View user profile"
                title="Guest Mode Profile"
              >
                <User className="w-4 h-4 text-brand-navy-900 dark:text-sky-400" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
