# SAHAYAK — Phase 6.4 Interaction & Conversational UX Report
## Conversational Eligibility Design for Low-Literacy Citizens

**Role**: Principal Conversational UX Designer & Frontend Engineer  
**Phase**: 6.4 — Bolo Aur Jano: Eligibility Experience  
**Date**: November 2026  
**Audience**: Product Leadership, Engineering, Civic Tech Stakeholders  

---

### 1. The Design Challenge: Digital Literacy & Citizen Anxiety

In rural and peri-urban India, citizens navigating welfare portals face three acute psychological barriers:
1. **Administrative Fear & Confusion**: Fear of selecting the "wrong" option or committing perjury on official portals.
2. **Deceptive Voice Interfaces**: Many AI portals deceptively pulse microphone animations when no speech recognition is active, causing citizens to distrust the tool.
3. **Misleading Financial Promises**: Aggregators often sum hospital insurance limits with loans (e.g., claiming "You get ₹5,56,000!"), leading to deep disillusionment when citizens realize the hospital cover is an inpatient indemnity and the loan must be repaid.

Phase 6.4 directly tackles these challenges with the **Statutory Conversational Transparency Framework**.

---

### 2. Conversational Flow Architecture

#### 2.1 One Question at a Time (Cognitive Chunking)
- **Miller's Law Application**: Rather than bombarding users with a dense multi-page bureaucratic form, SAHAYAK presents exactly one question per view.
- **Why We Ask This (Contextual Reassurance)**: Every question card includes a gentle, plain-language explanation of why the question matters (e.g. *"Select your main source of household income to check matching vocational welfare schemes"*).
- **Non-Linear Navigation & Error Recovery**:
  - Citizens can easily change their minds. The "Previous Question" button allows users to review previously chosen answers, alter them, and move forward without losing state.
  - A prominent "Start Over / Review All Answers" button provides a safe reset at any point.

#### 2.2 Adaptive Conditional Branching
- Questions adapt dynamically to the citizen's lived reality:
  - When a user identifies as **Female**, the assessment seamlessly introduces the maternity nutrition question (`q_maternity`) for PMMVY cash assistance.
  - When a user identifies as a **Street Vendor**, it asks about urban vending territory for PM SVANidhi micro-credit.
  - When a user identifies as a **Student**, it introduces post-matric scholarship enrollment checks.
  - For male farmers, irrelevant questions are cleanly bypassed, maintaining a brisk, respectful 5-step flow.

---

### 3. Voice Interaction ("Bolo Aur Jano") State Model

The microphone interaction adheres strictly to honest UI state design:

```
[ IDLE ] ──(Tap Mic)──> [ LISTENING ] ──(2s Window)──> [ PROCESSING ] ──(Match)──> [ RECOGNIZED ] ──(Auto-Advance)──> [ NEXT QUESTION ]
   ▲                           │                              │                             │
   │                           ▼                              ▼                             ▼
   └────────────────────(Cancel Button)──────────────(No Detection)────────────────(Audio Confirmed)
                                                              │
                                                              ▼
                                                        [ FALLBACK ]
```

1. **Idle State**:
   - Amber microphone pill with explicit text: "Tap to Speak (Bolo Aur Jano)".
   - Microphone hardware is completely inactive; zero misleading recording animations.
2. **Listening State**:
   - Pinging red recording beacon with a 7-bar animated audio visualizer.
   - Live banner: "Listening... Speak your answer now (ಕೇಳುತ್ತಿದ್ದೇವೆ...)".
   - Explicit "Cancel Listening" button so the citizen can exit recording at any moment.
3. **Processing State**:
   - Clean spinning indicator with text: "Analyzing speech in Kannada/Hindi/Bengali/English...".
4. **Recognized State**:
   - High-visibility green badge displaying the recognized transcript (e.g. `Recognized: Farmer / ರೈತ`).
   - Plays brief synthesized audio confirmation in the citizen's vernacular tongue, visually highlights the selected card, and pauses for 800ms before auto-advancing so the citizen clearly sees their input was registered.
5. **Fallback State**:
   - If silence or unclear speech is detected, a polite banner explains: "Could not detect clear speech. Please tap an option above or try speaking again."

---

### 4. Statutory Results Presentation

#### 4.1 Three Distinct Categories (No Vague Middle Ground)
- **Likely Eligible** (`CheckCircle2` / Emerald):
  - Conveys that preliminary self-reported conditions are met, while reminding the citizen that official approval requires document verification.
- **Needs More Information** (`AlertCircle` / Amber):
  - Normalizes the fact that government programs require specific registry cross-checks (e.g. Bhoomi land records, NFSA ration card, or caste certificate).
- **Likely Not Eligible** (`XCircle` / Neutral Slate):
  - Respectfully details statutory government exclusion categories (e.g., serving government employees or income tax payees), preventing wasted visits to government offices.

#### 4.2 Transparent Benefit Bucketing (Anti-Slop Economics)
- **Direct Cash DBT**: Isolated and totaled independently (PFMS bank transfer).
- **Hospitalization Coverage**: Clearly branded as a **cashless inpatient treatment limit**, accompanied by the warning: *(This is an insurance cover, NOT a cash payment to your bank)*.
- **Subsidized Working Capital**: Clearly branded as a **repayable institutional loan**, accompanied by the warning: *(This is a repayable loan, NOT a cash grant)*.
- **Installment Transparency**: Details installment cycles (e.g., ₹2,000 every 4 months) so citizens know when funds actually arrive.

---

### 5. Accessibility & Ergonomics

- **Touch Targets**: All selectable answer cards have a minimum height of 56px, exceeding WCAG 2.2 AAA guidelines.
- **Color Independence**: Every state pairs color with a distinct icon and written label (`CheckCircle2` for eligible, `AlertTriangle` for verification, `XCircle` for ineligible).
- **Keyboard Navigation**: Complete support for `Tab`, `Shift+Tab`, `Enter`, and `Space` selection with prominent `focus-visible:ring-4 focus-visible:ring-amber-500/50` rings.
- **Indic Typography**: Tested across English, Kannada, Hindi, and Bengali with fluid line-heights, ensuring zero horizontal overflow on screens as narrow as 360px.
