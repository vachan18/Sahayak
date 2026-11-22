# PM-KISAN — Rule Corrections & Statutory Exclusion Nuance

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/services/eligibilityEngine.ts`, `src/data/schemes.ts`  

---

## 1. Statutory Background & Authority

**Primary Legal Source:**  
Operational Guidelines for Pradhan Mantri Kisan Samman Nidhi (PM-KISAN), Department of Agriculture & Farmers Welfare, Ministry of Agriculture & Farmers Welfare, Government of India.  
*Cabinet Decision dated 31.05.2019 (Abolition of 2-Hectare / 5-Acre Limit).*

---

## 2. Key Rule Refinements & Defect Corrections

### 2.1 Universal Landholding (No 5-Acre Ceiling)
- In Phase 4.5, we eliminated the obsolete 5-acre limit.
- In Phase 4.6, we preserved universal coverage for all cultivable landholding sizes while strictly excluding landless casual laborers (`landholdingAcres === 0`), who must be directed to MGNREGA or State Social Security rather than PM-KISAN, as land title in state land records (Bhoomi/RTC/Khatauni) is a non-negotiable statutory requirement under Clause 2.

### 2.2 Clause 2(b)(iii) Group D / MTS Exemption (Critical Fix)
- **Previous Defect:** The engine previously applied a blunt `isGovtEmployee === true` exclusion, disqualifying any family with any government job.
- **Statutory Truth:** Under PM-KISAN Clause 2(b)(iii), regular serving or retired officers and employees of Central/State Government Departments, Autonomous Bodies, and PSUs are excluded, **except Class IV / Multi-Tasking Staff (MTS) / Group D employees**.
- **Implementation:** Added `answers.govtEmploymentType === 'group_d_mts'`. When selected or verified, the engine marks the applicant as exempt and satisfies the employment criterion.

### 2.3 Clause 2(b)(iv) Pension Exemption Threshold
- **Statutory Truth:** Superannuated or retired pensioners whose monthly pension is **₹10,000 or more** are excluded. Pensioners whose monthly pension is **below ₹10,000** are legally entitled to receive PM-KISAN if they hold agricultural land.
- **Implementation:**
  - `pensioner_above_10k`: Disqualified with citation of Clause 2(b)(iv).
  - `pensioner_below_10k`: Explicitly satisfied as exempt.

### 2.4 Clause 2(b)(iv) Income-Tax Payee Handling
- **Statutory Rule:** All persons who paid Income Tax in the last assessment year are excluded.
- **Engine Logic:**
  - If `isIncomeTaxPayee === true` OR `annualIncome > 800000`: Disqualified under Clause 2(b)(iv).
  - If `annualIncome <= 250000` OR `isIncomeTaxPayee === false`: Confirmed non-income tax payee status based on tax-exempt bracket.
  - If income is between ₹2.5L and ₹8L: Confirmed as non-excluded bracket unless explicitly declared as a tax payee.

### 2.5 Institutional Landholders & Registered Professionals
- Institutional landholders (temple trusts, corporate farms, educational institutions) are excluded under Clause 2(a).
- Doctors, Engineers, Lawyers, Chartered Accountants, and Architects registered with statutory professional bodies and carrying out practice by undertaking field work are excluded under Clause 2(b)(v).
- Constitutional post holders, present and former Ministers, MPs, MLAs, and Mayors are excluded under Clause 2(b)(i-ii).

---

## 3. Test Verification Matrix

| Test Scenario | Profile Inputs | Expected Status | Result |
| :--- | :--- | :--- | :--- |
| **Large Landholder (> 5 Acres)** | Farmer, 12 Acres, Income ₹2L, Non-govt | `potentially_eligible` | **PASS** |
| **Landless Labourer (0 Acres)** | Farmer, 0 Acres, Income ₹1L, Non-govt | `not_established` | **PASS** |
| **Missing Landholding** | Farmer, Income ₹1L, Non-govt, Land missing | `additional_verification_required` | **PASS** |
| **Regular State Govt Employee** | Farmer, 2 Acres, `central_state_regular` | `not_established` (Statutory Exclusion) | **PASS** |
| **Group D / MTS Staff** | Farmer, 2.5 Acres, `group_d_mts`, Income ₹2.2L | `potentially_eligible` (Clause 2.b.iii Exemption) | **PASS** |
| **High Pensioner (≥ ₹10,000/mo)** | Farmer, 3 Acres, `pensioner_above_10k` | `not_established` (Clause 2.b.iv Exclusion) | **PASS** |
| **Low Pensioner (< ₹10,000/mo)** | Farmer, 3 Acres, `pensioner_below_10k` | `potentially_eligible` (Exempt) | **PASS** |
| **Income-Tax Payee** | Farmer, 2 Acres, `isIncomeTaxPayee === true` | `not_established` (Clause 2.b.iv Exclusion) | **PASS** |
