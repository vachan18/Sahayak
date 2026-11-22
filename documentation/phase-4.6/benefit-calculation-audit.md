# Benefit Calculation Audit & Financial Segregation

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/services/eligibilityEngine.ts`, `src/types/index.ts`, `src/pages/EligibilityResultsScreen.tsx`  

---

## 1. Statutory Truth vs Historical UI Slop

In Indian public welfare administration, aggregating different benefit instruments into a single headline rupee figure is considered deceptive and misleading to vulnerable citizens.

### 1.1 The False "₹5,16,000 Benefit" Pattern
In unprincipled civic apps, developers frequently add:
- PM-KISAN cash transfer: ₹6,000
- PM-JAY hospital coverage: ₹5,00,000
- PM SVANidhi working capital loan: ₹10,000
and display: *"Congratulations! You have won ₹5,16,000 from the government!"*

This is deeply unethical:
1. **Health Insurance is NOT Cash:** Ayushman Bharat provides up to ₹5.00 Lakh in cashless pre-authorized hospital care per family/year at empaneled hospitals. Zero cash is deposited into the beneficiary's bank account.
2. **Loans are NOT Income:** A PM SVANidhi or KCC loan is an institutional credit facility that must be repaid with interest (even if subsidized). It is not a welfare grant.
3. **One-Time Grants are NOT Annual Income:** PMMVY maternity benefits (₹5,000 or ₹6,000) occur only upon the specific biological event of childbirth; they do not recur annually.
4. **Scholarships are Tied to Education:** Post-matric scholarships are directed to educational institutions and student maintenance, distinct from universal family subsidies.

---

## 2. Hardened Benefit Segregation Architecture

In Phase 4.6, `src/services/eligibilityEngine.ts` enforces strict segregation in `calculateCategorizedBenefits`:

```typescript
export interface CategorizedBenefitSummary {
  annualCashTransferTotal: number;       // Direct DBT cash (e.g. PM-KISAN ₹6,000)
  oneTimeCashTotal: number;              // Event-triggered cash (e.g. PMMVY ₹5,000 / ₹6,000)
  healthInsuranceCoverTotal: number;     // Cashless hospitalization cover (e.g. PM-JAY ₹5,00,000)
  loanCreditFacilityTotal: number;       // Subsidized loan/credit limit (e.g. PM SVANidhi ₹10,000, KCC ₹2,00,000)
  scholarshipTotal: number;              // Dedicated educational assistance (e.g. PMS ₹14,000)
  subsidyTotal: number;                  // Capital subsidies & interest subventions
  hasNonFinancialBenefits: boolean;      // In-kind toolkits, food grains, training
}
```

### 2.1 The 4-Card Cockpit in EligibilityResultsScreen
The results cockpit presents four distinct cards with unambiguous labels:
1. **Annual Cash Transfer (DBT):** Displays strictly `annualCashTransferTotal`. Subtitle: *"Credited directly to bank account via PFMS"*.
2. **Hospitalization Health Cover:** Displays strictly `healthInsuranceCoverTotal` in Lakhs (e.g. ₹5 Lakh). Subtitle: *"Cashless hospital treatment per family/year"*.
3. **Subsidized Credit / Loan Limit:** Displays strictly `loanCreditFacilityTotal`. Subtitle: *"Collateral-free working capital loan limit"*.
4. **One-Time Grant / Scholarship:** Displays sum of `oneTimeCashTotal + subsidyTotal + scholarshipTotal`. Subtitle: *"Maternity / student assistance upon event"*.

---

## 3. Test Verification Matrix

| Test Assertion | Input Scheme Combination | Expected Segregated Result | Result |
| :--- | :--- | :--- | :--- |
| **Direct Cash Isolation** | PM-KISAN + PM-JAY + SVANidhi | `annualCashTransferTotal === 6000`, `annualCashTransferTotal !== 516000` | **PASS** |
| **Health Cover Isolation** | PM-JAY (₹5 Lakh) | `healthInsuranceCoverTotal === 500000` | **PASS** |
| **Credit Facility Isolation** | PM SVANidhi (₹10,000) | `loanCreditFacilityTotal === 10000` | **PASS** |
| **One-Time Event Isolation** | PMMVY (₹5,000) | `annualCashTransferTotal === 0`, `oneTimeCashTotal === 5000` | **PASS** |
| **Scholarship Isolation** | Post-Matric Scholarship (₹14,000) | `scholarshipTotal === 14000`, `subsidyTotal === 0` | **PASS** |
