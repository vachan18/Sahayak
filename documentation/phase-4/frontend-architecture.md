# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Frontend Architecture & System Design Documentation
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 4 Deliverable

---

## 1. Architectural Overview & Technology Stack

SAHAYAK is engineered as a high-performance, mobile-first Single Page Application (SPA) with Progressive Web App (PWA) readiness, specifically optimized for Indian network constraints (2G/3G/4G bandwidths and entry-level Android devices).

```
+---------------------------------------------------------------------------------------------------------+
| Layer                  | Technology                                     | Strategic Purpose             |
+---------------------------------------------------------------------------------------------------------+
| UI Framework           | React 18.3 (TypeScript 5.6)                    | Component modularity & typing |
| Build Tool             | Vite 6.0                                       | Sub-second HMR & lean bundles |
| State Management       | Zustand 5.0                                    | Lightweight reactive state    |
| Routing                | React Router 6.28                              | Declarative nested navigation |
| Styling Engine         | Tailwind CSS 3.4 + Custom CSS Design Tokens    | 8-pt spatial design & theme   |
| Iconography            | Lucide React 0.468                             | Accessible sovereign glyphs   |
| Speech Synthesis       | Native Web Speech API (kn-IN, hi-IN, en-IN)    | Offline vernacular voiceover  |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Directory Structure & Modular Separation

```
src/
├── types/                # Strongly typed domain entities & models
│   └── index.ts          # SupportedLanguage, Scheme, LifeEvent, UserProfile, etc.
├── data/                 # Sovereign data fixtures & translation dictionaries
│   ├── translations.ts   # Centralized 3-language dictionary (KN, HI, EN)
│   ├── schemes.ts        # 6 verified benchmark national/state schemes
│   ├── lifeEvents.ts     # 6 life-event exploration categories
│   ├── questions.ts      # 5 dynamic eligibility questions
│   ├── mockApplications.ts # Live application trackers with milestones
│   └── mockNotifications.ts# Status alerts and audio update notices
├── store/                # Global reactive state
│   └── useAppStore.ts    # Zustand store (language, theme, profiles, apps, docs)
├── services/             # Pure computational & business logic
│   └── eligibilityEngine.ts # Rule-based entitlement scoring engine
├── hooks/                # Reusable React hooks
│   └── useTranslation.ts # Reactive type-safe localization hook
├── utils/                # Utility helpers
│   └── audioSpeech.ts    # Bhashini/Web Speech API voice synthesizer
├── components/           # Reusable UI & structural widgets
│   ├── layout/AppLayout.tsx          # Shell with header, nav, FAB, overlays
│   ├── navigation/TopUtilityBar.tsx  # Sticky header with lang & audio pills
│   ├── navigation/BottomNavBar.tsx   # Mobile persistent 4-tab dock
│   ├── navigation/LanguageModal.tsx  # Full vernacular selector sheet
│   ├── navigation/NotificationsModal.tsx # Notifications modal
│   ├── schemes/SchemeCard.tsx        # High-contrast welfare card with DBT tag
│   ├── dashboard/LifeEventGrid.tsx   # 6 life-event cards with cultural icons
│   └── feedback/
│       ├── AudioListenButton.tsx     # Tactile "Suniye / ಕೇಳಿ" speech trigger
│       ├── StatutoryFeeBadge.tsx     # Guaranteed ₹0.00 fee seal
│       └── AiAssistantDrawer.tsx     # "Sahayak Sathi" conversational assistant
├── pages/                # 15 Core screen views
│   ├── WelcomeScreen.tsx             # Language gate & sovereign welcome
│   ├── LanguageSelectionScreen.tsx   # Dedicated dialect selection view
│   ├── OnboardingScreen.tsx          # 3-step micro-onboarding carousel
│   ├── HomeScreen.tsx                # Discovery cockpit & voice search
│   ├── SchemeDiscoveryScreen.tsx     # Catalog with filter & sorting
│   ├── SchemeDetailScreen.tsx        # Zero-jargon details, SLA, documents
│   ├── EligibilityCheckerScreen.tsx  # "Bolo Aur Jano" 5-question wizard
│   ├── EligibilityResultsScreen.tsx  # Calculated entitlement deck & totals
│   ├── DocumentChecklistScreen.tsx   # Visual Do's/Don'ts & blur validator
│   ├── ApplicationGuidanceScreen.tsx # Self online vs. Assisted CSC QR path
│   ├── CscSlipScreen.tsx             # Official printable/scannable QR slip
│   ├── ApplicationTrackerScreen.tsx  # 4-stage visual milestone timeline
│   ├── ApplicationTrackerDetailScreen.tsx # Milestone history & CPGRAMS link
│   ├── UserProfileScreen.tsx         # Family proxy manager & DigiLocker
│   └── NotificationsScreen.tsx       # Live status update alerts
└── routes/
    └── AppRoutes.tsx     # Route tree mapping all 15 screens
```

---

## 3. Multilingual Translation Engine & Text Expansion Resilience

- **Zero Hardcoded Strings**: All citizen-facing text routes through `useTranslation()` which queries `translations[language]`.
- **Typographic Fallback Cascade**: If a translation string is missing in a regional dialect, it gracefully cascades to standard literary language, and ultimately to English.
- **Layout Expansion Safety**:
  - Flexbox and CSS Grid containers allow Kannada text (+35% expansion) to wrap naturally across 2 lines on buttons.
  - Buttons enforce `min-height: 48px` to prevent overflow clipping.
  - Body text uses `line-height: 1.75` for Kannada and `1.65` for Hindi to protect complex diacritic *matras*.

---

## 4. State Management with Zustand

The global store (`useAppStore.ts`) manages:
1. **Localization**: `language`, `dialect`, reactive DOM synchronization.
2. **Audio Voiceover**: `isAudioAssistanceEnabled` toggle.
3. **Theme**: `isDarkMode`, auto-syncing `.dark` class to `document.documentElement`.
4. **Family Profiles**: Manages multi-member proxy profiles (*Rameshwar, Sunita*).
5. **Eligibility Answers**: Dynamic dictionary storing answers for the eligibility calculator.
6. **Active Applications**: Local tracking store for submitted applications with milestone states.
7. **Document Verifications**: Status flags (*verified, uploaded, pending, blur_detected*).
