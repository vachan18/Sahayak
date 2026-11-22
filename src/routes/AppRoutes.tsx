import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { WelcomeScreen } from '../pages/WelcomeScreen';
import { LanguageSelectionScreen } from '../pages/LanguageSelectionScreen';
import { OnboardingScreen } from '../pages/OnboardingScreen';
import { HomeScreen } from '../pages/HomeScreen';
import { SchemeDiscoveryScreen } from '../pages/SchemeDiscoveryScreen';
import { SchemeDetailScreen } from '../pages/SchemeDetailScreen';
import { EligibilityCheckerScreen } from '../pages/EligibilityCheckerScreen';
import { EligibilityResultsScreen } from '../pages/EligibilityResultsScreen';
import { DocumentChecklistScreen } from '../pages/DocumentChecklistScreen';
import { ApplicationGuidanceScreen } from '../pages/ApplicationGuidanceScreen';
import { CscSlipScreen } from '../pages/CscSlipScreen';
import { ApplicationTrackerScreen } from '../pages/ApplicationTrackerScreen';
import { ApplicationTrackerDetailScreen } from '../pages/ApplicationTrackerDetailScreen';
import { UserProfileScreen } from '../pages/UserProfileScreen';
import { NotificationsScreen } from '../pages/NotificationsScreen';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Entry Views */}
      <Route path="/" element={<WelcomeScreen />} />
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
        <Route path="/tracker" element={<ApplicationTrackerScreen />} />
        <Route path="/tracker/:id" element={<ApplicationTrackerDetailScreen />} />
        <Route path="/profile" element={<UserProfileScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
