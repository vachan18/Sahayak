# SAHAYAK — Test Coverage & Validation Report
**Phase:** 4.4 — Codebase Audit, Build Stabilization & Technical Readiness  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** Principal Software Architect & QA Lead  

---

## 1. Test Architecture & Runner Setup

SAHAYAK utilizes **Vitest** (v5.1.1) paired with **@testing-library/react** (v16.3.3) and **jsdom** (v29.1.1) to achieve fast, isolated, and deterministic testing.

### Test Environment Configuration (`vite.config.ts`)
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

---

## 2. Test Execution Summary

```powershell
npm run test
```

**Real Execution Log:**
```
> pixel-theory-sahayak@1.0.0 test
> vitest run

 RUN  v5.1.1 C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory

 ✓ src/test/translations.test.ts (4 tests) 19ms
 ✓ src/test/schemeSearch.test.ts (5 tests) 12ms
 ✓ src/test/securityAndPrivacy.test.ts (3 tests) 9ms
 ✓ src/test/store.test.ts (6 tests) 18ms
 ✓ src/test/eligibilityEngine.test.ts (7 tests) 17ms

 Test Files  5 passed (5)
      Tests  25 passed (25)
   Start at  20:40:31
   Duration  5.08s
```

**Overall Pass Rate: 100% (25 / 25 Passing)**

---

## 3. Test Suite Breakdown

### 3.1 Eligibility Engine (`src/test/eligibilityEngine.test.ts`)
Validates the rule engine and the 5 statutory assessment states:

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **State 1: `not_assessed`** | Confirms 0 answers return `not_assessed`, 0 eligible schemes, and proper disclaimer. | **PASS** |
| **State 2: `in_progress`** | Confirms 1–2 answers return `in_progress` without false eligibility claims. | **PASS** |
| **State 3: `potentially_eligible`** | Simulates small farmer profile (Mandya, 1.5 acres) and confirms match for PM-KISAN (₹6,000/yr). | **PASS** |
| **State 4: Govt Employee Exclusion** | Tests statutory exclusion rule for government servants across PM-KISAN, PMMVY, and PM-JAY. | **PASS** |
| **State 5: `additional_verification_required`** | Verifies partial criteria handling and flags required documentation. | **PASS** |
| **Landholding Ceiling Rule** | Verifies that farmers exceeding 5.0 acres are excluded from PM-KISAN. | **PASS** |
| **Gender Specificity Rule** | Verifies that male applicants are excluded from maternal cash transfer (PMMVY). | **PASS** |

### 3.2 Localization & Translation Parity (`src/test/translations.test.ts`)
Validates language consistency across English, Kannada, and Hindi:

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **Language Support** | Verifies existence of `en`, `kn`, and `hi` dictionaries. | **PASS** |
| **Core Brand & Navigation Keys** | Verifies that 16 essential statutory keys exist in all languages. | **PASS** |
| **Key Parity Verification** | Automatically diffs English keys against Kannada and Hindi to guarantee 0 missing keys. | **PASS** |
| **Non-Empty String Audit** | Confirms no translated string is empty or whitespace-only. | **PASS** |

### 3.3 Scheme Catalog & Search (`src/test/schemeSearch.test.ts`)
Validates scheme query, filtering, sorting, and metadata integrity:

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **Metadata Integrity** | Confirms all verified schemes have statutory fee citations, SLA days, and ministry attribution. | **PASS** |
| **Life Event Filtering** | Confirms accurate classification for `farming`, `health_elder`, `women_child`, etc. | **PASS** |
| **Keyword Search** | Confirms multi-term query matching across scheme titles and descriptions. | **PASS** |
| **SLA Turnaround Sorting** | Confirms ascending and descending sorting by statutory handling days. | **PASS** |
| **Statutory Zero Fee Invariant** | Validates that official statutory application fees are ₹0.00 across primary schemes. | **PASS** |

### 3.4 Zustand Global Store (`src/test/store.test.ts`)
Validates global client state transitions and accessibility toggles:

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **Language Switching** | Confirms store updates `language` and syncs `document.documentElement.lang`. | **PASS** |
| **Dark Mode Toggle** | Confirms DOM class toggle (`dark`) and theme state persistence. | **PASS** |
| **Offline Scheme Bookmarking** | Validates bookmarking and un-bookmarking schemes for offline reference. | **PASS** |
| **Comparison Cap** | Confirms scheme comparison tray enforces hard ceiling of 3 schemes. | **PASS** |
| **Family Proxy Switching** | Validates switching active profile between household members. | **PASS** |
| **Eligibility State Mapping** | Verifies step-by-step questionnaire answer recording in store. | **PASS** |

### 3.5 Security & Privacy Audit (`src/test/securityAndPrivacy.test.ts`)
Validates client-side data hygiene and statutory disclaimers:

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **PII & Aadhaar Masking** | Regex check confirming no raw 12-digit Aadhaar or raw bank account numbers exist in mock profiles. | **PASS** |
| **Storage Security Audit** | Confirms `localStorage` contains zero unencrypted identity tokens, private keys, or raw PII. | **PASS** |
| **Preliminary Guidance Disclaimers** | Confirms all eligibility outputs carry preliminary guidance disclaimers. | **PASS** |

---

## 4. Distinction Between Test Tiers

1. **Unit Tests (Vitest / Node-JSDOM):** Core logic, eligibility calculation, string translation parity, and data transformations executed in <100ms.
2. **Component & Store Tests (React Testing Library):** React component mounts, user-event interactions, state mutation, and DOM attribute verification.
3. **Manual Browser Verification:** Visual layout rendering, touch target comfort, Kannada font legibility, and high-contrast sunlight toggle tested on Chrome Desktop & Mobile viewports.
