# SAHAYAK — Government Schemes Eligibility Rules Reference
**Phase:** 4.5 — Eligibility Engine Correction & Government Data Integrity  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** Government Benefits Domain Analyst & TypeScript Architect  

---

## 1. Scheme-Specific Rules Matrix

This document codifies the exact eligibility criteria, statutory exclusions, missing-information triggers, and government legal citations for all 6 verified schemes in SAHAYAK.

---

### 1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
- **Official Authority:** Ministry of Agriculture & Farmers Welfare, Government of India.
- **Primary Source:** Operational Guidelines for PM-KISAN (Revised 31.05.2019 via Cabinet Decision).
- **Benefit Type:** `annual_cash_transfer` (₹6,000 per year in 3 equal installments of ₹2,000 via DBT/PFMS).
- **Affirmative Criteria:**
  - Primary occupation: Cultivator / farmer.
  - Land title: Registered cultivable landholding in state revenue records (RTC / Pahani / Khatauni / Bhoomi).
  - Landholding ceiling: **NONE** (2-hectare ceiling abolished on 31.05.2019).
- **Statutory Exclusions (Clause 2 of Guidelines):**
  - Institutional landholders.
  - Serving or retired officers and employees of Central/State Government Ministries, Departments, PSEs, and regular local body employees (excluding Multi Tasking Staff / Class IV / Group D).
  - All superannuated/retired pensioners whose monthly pension is ₹10,000/- or more.
  - All persons who paid Income Tax in the last assessment year.
  - Former and present Ministers, MPs, MLAs, MLCs, Mayors, and Chairpersons of District Panchayats.
  - Professionals (Doctors, Engineers, Lawyers, Chartered Accountants, Architects) registered with professional bodies.
  - Tenant farmers and sharecroppers without registered land ownership title in state records.
- **Missing Information Triggers:**
  - If `landholdingAcres` is undefined -> `additional_verification_required`.
  - If `isGovtEmployee` is undefined -> `additional_verification_required`.

---

### 2. Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)
- **Official Authority:** National Health Authority (NHA), Ministry of Health & Family Welfare.
- **Primary Source:** NHA PM-JAY Operational Guidelines 2020 & Ayushman Vay Vandana Gazette Notification (October 2024).
- **Benefit Type:** `health_insurance_cover` (₹5,00,000 hospitalization cover per family per year; cashless).
- **Affirmative Criteria:**
  - Route A (Senior Citizens): All citizens aged 70+ qualify under **Ayushman Vay Vandana card**, irrespective of household income.
  - Route B (Vulnerable Households): Households identified in SECC 2011 deprivation criteria (D1–D7 rural, 11 occupational categories urban) or active state NFSA BPL/Antyodaya ration cards.
- **Statutory Exclusions:**
  - Serving government employees covered under CGHS/ECHS/State government health schemes.
  - Households with income exceeding state NFSA threshold without senior citizens.
- **Missing Information Triggers:**
  - For applicants aged < 70, income <= 2.5L is insufficient for instant qualification. Requires cross-verification against SECC 2011 or state NFSA database -> `additional_verification_required`.

---

### 3. PMMVY (Pradhan Mantri Matru Vandana Yojana)
- **Official Authority:** Ministry of Women & Child Development (MWCD), Government of India.
- **Primary Source:** Mission Shakti Operational Guidelines (Effective 01.04.2022).
- **Benefit Type:** `one_time_cash` (₹5,000 for 1st child in 2 installments; ₹6,000 for 2nd girl child).
- **Affirmative Criteria:**
  - Gender: Female only.
  - Minimum Age: 19 years at date of registration.
  - Condition: Pregnant woman or lactating mother (PW&LM) registered at Anganwadi/PHC with valid MCP Card.
- **Statutory Exclusions:**
  - Male applicants (Confirmed exclusion: `not_established`).
  - Women in regular service with Central/State Govt or PSUs receiving paid maternity leave benefits under law.
- **Missing Information Triggers:**
  - If `isPregnantOrLactating` is undefined -> `additional_verification_required` ("Requires active Mother and Child Protection (MCP) card registration at Anganwadi/PHC").

---

### 4. PM SVANidhi (Micro-Credit for Street Vendors)
- **Official Authority:** Ministry of Housing & Urban Affairs (MoHUA), Government of India.
- **Primary Source:** Scheme Guidelines for PM SVANidhi (June 2020, extended to December 2024).
- **Benefit Type:** `loan_credit_facility` (Collateral-free working capital loan: 1st tranche ₹10,000, 2nd ₹20,000, 3rd ₹50,000 + 7% interest subsidy).
- **Affirmative Criteria:**
  - Occupation: Urban street vendor, hawker, thelawala.
  - Minimum Age: 18 years.
  - Verification: Possesses Certificate of Vending (CoV) or Letter of Recommendation (LoR) from Town Vending Committee (TVC) or Urban Local Body (ULB).
- **Statutory Exclusions:**
  - Fixed-store commercial shopkeepers.
  - Individuals below 18 years of age.
- **Missing Information Triggers:**
  - If `hasStreetVendorCertificate` is undefined -> `additional_verification_required`.

---

### 5. Post-Matric Scholarship for SC/OBC/Minority Students
- **Official Authority:** Ministry of Social Justice & Empowerment, Government of India.
- **Primary Source:** Centrally Sponsored Post-Matric Scholarship Scheme Guidelines • scholarships.gov.in.
- **Benefit Type:** `scholarship` (100% non-refundable tuition reimbursement + monthly maintenance allowance).
- **Affirmative Criteria:**
  - Social Category: SC, ST, OBC, or Minority.
  - Annual Family Income: <= ₹2,50,000 per annum.
  - Enrollment: Actively enrolled in a recognized post-matric course (Class 11, 12, ITI, Degree, PG).
  - Age: 15 to 35 years.
- **Statutory Exclusions:**
  - Family income > ₹2,50,000.
  - Students already receiving other central/state scholarships.
- **Missing Information Triggers:**
  - If student enrollment or caste verification is unconfirmed -> `additional_verification_required`.

---

### 6. Kisan Credit Card (KCC) Subsidized Crop Credit
- **Official Authority:** Reserve Bank of India (RBI) & NABARD.
- **Primary Source:** Master Directions on Kisan Credit Card Scheme (FIDD.CO.FSD.BC.No.12/05.05.010/2018-19).
- **Benefit Type:** `loan_credit_facility` (Subsidized crop credit limit up to ₹3,00,000 at 4% effective interest).
- **Affirmative Criteria:**
  - Occupation: Farmer (owner cultivator, recorded tenant farmer, or oral lessee).
  - Land Tenure: Active agricultural land cultivation title or tenancy agreement.
- **Statutory Exclusions:**
  - Non-farmers and landless individuals with no agricultural tenure.
  - Defaulters with non-performing agricultural debt.
- **Missing Information Triggers:**
  - If land records or agricultural occupation is undefined -> `additional_verification_required`.
