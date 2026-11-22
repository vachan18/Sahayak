# SAHAYAK (ಸಹಾಯಕ / सहायक)
### Government Schemes in Your Language • ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರ್ಕಾರದ ಯೋಜನೆಗಳು
#### Project: PIXEL THEORY | Pixelcraft 2026 UI/UX Competition | Track: DS-02

[![Pixelcraft 2026](https://img.shields.io/badge/Pixelcraft_2026-Track_DS--02-B45309?style=for-the-badge)](https://github.com/vachan18/Sahayak)
[![Tests Passing](https://img.shields.io/badge/Vitest-97%20Passed%20(100%25)-065F46?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![React 18](https://img.shields.io/badge/React_18-TypeScript-0B2545?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20RLS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA_%26_GIGW_3.0-065F46?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🏛 Executive Overview

**SAHAYAK** is India's sovereign, dignified, and intelligent digital welfare discovery platform. Designed from the ground up for Bharat, it empowers over **800+ million Indian citizens** navigating public services outside the English-first internet to discover legitimate government entitlements, verify eligibility in under 3 minutes, prepare bulletproof documentation, and track applications with absolute transparency and zero reliance on exploitative middlemen (*dalals*).

In India, over **₹4.5 lakh crore** is disbursed annually via Direct Benefit Transfer (DBT). Yet, up to **40% of intended beneficiaries** are left out or overcharged due to legalistic jargon, eligibility ambiguity, unreadable document rejections, and administrative silos. SAHAYAK completely re-engineers this experience around human life events rather than administrative department divisions.

---

## ✨ Key Pillars & Core Innovations

### 1. 🗣 Multilingual Sovereign Voice Parity (ಕನ್ನಡ • हिन्दी • English)
- **Zero Second-Class Citizens**: Native Kannada-first interface with full Hindi and English parity. Copy is natural, respectful, and culturally anchored rather than machine-translated gibberish.
- **Audio Read-Aloud Engine**: Integrated Web Speech synthesis tuned for `kn-IN`, `hi-IN`, and `en-IN` delivers spoken summaries of statutory rules, benefits, and status updates.
- **Indic Typography Architecture**: Generous 1.75x line-height prevents vertical clipping of Kannada complex conjuncts (*vattugalu*) and Hindi vowel markers (*matras*).

### 2. 🌱 "Jeevan Ke Padav" — Life-Event Mental Model
Replaces cold department dropdowns with 6 universal life milestones:
- 🌾 **Farming & Agriculture** (ಕೃಷಿ & ಬೆಳೆ)
- 🤱 **Motherhood & Child Care** (ತಾಯಿ ಮತ್ತು ಮಗು)
- 🩺 **Health & Elder Dignity** (ಆರೋಗ್ಯ & ವೃದ್ಧಾಪ್ಯ)
- 🎓 **Education & Youth** (ಶಿಕ್ಷಣ & ಯುವಜನತೆ)
- 🛠 **Small Business & Artisans** (ಸಣ್ಣ ವ್ಯಾಪಾರ & ಕುಶಲಕರ್ಮಿ)
- 🏠 **Housing & Basic Utilities** (ವಸತಿ & ಮೂಲಸೌಕರ್ಯ)

### 3. ⚡ "Bolo Aur Jano" — Hardened 5-State Eligibility Engine
- **Conversational 5-Question Assessment**: Evaluates occupation, landholding, gender, age, income, and social category without intimidating legal forms.
- **Strict 5-State Mathematical Logic**: Never makes premature claims. Enforces precise statutory states:
  `not_assessed` ➔ `in_progress` ➔ `potentially_eligible` | `additional_verification_required` | `not_established`.
- **Categorized Benefit Breakdown**: Directly segregates cash transfers (DBT) from health insurance coverage and concessional credit limits to prevent misleading financial totals.
- **Statutory Preliminary Guidance Disclaimer**: Explicitly informs citizens that results represent preliminary eligibility guidance based on self-reported inputs, pending official department verification.

### 4. 🗄 Zero-Trust Supabase Cloud Backend & Sovereign Guest Mode
- **PostgreSQL 15+ Relational Architecture**: 6 tables (`profiles`, `schemes`, `assessments`, `assessment_results`, `saved_schemes`, `applications`) with UUID primary keys and composite search indexes.
- **Ironclad Row Level Security (RLS)**: Zero-trust database policies enforce strict citizen-level isolation (`auth.uid() = user_id`). Public service-role keys are strictly banned from frontend code.
- **Private Document Vault**: Isolated storage bucket (`user-documents`) with 5MB file cap, MIME whitelisting, and 300-second ephemeral signed URLs.
- **Sovereign Guest Mode Guarantee**: 100% kiosk-ready. Citizens at rural Gram One / CSC centers can discover schemes, test eligibility, and inspect checklists without mandatory account creation or phone number barriers.

### 5. 📄 Visual Document Readiness & Pre-Flight Inspection
- **Side-by-Side Visual Do's & Don'ts**: Demonstrates acceptable document scans (e.g. Bank Passbook front page with visible IFSC/stamp vs blurry transaction history).
- **On-Device Optical Pre-Check**: Simulated camera scanner with blur detection alerts citizens before submission to prevent application rejections.
- **DigiLocker Integration**: 1-tap sovereign credential import.

### 6. 🛡 "Seva Kendra Slip" — Anti-Middleman Statutory Fee Protection
- **Treasury-Grade CSC Slip**: Generates a standardized token slip with QR code for physical kiosk operators.
- **Mandatory Statutory Fee Banner**:
  > *"STATUTORY FEE GUARANTEE: Government Fee is ₹0.00. The maximum authorized convenience fee at an authorized CSC is ₹30.00 only. Do not pay any extra commission."*

### 7. ⏱ 4-Stage Transparent Application Lifecycle Tracker
- **Audit-Traceable Milestones**: Replaces vague "Under Review" statuses with a 4-stage visual timeline (*Submitted ➔ Field Verification ➔ Sanction Order ➔ DBT Credit*).
- **SLA Countdown & Accountability**: Displays handling officer titles (*e.g., Tahsildar, Revenue Inspector*), statutory Citizen Charter SLA countdowns, and direct 1-tap CPGRAMS grievance escalation.

---

## 🏛 Verified Showcase Schemes (Primary Statutory Sources)

All scheme rules, exclusions, and financial numbers are strictly aligned with published Government of India Gazette notifications and operational guidelines:

| Scheme Code | Scheme Name | Nodal Authority | Benefit Type | Core Statutory Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `pm-kisan` | **PM-KISAN Samman Nidhi** | MoA&FW | ₹6,000 / year (3x ₹2,000 DBT) | Cultivable land record in state revenue database; excludes regular govt employees and income-tax payees. |
| `pm-jay` | **Ayushman Bharat PM-JAY** | National Health Authority (NHA) | ₹5,00,000 / family / year hospital cover | Identified via SECC 2011 / NFSA BPL ration cards; universal ₹5 Lakh cover for seniors aged 70+ (Vay Vandana). |
| `pmmvy` | **Pradhan Mantri Matru Vandana Yojana** | MWCD | ₹5,000 (1st child) / ₹6,000 (2nd girl child) | Institutional registration, ANC checkups; excludes regular govt/PSU employees with paid maternity leave. |
| `pm-svanidhi` | **PM SVANidhi Micro-Credit** | MoHUA | ₹10,000 - ₹50,000 working capital loan | Urban street vendors holding Certificate of Vending (CoV) or Urban Local Body LoR; 7% interest subsidy. |
| `post-matric-scholarship` | **Post-Matric Scholarship (SC/ST)** | MoSJE | ₹14,000+ / year (Fees + Maintenance) | SC/ST students enrolled in recognized higher education; parental annual income $\le$ ₹2.50 Lakh. |
| `post-matric-scholarship-minority` | **Post-Matric Scholarship (Minorities)** | Ministry of Minority Affairs | ₹10,000 / year (Fees + Maintenance) | Notified minority communities; parental income $\le$ ₹2.00 Lakh; $\ge$ 50% marks in previous examination. |
| `pm-kcc` | **Kisan Credit Card (KCC)** | MoA&FW / NABARD | ₹1,50,000 - ₹3,00,000 credit limit @ 4% | Owner cultivators, tenant farmers, sharecroppers, animal husbandry & fisheries operators under RBI guidelines. |

---

## 📱 Implemented Core Screens (15 Views)

1. **Welcome Screen** (`/`) — Sovereign emblem, bilingual greeting, audio welcome, language selection gate.
2. **Language Selection** (`/language`) — Dialect accent selection (*Standard Kannada / North Karnataka / Hindi / English*) with live audio sample preview.
3. **Onboarding Carousel** (`/onboarding`) — 3-step walkthrough explaining statutory entitlements, fee caps, and document preparation.
4. **Home Dashboard** (`/home`) — Responsive 2-column hero, voice search, category filters, and 6 life-event cards.
5. **Scheme Discovery** (`/schemes`) — Multi-filter catalog, search query matching, and sorting by DBT amount or processing speed.
6. **Scheme Detail** (`/schemes/:id`) — Plain-language specifications, DBT cash tags, "Who Can Apply / Who is Not Covered", statutory fee citations, and official helpline numbers.
7. **Eligibility Checker** (`/eligibility`) — *"Bolo Aur Jano"* 5-step conversational questionnaire wizard with voice narration.
8. **Eligibility Results** (`/eligibility/results`) — Scorecard with categorized benefit cockpit, eligible scheme cards, and statutory guidance disclaimers.
9. **Document Checklist** (`/documents`) — Readiness meter, visual Do's/Don'ts modal, and camera blur detection pre-check.
10. **Application Guidance** (`/guidance/:id`) — Dual pathway: Self-Service Online e-Sign vs. Assisted CSC Seva Kendra Slip.
11. **CSC Token Slip** (`/csc-slip/:tokenId`) — Treasury-style printable summary slip with QR code and statutory fee cap guarantee.
12. **Application Tracker** (`/tracker`) — Active application overview with SLA countdown and 4-stage progress steppers.
13. **Tracker Detail** (`/tracker/:id`) — Granular officer audit log and 1-tap CPGRAMS complaint filing.
14. **User Profile** (`/profile`) — Household family proxy manager (*e.g. Rameshwar, Sunita*) enabling a single device to manage multi-generational welfare entitlements.
15. **Notifications** (`/notifications`) — Real-time event log for milestone updates, verification reminders, and DBT credit voice notes.

---

## 🛠 Tech Stack & Engineering Standards

- **Core Framework**: React 18.3, TypeScript 5.6 (strict mode)
- **Build Tool**: Vite 6.0
- **Database & Cloud**: Supabase (PostgreSQL 15+, Row Level Security, Storage Buckets, Auth GoTrue)
- **State Management**: Zustand 5.0 (optimistic caching, local storage persistence, and cloud sync hooks)
- **Styling**: Tailwind CSS 3.4 with custom Sovereign Bharat Design Tokens (outdoor high-contrast mode, dark mode)
- **Testing**: Vitest 5.1.1 (Unit, component, store, and backend integration test suites)
- **Validation**: Zod (runtime validation for auth payloads, file uploads, and scheme criteria)
- **Audio Engine**: Native Web Speech Synthesis API (`kn-IN`, `hi-IN`, `en-IN`)
- **Icons**: Lucide React
- **Accessibility**: WCAG 2.2 Level AA & Guidelines for Indian Government Websites and Apps (GIGW 3.0)

---

## 🧪 Comprehensive Automated Test Suite

SAHAYAK maintains an audit-grade automated test suite with **97 passing tests** across 7 test files:

```bash
 ✓ src/test/translations.test.ts (4 tests)          # Kannada, Hindi, English key parity & interpolations
 ✓ src/test/schemeSearch.test.ts (5 tests)          # Multilingual search & phonetic tag matching
 ✓ src/test/schemeValidation.test.ts (5 tests)      # Statutory rule integrity & primary source citations
 ✓ src/test/eligibilityEngine.test.ts (49 tests)    # 5-state logic, exclusions, boundary conditions
 ✓ src/test/securityAndPrivacy.test.ts (3 tests)    # Zero PII persistence & client storage safety
 ✓ src/test/store.test.ts (6 tests)                 # Zustand multi-profile state & guest mode caching
 ✓ src/test/supabaseBackend.test.ts (25 tests)      # Supabase client, Zod schemas, RLS, storage & guest fallback

 Test Files  7 passed (7)
      Tests  97 passed (97)
   Duration  6.48s
```

---

## 🚀 Quick Start & Development Setup

### 1. Prerequisites
- Node.js (v18.0.0 or higher; tested on Node v20/v24)
- npm (v9.0.0 or higher)
- Free Supabase project ([supabase.com](https://supabase.com)) or local Docker Supabase instance

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/vachan18/Sahayak.git

# Navigate into project directory
cd Sahayak

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
VITE_SUPABASE_STORAGE_BUCKET=user-documents
```
*(Note: If left empty, SAHAYAK automatically boots into Sovereign Guest Mode with complete offline mock fallbacks).*

### 4. Database Setup (1-Click SQL)
1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard) ➔ **SQL Editor**.
2. Copy and paste the contents of [supabase/full_schema_setup.sql](supabase/full_schema_setup.sql).
3. Click **Run** to provision all 6 tables, triggers, RLS policies, storage bucket, and seed data.

### 5. Run & Test
```bash
# Start Vite development server
npm run dev

# Run full Vitest test suite
npm run test

# Run TypeScript static type check
npx tsc --noEmit

# Compile production build
npm run build

# Preview production build locally
npm run preview
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Complete Project Documentation

The repository houses audit-grade research, design, engineering, and database documentation:

- **Phase 1: Research & Problem Definition**
  - [Problem Definition & Ecosystem Analysis](docs/01-problem-definition-and-research.md)
  - [Target Personas & Pain Points](docs/02-target-personas-and-pain-points.md)
  - [User Journeys & Service Blueprint](docs/03-user-journeys-and-service-blueprint.md)
  - [Product Objectives & Core Features](docs/04-product-objectives-and-core-features.md)
  - [Information Architecture & Navigation](docs/05-information-architecture-and-navigation.md)
  - [MVP Scope & Verified Showcase Schemes](docs/06-mvp-scope-and-roadmap.md)
  - [Measurable UX Success Criteria](docs/07-ux-success-criteria-and-metrics.md)

- **Phase 2: UX Architecture & Experience Design**
  - [Information Architecture Specification](documentation/phase-2/information-architecture.md)
  - [Application Sitemap & Route Mapping](documentation/phase-2/application-sitemap.md)
  - [11 End-to-End User Journeys](documentation/phase-2/user-journeys.md)
  - [15 Screen Detailed Specifications](documentation/phase-2/screen-specifications.md)
  - [Interaction Design Guidelines](documentation/phase-2/interaction-design.md)
  - [Accessibility & Multilingual Guidelines](documentation/phase-2/accessibility-guidelines.md)
  - [Navigation & Routing Specification](documentation/phase-2/navigation-specification.md)

- **Phase 3: Visual Identity & Design System**
  - [Brand Guidelines & Visual Language](documentation/phase-3/brand-guidelines.md)
  - [Semantic Color System (Outdoor Contrast)](documentation/phase-3/color-system.md)
  - [Indic Typography System (1.75x Line-Height)](documentation/phase-3/typography-system.md)
  - [Spacing Scale & Responsive Layouts](documentation/phase-3/spacing-and-layout.md)
  - [Component Library Specification](documentation/phase-3/component-library.md)
  - [Motion & Timing Guidelines](documentation/phase-3/motion-guidelines.md)
  - [Responsive Guidelines](documentation/phase-3/responsive-guidelines.md)
  - [Accessibility Design (GIGW 3.0 / WCAG AA)](documentation/phase-3/accessibility-design.md)
  - [Machine-Readable Design Tokens JSON](documentation/phase-3/design-tokens.json)

- **Phase 4: Frontend Development & UI Hardening**
  - [Frontend Architecture](documentation/phase-4/frontend-architecture.md)
  - [Component Inventory](documentation/phase-4/component-inventory.md)
  - [Routing Documentation](documentation/phase-4/routing-documentation.md)
  - [Implementation & Test Report](documentation/phase-4/implementation-report.md)
  - [Known Limitations & Roadmap](documentation/phase-4/known-limitations.md)

- **Phase 5: Supabase Backend & Database Integration**
  - [Database Schema & ER Specification](documentation/phase-5/database-schema.md)
  - [Supabase Setup & 1-Click Migration Guide](documentation/phase-5/supabase-setup.md)
  - [Security Architecture & Row Level Security (RLS)](documentation/phase-5/security-and-rls.md)
  - [Backend Implementation Report](documentation/phase-5/implementation-report.md)
  - [Testing & Quality Assurance Report](documentation/phase-5/testing-report.md)

---

## ⚖️ Statutory Attribution & Sovereign Compliance

All welfare schemes featured in SAHAYAK (*PM-KISAN, Ayushman Bharat PM-JAY, PMMVY, PM SVANidhi, Post-Matric Scholarship SC/ST, Post-Matric Scholarship Minority, and Kisan Credit Card*) are grounded strictly in published Government of India gazette criteria, Reserve Bank of India Master Directions, and official nodal portals.

**Crafted with pride for Pixelcraft 2026 by [vachan18](https://github.com/vachan18)**.
