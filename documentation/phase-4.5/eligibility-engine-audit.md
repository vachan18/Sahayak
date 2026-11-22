# SAHAYAK — Eligibility Engine Audit Report
**Phase:** 4.5 — Eligibility Engine Correction & Government Data Integrity  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** Principal Software Engineer & Government Benefits Domain Analyst  

---

## 1. Audit Overview & Objectives

The primary objective of this audit was to inspect `src/services/eligibilityEngine.ts`, `src/data/schemes.ts`, and client-side benefit aggregation logic to identify and eradicate:
1. **False-Positive Eligibility Results:** Situations where missing data or partial questions were treated as successful eligibility checks.
2. **False-Negative Eligibility Results:** Erroneous statutory limits (such as imposing an obsolete 5-acre ceiling on PM-KISAN).
3. **Misleading Benefit Calculations:** Mathematical aggregation that combined health insurance coverage and micro-credit loans into "annual cash income".
4. **Unsubstantiated Government Claims:** Claims of universal statutory timelines or zero CSC facilitation fees.

---

## 2. Identified Vulnerabilities & Root Causes

### 2.1 The Missing Information Anti-Pattern
- **Observed Defect:** In earlier versions, if an applicant did not answer a criterion (e.g., landholding in acres, or maternity status), the condition block `if (scheme.eligibilityCriteria.maxLandholdingAcres !== undefined && answers.landholdingAcres !== undefined)` was skipped. As a result, the scheme remained marked as `isFullyEligible = true`.
- **Impact:** An applicant with no land recorded could be declared "Potentially Eligible" for PM-KISAN simply because the question was omitted.
- **Correction:** The engine now enforces that **a missing answer must NEVER count as an automatic pass**. If an affirmative criterion is required by the scheme and missing in user input, the scheme is classified as **`additional_verification_required`** with an explicit explanatory note.

### 2.2 The Obsolete PM-KISAN 5-Acre Limit
- **Observed Defect:** `schemes.ts` configured `maxLandholdingAcres: 5.0` and excluded farmers possessing more than 5 acres.
- **Government Authority Source:** On **31 May 2019**, the Union Cabinet formally approved the expansion of PM-KISAN to **all landholding eligible farmer families** irrespective of the size of their landholdings (Ministry of Agriculture & Farmers Welfare Order No. 1-1/2019-Credit-I).
- **Correction:** The arbitrary 5-acre restriction was removed. Farmers with cultivable land in state land records (RTC/Khatauni) are eligible, regardless of whether they own 1 acre or 15 acres, provided they are not income taxpayers or government employees.

### 2.3 The PM-JAY Beneficiary Assumption
- **Observed Defect:** PM-JAY was modeled as a simple threshold check (`annualIncome <= 250000`).
- **Government Authority Source:** National Health Authority (NHA) Operational Guidelines stipulate that PM-JAY is an entitlement-based scheme determined by **SECC 2011 deprivation criteria (D1–D7 rural, 11 occupational categories urban)** or active state NFSA BPL/Antyodaya ration cards, plus the expanded 2024 **Ayushman Vay Vandana card for all citizens aged 70+**.
- **Correction:** Income alone does not certify eligibility. For citizens under 70, the engine marks PM-JAY as `additional_verification_required` and prompts for official SECC/BPL ration card verification. Senior citizens aged 70+ are recognized as potentially eligible under the Ayushman Vay Vandana rule.

### 2.4 PMMVY Maternity Status Misattribution
- **Observed Defect:** PMMVY marked any female applicant between ages 19–45 as eligible.
- **Government Authority Source:** Ministry of Women & Child Development (MWCD) Mission Shakti Guidelines (2022) state that PMMVY is a conditional cash transfer specifically for **pregnant women and lactating mothers (PW&LM)** for their first living child (₹5,000) or second girl child (₹6,000).
- **Correction:** Gender and age alone do not establish eligibility. If pregnancy/maternity status with an MCP card is unconfirmed, the scheme is marked `additional_verification_required`. Male applicants receive a confirmed exclusion (`not_established`).

### 2.5 Flawed Benefit Aggregation
- **Observed Defect:** `totalAnnualBenefitValue = eligible.reduce((acc, s) => acc + s.financialBenefit.amount, 0)` combined PM-JAY (₹5,00,000 hospital insurance) + PM-KISAN (₹6,000 cash) + PM SVANidhi (₹10,000 loan) to display an erroneous "₹5,16,000 / year" cash benefit.
- **Correction:** Built a segregated benefit calculation model (`annualCashTransferTotal`, `healthInsuranceCoverTotal`, `loanCreditFacilityTotal`, `oneTimeCashTotal`, `subsidyTotal`). Health insurance and loans are strictly isolated from annual cash income.

---

## 3. Structural Engine Redesign

The engine was refactored into a modular two-tier architecture:
1. `evaluateSchemeEligibility(scheme, answers)`: Evaluates scheme-specific conditions, exclusions, and missing criteria, returning a structured `SchemeEvaluationOutcome`.
2. `assessEligibility(answers)`: Computes overall assessment state across all 6 verified schemes, aggregates categorized benefits, and attaches preliminary guidance disclaimers.
