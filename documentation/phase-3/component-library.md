# SAHAYAK (सहायಕ / ಸಹಾಯಕ)
## Reusable Component Library & Design Specifications
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 3 Deliverable

---

## 1. Action & Input Components

### 1.1 Buttons (`Button`)
- **Dimensions**:
  - `Large (Primary)`: Height 56px, horizontal padding 24px, radius 12px (Full width on mobile).
  - `Medium (Secondary)`: Height 48px, horizontal padding 20px, radius 8px.
  - `Small (Compact/Table)`: Height 36px, horizontal padding 14px, radius 6px.
- **Variants**:
  - `Primary Sovereign`: Background `#0B2545`, Text `#FFFFFF`, Border none.
  - `Secondary Outline`: Background `transparent`, Text `#0B2545`, Border `1.5px solid #CBD5E1`.
  - `Success Entitlement`: Background `#065F46`, Text `#FFFFFF`, Border none.
  - `Audio Pill`: Background `#FEF3C7`, Text `#92400E`, Border `1px solid #FDE68A`, Icon: Speaker.
  - `Ghost/Destructive`: Background `transparent`, Text `#991B1B`, Border none.
- **States**: Default, Hover (`filter: brightness(1.1)`), Active/Pressed (`transform: scale(0.98)`), Disabled (`background: #F1F5F9; color: #94A3B8; cursor: not-allowed`), Focused (`outline: 3px solid #B45309`).
- **Typography**: Label / Button CTA (16px, weight 600, Indic line-height 1.5).
- **Accessibility**: Button elements have explicit `aria-label` when containing only an icon; `role="button"`.

---

### 1.2 Text Input Fields (`InputField`)
- **Dimensions**: Height 52px, horizontal padding 16px, border radius 8px.
- **Variants**: Default text, Numeric with vernacular prefix (e.g. `+91` or `₹`), Date input, Voice-assisted text field.
- **States**:
  - Default: Border `1.5px solid #CBD5E1`, Background `#FFFFFF`.
  - Focused: Border `2px solid #0B2545`, Box-shadow `0 0 0 3px rgba(180, 83, 9, 0.2)`.
  - Error: Border `2px solid #991B1B`, Background `#FEF2F2`.
  - Success/Validated: Border `2px solid #065F46`, Background `#F0FDF4`.
- **Typography**: 16px body text (preventing iOS auto-zoom on mobile inputs).
- **Accessibility**: Associated `<label>` with explicit `for` attribute; error messages linked via `aria-describedby`.

---

### 1.3 Voice Search Bar (`VoiceSearchBar`)
- **Dimensions**: Height 56px, full container width, border radius 9999px (pill).
- **Components**:
  - Left icon: Magnifying glass search icon in `#64748B`.
  - Center placeholder: *"ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ..."* (16px text).
  - Right action: Pulsing circular microphone button (44 × 44px) in `#FEF3C7` with `#B45309` mic glyph.
- **Interaction**: Tapping input activates keyboard search; tapping mic immediately launches voice assistant sheet.

---

### 1.4 Selectors & Radio Option Cards (`OptionCardSelector`)
- **Dimensions**: Minimum height 64px, padding 16px, border radius 12px.
- **Layout**: Horizontal flex container with large 24px icon on left, 2-line title & description in center, and custom 24px radio circle on right.
- **States**:
  - Inactive: Border `1.5px solid #E2E8F0`, Background `#FFFFFF`.
  - Selected: Border `2px solid #0B2545`, Background `#F8FAFC`, Radio ring filled with `#0B2545`.
- **Accessibility**: `role="radiogroup"`, `role="radio"`, `aria-checked="true/false"`.

---

## 2. Card & Content Components

### 2.1 Scheme Benefit Card (`SchemeBenefitCard`)
- **Dimensions**: Full width, vertical padding 20px, horizontal padding 20px, radius 16px, shadow `--shadow-sm`.
- **Structure**:
  - **Header Row**: Ministry Badge (`[ ಕೇಂದ್ರ ಸರ್ಕಾರ / Central Govt ]` in `#F1F5F9`) + Scheme Title (18px Bold) + Audio Listen Pill (`[ 🔊 ಕೇಳಿ ]`).
  - **Value Hero Banner**: Large green benefit block (Background `#ECFDF5`, Border `1px solid #A7F3D0`):
    - Text: `₹6,000 / ವರ್ಷಕ್ಕೆ` (24px Tabular Bold `#065F46`).
    - Subtext: "ಖಾತೆಗೆ ನೇರ ನಗದು ಜಮೆ (Direct DBT credit into bank)".
  - **Metadata Strip**:
    - Processing Time: `[ ⏱ 15 ದಿನಗಳಲ್ಲಿ ]`
    - Official Fee: `[ 🏷 ₹0.00 ಉಚಿತ (Free) ]`
  - **Action Footer**: Primary CTA `[ ಅರ್ಹತೆ ಪರೀಕ್ಷಿಸಿ / Check Eligibility ]` + `[ ವಿವರ ನೋಡಿ / View Details ]`.
- **Accessibility**: Card container is keyboard focusable; enter key triggers detail view.

---

### 2.2 Life-Event Exploration Grid Tile (`LifeEventTile`)
- **Dimensions**: Minimum height 112px, padding 16px, radius 16px.
- **Visuals**: Distinct 48px cultural icon at top, followed by 16px bold title and 13px sub-category count.
- **States**: Default (`border: 1.5px solid #E2E8F0`), Hover/Press (`border-color: #B45309; transform: translateY(-2px)`).
- **Accessibility**: `aria-label="Farming category: 8 schemes available"`.

---

## 3. Navigation & Structural Components

### 3.1 Persistent Bottom Navigation Bar (`BottomNavBar`)
- **Dimensions**: Height 64px, full viewport width, anchored to bottom.
- **Layout**: 4 equal flex columns with icon (24px) stacked vertically above label (12px bold).
- **States**: Inactive item `#64748B`; Active item `#0B2545` with top 3px sovereign saffron pill line.
- **Accessibility**: `<nav aria-label="Primary Mobile Navigation">`; active item has `aria-current="page"`.

---

### 3.2 Top Utility Bar (`TopUtilityBar`)
- **Dimensions**: Height 56px, padding 0 16px, border-bottom `1px solid #E2E8F0`.
- **Contents**:
  - Left: Back chevron + "ಹಿಂದೆ (Back)" or Logo emblem.
  - Right Flex: Language Selector Pill (`[ 🌐 ಕನ್ನಡ ▼ ]`) + Audio Voiceover Toggle + Notifications Bell.

---

### 3.3 Language Selector Pill & Drawer (`LanguageSelector`)
- **Pill**: Height 38px, padding 0 12px, border radius 9999px, border `1.5px solid #CBD5E1`.
- **Drawer**: Slide-up bottom sheet containing 3 full-width cards for Kannada, Hindi, and English.
- **Audio Sample**: Tapping a speaker icon on any language card speaks a 2-second dialect greeting.

---

## 4. Status, Progress & Stepper Components

### 4.1 4-Stage Milestone Stepper (`MilestoneStepper`)
- **Dimensions**: Vertical layout for mobile (track length ~220px); Horizontal for desktop.
- **Milestones**:
  1. Submitted (ಸಲ್ಲಿಸಲಾಗಿದೆ)
  2. Revenue Verification (ದಾಖಲೆ ಪರಿಶೀಲನೆ)
  3. Sanction Order (ಅನುಮೋದನೆ)
  4. DBT Disbursed (ಖಾತೆಗೆ ಜಮೆ)
- **Node States**:
  - `Completed`: Solid emerald `#065F46` circle with white checkmark.
  - `In-Progress`: Pulsing amber `#B45309` circle with active date countdown.
  - `Upcoming`: Slate `#CBD5E1` outline with dashed connector track.
- **Accessibility**: `ol` semantic list with `aria-current="step"`.

---

### 4.2 Document Readiness Meter (`ReadinessMeter`)
- **Visual**: Circular SVG gauge (diameter 56px, stroke 6px) with center text "2/3".
- **Color Transitions**: Red (`#991B1B`) for 0%, Amber (`#B45309`) for 50%, Green (`#065F46`) for 100%.

---

## 5. Overlay, Dialog & Feedback Components

### 5.1 Slide-Up Bottom Drawer (`BottomDrawer`)
- **Geometry**: Max height 85vh, border-radius top 20px, shadow `--shadow-lg`.
- **Drag Handle**: Width 36px, height 4px, rounded, `#CBD5E1`.
- **Dismissal**: Swipe down, tap scrim backdrop, or tap explicit top-right "X" button.
- **Accessibility**: Focus trapped via `tabbable`; backdrop has `aria-hidden="true"`.

---

### 5.2 Toast Notification & Alert Banner (`ToastAlert`)
- **Dimensions**: Minimum height 48px, padding 12px 16px, radius 8px, `--shadow-md`.
- **Variants**:
  - Success: `#ECFDF5` surface, `#065F46` border and text.
  - Alert/Warning: `#FFFBEB` surface, `#92400E` border and text.
  - Error: `#FEF2F2` surface, `#991B1B` border and text.
- **Accessibility**: `role="status"`, `aria-live="polite"`.

---

## 6. Specialized Bharat Welfare Components

### 6.1 Visual Do's and Don'ts Modal (`VisualDosDontsGuide`)
- **Layout**: Two side-by-side or stacked comparative photo tiles:
  - **Tile 1 (Correct / ಸರಿ)**: Border `2px solid #065F46`, green checkmark badge, highlight box over bank stamp and IFSC code.
  - **Tile 2 (Wrong / ತಪ್ಪು)**: Border `2px solid #991B1B`, red cross mark badge, caption: "Do not upload transaction history or blurred photos".

---

### 6.2 Assisted CSC QR Token Slip (`CscTokenSlip`)
- **Visual**: Styled like an authentic official government treasury receipt.
- **Top Header**: Ashoka Chakra seal, Token ID (`#KA-KISAN-84920`).
- **Center**: High-density QR code (200 × 200px) containing encrypted pre-verified profile.
- **Mandatory Fee Banner**:
  - Background `#FEF3C7`, Border `2px dashed #B45309`.
  - Bold Kannada & English notice:
    **"ಸರ್ಕಾರಿ ಶುಲ್ಕ: ₹0.00 | ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರದ ಗರಿಷ್ಠ ಶುಲ್ಕ: ₹30.00 ಮಾತ್ರ"**
    *(Govt Fee: ₹0.00 | Maximum CSC Fee: ₹30.00 only. Do not pay extra).*
