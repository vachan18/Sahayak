# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Spacing, Layout Architecture & Spatial Design System
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 3 Deliverable

---

## 1. 8-Point Spatial Grid & Spacing Scale

SAHAYAK adheres strictly to an **8-point geometric grid** (with a 4-point half-step micro scale for tight metadata and button padding). This mathematical discipline ensures the razor-sharp visual rhythm characteristic of products like Linear and Stripe.

```
+---------------------------------------------------------------------------------------------------------+
| Token Name      | Value (px / rem)  | Multiplier  | Primary Usage                                       |
+---------------------------------------------------------------------------------------------------------+
| space-1 (micro) | 4px / 0.25rem     | 0.5x        | Gap between icon and text, micro-badge padding      |
| space-2 (tiny)  | 8px / 0.5rem      | 1x          | Intra-component spacing, chip horizontal padding    |
| space-3 (small) | 12px / 0.75rem    | 1.5x        | Input field vertical padding, small card gap        |
| space-4 (base)  | 16px / 1.0rem     | 2x          | Standard card internal padding, mobile screen margin|
| space-5 (med)   | 20px / 1.25rem    | 2.5x        | Medium section dividers, list item row gaps         |
| space-6 (large) | 24px / 1.5rem     | 3x          | Tablet screen margin, modal header padding          |
| space-8 (xlarge)| 32px / 2.0rem     | 4x          | Major screen section vertical gutters               |
| space-10 (2xl)  | 40px / 2.5rem     | 5x          | Hero banner padding, desktop container padding      |
| space-12 (3xl)  | 48px / 3.0rem     | 6x          | Primary landing page section separators             |
| space-16 (4xl)  | 64px / 4.0rem     | 8x          | Generous desktop whitespace anchors                 |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Responsive Breakpoints & Container Boundaries

```
+--------------------------------------------------------------------------------------------------------------------+
| Viewport Tier      | Min Width | Max Container | Columns | Gutters | Margins | Target Device Landscape             |
+--------------------------------------------------------------------------------------------------------------------+
| Mobile Compact     | 320px     | 100%          | 4 cols  | 12px    | 16px    | Low-cost 4G Android (JioPhone, etc.)|
| Mobile Standard    | 375px     | 100%          | 4 cols  | 16px    | 16px    | Standard Indian Smartphone (Redmi)  |
| Tablet / Phablet   | 768px     | 720px         | 8 cols  | 20px    | 24px    | iPad Mini, Samsung Galaxy Tab, CSC  |
| Desktop Small      | 1024px    | 960px         | 12 cols | 24px    | 32px    | Government Cyber Café desktop CRT   |
| Desktop Wide       | 1280px    | 1140px        | 12 cols | 32px    | Auto    | High-res Panchayat administrative PC|
+--------------------------------------------------------------------------------------------------------------------+
```

### Layout Constraints by Form Factor
- **Mobile First (320px – 767px)**:
  - Single-column stacked layout.
  - Sticky bottom navigation bar (64px height) with safe-area bottom inset.
  - Sticky top utility header (56px height).
  - Floating Action Button (FAB) anchored 80px from bottom (clearing dock).
- **Tablet (768px – 1023px)**:
  - 2-column asymmetric grid: Left sidebar (35% width) for categories and filters; Right feed (65% width) for scheme cards.
  - Dual-action bottom modal becomes an anchored side-drawer.
- **Desktop (1024px+)**:
  - Max content container capped at `1140px` centered with `margin: 0 auto`.
  - Persistent left-hand vertical navigation sidebar (260px width) replacing bottom dock.
  - Reading measures constrained to maximum `68ch` to maintain comfortable readability.

---

## 3. Elevation Scale & Shadow Tokens

SAHAYAK avoids heavy, muddy drop shadows. Instead, it uses **crisp, dual-layer shadows** with subtle ambient occlusion:

```css
:root {
  /* Surface Elevation System */
  --shadow-none: 0 0 #0000;
  
  /* Elevation 1: Interactive Cards & Input Fields */
  --shadow-sm: 
    0 1px 2px 0 rgba(15, 23, 42, 0.05),
    0 0 0 1px rgba(15, 23, 42, 0.06);

  /* Elevation 2: Active Cards, Sticky Floating Dock, Tooltips */
  --shadow-md: 
    0 4px 6px -1px rgba(15, 23, 42, 0.08), 
    0 2px 4px -2px rgba(15, 23, 42, 0.04),
    0 0 0 1px rgba(15, 23, 42, 0.08);

  /* Elevation 3: Slide-up Bottom Drawers, Notification Center */
  --shadow-lg: 
    0 10px 15px -3px rgba(15, 23, 42, 0.10), 
    0 4px 6px -4px rgba(15, 23, 42, 0.05),
    0 0 0 1px rgba(15, 23, 42, 0.08);

  /* Elevation 4: Urgent Dialog Modals, QR Token Full-Screen Preview */
  --shadow-xl: 
    0 20px 25px -5px rgba(15, 23, 42, 0.15), 
    0 8px 10px -6px rgba(15, 23, 42, 0.06);
}
```

---

## 4. Border Radius Scale

Consistent corner curvature conveys approachability while maintaining sovereign structure:
- **`radius-sm` (4px / 0.25rem)**: Micro-tags, statutory badges, category chips.
- **`radius-md` (8px / 0.5rem)**: Standard buttons, text input fields, dropdown menus.
- **`radius-lg` (12px / 0.75rem)**: Scheme cards, visual comparison tiles, audio banners.
- **`radius-xl` (16px / 1.0rem)**: Slide-up bottom sheets, primary container cards.
- **`radius-2xl` (24px / 1.5rem)**: Life-event exploration grid cards.
- **`radius-full` (9999px)**: Floating pills, language toggle switcher, circular microphone button.

---

## 5. Touch Target Dimensions & Motor Ergonomics

```
+---------------------------------------------------------------------------------------------------------------+
| Component                     | Min Dimension   | Recommended Dimension | Separation Buffer                    |
+---------------------------------------------------------------------------------------------------------------+
| Primary Action Button (CTA)   | 48 × 48 px      | 56 × 56 px (Full W)   | 12px vertical margin                 |
| Secondary Action Button       | 44 × 44 px      | 48 × 48 px            | 8px horizontal margin                |
| Bottom Dock Navigation Item   | 48 × 48 px      | 64 × 64 px            | 0px (Continuous dock surface)        |
| Language Switcher Pill        | 40 × 40 px      | 44 × 72 px            | 8px from header edges                |
| Microphone Audio FAB          | 56 × 56 px      | 64 × 64 px            | 16px from screen edge                |
| Form Radio Option Card        | 48px height     | 60px height           | 12px between cards                   |
+---------------------------------------------------------------------------------------------------------------+
```
