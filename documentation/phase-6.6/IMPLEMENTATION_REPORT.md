# SAHAYAK — Phase 6.6 Implementation Report
## Application Tracking, Scheme Comparison & Citizen Support Architecture

**System**: SAHAYAK (Citizen Welfare Portal)  
**Phase**: 6.6 — Application Tracking & Citizen Support  
**Date**: November 2026  
**Status**: Completed & Verified  

---

### 1. Executive Summary

Phase 6.6 upgrades SAHAYAK's post-application tracking, multi-scheme evaluation, and administrative grievance support into an integrated civic experience. It eliminates the post-submission "black hole" where citizens are left uninformed about department handling, while providing actionable escalation mechanisms when statutory Service Level Agreements (SLAs) are breached.

The implementation delivers:
1. **Four-Stage Visual Lifecycle Tracker (`ApplicationTrackerScreen.tsx` & `ApplicationTrackerDetailScreen.tsx`)**:
   - A standardized four-stage lifecycle:
     - **Stage 1**: Application submitted & acknowledged.
     - **Stage 2**: Department verification (field inspection, land revenue Bhoomi matching, eKYC).
     - **Stage 3**: Application decision (sanction order or action-needed resolution).
     - **Stage 4**: Benefit disbursement (DBT bank credit or cashless card activation).
   - **Anti-Fabrication Principle**: Milestone timestamps and officer descriptions are rendered **only** when verified administrative records exist. No artificial countdown timers or pseudo-updates are shown.
2. **Transparent Status & Notification Experience**:
   - High-contrast status badges: `Under Review`, `Action Needed`, `Sanctioned`, `Disbursed`, and `SLA Overdue`.
   - **Missing Document Notifications**: Dedicated alert cards detailing the document name, reason for deficiency, requesting authority, and one-click resolution.
   - **Pending Citizen Actions**: Concise actionable checklists for active bank verification and physical token collection.
   - **Citizen Personal Notes**: Enables applicants to record personal activity notes (e.g. kiosk visits, phone calls) clearly marked with an explicit disclaimer: *"Citizen Note (Not official government communication)"*.
3. **Multi-Scheme Comparison Tray (`SchemeComparisonTray.tsx`)**:
   - Floating comparison dock supporting up to 3 simultaneous schemes.
   - Card-level comparison toggle button with `Scale` icon on all scheme cards (`SchemeCard.tsx`).
   - Comprehensive side-by-side comparison matrix evaluating:
     1. Benefit type and monetary amount
     2. Primary eligibility criteria
     3. Required documents
     4. Application method and statutory SLA
     5. Important conditions and statutory exclusions
4. **Official Grievance Guidance Experience (`GrievanceGuidanceModal.tsx`)**:
   - Step-by-step grievance lodging protocol.
   - Direct integration and verified external links to the Central **CPGRAMS** portal (`pgportal.gov.in`).
   - State statutory grievance channels (**Karnataka Sakala Services** 1902 / 080-44554455 with delay compensation clauses) and scheme nodal helplines.
   - Evidence preparation checklist for escalations.
   - Contextual token pre-fill and one-click clipboard copying.
5. **Mobile & Viewport Optimization**:
   - Vertical timeline layout on mobile devices (`ApplicationTrackerDetailScreen.tsx`).
   - Touch targets $\ge 48\text{px}$.
   - **Zero Horizontal Overflow**: 100% pass across all 84 automated Puppeteer captures (360px to 1728px).

---

### 2. Four-Stage Application Lifecycle Architecture

#### 2.1 The Standardized 4-Stage Model
Every application record implements the four statutory milestones:

```
[ Stage 1: Submitted ] ──► [ Stage 2: Verification ] ──► [ Stage 3: Decision ] ──► [ Stage 4: Disbursed ]
  • Acknowledgment Token     • Revenue / TVC Inquest        • Sanction / Order         • DBT Cash / Card
  • Kiosk / Online Stamp     • Land / eKYC Database         • Officer Approval         • Bank Credit / UTR
```

#### 2.2 Truth in Government Tracking: No Fabricated Timestamps
To prevent misleading citizens about statutory guarantees:
- Milestone timestamps (`m.date`, `m.timestamp`) and handling officer names (`m.handlingOfficer`) are displayed **strictly** when verified administrative events have occurred.
- Uncompleted milestones display qualitative statuses (*"Upcoming"*, *"Pending Sanction"*, *"Next Disbursal Cycle"*) rather than fabricated timestamps or artificial countdown clocks.
- Each verified milestone carries an `Official Record` badge to distinguish government log entries from advisory copy.

---

### 3. Scheme Comparison Tray (`src/components/schemes/SchemeComparisonTray.tsx`)

#### 3.1 Tray Mechanics & State Management
- Integrated into `useAppStore`:
  - `compareSchemeIds: string[]` (capped at 3 items to preserve cognitive clarity).
  - `toggleCompareScheme(id)`: Adds or removes schemes with animated feedback.
  - `clearCompareSchemes()`: Empties the tray.
- The floating bottom dock animates into view on any scheme screen when at least one scheme is selected.

#### 3.2 Side-by-Side Comparison Matrix
Citizens can open the comparison modal to evaluate schemes along 5 statutory axes:
1. **Benefit Type & Value**: e.g., ₹6,000/year DBT vs ₹10,000 subsidized micro-credit vs ₹5,00,000 cashless health insurance.
2. **Primary Eligibility**: Occupations, land title requirements, maternity conditions, income ceilings.
3. **Required Documents**: Checklists of mandatory papers for each scheme.
4. **Application Mode & Guarantee**: Self-filing vs Grama One / CSC assistance, official Sakala SLA days.
5. **Important Conditions**: Statutory disqualifications (government employees, tax brackets).

---

### 4. Official Grievance Guidance (`src/components/support/GrievanceGuidanceModal.tsx`)

#### 4.1 CPGRAMS Central Escalation
- Details the Centralized Public Grievance Redress and Monitoring System (CPGRAMS) operated by DARPG, Government of India.
- Provides step-by-step instructions on selecting the relevant nodal ministry, entering reference tokens, and attaching evidence.
- Verified link to `https://pgportal.gov.in`.

#### 4.2 State Statutory Protection (Karnataka Sakala Services Act 2011)
- Highlights citizen legal entitlements: under the Sakala Guarantee of Services Act, delays past SLA deadlines entitle applicants to ₹20/day compensation deducted from the defaulting officer's salary.
- Surfaces statewide toll-free numbers: **1902** and **080-44554455**.
- Surfaces scheme-specific hotlines: PM-KISAN (`155261`), PM-JAY (`14555`), PM-SVANidhi (`1800-11-1979`).

#### 4.3 Escalation Evidence Checklist
Specifies the four documents required before filing:
1. Application acknowledgment token slip.
2. Screenshot of tracker showing elapsed days beyond SLA limit.
3. Kiosk operator fee receipt (if overcharged beyond the ₹30 statutory cap).
4. Applicant identity document.

---

### 5. Technical Verification & Test Results

#### 5.1 Unit & Integration Test Suite
```bash
npm test -- --run
```
- **Test Files**: 8 passed (8)
- **Tests**: 119 passed (119)
- **Execution Time**: 4.88s
- **Verified Suites**:
  - `translations.test.ts`: 100% key parity across `en`, `kn`, `hi`, `bn`
  - `schemeSearch.test.ts`: Indexing, keyword filtering, category matching
  - `schemeValidation.test.ts`: Statutory fees, document specs, SLA rules
  - `eligibilityEngine.test.ts`: 49 rule permutations
  - `backendCorrections.test.ts`: Real-world edge case validation
  - `securityAndPrivacy.test.ts`: Privacy, data minimization, no credential leaks
  - `supabaseBackend.test.ts`: Database sync & offline caching
  - `store.test.ts`: Comparison tray, citizen notes, and document status

#### 5.2 Production Compilation
```bash
npm run build
```
- TypeScript compiler (`tsc -b`) returned **0 errors**.
- Vite production build bundled cleanly:
  - `dist/index.html`: 1.32 kB
  - `dist/assets/index.css`: 74.27 kB (gzip: 12.17 kB)
  - `dist/assets/index.js`: 1,068 kB (gzip: 279.46 kB)

#### 5.3 Responsive Viewport & Overflow Audit (Puppeteer)
```bash
node scripts/capture_screenshots.cjs documentation/phase-6.6/screenshots
```
- **Viewports Tested**:
  1. `mobile-360` (360 × 640)
  2. `mobile-390` (390 × 844)
  3. `tablet-768` (768 × 1024)
  4. `tablet-1024` (1024 × 768)
  5. `desktop-1440` (1440 × 900)
  6. `desktop-1728` (1728 × 1000)
- **Routes Audited**: 14 routes (`/home`, `/schemes`, `/schemes/pm-kisan`, `/eligibility`, `/eligibility/results`, `/documents`, `/guidance/pm-kisan`, `/csc-slip/KA-KISAN-2026-84920`, `/tracker`, `/tracker/app-kisan-84920`, `/profile`, `/notifications`, `/language`, `/welcome`).
- **Total Screenshots Captured**: 84
- **Total Horizontal Overflow Defects**: **0** (`overflow-audit.json` contains `[]`).

---

### 6. File Manifest for Phase 6.6

| File | Type | Purpose |
| :--- | :--- | :--- |
| `src/types/index.ts` | Types | Added `CitizenNote`, `MissingDocumentAlert`, and extended `ApplicationRecord` |
| `src/data/mockApplications.ts` | Data | 3 realistic application lifecycles (PM-KISAN, PM-SVANidhi, PM-JAY) |
| `src/store/useAppStore.ts` | Store | State actions for comparison tray, citizen notes, and missing document resolution |
| `src/components/schemes/SchemeComparisonTray.tsx` | Component | Floating bottom tray and side-by-side comparison modal |
| `src/components/schemes/SchemeCard.tsx` | Component | Integrated comparison toggle button with `Scale` icon |
| `src/components/support/GrievanceGuidanceModal.tsx` | Component | CPGRAMS, Sakala, and departmental grievance escalation modal |
| `src/pages/ApplicationTrackerScreen.tsx` | Page | Four-stage stepper, status filters, missing doc alerts, and note previews |
| `src/pages/ApplicationTrackerDetailScreen.tsx` | Page | Vertical connected timeline, disbursement ledger, and personal note creator |
| `src/pages/SchemeDiscoveryScreen.tsx` | Page | Integrated floating `SchemeComparisonTray` |
| `scripts/capture_screenshots.cjs` | Script | Added `/tracker/app-kisan-84920` to responsive screenshot suite |
| `documentation/phase-6.6/screenshots/` | Artifacts | 84 responsive screenshots + `overflow-audit.json` |
| `documentation/phase-6.6/IMPLEMENTATION_REPORT.md` | Doc | Architectural and technical implementation report |
| `documentation/phase-6.6/UX_REPORT.md` | Doc | User experience, citizen psychology, and anti-fabrication report |
