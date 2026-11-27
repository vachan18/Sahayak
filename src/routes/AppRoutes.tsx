import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomeScreen } from '../pages/HomeScreen';

// Route-level code splitting via React.lazy for secondary screens
const WelcomeScreen = lazy(() => import('../pages/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
const LanguageSelectionScreen = lazy(() => import('../pages/LanguageSelectionScreen').then(m => ({ default: m.LanguageSelectionScreen })));
const OnboardingScreen = lazy(() => import('../pages/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })));
const SchemeDiscoveryScreen = lazy(() => import('../pages/SchemeDiscoveryScreen').then(m => ({ default: m.SchemeDiscoveryScreen })));
const SchemeDetailScreen = lazy(() => import('../pages/SchemeDetailScreen').then(m => ({ default: m.SchemeDetailScreen })));
const EligibilityCheckerScreen = lazy(() => import('../pages/EligibilityCheckerScreen').then(m => ({ default: m.EligibilityCheckerScreen })));
const EligibilityResultsScreen = lazy(() => import('../pages/EligibilityResultsScreen').then(m => ({ default: m.EligibilityResultsScreen })));
const DocumentChecklistScreen = lazy(() => import('../pages/DocumentChecklistScreen').then(m => ({ default: m.DocumentChecklistScreen })));
const ApplicationGuidanceScreen = lazy(() => import('../pages/ApplicationGuidanceScreen').then(m => ({ default: m.ApplicationGuidanceScreen })));
const CscSlipScreen = lazy(() => import('../pages/CscSlipScreen').then(m => ({ default: m.CscSlipScreen })));
const ApplicationTrackerScreen = lazy(() => import('../pages/ApplicationTrackerScreen').then(m => ({ default: m.ApplicationTrackerScreen })));
const ApplicationTrackerDetailScreen = lazy(() => import('../pages/ApplicationTrackerDetailScreen').then(m => ({ default: m.ApplicationTrackerDetailScreen })));
const UserProfileScreen = lazy(() => import('../pages/UserProfileScreen').then(m => ({ default: m.UserProfileScreen })));
const NotificationsScreen = lazy(() => import('../pages/NotificationsScreen').then(m => ({ default: m.NotificationsScreen })));

const RouteLoadingFallback: React.FC = () => (
  <div 
    className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3"
    role="status"
    aria-live="polite"
    aria-label="Loading page content"
  >
    <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
    <span className="text-xs font-semibold text-slate-400">Loading...</span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Root redirect to Main Dashboard */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/language" element={<LanguageSelectionScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />

        {/* Main Authenticated / Nested App Shell */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/schemes" element={<SchemeDiscoveryScreen />} />
          <Route path="/schemes/:id" element={<SchemeDetailScreen />} />
          <Route path="/eligibility" element={<EligibilityCheckerScreen />} />
          <Route path="/eligibility/results" element={<EligibilityResultsScreen />} />
          <Route path="/documents" element={<DocumentChecklistScreen />} />
          <Route path="/guidance/:id" element={<ApplicationGuidanceScreen />} />
          <Route path="/csc-slip/:tokenId" element={<CscSlipScreen />} />
          <Route path="/csc-slip" element={<CscSlipScreen />} />
          <Route path="/tracker" element={<ApplicationTrackerScreen />} />
          <Route path="/tracker/:id" element={<ApplicationTrackerDetailScreen />} />
          <Route path="/profile" element={<UserProfileScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
        </Route>

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
};
