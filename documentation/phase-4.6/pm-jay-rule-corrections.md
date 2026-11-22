# Ayushman Bharat PM-JAY — Rule Corrections & Statutory Alignment

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/services/eligibilityEngine.ts`, `src/data/schemes.ts`  

---

## 1. Defect Identification

In Phase 4.5, the application contained an arbitrary income ceiling rule for PM-JAY:
```typescript
// Obsolete Phase 4.5 logic:
if (answers.annualIncome > 250000) {
  disqualifyingExclusions.push("Income exceeds PM-JAY threshold");
}
```
This was a critical domain error. The Government of India and National Health Authority (NHA) operational guidelines **do not enforce an arbitrary ₹2.50 Lakh income threshold** for PM-JAY.

## 2. Statutory Legal Framework

### 2.1 Primary Legal Authorities
1. **National Health Authority (NHA) Operational Guidelines for Ayushman Bharat PM-JAY (2018, as amended):**
   - Entitlement basis: Defined by Socio-Economic and Caste Census (SECC) 2011 deprivation criteria.
   - Rural: Households satisfying at least one of 7 deprivation criteria (D1: only one room with kucha walls/roof, D2: no adult member age 16-59, D3: female-headed household with no adult male, D4: disabled member with no able-bodied adult, D5: SC/ST households, D6: no literate adult above 25, D7: landless households deriving major income from manual casual labour), plus automatically included categories (destitute/living on alms, manual scavengers, primitive tribal groups, legally released bonded labourers).
   - Urban: 11 defined occupational categories (rag pickers, beggars, domestic workers, street vendors, construction workers, plumbers, transport workers, etc.).
2. **State Convergence (Karnataka Ayushman Bharat - Arogya Karnataka / AB-ArK):**
   - Direct convergence with National Food Security Act (NFSA) ration cards: BPL (Yellow/PHH) cardholders receive 100% cashless treatment up to ₹5.00 Lakh.
   - Non-BPL (APL) cardholders are covered under a co-payment structure (30% government subsidy up to ₹1.5 Lakh per family/year).
3. **Ayushman Vay Vandana Gazette Notification (MoHFW S.O. 4668(E), 2024):**
   - Universal coverage: Every citizen aged 70 years and above is entitled to a distinct Ayushman Vay Vandana card providing ₹5.00 Lakh hospitalization cover per year, **irrespective of household income or economic status**.
   - Senior citizens in families already covered under PM-JAY receive an additional top-up of ₹5.00 Lakh exclusively for themselves.
   - Senior citizens with existing private health insurance or ESIC/CGHS/ECHS can opt for Ayushman Vay Vandana card as per NHA protocol.

---

## 3. Implemented Corrections

1. **Abolition of Income Ceiling:**
   - Earning above ₹2.50 Lakh or ₹5.00 Lakh **never automatically disqualifies** an applicant from PM-JAY.
2. **Dual-Route Evaluation Architecture:**
   - **Route A (Universal Senior Citizens - 70+ Years):**
     - Evaluated if `answers.age >= 70`.
     - Automatically granted `potentially_eligible` status with citation: *"Ayushman Vay Vandana: Senior citizen aged 70+ qualifies for ₹5 Lakh hospital coverage irrespective of household income."*
   - **Route B (Citizens Under 70 Years):**
     - If `hasBplOrRationCard === true` OR `isSeccDeprivedHousehold === true`: flags `potentially_eligible` pending biometric e-KYC on the NHA Beneficiary Identification System (BIS) desk.
     - If `hasBplOrRationCard === false` AND `isSeccDeprivedHousehold === false`: evaluates to `not_established` due to non-inclusion in SECC deprivation lists or active NFSA food security records.
     - If beneficiary status is unconfirmed: flags `additional_verification_required` to instruct the citizen to verify their name at the local Gram Panchayat or Ayushman Mitra desk, **preventing false disqualification**.
3. **Government Employee Decoupling:**
   - Regular central/state government employees under age 70 are covered under statutory Central Government Health Scheme (CGHS) or State Medical Attendance Rules, which are distinct departmental systems.
   - However, senior citizens aged 70+ who are government pensioners are explicitly permitted to opt for the Ayushman Vay Vandana card.

---

## 4. Test Verification Matrix

| Test Scenario | Input Profile | Expected Status | Result |
| :--- | :--- | :--- | :--- |
| **Senior Citizen High Income** | Age 72, Income ₹8,00,000, Non-govt | `potentially_eligible` (Vay Vandana) | **PASS** |
| **Senior Citizen Ultra-High Income** | Age 72, Income ₹12,00,000, Non-govt | `potentially_eligible` (Vay Vandana) | **PASS** |
| **Under-70 with BPL Card** | Age 45, Income ₹1,20,000, BPL card unconfirmed | `additional_verification_required` | **PASS** |
| **Under-70 with ₹6.5L Income** | Age 45, Income ₹6,50,000, SECC unconfirmed | `additional_verification_required` (Not disqualified!) | **PASS** |
| **Under-70 Non-BPL/Non-SECC** | Age 45, BPL = false, SECC = false | `not_established` (SECC exclusion) | **PASS** |
| **Under-70 Regular Govt Employee** | Age 40, Regular State Govt employee | `not_established` (CGHS/ECHS rule) | **PASS** |
