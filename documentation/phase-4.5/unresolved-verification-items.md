# SAHAYAK — Unresolved Verification Items & State-Specific Nuances
**Phase:** 4.5 — Eligibility Engine Correction & Government Data Integrity  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** Government Benefits Domain Analyst & Principal Software Engineer  

---

## 1. Transparency Ledger

In strict accordance with the mandate ("Do not invent government eligibility rules. If a rule cannot be verified, mark it as requiring review rather than inventing a replacement"), this ledger documents all operational nuances and state-level variations that cannot be settled without live state database access.

---

## 2. Unresolved Items & Department Variations

### 2.1 State-Specific PM-KISAN Land Record Integration
- **Issue:** In Karnataka, land titles are indexed in the **Bhoomi** revenue portal (RTC / Pahani). Other states use distinct land record systems (e.g., Bhulekh in UP, MeeBhoomi in AP).
- **Nuance:** While PM-KISAN central guidelines mandate land title ownership in state revenue records, states have differing rules regarding inherited land pending Khata mutation.
- **Engine Handling:** When a farmer has non-mutated or joint ancestral land records, the engine marks the result as `additional_verification_required` and prompts the citizen to present their current mutation endorsement (Pahani/RTC).

### 2.2 Ayushman Bharat PM-JAY / State Convergence Scheme Mergers
- **Issue:** In Karnataka, PM-JAY is converged with **Arogya Karnataka (AB-ArK)**. Under state convergence rules, families holding BPL cards receive 100% cashless treatment up to ₹5 Lakh, while APL cardholders receive 30% co-payment subsidies up to ₹1.5 Lakh.
- **Engine Handling:** The core central rules for PM-JAY (SECC 2011 / BPL cardholders / 70+ Vay Vandana cardholders) are marked `VERIFIED`. Detailed APL co-payment tiering is marked as `NEEDS_REVIEW` and deferred to state-level health portal integration in Phase 5.

### 2.3 PM SVANidhi Vending Period Grandfathering
- **Issue:** PM SVANidhi originally applied to street vendors vending on or before March 24, 2020. The scheme has since been extended by MoHUA through December 2024 with subsequent transitional notifications.
- **Engine Handling:** The core eligibility requirement (Certificate of Vending or ULB Letter of Recommendation) is marked `VERIFIED`. The grandfathering cut-off date is omitted from hardcoded exclusion logic so as not to prematurely disqualify new urban vendor cardholders.

---

## 3. Safe Fallback Protocol

When live verification is unavailable:
1. **Never assume disqualification.** If an official document check is pending, classify as `additional_verification_required`.
2. **Never assume qualification.** Do not certify benefits before physical/biometric validation.
3. **Always display statutory disclaimers.** Every screen explicitly informs the citizen that final sanction rests with the competent statutory authority.
