# SAHAYAK — Benefit Calculation & Categorization Model
**Phase:** 4.5 — Eligibility Engine Correction & Government Data Integrity  
**Product:** SAHAYAK (PIXEL THEORY)  
**Track:** DS-02: Government Schemes in Your Language  
**Date:** November 2026  
**Auditor:** Principal Software Engineer & Financial Logic Analyst  

---

## 1. The Benefit Aggregation Flaw & Correction

### 1.1 The Prior Mathematical Error
In earlier prototypes, benefits across all matched schemes were aggregated into a single scalar:
$$\text{Total Annual Benefit} = \sum \text{scheme.financialBenefit.amount}$$

When an applicant qualified for PM-KISAN (₹6,000), PM-JAY (₹5,00,000 hospital assurance), and PM SVANidhi (₹10,000 micro-credit loan), the system displayed:
$$\text{Total Annual Benefit} = \text{₹}5,16,000 \text{ / year}$$

This was severely misleading to citizens:
1. **Health insurance coverage is not cash income.** A ₹5,00,000 hospitalization cover is an in-kind indemnity policy usable only during secondary/tertiary hospital stays; it cannot be withdrawn or spent on household necessities.
2. **Loans are repayable debt, not cash grants.** A ₹10,000 or ₹1,50,000 working capital loan facility under PM SVANidhi or KCC is a credit limit that must be repaid with interest, not an income transfer.
3. **One-time benefits do not recur annually.** A ₹5,000 maternity transfer under PMMVY occurs upon childbirth; it does not repeat every year.

---

## 2. Segregated Benefit Taxonomy

SAHAYAK now implements 6 distinct benefit categories:

| Category Key | Category Name | Description | Example Schemes | Aggregation Rule |
| :--- | :--- | :--- | :--- | :--- |
| **`annual_cash_transfer`** | Annual Direct Cash (DBT) | Unconditional or conditional recurrent direct bank transfer credited annually. | PM-KISAN (₹6,000/yr) | Summed into `annualCashTransferTotal`. Contributes to primary annual cash metric. |
| **`one_time_cash`** | One-Time Maternity / Welfare Grant | Direct cash transfer tied to a specific life milestone (e.g., childbirth). | PMMVY (₹5,000) | Summed into `oneTimeCashTotal`. Displayed separately as milestone grant. |
| **`health_insurance_cover`** | Hospitalization Health Coverage | Cashless secondary and tertiary hospital insurance coverage. | PM-JAY (₹5,00,000/yr) | Summed into `healthInsuranceCoverTotal`. Never added to cash income. |
| **`loan_credit_facility`** | Subsidized Credit & Loans | Working capital micro-loans or subsidized credit limits. | PM SVANidhi (₹10,000), KCC (₹1,50,000) | Summed into `loanCreditFacilityTotal`. Explicitly labeled as repayable credit. |
| **`subsidy` / `scholarship`** | Academic Subsidy & Fee Reimbursement | Educational assistance, fee waivers, or input subsidies. | Post-Matric Scholarship (₹14,000) | Summed into `subsidyTotal`. Labeled as educational support. |
| **`non_financial`** | In-Kind / Non-Financial Entitlement | Foodgrains, ration cards, toolkits, training. | NFSA ration card, PM Vishwakarma toolkits | Boolean flag `hasNonFinancialBenefits`. |

---

## 3. Mathematical Formulae

$$\begin{aligned}
\text{Total Annual Cash Income (DBT)} &= \sum_{s \in \text{Eligible}} [s.\text{category} = \text{annual\_cash\_transfer}] \cdot s.\text{amount} \\
\text{Total Health Hospitalization Cover} &= \sum_{s \in \text{Eligible}} [s.\text{category} = \text{health\_insurance\_cover}] \cdot s.\text{amount} \\
\text{Total Loan Credit Facility} &= \sum_{s \in \text{Eligible}} [s.\text{category} = \text{loan\_credit\_facility}] \cdot s.\text{amount} \\
\text{Total One-Time Event Grants} &= \sum_{s \in \text{Eligible}} [s.\text{category} = \text{one\_time\_cash}] \cdot s.\text{amount}
\end{aligned}$$

---

## 4. Frontend Cockpit Display

The updated `EligibilityResultsScreen.tsx` presents a 4-card segmented cockpit:
1. **Annual Cash Transfer (DBT):** Displays exact recurring bank cash (`₹6,000 / year` for a qualifying small farmer).
2. **Hospitalization Health Cover:** Displays `₹5 Lakh` cashless cover (only when qualified/senior citizen 70+).
3. **Subsidized Credit / Loan Limit:** Displays `₹10,000 – ₹1,50,000` micro-credit limit.
4. **One-Time Grants / Scholarships:** Displays event-based educational or maternal cash transfers.
