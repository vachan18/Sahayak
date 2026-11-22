# SAHAYAK — Scheme Data Verification & Fee Transparency Report
**Phase:** 4.5 — Eligibility Engine Correction & Government Data Integrity  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** Government Benefits Domain Analyst & QA Specialist  

---

## 1. Scheme Data Verification Taxonomy

Every scheme record in SAHAYAK is classified into one of three statutory verification tiers:

| Status Tag | Definition & Criteria |
| :--- | :--- |
| **`VERIFIED`** | Supported by a primary official government gazette, central operational guideline, or official ministry portal URL. Verified on November 2026. |
| **`NEEDS_REVIEW`** | Information exists in secondary circulars or public advisories, but requires formal department confirmation before production deployment. |
| **`DEMONSTRATION`** | Illustrative mock data included solely to test UI interaction, edge cases, or error handling. |

All 6 primary schemes in `src/data/schemes.ts` have been audited and certified as **`VERIFIED`** against official government sources.

---

## 2. Comprehensive Scheme Audit & Source Reference Table

| Scheme ID | Official Name | Benefit Category | Verification Status | Official Primary Source | Statutory Fee | CSC Assistance Charge | Statutory SLA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`pm-kisan`** | PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) | `annual_cash_transfer` (₹6,000/yr) | **`VERIFIED`** | Ministry of Agriculture & Farmers Welfare, Revised Guidelines (31.05.2019) • `pmkisan.gov.in` | **₹0.00** (Statutory Free) | Capped at ₹15 for biometric eKYC | 21 Days (Admin Estimate) |
| **`pm-jay`** | Ayushman Bharat (PM-JAY) | `health_insurance_cover` (₹5 Lakh cover) | **`VERIFIED`** | National Health Authority (NHA) Operational Guidelines & Ayushman Vay Vandana • `pmjay.gov.in` | **₹0.00** (Free at Public Hospitals) | Up to ₹30 for laminated PVC card print | 7 Days (Admin Estimate) |
| **`pmmvy`** | PMMVY (Pradhan Mantri Matru Vandana Yojana) | `one_time_cash` (₹5,000 maternity grant) | **`VERIFIED`** | Ministry of Women & Child Development, Mission Shakti Guidelines (2022) • `pmmvy.wcd.gov.in` | **₹0.00** (Free at Anganwadi/PHC) | ₹0 (Assisted by ASHA/Anganwadi worker) | 14 Days (Admin Estimate) |
| **`pm-svanidhi`** | PM SVANidhi (Micro-Credit for Street Vendors) | `loan_credit_facility` (₹10,000 loan) | **`VERIFIED`** | Ministry of Housing & Urban Affairs (MoHUA) Guidelines • `pmsvanidhi.mohua.gov.in` | **₹0.00** (Zero Bank Processing Fee) | Capped at ₹25 for assisted form upload | 10 Days (Admin Estimate) |
| **`post-matric-scholarship`**| Post-Matric Scholarship for SC/OBC | `scholarship` (₹14,000+ tuition + allowance) | **`VERIFIED`** | Ministry of Social Justice & Empowerment Guidelines • `scholarships.gov.in` | **₹0.00** (Free on NSP Portal) | ₹0 official fee | 30 Days (Admin Estimate) |
| **`pm-kcc`** | Kisan Credit Card (KCC) Subsidized Credit | `loan_credit_facility` (₹1,50,000 credit limit) | **`VERIFIED`** | Reserve Bank of India (RBI) / NABARD Master Directions • `rbi.org.in` | **₹0.00** (Zero Bank Fee up to ₹3 Lakh) | ₹0 bank documentation fee | 14 Days (Admin Estimate) |

---

## 3. Government Fee & Anti-Intermediary Safeguards

### 3.1 Eliminating Universal "100% Free" Oversimplifications
- In earlier phases, generic statements claimed that all government interactions are "100% Free without fees".
- **Regulatory Reality:** While official government statutory application fees are indeed **₹0.00** on self-service portals, **Common Service Centres (CSCs) and Village Level Entrepreneurs (VLEs)** are legally authorized by CSC e-Governance Services India Limited (CSC SPV) to levy nominal facilitation charges for biometric scanning, hardware printing, and data entry (typically ₹15 to ₹30).
- **SAHAYAK Protection:**
  - SAHAYAK's updated CSC Summary Slip (`CscSlipScreen.tsx`) and Scheme Detail screens explicitly distinguish the **Statutory Government Fee (₹0.00)** from the **Authorized CSC Assistance Charge (₹15–₹30)**.
  - This arms semi-literate rural citizens with precise official fee receipts, preventing corrupt intermediaries from extracting arbitrary surcharges of ₹500–₹1,000.

### 3.2 Processing Timelines: Estimates vs. Statutory Guarantees
- SAHAYAK no longer asserts "guaranteed 7-day turnaround" universally.
- Timelines are clearly designated as **Administrative Estimates** based on standard departmental processing cycles (e.g., 21 days for revenue verification under PM-KISAN, 14 days for bank underwriting under PM-KCC), avoiding false expectations of instant approval.
