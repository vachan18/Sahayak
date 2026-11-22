# PMMVY (Pradhan Mantri Matru Vandana Yojana) — Multi-Pathway Parity & Mission Shakti Rules

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/services/eligibilityEngine.ts`, `src/data/schemes.ts`  

---

## 1. Statutory Authority & Governance

**Primary Legal Reference:**  
Mission Shakti Operational Guidelines (Samarthya Sub-Scheme), Ministry of Women and Child Development (MWCD), Government of India.  
*Effective Date: 01.04.2022.*  
*Supersedes previous PMMVY guidelines from 2017.*

---

## 2. Key Rule Refinements & Multi-Pathway Architecture

### 2.1 The Two Distinct Benefit Pathways
Under Mission Shakti, PMMVY restructured maternity cash incentives into two distinct pathways:

1. **Pathway 1: First Living Child (₹5,000 Total):**
   - Disbursed in 2 installments:
     - Installment 1: ₹3,000 upon early registration of pregnancy and at least one Ante-Natal Check-up (ANC) within 6 months from Last Menstrual Period (LMP) at Anganwadi / Primary Health Centre (PHC).
     - Installment 2: ₹2,000 upon child birth registration and completion of first cycle of immunization (BCG, OPV, DPT, Hepatitis B).
   - *Note:* Under institutional delivery, mother also receives ₹1,000 under Janani Suraksha Yojana (JSY), bringing total maternity support to ₹6,000.

2. **Pathway 2: Second Girl Child (₹6,000 Total):**
   - Introduced under Mission Shakti specifically to discourage female foeticide and improve Sex Ratio at Birth (SRB).
   - Disbursed in **a single installment of ₹6,000** after the birth of the girl child and completion of all primary immunizations.
   - **Crucial Statutory Condition:** If the second child is a **boy**, this benefit is **statutorily denied**.

3. **Statutory Parity Cap (Third Child Exclusion):**
   - PMMVY benefits under Mission Shakti are strictly capped at the first two children. Any pregnancy of parity 3 or above is ineligible (`not_established`).

---

## 3. Applicant Eligibility & Exclusion Criteria

| Criterion | Rule & Operational Baseline | Engine Behavior |
| :--- | :--- | :--- |
| **Gender** | Exclusively pregnant women and lactating mothers | Male applicants are conclusively disqualified (`not_established`) |
| **Minimum Age** | At least 19 years at date of registration | Age < 19 is conclusively disqualified (`not_established`) |
| **Maternity Status** | Must be currently pregnant or lactating mother | Non-expectant/non-lactating women disqualified |
| **Employment Exclusion** | Regular employees of Central/State Govt and PSUs with paid maternity leave are excluded | Excluded under Section 3.2 unless non-government/unorganized sector |
| **Documentation** | Must hold Mother and Child Protection (MCP) card | If missing, flags `additional_verification_required` |

---

## 4. Test Verification Matrix

| Test Scenario | Profile Inputs | Expected Status | Result |
| :--- | :--- | :--- | :--- |
| **Male Applicant** | Male, Age 30, Non-govt | `not_established` (Male exclusion) | **PASS** |
| **Underage Mother (< 19)** | Female, Age 17, Pregnant | `not_established` (Under 19 exclusion) | **PASS** |
| **1st Child Eligible Mother** | Female, Age 24, Pregnant, 1st Child, MCP = true | `potentially_eligible` (Pathway 1: ₹5,000) | **PASS** |
| **2nd Girl Child Eligible** | Female, Age 26, Pregnant, 2nd Child, Female, MCP = true | `potentially_eligible` (Pathway 2: ₹6,000) | **PASS** |
| **2nd Boy Child Disqualified** | Female, Age 26, 2nd Child, Male, MCP = true | `not_established` (Mission Shakti clause) | **PASS** |
| **3rd Child Disqualified** | Female, Age 30, 3rd Child, MCP = true | `not_established` (Parity cap) | **PASS** |
| **Missing MCP Card** | Female, Age 24, Pregnant, MCP unconfirmed | `additional_verification_required` | **PASS** |
