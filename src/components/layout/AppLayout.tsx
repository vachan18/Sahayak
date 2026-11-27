import { useEffect, useState, lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { ensureScriptFont } from '../../lib/fonts';
import { SideRail } from '../shell/SideRail';
import { TopBar } from '../shell/TopBar';
import { BottomDock } from '../shell/BottomDock';
import { AnimatedOutlet } from '../shell/AnimatedOutlet';
import { OfflineBanner } from '../shell/OfflineBanner';
import { RouteProgress } from '../shell/RouteProgress';
import { Toaster } from '../../ui/Toaster';

// Overlays are code-split; they cost nothing until opened.
const LanguageSheet = lazy(() => import('../shell/LanguageSheet').then((m) => ({ default: m.LanguageSheet })));
const ComfortSheet = lazy(() => import('../shell/ComfortSheet').then((m) => ({ default: m.ComfortSheet })));
const CommandPalette = lazy(() => import('../shell/CommandPalette').then((m) => ({ default: m.CommandPalette })));
const NotificationsModal = lazy(() => import('../navigation/NotificationsModal').then((m) => ({ default: m.NotificationsModal })));
const AuthModal = lazy(() => import('../auth/AuthModal').then((m) => ({ default: m.AuthModal })));
const AiAssistantDrawer = lazy(() => import('../feedback/AiAssistantDrawer').then((m) => ({ default: m.AiAssistantDrawer })));

/**
 * App shell
 *  ≥1024px  rail (start) · top bar with search · content column
 *  <1024px  top bar · content · dock with central Speak button
 */
export function AppLayout() {
  const { t, language } = useTranslation();
  const {
    initializeAuth,
    isLiteMode,
    isAiDrawerOpen,
    isAuthModalOpen,
    authModalView,
    closeAuthModal,
    isNotificationsOpen,
    setNotificationsOpen,
    isLanguageSheetOpen,
    isComfortOpen,
  } = useAppStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // PWA shortcut / deep link: /home?speak=1 opens the voice assistant straight away
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('speak') === '1') {
      useAppStore.getState().setAiDrawerOpen(true);
      params.delete('speak');
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  // Lazy overlays stay mounted after first open so their exit animations can play.
  const [mounted, setMounted] = useState({ lang: false, comfort: false, ai: false, notif: false, auth: false });
  useEffect(() => {
    setMounted((m) => ({
      lang: m.lang || isLanguageSheetOpen,
      comfort: m.comfort || isComfortOpen,
      ai: m.ai || isAiDrawerOpen,
      notif: m.notif || isNotificationsOpen,
      auth: m.auth || isAuthModalOpen,
    }));
  }, [isLanguageSheetOpen, isComfortOpen, isAiDrawerOpen, isNotificationsOpen, isAuthModalOpen]);

  useEffect(() => {
    ensureScriptFont(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <MotionConfig reducedMotion={isLiteMode ? 'always' : 'user'}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[80] focus:px-4 focus:py-3 focus:rounded-md focus:bg-ink focus:text-paper">
        {t('shell.nav.skipToContent', 'Skip to main content')}
      </a>
      <RouteProgress />
      <SideRail />
      <div className="lg:ps-[var(--rail-w)] min-h-[100dvh] flex flex-col">
        <OfflineBanner />
        <TopBar />
        <main id="main" tabIndex={-1} className="flex-1 w-full max-w-[1240px] mx-auto overflow-x-clip px-4 sm:px-6 lg:px-10 pt-2 lg:pt-4 pb-[calc(var(--dock-h)+var(--safe-b)+40px)] lg:pb-16 outline-none">
          <AnimatedOutlet />
        </main>
      </div>
      <BottomDock />
      <Toaster />

      <Suspense fallback={null}>
        <CommandPalette />
        {(mounted.lang || isLanguageSheetOpen) && <LanguageSheet />}
        {(mounted.comfort || isComfortOpen) && <ComfortSheet />}
        {(mounted.notif || isNotificationsOpen) && <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />}
        {(mounted.auth || isAuthModalOpen) && <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialView={authModalView} />}
        {/* The assistant reads its own open state from the store (isAiDrawerOpen) */}
        {(mounted.ai || isAiDrawerOpen) && <AiAssistantDrawer />}
      </Suspense>
    </MotionConfig>
  );
}
