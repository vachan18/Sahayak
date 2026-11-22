# 07: Measurable UX Success Criteria, Usability Heuristics & Accessibility Mandates

---

## 1. Measurable UX Success Criteria

To establish definitive product excellence for Pixelcraft 2026, PIXEL THEORY defines empirical, quantitatively auditable UX benchmarks against industry baseline portals (*myScheme, UMANG, State e-District*):

```
+-------------------------------------------------------------------------------------------------------------------+
| Metric                        | Existing Govt Baseline | PIXEL THEORY Target | Measurement Protocol               |
+-------------------------------------------------------------------------------------------------------------------+
| 1. Time to Discovery (TTD)    | 8 - 14 minutes         | < 120 seconds       | Time from app opening to viewing a |
|                               | (Complex keyword search)| (Life-event grid)   | personalized matching scheme card. |
+-------------------------------------------------------------------------------------------------------------------+
| 2. Eligibility Completion Rate| 28%                    | > 85%               | Percentage of users who complete   |
|    (TCR)                      | (Abandonment at step 6)| (3-4 question quiz) | the eligibility questionnaire.     |
+-------------------------------------------------------------------------------------------------------------------+
| 3. Document Preparation Error | 32% - 40% rejections   | < 5%                | Submissions flagged for missing    |
|    Rate                       | (Unclear scans/wrong p)| (Visual Do's/Don'ts)| stamps, blur, or incorrect pages.  |
+-------------------------------------------------------------------------------------------------------------------+
| 4. System Usability Scale     | SUS Score: 41 / 100    | SUS Score: > 84/100 | Standard 10-question SUS survey    |
|    (SUS)                      | ("Poor / Unusable")    | ("Grade A / Stellar")| adapted for vernacular interview.  |
+-------------------------------------------------------------------------------------------------------------------+
| 5. Language Transition        | Reloads whole page;    | < 0.2s instant swap;| Zero lost form fields or resets    |
|    Friction                   | often resets input data| keeps form state    | when changing language mid-session.|
+-------------------------------------------------------------------------------------------------------------------+
| 6. Middleman Intermediation   | 72% report paying fees | < 10%               | Users who complete direct e-Sign   |
|    Avoidance                  | of ₹200 - ₹1,500       | (QR Tokenizer used) | or take standard fee slip to CSC.  |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Nielsen's Heuristics Applied to Bharat & Public Welfare UX

1. **Visibility of System Status**:
   - Instead of a generic *"Pending"* badge, the citizen sees an exact 4-stage visual timeline showing:
     - Who has the file (e.g., *“Tehsildar Office, Gorakhpur”*).
     - Expected resolution date (*“Target completion: 4 days remaining”*).
     - Audio message explaining the current status.
2. **Match Between System and the Real World**:
   - Zero legalistic jargon. Uses real-world metaphors:
     - Document checklist looks like a physical folder.
     - Cash transfers are depicted as direct bank passbook credits, not "DBT APBS clearing transactions".
     - Spoken colloquial language (Bhojpuri/Kannada/Bengali) avoids bureaucratic Sanskritisms.
3. **User Control and Freedom**:
   - At every step of the eligibility check, citizens can edit prior answers with 1 tap without restarting the entire form.
   - Clear "Cancel" or "Save for Later" buttons that preserve inputs locally in the browser cache.
4. **Error Prevention Rather Than Error Messages**:
   - Before a citizen uploads a bank passbook photo, the interface shows: *"Is your IFSC code clearly visible? Make sure there is no light glare over the account number."*
   - Real-time client-side checks detect image blur and ask the citizen to retake the photo immediately before uploading.
5. **Recognition Rather Than Recall**:
   - Visual icons accompany every category (wheat stalk for farming, stethoscope for health, student cap for education).
   - Citizens do not have to type government department names.

---

## 3. Accessibility & Compliance Mandates

### GIGW 3.0 (Guidelines for Indian Government Websites & Apps) Compliance
- **Bilingual & Multilingual Parity**: Content, button labels, error strings, and voice recordings must maintain 100% functional equivalence across all supported languages.
- **Statutory Fee Clarity**: Every service must prominently display the official statutory fee (e.g., *"Government Application Fee: ₹0.00"*).
- **Citizens' Charter & Redressal**: Mandatory display of the designated Grievance Redressal Officer (GRO) and statutory timeline for each scheme.

### WCAG 2.1 Level AA Technical Benchmarks
- **Color Contrast**:
  - Text: Minimum **4.5:1** contrast ratio (PIXEL THEORY targets **6.0:1** for outdoor solar readability).
  - Non-text UI elements (buttons, inputs, borders): Minimum **3.0:1** contrast ratio.
- **Touch Ergonomics**:
  - Touch targets minimum **48 × 48 CSS pixels**, with **8px padding** separation to prevent accidental presses.
- **Screen Reader & Indic Script Semantics**:
  - Complete `aria-label`, `role`, and `alt` tags translated into the respective Indic language so screen readers read aloud in native pronunciation.
  - Line-height configured to `1.7` across Devanagari, Bengali, and Dravidian typography to preserve ligatures and matras.
- **Low-End Hardware Performance**:
  - First Contentful Paint (FCP) under **1.2 seconds** on simulated 3G/4G network and 2GB RAM budget Android hardware.
  - Total initial payload budget **< 350 KB** (lightweight PWA architecture).
