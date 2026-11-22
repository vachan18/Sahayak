# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Professional Typography System & Indic Script Specifications
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 3 Deliverable

---

## 1. Typeface Selection & Technical Rationale

SAHAYAK serves users across **Kannada (ಕನ್ನಡ), Hindi (हिन्दी), and English**, with future pan-Indian script expansion. The typographic architecture is engineered to eliminate three systemic defects in Indian digital interfaces:
1. **Diacritic Clipping**: Vertical truncation of Kannada *vattugalu* and Hindi *matras*.
2. **Font Mismatch (Frankenstein Typesetting)**: Disjointed visual appearance when English numerals appear alongside Kannada or Devanagari text.
3. **Weight Imbalance**: Indic scripts requiring higher visual weight to achieve optical parity with Latin bold characters.

### Sovereign Font Family Stack:
- **Primary Indic Family (Kannada)**: `Noto Sans Kannada` (Google Fonts / Sovereign OSS). Engineered with open counters, robust ligatures, and optical stroke modulation for low-resolution displays.
- **Primary Indic Family (Hindi / Devanagari)**: `Noto Sans Devanagari`. Consistent shirorekha alignment, balanced conjuncts, and high legibility at 14px–16px.
- **Primary Latin & Numeral Family**: `Inter` (Inter Display for headings, Inter Variable for UI body and tabular numbers).
- **Secondary Display / Accent**: System fallback stack prioritizing device-native high-performance rendering:
  ```css
  font-family: 
    /* Kannada Context */ var(--font-kannada, "Noto Sans Kannada", "Tunga", system-ui, sans-serif),
    /* Hindi Context */ var(--font-devanagari, "Noto Sans Devanagari", "Mangal", system-ui, sans-serif),
    /* English & Numerals */ var(--font-latin, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  ```

---

## 2. Indic-First Typographic Scale & Rhythm

Because Kannada and Devanagari scripts require greater vertical clearance, line heights are adjusted systematically:
- **English/Latin Baseline**: `1.4x – 1.5x`
- **Hindi / Devanagari Baseline**: `1.65x`
- **Kannada Baseline**: `1.75x – 1.8x`

```
+-------------------------------------------------------------------------------------------------------------------------+
| Level / Token      | Font Size (rem / px) | Weight           | Line-Height (KN) | Letter Spacing | Primary Usage            |
+-------------------------------------------------------------------------------------------------------------------------+
| Display Hero       | 2.0rem / 32px        | 700 (Bold)       | 1.8 (58px)       | -0.02em        | Welcome splash, big      |
|                    |                      |                  |                  |                | annual payout figures    |
+-------------------------------------------------------------------------------------------------------------------------+
| Page Heading (H1)  | 1.5rem / 24px        | 700 (Bold)       | 1.75 (42px)      | -0.015em       | Main screen titles,      |
|                    |                      |                  |                  |                | life-event section hero  |
+-------------------------------------------------------------------------------------------------------------------------+
| Section Heading(H2)| 1.25rem / 20px       | 600 (SemiBold)   | 1.75 (35px)      | -0.01em        | Scheme Card titles,      |
|                    |                      |                  |                  |                | eligibility question stem|
+-------------------------------------------------------------------------------------------------------------------------+
| Subsection (H3)    | 1.125rem / 18px      | 600 (SemiBold)   | 1.7 (30px)       | 0.0em          | Sub-headers, checklist   |
|                    |                      |                  |                  |                | document category titles |
+-------------------------------------------------------------------------------------------------------------------------+
| Body Regular       | 1.0rem / 16px        | 400 (Regular)    | 1.75 (28px)      | 0.0em          | Primary reading text,    |
|                    |                      |                  |                  |                | scheme benefit bullets   |
+-------------------------------------------------------------------------------------------------------------------------+
| Body Medium / Emph | 1.0rem / 16px        | 500 (Medium)     | 1.75 (28px)      | 0.0em          | Explanatory text with    |
|                    |                      |                  |                  |                | high contrast focus      |
+-------------------------------------------------------------------------------------------------------------------------+
| Label / Button CTA | 1.0rem / 16px        | 600 (SemiBold)   | 1.5 (24px)       | +0.01em        | Action buttons, category |
|                    |                      |                  |                  |                | tabs, audio listen pills |
+-------------------------------------------------------------------------------------------------------------------------+
| Caption / Meta     | 0.875rem / 14px      | 500 (Medium)     | 1.65 (23px)      | +0.01em        | Processing SLA, statutory|
|                    |                      |                  |                  |                | fee tags, officer stamps |
+-------------------------------------------------------------------------------------------------------------------------+
| Micro / Overline   | 0.75rem / 12px       | 700 (Bold / Caps)| 1.5 (18px)       | +0.04em        | Category badges, Central/|
|                    |                      |                  |                  |                | State government pill tag|
+-------------------------------------------------------------------------------------------------------------------------+
| Tabular Numbers    | 1.25rem / 20px       | 700 (Bold)       | 1.4 (28px)       | Monospace      | Currency amounts (₹6000),|
| (Currency / Phone) |                      |                  |                  |                | dates, application tokens|
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Numeric Typography & Currency Standard

- **Indian Rupee Symbol Alignment**:
  - The Rupee symbol (`₹`, U+20B9) is always set in **Tabular Monospace Lining** (`font-variant-numeric: tabular-nums lining-nums`).
  - No space between the symbol and amount (e.g. `₹6,000`, not `₹ 6,000` or `Rs. 6000`).
  - Payout frequency is rendered with clear vernacular time denominator:
    - Kannada: `₹6,000 / ವರ್ಷಕ್ಕೆ` (₹6,000 / year)
    - Hindi: `₹6,000 / वर्ष`
    - English: `₹6,000 / year`
- **Application Token Formatting**:
  - Structured for effortless read-back over phone lines:
    `KA - KISAN - 2026 - 84920` (broken into 4-5 character hyphenated chunks).

---

## 4. Translated Text Expansion Ratios & Elastic Rules

```
+---------------------------------------------------------------------------------------------------------------+
| Source String (English)             | Kannada Translation                   | Expansion | Architectural Rule   |
+---------------------------------------------------------------------------------------------------------------+
| "Check Eligibility" (17 chars)      | "ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ" (22 chars)     | +30%      | Button wraps to 2    |
|                                     |                                       |           | lines if width <160px|
+---------------------------------------------------------------------------------------------------------------+
| "Required Documents" (18 chars)     | "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು" (20 chars)      | +25%      | Header container     |
|                                     |                                       |           | flex-direction: row  |
+---------------------------------------------------------------------------------------------------------------+
| "Direct Benefit Transfer" (23 chars)| "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ಹಣ" (27 chars)| +20%   | No ellipsis truncation|
|                                     |                                       |           | allowed              |
+---------------------------------------------------------------------------------------------------------------+
| "Application Status" (18 chars)     | "ಅರ್ಜಿಯ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ" (23 chars)   | +28%      | Tab label font drops |
|                                     |                                       |           | to 13px on 360px dp  |
+---------------------------------------------------------------------------------------------------------------+
```

### Typographic Implementation CSS:
```css
/* Universal Typography Baseline for SAHAYAK */
body[lang="kn"] {
  font-family: var(--font-kannada);
  line-height: 1.75;
  letter-spacing: 0.01em;
}

body[lang="hi"] {
  font-family: var(--font-devanagari);
  line-height: 1.65;
  letter-spacing: 0.005em;
}

body[lang="en"] {
  font-family: var(--font-latin);
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```
