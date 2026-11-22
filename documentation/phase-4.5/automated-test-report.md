# SAHAYAK — Automated Test Report (Phase 4.5)
**Phase:** 4.5 — Eligibility Engine Correction & Government Data Integrity  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** QA Specialist & Principal Software Engineer  

---

## 1. Test Execution Summary

The entire automated test suite was executed using **Vitest** (v5.1.1) against the corrected eligibility engine, scheme validation rules, and benefit calculation models.

```powershell
npm run test
```

### Real Execution Log:
```
> pixel-theory-sahayak@1.0.0 test
> vitest run

 RUN  v5.1.1 C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory

 ✓ src/test/translations.test.ts (4 tests) 22ms
 ✓ src/test/schemeSearch.test.ts (5 tests) 13ms
 ✓ src/test/schemeValidation.test.ts (5 tests) 21ms
 ✓ src/test/securityAndPrivacy.test.ts (3 tests) 11ms
 ✓ src/test/eligibilityEngine.test.ts (22 tests) 28ms
 ✓ src/test/store.test.ts (6 tests) 24ms

 Test Files  6 passed (6)
      Tests  45 passed (45)
   Start at  20:56:26
   Duration  10.44s
```

**Overall Pass Rate: 100% (45 / 45 Tests Passing)**

---

## 2. Test Suite Breakdown

### 2.1 Eligibility Engine (`src/test/eligibilityEngine.test.ts` — 22 Tests)

| Category | Test Case Description | Verified Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Missing Info** | Zero answers supplied | Returns `not_assessed`, 0 benefits, proper disclaimer | **PASS** |
| **Missing Info** | Incomplete questionnaire (< 4 answers) | Returns `in_progress` without false eligibility | **PASS** |
| **Missing Info** | Farmer missing landholding area | Returns `additional_verification_required` | **PASS** |
| **Missing Info** | Female missing pregnancy/maternity status | Returns `additional_verification_required` for PMMVY | **PASS** |
| **5 States** | State 1: `not_assessed` | Empty input check | **PASS** |
| **5 States** | State 2: `in_progress` | 3 questions answered check | **PASS** |
| **5 States** | State 3: `potentially_eligible` | Small farmer (Mandya, 1.5 acres) matches PM-KISAN | **PASS** |
| **5 States** | State 4: `not_established` | Confirmed disqualifying exclusion applies to all | **PASS** |
| **5 States** | State 5: `additional_verification_required` | No full match, but documents needed | **PASS** |
| **PM-KISAN** | Landholding > 5 acres (12 acres) | **Potentially eligible** (verifies 2019 Cabinet removal of 5-acre limit) | **PASS** |
| **PM-KISAN** | Landless farmer (0 acres) | Excluded with explicit statutory explanation | **PASS** |
| **PM-KISAN** | Permanent govt employee | Disqualified under statutory exclusion | **PASS** |
| **PM-JAY** | Senior citizen aged 70+ | Qualifies under Ayushman Vay Vandana regardless of income | **PASS** |
| **PM-JAY** | Citizen under 70 with income < 2.5L | Returns `additional_verification_required` for SECC/BPL check | **PASS** |
| **PM-JAY** | Income > 2.5L without senior citizen | Disqualified under standard PM-JAY | **PASS** |
| **PMMVY** | Male applicant | Disqualified with clear statutory explanation | **PASS** |
| **PMMVY** | Age under 19 | Disqualified (min age 19) | **PASS** |
| **PMMVY** | Expectant mother (24 yrs, pregnant, non-govt) | Qualifies as `potentially_eligible` | **PASS** |
| **Benefit Calc**| No summing loan/insurance into cash | Annual cash strictly ₹6,000; health cover ₹5,00,000 isolated | **PASS** |
| **Benefit Calc**| One-time maternity grant isolation | ₹5,000 one-time grant segregated from annual cash | **PASS** |
| **Boundaries**  | Income ceiling exact threshold (₹2.5L) | ₹2,50,000 passes; ₹2,50,001 fails | **PASS** |
| **Boundaries**  | Age boundaries (18 for SVANidhi, 19 for PMMVY) | Age 17 fails, Age 18 passes | **PASS** |

### 2.2 Scheme Data Validation (`src/test/schemeValidation.test.ts` — 5 Tests)
- Strict Zod schema validation across all 6 verified schemes: **PASS**.
- Verification status enumeration (`VERIFIED`, `NEEDS_REVIEW`, `DEMONSTRATION`): **PASS**.
- Strict benefit category segregation: **PASS**.
- Statutory fee structure & CSC charge transparency: **PASS**.
- Exception handling on malformed or negative-amount inputs: **PASS**.

### 2.3 Existing Suites Preserved
- `translations.test.ts` (4 tests): **PASS**.
- `schemeSearch.test.ts` (5 tests): **PASS**.
- `securityAndPrivacy.test.ts` (3 tests): **PASS**.
- `store.test.ts` (6 tests): **PASS**.
