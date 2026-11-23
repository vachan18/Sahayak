# SAHAYAK — Phase 6.4 Implementation Report
## Conversational Eligibility Architecture & Statutory Results Experience

**System**: SAHAYAK (Citizen Welfare Portal)  
**Phase**: 6.4 — Bolo Aur Jano: Eligibility Experience  
**Date**: November 2026  
**Status**: Completed & Verified  

---

### 1. Executive Summary

Phase 6.4 redesigns the complete "Bolo Aur Jano" eligibility assessment flow into an intuitive, accessible conversational experience optimized for citizens with limited digital literacy. The implementation introduces dynamic conditional branching, discrete voice recognition states with full text alternatives, a strict 3-tier categorization of evaluation results (Likely Eligible, Needs More Information, Likely Not Eligible), and transparent benefit segregation that eliminates misleading combined figures.

All 119 vitest test cases pass cleanly (with 100% key parity across English, Kannada, Hindi, and Bengali), and automated Puppeteer tests confirmed **0 horizontal overflow defects** across all 78 route/viewport combinations (360px to 1728px).

---

### 2. Conversational Architecture & Upgrades

#### 2.1 Conversational Questionnaire (`src/pages/EligibilityCheckerScreen.tsx`)
- **Single Question Presentation**:
  - Displays exactly one clear, high-contrast question card at a time with warm, conversational phrasing.
  - Subtitle help context explains the statutory rationale for each question (e.g., why land title or income is requested).
- **Dynamic Conditional Branching**:
  - `activeQuestions` is evaluated in real-time based on prior self-reported answers:
    - *Female Beneficiaries*: Dynamically introduces maternity & nursing qualification checks (`q_maternity`) for Pradhan Mantri Matru Vandana Yojana (PMMVY).
    - *Street Vendors*: Dynamically introduces urban municipal vending verification (`q_vending`) for PM SVANidhi credit.
    - *Students*: Dynamically introduces post-matric / college enrollment verification (`q_student`) for scholarships.
    - *Male / Non-applicable profiles*: Conditional questions are cleanly bypassed without disrupting assessment progress.
- **Progress & Navigation**:
  - Prominent step badge: `Question X of Y` (`X% Completed`) with accessible ARIA progressbar.
  - Interactive "Previous Question" button allowing citizens to step back, view previous selections, edit their answers, and continue without losing progress.
  - "Start Over / Review All Answers" control for full questionnaire reset.
- **Large Selectable Cards**:
  - Minimum 56px touch height with large tactile radio controls.
  - Semantic visual icons (`Wheat`, `Store`, `GraduationCap`, `Hammer`, `Heart`, `Scissors`, `User`, `Users`, `CheckCircle2`, `XCircle`).
  - Full keyboard accessibility with `Enter`/`Space` selection, ARIA `role="radiogroup"`, `role="radio"`, `aria-checked`, and `focus-visible:ring-4 focus-visible:ring-amber-500/50`.

#### 2.2 Voice Interaction System ("Bolo Aur Jano")
- **Discrete, Transparent States**:
  1. `idle`: Displays "Tap to Speak (Bolo Aur Jano)" with an amber microphone icon. Strictly non-active (no deceitful continuous recording animations).
  2. `listening`: Explicit active recording state with red/rose pinging indicator, 7-bar animated audio waveform, and an immediate "Cancel Listening" escape button.
  3. `processing`: Transcribing spinner analyzing speech in Kannada, Hindi, Bengali, or English.
  4. `recognized`: Displays a green confirmation badge with the exact recognized vernacular transcript (e.g., `Recognized: Farmer (ರೈತ)`) and speaks audio feedback before advancing.
  5. `error`: Friendly fallback: "Could not detect clear speech. Please tap an option above."
- **100% Text Alternative**:
  - Every spoken prompt is fully available as large, readable on-screen text.
  - Citizens can complete the entire assessment through visual tapping or keyboard input without touching the microphone.

---

### 3. Statutory Results Experience (`src/pages/EligibilityResultsScreen.tsx`)

#### 3.1 Three Clear Categorization Tiers
The results interface establishes 3 clear statutory categories:
1. **Likely Eligible** (`eligibleSchemes`):
   - Meets all preliminary self-reported conditions with zero statutory exclusions.
   - Highlighted with high-contrast emerald borders, `CheckCircle2` icon, and explicit entitlement breakdown.
2. **Needs More Information** (`additionalVerificationSchemes`):
   - Potentially qualifying, but requires official document cross-checks (e.g. land records in Bhoomi database, non-taxpayer verification, or caste certificate).
   - Marked with amber alerts, missing document checklists, and guidance on how to confirm eligibility.
3. **Likely Not Eligible** (`notEstablishedSchemes`):
   - Identified statutory disqualifications (e.g., non-agricultural profession for PM-KISAN, permanent government employment, or income taxpayer bracket).
   - Explains the exact disqualifying clause without ambiguity.

#### 3.2 Exhaustive 4-Point Explanation per Scheme Card
Every card across all 3 tiers details:
- **Why it matches or does not match**: Clear statutory rationale.
- **Conditions evaluated**: Explicit bullet tags reflecting citizen inputs (Occupation, Landholding, Income bracket, Employment type).
- **Missing information or documents**: Checklists of required papers (e.g., RTC land title, MCP card, caste certificate, bank passbook).
- **What the user should do next**: Actionable recommendations with direct links to Document Locker, CSC Guidance, or Official Ministry Rules.

#### 3.3 Transparent Benefit Presentation
- **Segregated Benefit Cockpit**:
  - **Annual Cash DBT**: e.g., ₹6,000/year (credited via PFMS).
  - **Hospitalization Health Cover**: Up to ₹5 Lakh (cashless inpatient indemnity, clearly stated as **NOT a cash payment**).
  - **Subsidized Working Capital Loan**: Up to ₹50,000 (clearly stated as a **repayable institutional loan, NOT a grant**).
  - **Grant / Scholarship**: Tuition reimbursement upon college enrollment.
- **Installment Schedule Clarity**:
  - Details installment schedules (e.g., PM-KISAN ₹2,000 every 4 months; PMMVY ₹3,000 + ₹2,000).
- **Anti-Deception Banner**:
  - Prominent warning explaining why loans and health cover are never summed into an artificial "total".

---

### 4. Verification & Testing

| Suite | Status | Execution Time | Notes |
|---|---|---|---|
| `npm run build` | Passed | 6.49s | Zero TypeScript errors (`tsc -b`), optimized production bundle |
| `src/test/translations.test.ts` | Passed | 28ms | 100% key parity across `en`, `kn`, `hi`, `bn` |
| `src/test/schemeSearch.test.ts` | Passed | 12ms | Verified query matching |
| `src/test/schemeValidation.test.ts` | Passed | 18ms | Schema validation for all verified schemes |
| `src/test/eligibilityEngine.test.ts` | Passed | 36ms | 49 statutory rule tests passing |
| `src/test/supabaseBackend.test.ts` | Passed | 29ms | 25 tests passing |
| `src/test/backendCorrections.test.ts` | Passed | 27ms | 22 tests passing |
| `src/test/securityAndPrivacy.test.ts` | Passed | 7ms | Zero privacy/data leaks |
| `src/test/store.test.ts` | Passed | 10ms | Zustand state management & answers |
| **Total Unit Tests** | **119 / 119 Passed** | **5.14s** | **8 Test Suites Green** |

#### Puppeteer Responsive & Horizontal Overflow Audit
- **Viewports Audited**: `360×640`, `390×844`, `768×1024`, `1024×768`, `1440×900`, `1728×1000`.
- **Routes Audited**: 13 routes (including `/eligibility` and `/eligibility/results`).
- **Total Tested Combinations**: 78 screen configurations.
- **Overflow Issues Detected**: **0 issues found** (Logged in `documentation/phase-6.4/screenshots/overflow-audit.json`).
- **No Global Overflow Cheat**: Implemented using true responsive flex/grid layouts with touch targets ≥ 48px/56px.
