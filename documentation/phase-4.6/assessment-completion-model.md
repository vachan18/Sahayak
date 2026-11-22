# Assessment Completion Model — Scheme-Specific vs Global Counting

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/services/eligibilityEngine.ts`  

---

## 1. Problem Statement & Former Defects

In Phase 4.5, assessment completion was calculated using an arbitrary global question counter:
```typescript
// Obsolete Phase 4.5 logic:
if (answeredKeysCount < 4) {
  return { status: 'in_progress', ... };
}
```
This naive heuristic had two severe flaws:
1. **False Incompleteness:** A citizen who answered 3 deeply specific questions (e.g., student status, caste SC, and annual income ₹1.5 Lakh) had answered all mandatory criteria for a Post-Matric Scholarship, but was blocked as "in progress".
2. **False Completeness:** A citizen who answered 4 completely unrelated questions (e.g., gender, age, preferred language, theme) was treated as having "completed" an assessment, even though vital criteria like landholding or street vending credentials were missing for schemes like PM-KISAN or PM SVANidhi.

---

## 2. Hardened Scheme-Specific Completeness Model

In Phase 4.6, the assessment engine was refactored to evaluate completeness against **scheme-specific mandatory criteria sets**:

### 2.1 Scheme-Specific Criteria Sets

| Scheme | Mandatory Field Set | If Missing |
| :--- | :--- | :--- |
| **PM-KISAN** | `occupation`, `landholdingAcres`, `isGovtEmployee` (or `govtEmploymentType`), `isIncomeTaxPayee` (or `annualIncome`) | Flags missing land title or non-taxpayer proof (`additional_verification_required`) |
| **Ayushman PM-JAY** | `age`, `hasBplOrRationCard` / `isSeccDeprivedHousehold` (for under-70) | Flags SECC 2011 / BIS verification (`additional_verification_required`) |
| **PMMVY** | `gender`, `age`, `isPregnantOrLactating`, `maternityParity`, `hasMcpCard`, `isGovtEmployee` | Flags MCP card or parity details (`additional_verification_required`) |
| **PM SVANidhi** | `occupation`, `age`, `hasStreetVendorCertificate` | Flags Certificate of Vending / TVC LoR (`additional_verification_required`) |
| **PM-KCC** | `occupation`, `farmerTenureType` (or `landholdingAcres > 0`) | Flags tenurial agreement / dairy certification (`additional_verification_required`) |
| **Scholarships** | `socialCategory`, `annualIncome`, `isEnrolledStudent`, `qualifyingExamMarksPercent` (Minority) | Flags category certificate or marksheet (`additional_verification_required`) |

---

## 3. Overall Assessment Status State Machine

The top-level `assessEligibility` function computes the overall status according to this state hierarchy:

1. **`not_assessed` (Zero Input State):**
   - Triggered when `Object.keys(answers).length === 0`.
   - Results in zero benefit cards and renders the initial CTA screen.
2. **`in_progress` (Under-Parameterized Questionnaire):**
   - Triggered when `answeredKeysCount > 0`, but:
     - Zero schemes evaluate to `potentially_eligible`.
     - The basic core demographic set (`occupation !== undefined && annualIncome !== undefined && (age !== undefined || gender !== undefined)`) has not yet been answered.
   - Prevents empty or incomplete screens while the citizen is midway through answering the 5-question questionnaire.
3. **`potentially_eligible` (Affirmative Qualification):**
   - Triggered if **at least one** verified scheme satisfies all preliminary criteria with zero disqualifying exclusions.
4. **`additional_verification_required` (Evidence Gap):**
   - Triggered if zero schemes are confirmed eligible, but at least one scheme has unmet document/database cross-checks without any outright statutory exclusion.
5. **`not_established` (Total Disqualification):**
   - Triggered only when every assessed scheme conclusively encounters a statutory exclusion (e.g. permanent government job, income above all ceilings, non-matching occupation).

---

## 4. Verification & Regression Coverage

The state machine was verified across edge cases in `src/test/eligibilityEngine.test.ts`:
- Zero answers returns `not_assessed`.
- 1 or 2 isolated answers without income returns `in_progress`.
- Incomplete scheme criteria yields `additional_verification_required` instead of false qualification.
- 100% verified against regressions.
