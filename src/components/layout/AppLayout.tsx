import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { TopUtilityBar } from '../navigation/TopUtilityBar';
import { BottomNavBar } from '../navigation/BottomNavBar';
import { LanguageModal } from '../navigation/LanguageModal';
import { NotificationsModal } from '../navigation/NotificationsModal';
import { AiAssistantDrawer } from '../feedback/AiAssistantDrawer';
import { AuthModal } from '../auth/AuthModal';
import { useAppStore } from '../../store/useAppStore';

export const AppLayout: React.FC = () => {
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const { 
    setAiDrawerOpen, 
    isAuthModalOpen, 
    authModalView, 
    closeAuthModal,
    initializeAuth 
  } = useAppStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Utility Header */}
      <TopUtilityBar
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
      />

      {/* Main Viewport Container — Fluid Responsive Desktop Scaling */}
      <main className="flex-1 layout-container pb-24 md:pb-16 pt-4 sm:pt-6">
        <Outlet />
      </main>

      {/* Floating Action Button (FAB) for Sahayak Sathi AI Voice Assistant */}
      <aside aria-label="Voice assistance trigger">
        <button
          type="button"
          onClick={() => setAiDrawerOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-30 flex items-center gap-2 py-3 px-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-crisp-lg active:scale-95 transition-all group"
          aria-label="Open Sahayak Sathi voice assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-amber-500 animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm tracking-tight pr-1">ಸಹಾಯಕ ಸಾಥಿ (Voice)</span>
        </button>
      </aside>

      {/* Mobile Persistent Bottom Navigation Dock */}
      <BottomNavBar />

      {/* Overlays & Modals */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialView={authModalView}
      />

      <AiAssistantDrawer />
    </div>
  );
};
