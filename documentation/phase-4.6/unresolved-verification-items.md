# Unresolved Verification Items & Future Phase Roadmap

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Status:** AUDITED & CATALOGED  

---

## 1. Statutory Truth & Intellectual Honesty

In accordance with Phase 4.6 engineering guidelines, SAHAYAK does not invent government rules or fabricate operational certitudes. When statutory guidelines vary by state or require primary field verification from district revenue departments, they are explicitly cataloged under `NEEDS_REVIEW` rather than falsely hardcoded.

The following items are unresolved verification items slated for deeper state-level field auditing and future integration:

---

## 2. Unresolved Verification Catalog

| Item Code | Scheme / Domain | Description & Legal Ambiguity | Current Conservative Fallback | Target Phase |
| :---: | :--- | :--- | :--- | :---: |
| **UVI-01** | **State Food Security (NFSA / BPL)** | Karnataka Ahara portal utilizes both Priority Household (PHH) and Antyodaya Anna Yojana (AAY) cards. Urban BPL criteria differ slightly from rural criteria regarding floor area (> 300 sq.ft) and white goods ownership. | Fallback flags `additional_verification_required` with explicit request for physical/digital ration card verification on Ahara portal. | Phase 5 |
| **UVI-02** | **Karnataka AB-ArK Co-Payment Tiers** | For non-BPL (APL) families, Ayushman Bharat - Arogya Karnataka covers 30% of package rates up to ₹1.50 Lakh. Whether an APL family should be displayed as partially eligible or requiring local referral desk consultation. | Displayed as `additional_verification_required` with clear note on 30% co-payment structure. | Phase 5 |
| **UVI-03** | **PM-KISAN Joint Land Titles** | Where cultivable land is held jointly under Hindu Succession Act / undivided family records, each co-owner with recorded land title is entitled to ₹6,000, subject to separate bank account linkage. However, if mutation is pending, disbursement stalls. | Added `isLandMutationPending` flag; triggers `additional_verification_required` instructing applicant to get RTC endorsement. | Phase 5 |
| **UVI-04** | **PMMVY Anganwadi Worker Coverage** | Operational guidelines Clause 3.2 explicitly permit Anganwadi Workers (AWWs), Anganwadi Helpers (AWHs), and Accredited Social Health Activists (ASHAs) to receive PMMVY if they are honorarium-based and not regular government employees with statutory paid maternity leave. | Modeled honorarium workers under non-excluded category; requires Anganwadi supervisor attestation. | Phase 5 |
| **UVI-05** | **PM SVANidhi Rural Hawkers** | Peri-urban and rural vendors operating adjacent to urban borders may receive Letters of Recommendation from peri-urban Gram Panchayats under certain state circulars. | Standardized on TVC / ULB LoR requirement; flags verification if applicant is rural vendor. | Phase 5 |
| **UVI-06** | **KCC Interest Subvention Scheme (ISS)** | Subsidized rate of 4% requires prompt repayment within 1 year; failure to repay resets rate to normal commercial lending rate (around 9-10%). | Formatted display shows "Up to ₹3.00 Lakh (at 4% effective interest upon prompt repayment)"; disclaimer clarifies loan condition. | Phase 5 |
| **UVI-07** | **Post-Matric Fee Waiver vs Maintenance Allowance** | Centrally sponsored scholarships consist of non-refundable compulsory fee reimbursement (paid to college) plus monthly maintenance allowance (paid to student). Totals vary by course group (Group 1: Medicine/Engineering vs Group 4: General Arts). | Standardized on average ₹14,000 annual maintenance and fee allowance benchmark with explanatory breakdown. | Phase 5 |

---

## 3. Preparation for Phase 5 (Supabase & Gemini Integration)

These unresolved items establish the clear functional requirements for Phase 5:
1. **Supabase Schema Alignment:**
   - Storing user profile attributes (`farmerTenureType`, `maternityParity`, `govtEmploymentType`, `hasBplOrRationCard`) in encrypted user state.
   - Securing citizen document metadata in Row Level Security (RLS) tables without storing raw Aadhaar numbers or unencrypted bank accounts.
2. **Gemini Sathi Domain Grounding:**
   - Grounding conversational queries using the `rulesRegistry` so the AI assistant never hallucinates eligibility or claims guaranteed disbursement.
