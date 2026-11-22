# PM SVANidhi — Urban Vending Scope & Artisan Separation

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/services/eligibilityEngine.ts`, `src/data/schemes.ts`  

---

## 1. Statutory Basis & Scope

**Primary Legal Reference:**  
Scheme Guidelines for PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi), Ministry of Housing and Urban Affairs (MoHUA), Government of India.  
*Extended operational validity through December 2024 / cabinet revision.*

---

## 2. Key Rule Corrections & Domain Distinctions

### 2.1 The Street Vendor Boundary
PM SVANidhi was enacted to provide affordable collateral-free working capital micro-credit to urban street vendors whose livelihoods were disrupted by pandemic lockdowns.
- **Eligible Target Group:** Urban street vendors, hawkers, thelawalas, rehris, vegetable/fruit sellers, tea stalls, and mobile food carts operating in urban local body (ULB) jurisdictions.
- **Ineligible Group (Artisans & Craftsmen):** Handloom weavers, blacksmiths, carpenters, potters, cobblers, and traditional artisans are **NOT street vendors** under Section 2.1 of MoHUA guidelines.
- **Redirection to PM Vishwakarma:** Artisans are explicitly covered under the **PM Vishwakarma Scheme** (Ministry of MSME), which provides ₹15,000 toolkit grants, 5% interest collateral-free credit (Tranche 1: ₹1 Lakh, Tranche 2: ₹2 Lakh), and 5 days of skill training. Qualifying an artisan for PM SVANidhi was an erroneous classification that would lead to bank rejections.
- **Engine Implementation:** When an applicant selects `artisan` without street vending credentials, the engine returns `not_established` and explicitly provides the redirection message: *"PM SVANidhi Section 2.1: Scheme is strictly intended for urban street vendors, hawkers, and thelawalas. Artisans/craftspersons are covered under PM Vishwakarma, not SVANidhi."*

### 2.2 Proof of Vending (CoV / LoR Requirement)
To qualify under Section 2.1, a vendor must possess one of the following:
1. Certificate of Vending (CoV) or Identity Card issued by the Urban Local Body (ULB) / Town Vending Committee (TVC).
2. Vendors identified in the TVC survey but not issued CoV/ID card (Letter of Recommendation / LoR issued via online portal).
3. Vendors left out of the survey: Letter of Recommendation (LoR) from ULB / TVC / Town Representative.
- If `hasStreetVendorCertificate === true`: Satisfied.
- If `hasStreetVendorCertificate === false`: Disqualified under Section 2.1.
- If unconfirmed: Flags `additional_verification_required` to prompt the vendor to obtain an LoR from their local municipal ward office.

### 2.3 Age & Loan Structure
- Minimum age: 18 years (statutory requirement for institutional banking credit contracts).
- Loan Tiers:
  - First tranche: Up to ₹10,000 (repayable in 12 monthly installments).
  - Second tranche: Up to ₹20,000 upon timely repayment of first tranche.
  - Third tranche: Up to ₹50,000 upon timely repayment of second tranche.
  - 7% interest subsidy credited directly to bank account via DBT.
  - Cash-back incentive up to ₹1,200 per year for digital transactions.

---

## 3. Test Verification Matrix

| Test Scenario | Profile Inputs | Expected Status | Result |
| :--- | :--- | :--- | :--- |
| **Verified Street Vendor** | Street vendor, Age 32, CoV = true | `potentially_eligible` | **PASS** |
| **Artisan without Vending** | Artisan, Age 35, CoV = false | `not_established` (Redirect to Vishwakarma) | **PASS** |
| **Unconfirmed CoV Status** | Street vendor, Age 28, CoV unconfirmed | `additional_verification_required` | **PASS** |
| **Underage Vendor (< 18)** | Street vendor, Age 17, CoV = true | `not_established` (Banking age limit) | **PASS** |
| **Exact 18-Year Boundary** | Street vendor, Age 18, CoV = true | `potentially_eligible` | **PASS** |
