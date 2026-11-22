# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Component Inventory & UI Catalog
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 4 Deliverable

---

## 1. Global Layout & Structural Components

```
+---------------------------------------------------------------------------------------------------------+
| Component Name         | File Location                           | Key Props / Capabilities             |
+---------------------------------------------------------------------------------------------------------+
| AppLayout              | src/components/layout/AppLayout.tsx     | Global header, bottom dock, FAB,     |
|                        |                                         | modal overlays, main outlet          |
+---------------------------------------------------------------------------------------------------------+
| TopUtilityBar          | src/components/navigation/TopUtilityBar | Language pill, voiceover toggle,     |
|                        |                                         | theme switch, notification counter   |
+---------------------------------------------------------------------------------------------------------+
| BottomNavBar           | src/components/navigation/BottomNavBar  | 4 primary tabs (Discover, Eligibility|
|                        |                                         | Documents, Tracker) with active line |
+---------------------------------------------------------------------------------------------------------+
| LanguageModal          | src/components/navigation/LanguageModal | Full-screen sheet with Kannada, Hindi|
|                        |                                         | English cards & dialect selector     |
+---------------------------------------------------------------------------------------------------------+
| NotificationsModal     | src/components/navigation/Notifications | Modal listing real-time alerts with  |
|                        | Modal.tsx                               | audio read-aloud buttons             |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Feedback & Bharat-Specific Widgets

```
+---------------------------------------------------------------------------------------------------------+
| Component Name         | File Location                           | Key Props / Capabilities             |
+---------------------------------------------------------------------------------------------------------+
| AudioListenButton      | src/components/feedback/                | Universal "Suniye / ಕೇಳಿ" speech     |
|                        | AudioListenButton.tsx                   | trigger with animated wave feedback  |
+---------------------------------------------------------------------------------------------------------+
| StatutoryFeeBadge      | src/components/feedback/                | Displays "Fee: ₹0.00 Free" guarantee|
|                        | StatutoryFeeBadge.tsx                   | and maximum authorized CSC charge    |
+---------------------------------------------------------------------------------------------------------+
| AiAssistantDrawer      | src/components/feedback/                | "Sahayak Sathi" AI Voice Assistant   |
|                        | AiAssistantDrawer.tsx                   | drawer with speech & quick prompts   |
+---------------------------------------------------------------------------------------------------------+
| SchemeCard             | src/components/schemes/SchemeCard.tsx   | High-contrast welfare card with bold |
|                        |                                         | green DBT amount badge & SLA tag     |
+---------------------------------------------------------------------------------------------------------+
| LifeEventGrid          | src/components/dashboard/LifeEventGrid  | 6 culturally resonant life-event     |
|                        |                                         | category tiles with icons            |
+---------------------------------------------------------------------------------------------------------+
```

---

## 3. Core Pages (15 Implemented Screens)

```
+---------------------------------------------------------------------------------------------------------+
| Screen Page            | Route               | File Location                                            |
+---------------------------------------------------------------------------------------------------------+
| 1. Welcome / Landing   | /                   | src/pages/WelcomeScreen.tsx                              |
| 2. Language Selection  | /language           | src/pages/LanguageSelectionScreen.tsx                    |
| 3. User Onboarding     | /onboarding         | src/pages/OnboardingScreen.tsx                           |
| 4. Home Dashboard      | /home               | src/pages/HomeScreen.tsx                                 |
| 5. Scheme Discovery    | /schemes            | src/pages/SchemeDiscoveryScreen.tsx                      |
| 6. Scheme Details      | /schemes/:id        | src/pages/SchemeDetailScreen.tsx                         |
| 7. Eligibility Checker | /eligibility        | src/pages/EligibilityCheckerScreen.tsx                   |
| 8. Eligibility Results | /eligibility/results| src/pages/EligibilityResultsScreen.tsx                   |
| 9. Document Checklist  | /documents          | src/pages/DocumentChecklistScreen.tsx                    |
| 10. Application Guidance| /guidance/:id      | src/pages/ApplicationGuidanceScreen.tsx                  |
| 11. CSC Token Slip     | /csc-slip/:tokenId  | src/pages/CscSlipScreen.tsx                              |
| 12. Application Tracker| /tracker            | src/pages/ApplicationTrackerScreen.tsx                   |
| 13. Tracker Milestone  | /tracker/:id        | src/pages/ApplicationTrackerDetailScreen.tsx             |
| 14. User Profile       | /profile            | src/pages/UserProfileScreen.tsx                          |
| 15. Notifications Log  | /notifications      | src/pages/NotificationsScreen.tsx                        |
+---------------------------------------------------------------------------------------------------------+
```
