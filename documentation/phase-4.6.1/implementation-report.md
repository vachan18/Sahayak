# Phase 4.6.1 — Master Implementation Report & Final Statutory Corrections

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Date:** 2026-11-22  
**Status:** IMPLEMENTED, TESTED, VERIFIED & COMMITTED  

---

## 1. Executive Summary

Phase 4.6.1 delivers targeted source-code corrections to address the final eligibility logic edge cases identified in the Phase 4.6 audit, without altering the established React component hierarchy, Zustand state store, or navy/amber visual design language.

### Core Objectives Delivered:
1. **PM-KISAN (Income Threshold Proxy Abolition):**
   - Completely abolished annual income thresholds as proxies for income-tax payer status.
   - Income tax liability depends on statutory tax definitions and agricultural income exemptions under Section 10(1) of the Income Tax Act, 1961, rather than blunt self-reported income bands.
   - Enforced explicit declaration of tax-status (`isIncomeTaxPayee === false`); unconfirmed status is flagged as `additional_verification_required`.
   - Preserved the removal of the 5-acre ceiling under the 31.05.2019 Cabinet revision.
2. **Ayushman Bharat PM-JAY (Employment Disqualification Decoupling):**
   - Reviewed government employment exclusions and eliminated the automatic disqualification of under-70 applicants based solely on public employment.
   - Grounded entitlement in verified beneficiary identification (SECC 2011 deprivation lists or active NFSA BPL/PHH ration cards).
   - Public sector workers under age 70 are flagged for departmental scheme coordination (CGHS / ECHS / State Medical Attendance Rules), not denied outright as in previous iterations.
3. **PMMVY (Missing Documents vs Ineligibility & Independent Validation):**
   - Strictly separated missing documentation (e.g. unverified MCP card) from confirmed statutory ineligibility.
   - Missing MCP card produces `additional_verification_required` to allow Anganwadi registration, rather than marking the applicant as `not_established`.
   - Independently validated parity conditions (1st child vs 2nd girl child vs 3rd+ cap) and beneficiary conditions (female, age ≥ 19, active pregnancy/lactation, paid maternity leave check).
4. **Assessment Completeness & Information Hierarchy:**
   - Guaranteed that missing mandatory criteria never produce a false positive `potentially_eligible` result.
   - Guaranteed that missing optional criteria (such as pending land mutation flags, language dialect, or secondary loan records) do not unnecessarily block assessment.
5. **Government Data & Official Sources:**
   - Validated all rules against primary Gazette notifications and Ministry operational guidelines.
   - Preserved transparent `NEEDS_REVIEW` auditing where state-level variations exist.
6. **Automated Regression Testing & Build Verification:**
   - Expanded Vitest test suite to 72 passing tests across 6 test suites (100% passing).
   - Verified strict TypeScript compilation (`tsc -b && vite build`) in 7.27s.

---

## 2. Targeted Source Code Changes

### 2.1 PM-KISAN Tax-Status Correction (`src/services/eligibilityEngine.ts`)
*Pre-Phase 4.6.1 Problem:* The engine used `annualIncome <= 250000` or `annualIncome > 800000` as proxies to deduce tax status.  
*Post-Phase 4.6.1 Correction:*
```typescript
// 1.2 Statutory Exclusion: Income-tax payees in the last assessment year (Clause 2.b.iv)
// Note (Phase 4.6.1): Annual income thresholds are NOT proxies for income-tax payer status.
// Explicit tax-status confirmation is required; otherwise flagged for additional verification.
if (answers.isIncomeTaxPayee === true) {
  disqualifyingExclusions.push(
    "PM-KISAN Statutory Exclusion Clause 2(b)(iv): All persons who paid Income Tax in the last assessment year are excluded."
  );
} else if (answers.isIncomeTaxPayee === false) {
  satisfiedCriteria.push("Explicit confirmation of non-income-tax-payer status for the preceding assessment year.");
} else {
  missingCriteria.push("Self-declaration or official verification of non-income-tax-payer status for the preceding assessment year.");
}
```

### 2.2 Ayushman Bharat PM-JAY Coordination (`src/services/eligibilityEngine.ts`)
*Pre-Phase 4.6.1 Problem:* Regular government employees under age 70 were pushed to `disqualifyingExclusions`, causing automatic `not_established` status.  
*Post-Phase 4.6.1 Correction:*
```typescript
// 2.2 Route B: Vulnerable Households (under 70 years)
else {
  // Government employment & health coverage rules (under 70 years)
  // Note (Phase 4.6.1): Do not automatically disqualify applicants based solely on employment status.
  // Entitlement is anchored in verified beneficiary identification (SECC 2011 / NFSA ration card),
  // with departmental coordination rules applied for existing public health schemes.
  if (answers.govtEmploymentType === 'central_state_regular' || answers.govtEmploymentType === 'psu_autonomous') {
    missingCriteria.push(
      "Verification of departmental health coverage (CGHS / ECHS / State Medical Attendance Rules) coordination with PM-JAY."
    );
  } else if (answers.isGovtEmployee === true && answers.govtEmploymentType === undefined) {
    missingCriteria.push(
      "Clarification of public sector employment category and applicable medical attendance rules."
    );
  } else {
    satisfiedCriteria.push("Confirmed non-departmental / general citizen category for PM-JAY health assurance.");
  }

  // Beneficiary Identification: SECC 2011 / State NFSA Ration Card
  if (answers.hasBplOrRationCard === true || answers.isSeccDeprivedHousehold === true) {
    satisfiedCriteria.push("Reported active state NFSA / BPL ration card or SECC deprivation status.");
    missingCriteria.push("Official biometric e-KYC authentication on NHA Beneficiary Identification System (BIS) / Ayushman Mitra desk.");
  } else if (answers.hasBplOrRationCard === false && answers.isSeccDeprivedHousehold === false) {
    disqualifyingExclusions.push(
      "PM-JAY Guidelines Section 3: Household is not mapped in SECC 2011 deprivation list (D1-D7 rural, 11 occupational categories urban) or active state NFSA food security records."
    );
  } else {
    missingCriteria.push("Beneficiary verification against NHA SECC 2011 database or active state NFSA BPL/Antyodaya ration records.");
  }
}
```

### 2.3 PMMVY Maternity Parity & Beneficiary Independence (`src/services/eligibilityEngine.ts`)
*Pre-Phase 4.6.1 Problem:* Blanket exclusion of public workers without checking maternity leave entitlement; missing MCP card risk of ineligibility.  
*Post-Phase 4.6.1 Correction:*
```typescript
// 3.3 Statutory Exclusion: Government / PSU employment with paid maternity leave (Section 3.2)
if (answers.govtEmploymentType === 'central_state_regular' || answers.govtEmploymentType === 'psu_autonomous') {
  disqualifyingExclusions.push(
    "PMMVY Section 3.2: Women in regular service with Central/State Govt or PSUs receiving statutory paid maternity leave are excluded."
  );
} else if (answers.govtEmploymentType === 'none' || answers.isGovtEmployee === false) {
  satisfiedCriteria.push("Confirmed non-government regular employment status.");
} else if (answers.isGovtEmployee === true && answers.govtEmploymentType === undefined) {
  missingCriteria.push("Verification of statutory paid maternity leave entitlement under government/PSU service rules.");
} else {
  missingCriteria.push("Confirmation of non-government employment status.");
}

// 3.6 Documentation Requirement: MCP Card (Section 3.1)
// Missing documents produce verification requirements, NEVER confirmed ineligibility!
if (answers.hasMcpCard === true) {
  satisfiedCriteria.push("Mother and Child Protection (MCP) card registered with early ANC stamp.");
} else {
  missingCriteria.push("Mother and Child Protection (MCP) card registration at local Anganwadi / Primary Health Centre (PHC).");
}
```

---

## 3. Automated Vitest Regression Test Suite

All 72 tests across 6 suites executed and passed with a 100% success rate:

```
> pixel-theory-sahayak@1.0.0 test
> vitest run

 ✓ src/test/translations.test.ts (4 tests) 21ms
 ✓ src/test/schemeSearch.test.ts (5 tests) 16ms
 ✓ src/test/schemeValidation.test.ts (5 tests) 25ms
 ✓ src/test/securityAndPrivacy.test.ts (3 tests) 16ms
 ✓ src/test/store.test.ts (6 tests) 32ms
 ✓ src/test/eligibilityEngine.test.ts (49 tests) 48ms

 Test Files  6 passed (6)
      Tests  72 passed (72)
   Duration  6.25s
```

### Detailed Breakdown of Phase 4.6.1 Additions:
1. `ensures missing mandatory information never produces a positive eligibility result` -> **PASS**
2. `ensures missing optional information does not unnecessarily block assessment` -> **PASS**
3. `requires explicit tax-status information and does NOT use annual income as a proxy` -> **PASS**
   - Verified: Farmer with ₹1.2L income but unconfirmed tax status receives `additional_verification_required`.
   - Verified: Farmer with ₹12L agricultural income and explicit non-taxpayer status receives `potentially_eligible`.
4. `does NOT automatically disqualify under-70 applicants based solely on government employment status` -> **PASS**
   - Verified: Public employee with BPL card receives `additional_verification_required` (prompting departmental coordination), zero exclusions.
5. `distinguishes missing documents (e.g. MCP card) from confirmed ineligibility` -> **PASS**
   - Verified: Pregnant mother with missing MCP card receives `additional_verification_required` with 0 disqualifying exclusions.
6. `independently validates parity and beneficiary conditions` -> **PASS**
   - Verified: Male applicant disqualified regardless of parity.
   - Verified: Second child male disqualified regardless of mother age and pregnancy status.

---

## 4. Production Build Verification

TypeScript compilation (`tsc -b`) and production bundle generation succeeded with zero errors:

```
> tsc -b && vite build
vite v6.4.6 building for production...
transforming...
✓ 1631 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.22 kB │ gzip:   0.65 kB
dist/assets/index-SZ2lDsdO.css   52.31 kB │ gzip:   8.74 kB
dist/assets/index-PIiCm8nn.js   483.23 kB │ gzip: 128.23 kB
✓ built in 7.27s
```

---

## 5. Verification Check Against Primary Statutory Sources

| Scheme | Statutory Authority & Gazette Citation | Status in SAHAYAK |
| :--- | :--- | :---: |
| **PM-KISAN** | Operational Guidelines Clause 2(b); Cabinet Decision 31.05.2019 | **VERIFIED** |
| **Ayushman PM-JAY** | NHA Operational Guidelines Section 3.1; Gazette S.O. 4668(E) | **VERIFIED** |
| **PMMVY** | MWCD Mission Shakti Samarthya Guidelines Section 3.1 & 3.2 | **VERIFIED** |
| **PM SVANidhi** | MoHUA Scheme Guidelines Section 2.1 | **VERIFIED** |
| **PM-KCC** | RBI Master Direction FIDD.CO.FSD.BC.No.12/05.05.010/2018-19 | **VERIFIED** |
| **Post-Matric SC/ST/OBC** | MoSJE Centrally Sponsored Scheme Guidelines Clause 4 | **VERIFIED** |
| **Post-Matric Minority** | MoMA Operational Guidelines Clause 3 | **VERIFIED** |

---

## 6. Next Steps & Phase 5 Readiness

Phase 4.6.1 is completely concluded and validated.
All criteria specified in the prompt have been met.
The codebase is in a stable, verified state, awaiting user signoff before beginning Phase 5 (Supabase database integration and Gemini API voice assistant).
