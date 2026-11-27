import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bot, X } from 'lucide-react';
import { TopUtilityBar } from '../navigation/TopUtilityBar';
import { BottomNavBar } from '../navigation/BottomNavBar';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { PageMotion } from '../common/PageMotion';

// Dynamic lazy-loading for overlay modals to reduce initial JavaScript payload
const LanguageModal = lazy(() => import('../navigation/LanguageModal').then(m => ({ default: m.LanguageModal })));
const NotificationsModal = lazy(() => import('../navigation/NotificationsModal').then(m => ({ default: m.NotificationsModal })));
const AuthModal = lazy(() => import('../auth/AuthModal').then(m => ({ default: m.AuthModal })));
const AiAssistantDrawer = lazy(() => import('../feedback/AiAssistantDrawer').then(m => ({ default: m.AiAssistantDrawer })));

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const { t } = useTranslation();
  const { 
    setAiDrawerOpen,
    isAiDrawerOpen,
    isAiFabDismissed,
    setAiFabDismissed,
    compareSchemeIds,
    isAuthModalOpen, 
    authModalView, 
    closeAuthModal,
    initializeAuth 
  } = useAppStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Adjust FAB position when comparison tray or SchemeDetail sticky action bar is active
  const isComparisonActive = compareSchemeIds.length > 0;
  const isSchemeDetailBarActive = /^\/schemes\/[^/]+/.test(location.pathname);
  const needsElevatedFab = isComparisonActive || isSchemeDetailBarActive;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Utility Header */}
      <TopUtilityBar
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
      />

      {/* Main Viewport Container — Fluid Responsive Desktop Scaling */}
      <main className="flex-1 layout-container pb-28 sm:pb-28 lg:pb-16 pt-3 sm:pt-6">
        <PageMotion>
          <Outlet />
        </PageMotion>
      </main>

      {/* Floating Action Button (FAB) for Sahayak Sathi AI Voice Assistant */}
      {!isAiFabDismissed && !isAiDrawerOpen && (
        <aside 
          aria-label={t('aiAssistantTitle', 'Sahayak Sathi')}
          className={`fixed z-30 flex items-center transition-all duration-300 right-3.5 sm:right-6 md:right-8 ${
            needsElevatedFab
              ? 'bottom-[calc(8.5rem+env(safe-area-inset-bottom,0px))] lg:bottom-24' 
              : 'bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-8'
          }`}
        >
          <div className="relative group flex items-center">
            <button
              type="button"
              onClick={() => setAiDrawerOpen(true)}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-crisp-lg active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              title={t('openAssistantAria', 'Open Sahayak Sathi voice assistant')}
              aria-label={t('openAssistantAria', 'Open Sahayak Sathi voice assistant')}
            >
              <div className="relative flex-shrink-0">
                <Bot className="w-6 h-6 text-slate-950" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-amber-500 animate-pulse" />
              </div>
            </button>

            {/* Quick Dismiss Trigger to prevent blocking content on touch screens */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAiFabDismissed(true);
              }}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ml-1.5 p-1 rounded-full bg-slate-800/80 text-white hover:bg-slate-900 shadow-sm min-h-[28px] min-w-[28px] flex items-center justify-center text-xs"
              title={t('dismissAssistantAria', 'Hide voice assistant button')}
              aria-label={t('dismissAssistantAria', 'Hide voice assistant button')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Persistent Bottom Navigation Dock */}
      <BottomNavBar />

      {/* Overlays & Modals (Lazy-loaded on demand) */}
      <Suspense fallback={null}>
        {isLangModalOpen && (
          <LanguageModal
            isOpen={isLangModalOpen}
            onClose={() => setIsLangModalOpen(false)}
          />
        )}

        {isNotifModalOpen && (
          <NotificationsModal
            isOpen={isNotifModalOpen}
            onClose={() => setIsNotifModalOpen(false)}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            initialView={authModalView}
          />
        )}

        {isAiDrawerOpen && <AiAssistantDrawer />}
      </Suspense>
    </div>
  );
};
