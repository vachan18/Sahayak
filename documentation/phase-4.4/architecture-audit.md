# SAHAYAK — Architecture Audit Report
**Phase:** 4.4 — Codebase Audit, Build Stabilization & Technical Readiness  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** Principal Software Architect & Senior TypeScript Engineer  

---

## 1. Architectural Blueprint

SAHAYAK is engineered as a resilient, client-first Single Page Application (SPA) structured around human-centered welfare discovery and Bharat-first accessibility.

```
src/
├── assets/             # Brand logos, emblem marks, static assets
├── components/
│   ├── dashboard/      # LifeEventGrid, Cockpit widgets
│   ├── feedback/       # AiAssistantDrawer, AudioListenButton, StatutoryFeeBadge
│   ├── layout/         # AppLayout, responsive desktop/mobile shells
│   ├── navigation/     # TopUtilityBar, BottomNavBar, LanguageModal, NotificationsModal
│   ├── schemes/        # SchemeCard, SchemeComparisonTray
├── data/
│   ├── schemes.ts      # Canonical verified government scheme definitions
│   ├── questions.ts    # Eligibility questionnaire steps ("Bolo Aur Jano")
│   ├── translations.ts # Trilingual localization dictionaries (EN, KN, HI)
│   ├── mockApplications.ts # Life-cycle tracker test fixtures
│   └── mockNotifications.ts# Milestone push notification mock fixtures
├── hooks/
│   └── useTranslation.ts   # Vernacular text hook with fallback resolution
├── pages/              # Routed screen views (Home, Discovery, Checker, Tracker, etc.)
├── routes/
│   └── AppRoutes.tsx   # React Router v6 route configuration
├── services/
│   └── eligibilityEngine.ts# Pure, stateless statutory rule assessment engine
├── store/
│   └── useAppStore.ts  # Zustand global state manager
├── styles/
│   └── index.css       # Tailwind directives & CSS variables
├── test/
│   ├── setup.ts        # Vitest & Jest-DOM environment setup
│   └── *.test.ts       # Automated test suites
├── types/
│   └── index.ts        # Comprehensive TypeScript contract definitions
└── utils/
    └── audioSpeech.ts  # Vernacular speech synthesis controller
```

---

## 2. Layer-by-Layer Architectural Audit

### 2.1 Component Boundaries & Separation of Concerns
- **Smart vs. Dumb Components:**
  - Route screens (`pages/`) manage route parameters, dispatch store actions, and compose layout sections.
  - Presentation components (`SchemeCard`, `StatutoryFeeBadge`, `LifeEventGrid`) are purely prop-driven, with zero hidden network side effects.
  - Layout wrappers (`AppLayout`, `TopUtilityBar`, `BottomNavBar`) isolate viewport mechanics, ensuring clean fluid responsiveness between 390px mobile screens and 1400px desktop containers.

### 2.2 Global State Management (`Zustand`)
- **Store Architecture:** Implemented via a single unified Zustand store (`src/store/useAppStore.ts`).
- **Store Segregation:**
  - *Localization State:* `language`, `dialect`, `setLanguage`, `setDialect`.
  - *Accessibility State:* `isAudioAssistanceEnabled`, `isDarkMode`, `isHighSunlightMode`.
  - *Citizen Profiles (Family Proxy):* `profiles`, `activeProfileId`, `setActiveProfileId`, `addProfile`.
  - *Eligibility State:* `eligibilityStatus`, `eligibilityAnswers`, `setEligibilityAnswer`.
  - *Application Life-Cycle:* `applications`, `addApplication`.
  - *Offline Scheme Bookmarking:* `savedSchemeIds`, `compareSchemeIds`.
- **Verdict:** **EXCELLENT**. Zustand avoids React Context re-render cascades, provides instant in-memory mutations, and maintains predictable state flow without Redux boilerplate.

### 2.3 Routing Architecture (`React Router v6`)
- Single centralized route tree in `src/routes/AppRoutes.tsx`.
- Seamless nested layouts utilizing `<Outlet />` inside `AppLayout`.
- Clean route parameter matching (`/schemes/:id`, `/tracker/:id`, `/apply/slip/:tokenId`).

### 2.4 Localization Architecture (`useTranslation`)
- Complete parity across English (`en`), Kannada (`kn`), and Hindi (`hi`).
- Fallback strategy: If a localized translation key is missing in Kannada or Hindi, the hook automatically resolves to the English string, preventing runtime blanks or undefined text rendering.
- Speech synthesis integration: The language state is coupled with `audioSpeech.ts`, ensuring that clicking "ಕೇಳಿ (Listen)" delivers pronunciation matching the active language and dialect.

### 2.5 Service Layer Isolation (`eligibilityEngine.ts`)
- The eligibility calculator is completely decoupled from UI components and the Zustand store.
- It operates as a pure function: `assessEligibility(answers: AssessmentAnswers): EligibilityAssessmentResult`.
- It evaluates criteria deterministically against `verifiedSchemes` and returns structured results with strict statutory disclaimers.

### 2.6 TypeScript Interfaces & Contracts (`src/types/index.ts`)
- Strong typing applied to all core domains:
  - `Scheme`, `BenefitType`, `FinancialBenefit`, `StatutoryFee`, `DocumentRequirement`
  - `EligibilityCriteria`, `EligibilityAssessmentResult`, `EligibilityAssessmentStatus`
  - `UserProfile`, `ApplicationRecord`, `ApplicationStatus`
- Strict compiler compliance verified with `noUnusedLocals` and `noUnusedParameters`.

### 2.7 Mock Data Isolation
- Mock fixtures (`mockApplications.ts`, `mockNotifications.ts`) are segregated in `src/data/` and adhere strictly to TypeScript interfaces.
- Replacing mock data with live Supabase REST endpoints in Phase 5 will require changes only to the store/service layer, without touching UI presentation components.
