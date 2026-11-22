# 05: Information Architecture, Navigation & Design System Foundation

---

## 1. Information Architecture & Ontology

Traditional government portals arrange content according to **administrative organizational charts** (e.g., Department of Agriculture, Cooperation and Farmers Welfare vs. Ministry of Rural Development vs. Ministry of Social Justice). To an ordinary citizen, these ministerial divisions are invisible and irrelevant.

PIXEL THEORY establishes a **Citizen-Centric Life-Event Ontology**:

```
[PIXEL THEORY ROOT]
│
├── 1. Top Persistent Bar
│   ├── Language & Dialect Selector (e.g. हिन्दी | ಕನ್ನಡ | বাংলা | English)
│   ├── Audio Assistant Master Toggle (Spoken Voiceover on/off)
│   └── High-Contrast / Text-Size Accessibility Controls
│
├── 2. Primary Navigation (4 Core Hubs)
│   ├── HUB A: DISCOVER (खोजें / ಅನ್ವೇಷಿಸಿ / অনুসন্ধান)
│   │   ├── Life-Event Exploration Grid (6 Key Portals)
│   │   │   ├── Farming & Rural Livelihood
│   │   │   ├── Women, Maternity & Child
│   │   │   ├── Healthcare & Elder Dignity
│   │   │   ├── Education, Youth & Skills
│   │   │   ├── Small Business & Street Vending
│   │   │   └── Housing & Essential Utilities
│   │   ├── "Bolo Aur Khojo" (Voice Search in Mother Tongue)
│   │   └── Popular Urgent Entitlements (Seasonal Alerts, e.g., Drought relief, Kharif inputs)
│   │
│   ├── HUB B: ELIGIBILITY CHECK ("पात्रता जांचें")
│   │   ├── Conversational 4-Step Guided Questionnaire
│   │   ├── Step 1: Occupation & Location (State/District/Rural vs Urban)
│   │   ├── Step 2: Demographic & Family Profile (Age, Gender, Social Category)
│   │   ├── Step 3: Economic Profile (Landholding / Income Bracket / Ration Card Type)
│   │   └── Dynamic Entitlements Result Deck ("Aapke Haq Ke Fayde")
│   │       ├── Matched Schemes (Sorted by financial impact)
│   │       ├── Partial-Match Schemes (What is missing to qualify)
│   │       └── Alternate Entitlements (Zero-dead-end fallback)
│   │
│   ├── HUB C: DOCUMENT LOCKER & PRE-CHECK ("दस्तावेज़ साथी")
│   │   ├── Visual Document Catalog (Aadhaar, Passbook, Caste Cert, Khatauni, Ration Card)
│   │   ├── DigiLocker Direct Connect (Instant verified badge)
│   │   ├── Smart Camera Scanner (On-device lighting, blur & framing validator)
│   │   └── Interactive "Do's & Don'ts" Visual Guide per Document
│   │
│   └── HUB D: TRACK APPLICATIONS ("आवेदन स्थिति")
│       ├── Active Application Trackers (Visual Stepper with SLA deadlines)
│       ├── Audio Status Summary (Spoken progress report in chosen language)
│       ├── Statutory Timeline Countdown & Delay Alert
│       └── 1-Tap Official Grievance Escalation (CPGRAMS / CM Helpline link)
│
└── 3. Utility & Support Overlays
    ├── Offline / Assisted Mode QR Slip Generator ("Seva Kendra Parchi")
    ├── Nearby Govt CSC / Jan Seva Kendra Locator
    └── Official Anti-Bribery & Free Service Declaration Banner
```

---

## 2. Navigational Principles for Bharat UX

1. **Flat Navigation Hierarchy**:
   - Maximum navigation depth: **2 clicks/taps** from any point in the app to an actionable result.
   - Elimination of nested desktop-style drop-down menus and hamburger sub-menus.
2. **Persistent Audio Controls ("Suniye" Pill)**:
   - Every primary card features an audio button that reads the card's essential message in simple colloquial vernacular speech, removing the reading burden for semi-literate users.
3. **Chunking & Miller's Law Compliance**:
   - Complex eligibility requirements are chunked into 3–4 digestible bite-sized cards rather than an unbroken wall of 500 words.
4. **State Machine for Eligibility Conversation**:
   ```
   [Idle: Welcome] 
          ↓ (Tap "Check My Schemes" or Voice Input)
   [State 1: Primary Livelihood] 
          ↓ (Selects / Speaks: "Farmer")
   [State 2: Landholding Filter] 
          ↓ (Selects: "Under 2 Hectares")
   [State 3: Social Category & State] 
          ↓ (Selects: "OBC", "Uttar Pradesh")
   [State 4: Instant Entitlement Ledger] 
          → Matches: PM-KISAN (₹6000), PM-KMY Pension, Kisan Credit Card
          → Unlocks: 1-Tap Document Prep & Application Flow
   ```

---

## 3. Design System & Accessibility Baseline (GIGW 3.0 & WCAG 2.1 AA)

### Indic Typography & Script Architecture
- **Font Stack**: Noto Sans Devanagari, Noto Sans Tamil, Noto Sans Bengali, Noto Sans Telugu, Inter (for numerals & English fallback).
- **Line Height Multiplier**: Standard Latin text uses 1.4x line height. Indic scripts require **1.65x to 1.8x line height** to prevent vertical clipping of vowel diacritics (*matras*, *halant*, *anusvara*).
- **Minimum Legible Type Size**: 16px (1rem) for body text; 14px strictly reserved for secondary metadata; 20px+ for primary interactive CTA labels.

### Ergonomics & Touch Target Sizing
- Minimum touch target: **48 × 48 dp** (standard). For primary actions in PIXEL THEORY: **56 × 56 dp** to support users with calloused or trembling fingers and varying motor precision.
- High bottom-sheet density: Key actions anchored in the thumb zone for comfortable single-handed mobile usage.

### Color Tokens & Semantic Signaling
- **Sovereign Trust Palette**: Deep Tiranga-inspired Navy Blue (`#0B2545`) paired with Warm Saffron Ochre (`#D97706`) and Emerald Agricultural Green (`#059669`).
- **High Contrast Thresholds**: All body text maintains **> 5.5:1 contrast ratio** against backgrounds (exceeding WCAG 2.1 AA 4.5:1 standard), ensuring legibility under intense direct Indian sunlight.
- **Visual Feedback**: Distinct states for Idle, Focused, Voice Recording, Processing, Success, and Rectification Needed.
