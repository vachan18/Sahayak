# Kisan Credit Card (KCC) — Multi-Pathway Tenurial Decoupling

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/services/eligibilityEngine.ts`, `src/data/schemes.ts`  

---

## 1. Statutory Authority

**Primary Legal Reference:**  
Reserve Bank of India (RBI) Master Direction on Kisan Credit Card (KCC) Scheme.  
*RBI Notification FIDD.CO.FSD.BC.No.12/05.05.010/2018-19 (and revised circulars on Animal Husbandry and Fisheries).*

---

## 2. Key Rule Refinements & Decoupling from Land Ownership

### 2.1 The Land Ownership Fallacy in Banking Regulations
In earlier iterations, the system conflated PM-KISAN's strict land title requirement with KCC. Under PM-KISAN, cash assistance is legally tied to agricultural land title deeds in state records. However, under the RBI Master Direction on KCC, credit delivery is **not restricted to land owners**.

### 2.2 Statutory Recognition of Non-Owner Cultivators (Section 3)
Under RBI guidelines, the following categories are legally eligible for KCC crop credit limits:
1. **Owner Cultivators:** Farmers cultivating their own agricultural land.
2. **Tenant Farmers:** Individuals cultivating land under formal or informal tenancy.
3. **Oral Lessees & Sharecroppers:** Farmers who cultivate land under crop-sharing arrangements.
4. **Self-Help Groups (SHGs) & Joint Liability Groups (JLGs):** Groups of micro-farmers and tenant cultivators.

**Crucial Correction:** A tenant farmer or sharecropper with `landholdingAcres === 0` is **fully eligible for KCC**, unlike PM-KISAN.

### 2.3 Animal Husbandry & Fisheries Working Capital Extension
By RBI Notification dated 04.02.2019, the Kisan Credit Card facility was officially extended to:
1. **Animal Husbandry & Dairy Farmers:** Credit for purchase of feed, veterinary aid, fodder cultivation, and water supply.
2. **Fisheries & Aquaculture Farmers:** Credit for fingerlings, feed, pond maintenance, harvesting, and fuel.
- Working capital loan limit for allied activities: Up to **₹2.00 Lakh** at concessional interest rate of 7% (effective 4% with prompt repayment incentive of 3%).
- No agricultural land ownership is required to operate a dairy or fishery unit.

### 2.4 Engine Implementation
- If `farmerTenureType` is `'owner_cultivator'`, `'tenant_farmer'`, `'sharecropper'`, or `'oral_lessee'`: Satisfies cultivation pathway.
- If `farmerTenureType` is `'animal_husbandry_dairy'` or `'fisheries'`: Satisfies allied pathway (up to ₹2L sub-limit).
- If `farmerTenureType` is missing and `landholdingAcres > 0`: Defaults to owner cultivator.
- If `farmerTenureType` is missing and `landholdingAcres === 0`: Flags `additional_verification_required` to clarify whether applicant is a tenant, sharecropper, or allied farmer.
- If `farmerTenureType === 'none'`: Excluded (`not_established`).

---

## 3. Test Verification Matrix

| Test Scenario | Profile Inputs | Expected Status | Result |
| :--- | :--- | :--- | :--- |
| **Owner Cultivator** | Farmer, 4.5 Acres, `owner_cultivator` | `potentially_eligible` | **PASS** |
| **Tenant Farmer (Landless)** | Farmer, 0 Acres, `tenant_farmer` | `potentially_eligible` | **PASS** |
| **Sharecropper (Landless)** | Farmer, 0 Acres, `sharecropper` | `potentially_eligible` | **PASS** |
| **Dairy / Animal Husbandry** | Farmer, 0 Acres, `animal_husbandry_dairy` | `potentially_eligible` (Allied Pathway) | **PASS** |
| **Fisheries (Landless)** | Farmer, 0 Acres, `fisheries` | `potentially_eligible` (Allied Pathway) | **PASS** |
| **Unspecified Tenure (0 Acres)** | Farmer, 0 Acres, Tenure unconfirmed | `additional_verification_required` | **PASS** |
| **Non-Farmer / No Activity** | Non-farmer, Tenure `none` | `not_established` | **PASS** |
