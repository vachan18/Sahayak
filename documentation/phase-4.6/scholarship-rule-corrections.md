# Scholarship Separation — SC/ST/OBC vs Minority Statutory Framework

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/data/schemes.ts`, `src/services/eligibilityEngine.ts`, `src/types/index.ts`  

---

## 1. Statutory Authorities & Scheme Separation

In previous iterations, educational scholarships were bundled into a generic single entry. In reality, the Government of India administers two distinct flagship centrally sponsored post-matric scholarship schemes under two separate ministries, with differing parental income ceilings, community definitions, and academic merit requirements.

### 1.1 Ministry of Social Justice and Empowerment (MoSJE)
- **Scheme Name:** Centrally Sponsored Scheme of Post-Matric Scholarships for Scheduled Castes (SC), Scheduled Tribes (ST), and Other Backward Classes (OBC).
- **Statutory Authority:** MoSJE Scheme Guidelines (Effective 2021-2026 Revision).
- **Target Beneficiaries:** Scheduled Caste (SC), Scheduled Tribe (ST), OBC, Economically Backward Classes (EBC), and De-notified Tribes (DNT) students.
- **Family Income Ceiling:** **₹2,50,000 per annum** from all sources.
- **Academic Merit Rule:** Enrolled in a recognized post-matric course (Class 11 to Ph.D.). Passing the qualifying examination is required, but there is no statutory 50% merit cut-off for initial post-matric entitlement.

### 1.2 Ministry of Minority Affairs (MoMA)
- **Scheme Name:** Post-Matric Scholarship Scheme for Minorities.
- **Statutory Authority:** Ministry of Minority Affairs Operational Guidelines (Clause 3).
- **Target Beneficiaries:** Students belonging to six notified minority communities under Section 2(c) of the National Commission for Minorities Act, 1992 (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).
- **Family Income Ceiling:** **₹2,00,000 per annum** (strictly lower than the ₹2.50 Lakh SC ceiling!).
- **Academic Merit Cut-off:** Student must have secured **not less than 50% marks** (or equivalent grade) in the previous final examination. An applicant with < 50% marks is statutorily disqualified.

---

## 2. Implemented Schema & Engine Structure

### 2.1 Scheme Catalog Separation
Two distinct verified scheme entities exist in `src/data/schemes.ts`:
1. `post-matric-scholarship`: ID `post-matric-scholarship`, Ministry `Ministry of Social Justice and Empowerment`, ceiling ₹2.50 Lakh, categories `['sc', 'st', 'obc']`.
2. `post-matric-scholarship-minority`: ID `post-matric-scholarship-minority`, Ministry `Ministry of Minority Affairs`, ceiling ₹2.00 Lakh, category `['minority']`, required minimum marks 50%.

### 2.2 Benefit Categorization
- In `src/types/index.ts`, `CategorizedBenefitSummary` was updated with `scholarshipTotal: number`.
- Scholarships are now strictly tracked under `scholarshipTotal`, preventing them from being aggregated into capital subsidies or annual DBT cash.

---

## 3. Test Verification Matrix

| Test Scenario | Profile Inputs | Expected Outcome | Result |
| :--- | :--- | :--- | :--- |
| **SC Student (Income ₹2.2L)** | Category SC, Income ₹2.20L, Student | `potentially_eligible` under MoSJE scheme | **PASS** |
| **Minority Student (Income ₹2.2L)** | Category Minority, Income ₹2.20L, Marks 65% | `not_established` (Exceeds ₹2.0L MoMA cap) | **PASS** |
| **Minority Student (Income ₹1.8L, 55% Marks)** | Category Minority, Income ₹1.80L, Marks 55% | `potentially_eligible` under MoMA scheme | **PASS** |
| **Minority Student (Income ₹1.8L, 45% Marks)** | Category Minority, Income ₹1.80L, Marks 45% | `not_established` (Fails 50% merit threshold) | **PASS** |
| **General Category Student** | Category General, Income ₹1.50L, Marks 80% | `not_established` on affirmative scholarships | **PASS** |
| **Benefit Isolation** | Evaluated scholarship benefit of ₹14,000 | `scholarshipTotal === 14000`, `subsidyTotal === 0` | **PASS** |
