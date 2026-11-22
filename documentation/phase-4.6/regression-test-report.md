# Regression Test Report — Phase 4.6 Verification

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Date:** 2026-11-22  
**Test Runner:** Vitest v5.1.1  
**TypeScript Version:** 5.7.2  

---

## 1. Executive Summary

All automated regression and component test suites passed with **100% success rate**. Zero failures, zero warnings, and zero type errors.

- **Total Test Files:** 6 passed (6 total)
- **Total Tests:** 69 passed (69 total)
- **Execution Duration:** ~5.5s
- **Production Build:** Succeeded (`tsc -b && vite build` built in 7.64s with gzip bundle ~128 kB)

---

## 2. Test File Breakdown

| Test File | Test Suite Name | Test Count | Passing | Failing |
| :--- | :--- | :---: | :---: | :---: |
| `src/test/eligibilityEngine.test.ts` | Hardened Rules & Primary Source Verification | 46 | 46 | 0 |
| `src/test/schemeSearch.test.ts` | Scheme Catalog & Search Engine | 5 | 5 | 0 |
| `src/test/schemeValidation.test.ts` | Scheme Zod Schema Validation | 5 | 5 | 0 |
| `src/test/securityAndPrivacy.test.ts`| Local Storage Security & Privacy | 3 | 3 | 0 |
| `src/test/store.test.ts` | Zustand Store & App State | 6 | 6 | 0 |
| `src/test/translations.test.ts` | Localization & Translations Integrity | 4 | 4 | 0 |
| **TOTALS** | | **69** | **69** | **0** |

---

## 3. Detailed Breakdown of Eligibility Engine Tests (46 Tests)

### 3.1 Section A: Missing Information Handling (4 Tests)
1. `returns "not_assessed" when zero questions are answered` -> PASS
2. `returns "in_progress" when questionnaire is incomplete (core demographic set missing)` -> PASS
3. `flags "additional_verification_required" when scheme criteria are missing rather than falsely qualifying` -> PASS
4. `flags PMMVY as "additional_verification_required" when pregnancy/maternity status is unconfirmed` -> PASS

### 3.2 Section B: 5 Eligibility Outcome States (5 Tests)
1. `State 1: "not_assessed" when empty` -> PASS
2. `State 2: "in_progress" when partially filled` -> PASS
3. `State 3: "potentially_eligible" when citizen satisfies all affirmative criteria with zero exclusions` -> PASS
4. `State 4: "not_established" when confirmed exclusion applies to all assessed schemes` -> PASS
5. `State 5: "additional_verification_required" when no schemes match fully but document checks are needed` -> PASS

### 3.3 Section C: Scheme-Specific Rules (32 Tests)

#### PM-KISAN (7 Tests)
1. `does NOT arbitrarily exclude farmers with > 5 acres (revised 31.05.2019 Cabinet guidelines)` -> PASS
2. `excludes landless farmers and agricultural labourers (landholding = 0)` -> PASS
3. `enforces statutory regular government employee exclusion` -> PASS
4. `exempts Group D / MTS employees from government exclusion under Clause 2(b)(iii)` -> PASS
5. `excludes pensioners with monthly pension >= ₹10,000 under Clause 2(b)(iv)` -> PASS
6. `exempts pensioners with monthly pension < ₹10,000` -> PASS
7. `excludes income-tax payees under Clause 2(b)(iv)` -> PASS

#### Ayushman Bharat PM-JAY (5 Tests)
8. `qualifies all senior citizens aged 70+ under expanded Ayushman Vay Vandana card regardless of income` -> PASS
9. `does NOT assume eligibility from income alone for under-70 citizens; requires SECC / BPL card verification` -> PASS
10. `does NOT auto-disqualify families with income > 2.5L; flags additional_verification_required if SECC unconfirmed` -> PASS
11. `excludes under-70 applicants when confirmed non-SECC and non-BPL` -> PASS
12. `excludes regular government employees covered under CGHS/ECHS` -> PASS

#### PMMVY (6 Tests)
13. `excludes male applicants with a clear statutory explanation` -> PASS
14. `excludes applicants under 19 years of age` -> PASS
15. `qualifies eligible expectant mother for 1st child (₹5,000) when all conditions are affirmatively satisfied` -> PASS
16. `qualifies eligible mother for 2nd girl child (₹6,000) under Mission Shakti guidelines` -> PASS
17. `excludes 2nd boy child with statutory reasoning countering female foeticide` -> PASS
18. `excludes 3rd or subsequent children under statutory cap` -> PASS

#### PM SVANidhi (3 Tests)
19. `qualifies verified street vendor with Certificate of Vending (CoV)` -> PASS
20. `excludes artisans and directs to PM Vishwakarma` -> PASS
21. `flags additional_verification_required when CoV / LoR status is unconfirmed` -> PASS

#### Kisan Credit Card (KCC) (6 Tests)
22. `qualifies owner cultivators with agricultural land` -> PASS
23. `qualifies tenant farmers without requiring land ownership title` -> PASS
24. `qualifies sharecroppers under RBI KCC Master Direction` -> PASS
25. `qualifies animal husbandry / dairy farmers for working capital up to ₹2 Lakh` -> PASS
26. `qualifies fisheries applicants without cultivable land ownership` -> PASS
27. `flags additional_verification_required when tenure type is unconfirmed` -> PASS

#### Post-Matric Scholarships Separation (5 Tests)
28. `qualifies SC student with family income ₹2.20 Lakh under MoSJE scheme (ceiling ₹2.5L)` -> PASS
29. `excludes minority student with family income ₹2.20 Lakh because Minority ceiling is ₹2.0L` -> PASS
30. `qualifies minority student with income ₹1.80 Lakh and 55% marks` -> PASS
31. `excludes minority student with 45% marks (< 50% statutory threshold)` -> PASS
32. `excludes General category non-minority from affirmative scholarship schemes` -> PASS

### 3.4 Section D: Benefit Calculation Integrity (3 Tests)
1. `NEVER combines health insurance coverage or loans into annual cash income` -> PASS
2. `does not assume that one-time maternity grants repeat annually` -> PASS
3. `isolates scholarships from generic subsidies` -> PASS

### 3.5 Section E: Boundary Conditions (2 Tests)
1. `handles exact income threshold boundaries (₹2,50,000)` -> PASS
2. `handles exact minimum age boundaries (18 for PM SVANidhi, 19 for PMMVY)` -> PASS

---

## 4. Build and Strict Compilation Output

```
> tsc -b && vite build
vite v6.4.6 building for production...
transforming...
✓ 1631 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.22 kB │ gzip:   0.65 kB
dist/assets/index-SZ2lDsdO.css   52.31 kB │ gzip:   8.74 kB
dist/assets/index-C27oQTTl.js   483.03 kB │ gzip: 128.16 kB
✓ built in 7.64s
```
Zero compile errors, zero linter warnings.
