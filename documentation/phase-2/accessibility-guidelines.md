# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Accessibility Guidelines & Multilingual UX Mandates
### Prioritizing Kannada (ಕನ್ನಡ), Hindi (हिन्दी) & English
### Project: PIXEL THEORY | Track DS-02 | Phase 2 Deliverable

---

## 1. Multilingual Typography & Indic Script Architecture

Rendering complex Brahmic and Dravidian scripts (Kannada, Devanagari) requires specialized typographic engineering. Standard Latin web font assumptions cause diacritic truncation and illegibility for rural citizens.

### Official Indic Font Stack
```css
/* Sovereign Indic Font Stack for SAHAYAK */
:root {
  --font-kannada: "Noto Sans Kannada", "Tunga", system-ui, sans-serif;
  --font-hindi: "Noto Sans Devanagari", "Mangal", system-ui, sans-serif;
  --font-english: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-numerals: "Inter", "Noto Sans", sans-serif;
}
```

### The Indic Line-Height & Diacritic Clipping Rule
- **The Problem**: Kannada has complex stacked sub-consonants (*vattugalu*) and vowel extensions (*deergha*); Hindi Devanagari has top headline bars (*shirorekha*) and bottom vowel diacritics (*u/oo matras*). Standard 1.2x – 1.4x line-height clips these marks, turning words into unreadable characters.
- **The SAHAYAK Standard**:
  - Latin Body Text Line-Height: `1.5`
  - Devanagari / Hindi Body Line-Height: `1.65`
  - Kannada Body Line-Height: `1.75`
  - Vertical element padding must allow minimum `4px` top and bottom buffer for ascending/descending matras.

### Typographic Hierarchy Scale (Mobile Base)
```
+---------------------------------------------------------------------------------------------------------+
| Style Token       | Size (px / rem)  | Weight      | Line-Height (KN) | Usage                           |
+---------------------------------------------------------------------------------------------------------+
| Display Hero      | 28px / 1.75rem   | 700 (Bold)  | 1.8              | Welcome headers, Payout numbers |
| Title Large       | 22px / 1.375rem  | 700 (Bold)  | 1.75             | Scheme titles, Section headers  |
| Title Medium      | 18px / 1.125rem  | 600 (Semi)  | 1.7              | Card titles, Question prompts   |
| Body Large        | 16px / 1.0rem    | 500 (Med)   | 1.75             | Primary narrative, Benefit text |
| Body Medium       | 14px / 0.875rem  | 400 (Reg)   | 1.7              | Secondary metadata, Sub-labels  |
| Caption / Stat    | 13px / 0.8125rem | 600 (Semi)  | 1.6              | Badges, Timestamps, SLA tags    |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Text Expansion & Dynamic Layout Resilience

### Language Expansion Multipliers
When translating from English into regional Indian languages, text length expands significantly:
- **English to Hindi**: Expands by **+15% to +25%** in character count.
- **English to Kannada**: Expands by **+25% to +40%** due to agglutinative noun-verb structures and honorific suffixes.

### Architectural Rules for Layouts:
1. **Zero Hardcoded Container Widths**: All buttons, badges, and card titles must use flexible flexbox/grid containers (`flex: 1`, `width: auto`, `min-width: fit-content`).
2. **Multi-line Button Wrapping**: Action buttons must permit 2-line wrapping for long verbs in Kannada (e.g., *"ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ"*).
3. **No String Truncation with Ellipsis on Critical Data**: Benefits, money amounts, document names, and deadlines must **never be truncated** (`text-overflow: ellipsis` is strictly forbidden on citizen-facing instructional text).

---

## 3. Plain Language & Jargon Elimination Lexicon

SAHAYAK replaces formal Sanskritised/Persianised statutory vocabulary with warm, everyday conversational equivalents:

```
+-------------------------------------------------------------------------------------------------------------------------+
| Bureaucratic Term               | Traditional Unfriendly Translation        | SAHAYAK Plain Language (KN / HI / EN)    |
+-------------------------------------------------------------------------------------------------------------------------+
| Direct Benefit Transfer (DBT)   | ಪ್ರತ್ಯಕ್ಷ ಸೌಲಭ್ಯ ವರ್ಗಾವಣೆ / प्रत्यक्ष लाभ अंतरण | ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ಹಣ / सीधे बैंक में पैसा |
|                                 | (Pratyaksha Saulabhya Vargavane)           | (Direct Cash into Your Bank Account)    |
+-------------------------------------------------------------------------------------------------------------------------+
| Indemnity Bond / Affidavit      | ಪರಿಹಾರ ಬಾಂಡ್ / क्षतिपूर्ति बंधपत्र           | ಮುಚ್ಚಳಿಕೆ ಪತ್ರ / साधारण शपथ-पत्र          |
|                                 | (Kshathipoorthi Bandhapatra)               | (Simple Declaration Paper)              |
+-------------------------------------------------------------------------------------------------------------------------+
| Grievance Redressal Officer     | ಕುಂದುಕೊರತೆ ನಿವಾರಣಾಧಿಕಾರಿ / शिकायत निवारण अधि.| ಸಹಾಯ ಮತ್ತು ದೂರು ಅಧಿಕಾರಿ / समाधान अधिकारी  |
|                                 | (Kundukorate Nivaaranaadhikari)            | (Help & Complaint Officer)              |
+-------------------------------------------------------------------------------------------------------------------------+
| Sponsoring Agency / Ministry    | ಪ್ರಾಯೋಜಕ ಇಲಾಖೆ / प्रायोजक मंत्रालय         | ಯೋಜನೆ ನೀಡುವ ಸರ್ಕಾರಿ ಕಚೇರಿ / संबंधित विभाग  |
|                                 | (Praayojaka Ilaakhe)                       | (Government Office Giving This Scheme)  |
+-------------------------------------------------------------------------------------------------------------------------+
| Eligibility Disqualification    | ಅನರ್ಹತಾ ಷರತ್ತುಗಳು / अपात्रता शर्तें         | ಯಾರಿಗೆ ಸಿಗುವುದಿಲ್ಲ? / कौन पात्र नहीं है?    |
|                                 | (Anarhatha Sharathugalu)                   | (Who is Not Covered?)                   |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Large Touch Ergonomics & Motor Accessibility

- **Primary Interactive Targets**:
  - Buttons, form cards, and navigation icons must measure at least **48 × 48 CSS pixels** (WCAG 2.1 Success Criterion 2.5.5).
  - High-priority actions (e.g. "Speak to Check Eligibility", "Confirm Language", "Take Photo") are engineered at **56 × 56 CSS pixels** or full viewport width with minimum 52px height.
- **Finger Separation Buffer**:
  - Minimum **8px physical margin** between any two interactive touch targets to eliminate accidental taps by elderly or calloused fingers.
- **Thumb Zone Anchor**:
  - Primary decision buttons are anchored in the bottom 40% of the mobile screen for effortless one-handed thumb interaction.

---

## 5. Visual Contrast & Sunlight Legibility Standards

Rural citizens and farmers use phones outdoors under harsh midday sunlight. Standard minimum contrast (4.5:1) often washes out completely.

### The SAHAYAK Outdoor Sovereign Color Palette:
```css
:root {
  /* High-Contrast Sovereign Color System */
  --color-primary-navy: #0B2545;       /* Text on light: Contrast 14.8:1 (AAA) */
  --color-saffron-ochre: #B45309;      /* Brand accent on white: Contrast 5.2:1 (AA) */
  --color-emerald-green: #065F46;      /* Success/Money on light: Contrast 7.1:1 (AAA) */
  --color-amber-alert: #92400E;        /* Warning text: Contrast 6.4:1 (AAA) */
  --color-crimson-error: #991B1B;      /* Danger/Rejection text: Contrast 7.8:1 (AAA) */
  --color-surface-bg: #F8FAFC;         /* Clean soft off-white background */
  --color-card-bg: #FFFFFF;            /* Pure white card surface */
  --color-focus-outline: #D97706;      /* 3px high-visibility focus ring */
}
```

- **Contrast Ratios**:
  - Body text against surface background: **14.8:1** (far exceeds WCAG AAA 7:1 standard).
  - Button text inside primary CTAs: **8.2:1**.
  - Secondary metadata & timestamps: **5.5:1** (exceeds WCAG AA 4.5:1).

---

## 6. Screen Reader (ARIA) & Bilingual Pronunciation Support

1. **Explicit Language Tagging**:
   - Every block of Kannada or Hindi text is explicitly tagged with `lang="kn"` or `lang="hi"` so native text-to-speech synthesizers switch pronunciation models accurately without stuttering in an English phoneme voice.
   - Example: `<span lang="kn">ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಯೋಜನೆ</span>`
2. **Icons with Mandatory Text Labels**:
   - Zero standalone mystery icons. Every icon is accompanied by a readable text label OR an explicit `aria-label`:
   - Example: `<button aria-label="ಯೋಜನೆಯ ವಿವರಗಳನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ"><svg aria-hidden="true">...</svg> ಕೇಳಿ</button>`
3. **Live Region Announcements (`aria-live`)**:
   - Step transitions in the eligibility quiz announce: `aria-live="polite"` *"ಹಂತ 2: ನಿಮ್ಮ ಭೂಮಿಯ ವಿವರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ"* (Step 2: Select your land details).
   - Voice assistant listening state: `aria-live="assertive"` *"ಮೈಕ್ರೊಫೋನ್ ಆನ್ ಆಗಿದೆ, ಈಗ ಮಾತನಾಡಿ"* (Microphone is on, speak now).

---

## 7. Keyboard Navigation & Assistive Switch Access

- **Logical Tab Order**: Follows natural reading order (Top navigation -> Hero actions -> Content cards -> Bottom navigation).
- **High-Visibility Focus Indicator**:
  - Focused interactive elements display an unmistakable outline:
    `outline: 3px solid #D97706; outline-offset: 3px; border-radius: 8px;`
- **Skip to Main Content Link**:
  - First tab stop on all screens exposes a hidden skip link: `[ ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ / Skip to main content ]`.
