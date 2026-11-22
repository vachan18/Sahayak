# SAHAYAK (ಸಹಾಯಕ / सहायक)
### Government Schemes in Your Language • ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರ್ಕಾರದ ಯೋಜನೆಗಳು
#### Project: PIXEL THEORY | Pixelcraft 2026 UI/UX Competition | Track: DS-02

[![Pixelcraft 2026](https://img.shields.io/badge/Pixelcraft_2026-Track_DS--02-B45309?style=for-the-badge)](https://github.com/vachan18/Sahayak)
[![React 18](https://img.shields.io/badge/React_18-TypeScript-0B2545?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA_%26_GIGW_3.0-065F46?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🏛 Executive Overview

**SAHAYAK** is India's sovereign, dignified, and intelligent digital welfare companion. It empowers over **800+ million Indian citizens** navigating public services outside the English-first internet to discover legitimate government entitlements, verify eligibility in under 3 minutes, prepare bulletproof documentation, and track applications with absolute transparency and zero reliance on exploitative middlemen (*dalals*).

In India, over **₹4.5 lakh crore** is disbursed annually via Direct Benefit Transfer (DBT). Yet, up to **40% of intended beneficiaries** are left out or overcharged due to legalistic jargon, eligibility ambiguity, and unreadable document rejections. SAHAYAK completely re-engineers this experience around human life events rather than administrative ministry silos.

---

## ✨ Key Pillars & Core Innovations

### 1. 🗣 Multilingual Sovereign Voice Parity (ಕನ್ನಡ • हिन्दी • English)
- Real-time vernacular audio read-aloud cues using the Web Speech API configured to `kn-IN`, `hi-IN`, and `en-IN` vocal synthesizers.
- Hot-reloading language switcher that updates all interface copy in real-time without resetting form states or re-rendering pages.
- Specialized Indic typography architecture with **1.75x line-height** to prevent vertical clipping of Kannada *vattugalu* and Hindi vowel *matras*.

### 2. 🌱 "Jeevan Ke Padav" — Life-Event Mental Model
- Replaces cold ministry drop-downs with 6 universal life milestones:
  - **Farming & Agriculture** (ಕೃಷಿ & ಬೆಳೆ)
  - **Motherhood & Child Care** (ತಾಯಿ ಮತ್ತು ಮಗು)
  - **Health & Elder Dignity** (ಆರೋಗ್ಯ & ವೃದ್ಧಾಪ್ಯ)
  - **Education & Youth** (ಶಿಕ್ಷಣ & ಯುವಜನತೆ)
  - **Small Business & Artisans** (ಸಣ್ಣ ವ್ಯಾಪಾರ & ಕುಶಲಕರ್ಮಿ)
  - **Housing & Basic Utilities** (ವಸತಿ & ಮೂಲಸೌಕರ್ಯ)

### 3. ⚡ "Bolo Aur Jano" — Smart Eligibility Engine
- A 5-question dynamic conversational questionnaire that extracts parameters through voice or large tactile cards.
- Computes exact household entitlements in real-time, calculating potential annual financial welfare (e.g., ₹18,000/yr), fully eligible schemes, and partial match prerequisites.

### 4. 📄 Visual Document Readiness & Pre-Flight Inspection
- Side-by-side **Visual Do's and Don'ts** guides (e.g. Bank Passbook front page with seal vs transaction page).
- On-device simulated optical scanner with **smart blur detection** that alerts citizens if a bank seal or account number is obscured before submission.
- 1-tap **DigiLocker** sovereign cloud sync.

### 5. 🛡 "Seva Kendra Slip" — Anti-Middleman Statutory Fee Protection
- For citizens preferring assisted physical counter submissions, SAHAYAK generates an official **Assisted CSC QR Slip**.
- Permanently displays the mandatory statutory fee guarantee banner:
  > **"STATUTORY FEE GUARANTEE: Government Fee is ₹0.00. The maximum authorized convenience fee at a CSC is ₹30.00 only. Do not pay any agent."**

### 6. ⏱ 4-Stage Transparent Application Lifecycle Tracker
- Replaces opaque "Under Review" statuses with an audit-traceable 4-stage visual timeline (*Submitted ➔ Revenue Verification ➔ Sanction Order ➔ Direct Benefit Transfer*).
- Displays active handling officer designations (*e.g., Tahsildar, Revenue Inspector*), statutory Citizens' Charter SLA countdowns, and a **1-tap CPGRAMS grievance escalation** path if deadlines are breached.

### 7. 🤖 "Sahayak Sathi" — AI Voice Assistant
- Persistent conversational slide-up drawer answering citizen queries in natural spoken Kannada and Hindi, strictly grounded in official government gazette rules without hallucination.

---

## 📱 Implemented Core Screens (15 Views)

1. **Welcome / Landing** (`/`) — Sovereign seal, audio welcome, language selection gate.
2. **Language Selection** (`/language`) — Dialect accent selection (*Bhojpuri / North Karnataka / Standard*) with voice greeting preview.
3. **User Onboarding** (`/onboarding`) — 3-step carousel explaining entitlements and fee guarantees.
4. **Home Dashboard** (`/home`) — Voice search hero bar, seasonal alerts, and 6 life-event exploration cards.
5. **Scheme Discovery** (`/schemes`) — Live multi-category filter rail, search query matching, and sorting by DBT amount / SLA speed.
6. **Scheme Details** (`/schemes/:id`) — Plain-language specifications, DBT cash tags, "Who Can Apply / Who is Not Covered", and helpline contacts.
7. **Eligibility Checker** (`/eligibility`) — *"Bolo Aur Jano"* 5-step dynamic question wizard.
8. **Eligibility Results** (`/eligibility/results`) — Calculation scorecard with total annual cash benefits and scheme cards deck.
9. **Document Checklist** (`/documents`) — Readiness meter, visual Do's/Don'ts modal, and camera blur detection validator.
10. **Application Guidance** (`/guidance/:id`) — Dual pathway: Self-Service Online e-Sign vs. Assisted CSC Seva Kendra Slip.
11. **CSC Token Slip** (`/csc-slip/:tokenId`) — Treasury-style printable summary slip with QR code and statutory fee cap.
12. **Application Tracker** (`/tracker`) — Active application overview with SLA countdown and progress steppers.
13. **Tracker Milestones** (`/tracker/:id`) — Granular officer audit log and 1-tap CPGRAMS complaint filing.
14. **User Profile** (`/profile`) — Family proxy manager (*Rameshwar, Sunita*) enabling a single phone to manage household welfare.
15. **Notifications** (`/notifications`) — Live log of milestone changes and DBT credit voice notes.

---

## 🛠 Tech Stack & Engineering Standards

- **Core Framework**: React 18.3, TypeScript 5.6
- **Tooling & Bundler**: Vite 6.0
- **State Architecture**: Zustand 5.0 (reactive local caching & multi-profile state)
- **Styling**: Tailwind CSS 3.4 with custom Sovereign Color Tokens
- **Icons**: Lucide React
- **Motion**: Framer Motion 11.15 (sub-400ms snappy spring physics; prefers-reduced-motion parity)
- **Audio Synthesis**: Native Web Speech API (`kn-IN`, `hi-IN`, `en-IN`)
- **Compliance**: WCAG 2.2 Level AA & Guidelines for Indian Government Websites and Apps (GIGW 3.0)

---

## 🚀 Quick Start & Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher; tested on Node v24.13.1)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/vachan18/Sahayak.git

# Navigate into project directory
cd Sahayak

# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run TypeScript check and production build
npm run build

# Preview production build locally
npm run preview
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Complete Project Documentation

The repository houses complete, audit-grade research, design, and architecture records:

- **Phase 1: Research & Fact-Assumption Audit**
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

- **Phase 4: Frontend Development & UI Implementation**
  - [Frontend Architecture](documentation/phase-4/frontend-architecture.md)
  - [Component Inventory](documentation/phase-4/component-inventory.md)
  - [Routing Documentation](documentation/phase-4/routing-documentation.md)
  - [Implementation & Test Report](documentation/phase-4/implementation-report.md)
  - [Known Limitations & Roadmap](documentation/phase-4/known-limitations.md)

---

## ⚖️ Sovereign Compliance & Attribution

All welfare schemes featured in SAHAYAK (*PM-KISAN, Ayushman Bharat PM-JAY, PMMVY, PM SVANidhi, Post-Matric Scholarship, Kisan Credit Card*) are grounded strictly in published Government of India gazette criteria and official data from `myScheme.gov.in`.

**Crafted with pride for Pixelcraft 2026 by [vachan18](https://github.com/vachan18)**.
