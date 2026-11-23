import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Bell, Sun, Moon, Volume2, User, ChevronLeft, LogIn, SunMedium, Bot } from 'lucide-react';
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
    isHighSunlightMode,
    toggleHighSunlightMode,
    isAudioAssistanceEnabled, 
    toggleAudioAssistance,
    notifications,
    authUser,
    openAuthModal,
    setAiDrawerOpen,
    isAiFabDismissed,
    setAiFabDismissed
  } = useAppStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isRootScreen = ['/', '/home', '/schemes', '/eligibility', '/documents', '/tracker'].includes(location.pathname);

  const getLanguageLabel = () => {
    switch (language) {
      case 'kn': return 'ಕನ್ನಡ';
      case 'hi': return 'हिन्दी';
      case 'bn': return 'বাংলা';
      default: return 'English';
    }
  };

  const getLanguageShortCode = () => {
    switch (language) {
      case 'kn': return 'ಕ';
      case 'hi': return 'हि';
      case 'bn': return 'বা';
      default: return 'EN';
    }
  };

  const desktopNavItems = [
    { to: '/home', label: t('navHome', 'Home'), shortLabel: t('navHome', 'Home') },
    { to: '/schemes', label: t('catalogTitle', 'All Schemes'), shortLabel: t('catalogTitle', 'Schemes') },
    { to: '/eligibility', label: t('navEligibility', 'Check Eligibility'), shortLabel: t('navEligibility', 'Eligibility') },
    { to: '/documents', label: t('navDocuments', 'Documents'), shortLabel: t('navDocuments', 'Docs') },
    { to: '/tracker', label: t('navTracker', 'Tracker'), shortLabel: t('navTracker', 'Tracker') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="layout-container h-16 flex items-center justify-between gap-1 sm:gap-3 lg:gap-4">
        {/* Left Side: Brand or Back Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 min-w-0">
          {!isRootScreen ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 py-1.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all min-h-[38px] sm:min-h-[44px]"
              aria-label="Go back to previous screen"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <span>{t('navBack', 'Back')}</span>
            </button>
          ) : (
            <Link to="/home" className="flex items-center gap-1.5 sm:gap-2.5 group">
              {/* Sovereign Tricolor Accent Emblem */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-xl bg-brand-navy-900 dark:bg-sky-500 flex items-center justify-center text-white font-extrabold text-sm sm:text-base lg:text-lg shadow-sm ring-2 ring-amber-500/50 group-hover:scale-105 transition-transform flex-shrink-0">
                <span>ಸ</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm sm:text-base lg:text-lg xl:text-xl leading-tight tracking-tight text-slate-900 dark:text-white truncate">
                  {t('appName', 'SAHAYAK')}
                </span>
                <span className="hidden xl:inline text-[10px] text-amber-700 dark:text-amber-400 font-bold tracking-wider uppercase truncate">
                  {language === 'kn' ? 'ಸಹಾಯಕ • ಭಾರತ' : language === 'hi' ? 'सहायक • भारत' : language === 'bn' ? 'সহায়ক • ভারত' : 'Bharat Welfare'}
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Center: Desktop Navigation Bar with Responsive Adaptive Labels */}
        <nav aria-label="Desktop primary navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-2 flex-shrink-0">
          {desktopNavItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/home' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2 py-1 text-xs xl:px-3.5 xl:py-2 xl:text-sm rounded-xl font-semibold transition-all whitespace-nowrap min-h-[36px] flex items-center ${
                  isActive
                    ? 'bg-brand-navy-900 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Global Controls */}
        <div className="flex items-center gap-1 sm:gap-1 xl:gap-2 flex-shrink-0">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1 px-1.5 sm:px-2 xl:px-2.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all min-h-[36px] sm:min-h-[40px] xl:min-h-[44px]"
            aria-label={`${getLanguageLabel()} - ${t('navLanguage', 'Language')}`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="hidden xl:inline">{getLanguageLabel()}</span>
            <span className="xl:hidden font-bold">{getLanguageShortCode()}</span>
            <span className="text-[10px] text-slate-400 hidden xs:inline">▼</span>
          </button>

          {/* Audio Assistance Toggle */}
          <button
            type="button"
            onClick={toggleAudioAssistance}
            title={isAudioAssistanceEnabled ? "Audio voiceover ON" : "Audio voiceover OFF"}
            className={`p-1.5 sm:p-2 rounded-full text-xs font-semibold transition-all active:scale-90 min-w-[34px] sm:min-w-[38px] xl:min-w-[44px] min-h-[34px] sm:min-h-[38px] xl:min-h-[44px] flex items-center justify-center ${
              isAudioAssistanceEnabled 
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 ring-2 ring-amber-400/50' 
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Toggle spoken audio assistance"
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title="Toggle theme"
            className="p-1.5 sm:p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90 min-w-[34px] sm:min-w-[38px] xl:min-w-[44px] min-h-[34px] sm:min-h-[38px] xl:min-h-[44px] flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 flex-shrink-0" />}
          </button>

          {/* High-Contrast / Bright-Sunlight Display Mode */}
          <button
            type="button"
            onClick={toggleHighSunlightMode}
            title={isHighSunlightMode ? "High contrast / Sunlight mode ON" : "High contrast / Sunlight mode OFF"}
            className={`p-1.5 sm:p-2 rounded-full transition-all active:scale-90 min-w-[34px] sm:min-w-[38px] xl:min-w-[44px] min-h-[34px] sm:min-h-[38px] xl:min-h-[44px] flex items-center justify-center ${
              isHighSunlightMode 
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Toggle high contrast bright sunlight mode"
          >
            <SunMedium className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          </button>

          {/* Restorable Voice Assistant Icon (when FAB is dismissed) */}
          {isAiFabDismissed && (
            <button
              type="button"
              onClick={() => {
                setAiDrawerOpen(true);
                setAiFabDismissed(false);
              }}
              title={t('aiAssistantTitle', 'Sahayak Sathi') + ' (Voice)'}
              className="p-1.5 sm:p-2 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition-all active:scale-90 min-w-[34px] sm:min-w-[38px] xl:min-w-[44px] min-h-[34px] sm:min-h-[38px] xl:min-h-[44px] flex items-center justify-center relative"
              aria-label={t('openAssistantAria', 'Open Sahayak Sathi voice assistant')}
            >
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          )}

          {/* Notifications Center */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90 min-w-[34px] sm:min-w-[38px] xl:min-w-[44px] min-h-[34px] sm:min-h-[38px] xl:min-h-[44px] flex items-center justify-center"
          >
            <span className="sr-only">{unreadCount > 0 ? `Notifications (${unreadCount})` : "Notifications"}</span>
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
            {unreadCount > 0 && (
              <span aria-hidden="true" className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-700 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile or Cloud Login Button */}
          {authUser ? (
            <Link
              to="/profile"
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:ring-2 hover:ring-amber-500 text-slate-700 dark:text-slate-200 transition-all min-w-[36px] sm:min-w-[44px] min-h-[36px] sm:min-h-[44px] justify-center"
              aria-label="View user profile"
              title={authUser.email || "Authenticated Citizen"}
            >
              <div className="w-5 h-5 rounded-full bg-brand-navy-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {authUser.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden xl:inline text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[80px] lg:max-w-[100px] truncate">
                {authUser.user_metadata?.full_name || authUser.email?.split('@')[0]}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex-shrink-0" title="Cloud Synced" />
            </Link>
          ) : (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 dark:hover:bg-sky-500 shadow-crisp-xs active:scale-95 transition-all min-h-[38px]"
                aria-label={language === 'kn' ? 'ಲಾಗಿನ್' : language === 'hi' ? 'लॉग इन' : language === 'bn' ? 'লগইন' : 'Sign In'}
              >
                <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{language === 'kn' ? 'ಲಾಗಿನ್' : language === 'hi' ? 'लॉग इन' : language === 'bn' ? 'লগইন' : 'Sign In'}</span>
              </button>
              <Link
                to="/profile"
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:ring-2 hover:ring-amber-500 text-slate-700 dark:text-slate-200 transition-all min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px] flex items-center justify-center lg:hidden"
                aria-label="View user profile"
                title="Guest Mode Profile"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-navy-900 dark:text-sky-400" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
