# SAHAYAK (सहायಕ / ಸಹಾಯಕ)
## Responsive Design & Cross-Device Layout Guidelines
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 3 Deliverable

---

## 1. Responsive Philosophy: Mobile-First Without Desktop Compromise

In India, **89% of citizens access welfare information on mobile smartphones**, but rural cyber cafés, CSC village operators, and college libraries rely on **desktop computers running at 1024×768 to 1366×768 resolution**.

SAHAYAK delivers a **fluid, mobile-first design that naturally scales into a high-productivity desktop workstation** without awkward stretched cards.

---

## 2. Adaptive Layout Archetypes by Viewport

```
+-------------------------------------------------------------------------------------------------------------------------+
| Screen / Feature             | Mobile (<768px)               | Tablet (768px - 1023px)      | Desktop (>=1024px)        |
+-------------------------------------------------------------------------------------------------------------------------+
| Navigation Structure         | 4-Tab Bottom Dock (64px) +    | Left Rail Mini-Dock (72px) + | Persistent Sidebar (260px)|
|                              | Top Utility Header (56px)     | Top Utility Bar              | with full labels & profile|
+-------------------------------------------------------------------------------------------------------------------------+
| Life-Event Exploration Grid  | 2-Column Grid of 6 Cards      | 3-Column Grid                | 6-Column Single Row or    |
|                              | (Vertical scroll)             |                              | 3x2 Asymmetric Showcase   |
+-------------------------------------------------------------------------------------------------------------------------+
| Scheme Discovery Catalog     | Single-card stacked feed      | 2-Column Masonry             | 2-Column with sticky left |
|                              | (Filter in bottom sheet)      | (Filter in slide-over drawer)| filter sidebar (280px)    |
+-------------------------------------------------------------------------------------------------------------------------+
| "Bolo Aur Jano" Quiz         | Full-screen card sequence     | Centered Card Container      | Centered Floating Card    |
|                              | (Zero scrolling required)     | (Max width 540px)            | with live preview tray    |
+-------------------------------------------------------------------------------------------------------------------------+
| Document Do's & Don'ts       | Vertically stacked photo tiles| Side-by-side 2-column tiles  | Side-by-side 2-column with|
|                              |                               | (50% - 50% split)            | live zoom loupe tool      |
+-------------------------------------------------------------------------------------------------------------------------+
| Application Milestone Tracker| Vertical Stepper with dates   | Vertical Stepper with dates  | Horizontal 4-Stage Stepper|
|                              | & expandable officer notes    | & officer avatar chips       | with interactive timeline |
+-------------------------------------------------------------------------------------------------------------------------+
| "Sahayak Sathi" AI Assistant | Slide-up bottom sheet (85vh)  | Slide-up bottom sheet        | Docked Right Sidebar      |
|                              |                               | (Max width 500px, centered)  | (380px fixed width panel) |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Desktop Ergonomics: Preventing the "Stretched Card" Trap

On wide desktop screens (1440px+), primitive mobile ports stretch cards across the entire monitor, forcing users to move their necks left-to-right to read text.

SAHAYAK enforces strict desktop container boundaries:
- **Max Content Container**: `1140px` centered with auto margins.
- **Reading Measure**: Paragraph text capped at `65ch` (characters per line) for optimal reading comfort.
- **Two-Column Split Layout for Details**:
  - Left Column (60% width): Plain-language scheme specifications, eligibility criteria, benefit calculation breakdown.
  - Right Sticky Column (40% width): Action Box (Check Eligibility CTA, Statutory Fee ₹0.00 Seal, Grievance SLA Box, Download CSC Slip).

---

## 4. Touch & Pointer Adaptations

- **Touch Devices (`@media (pointer: coarse)`)**:
  - Tap targets enlarged to minimum 48px height.
  - Generous 12px margins between cards.
  - Swipe gestures enabled for onboarding carousel, document preview, and bottom drawer dismissal.
- **Mouse & Keyboard (`@media (pointer: fine)`)**:
  - Subtle hover states with shadow elevation and cursor changes.
  - Keyboard shortcuts enabled:
    - `/` or `S`: Focus search bar.
    - `M`: Toggle audio voiceover.
    - `L`: Open language switcher.
    - `Esc`: Close open modal/drawer.
