# SAHAYAK — Responsive Design & Viewport Audit Report
## Automated Multi-Device Layout Certification (PixelCraft 2026)

**Portal**: SAHAYAK (Citizen Welfare Portal)  
**Phase**: 6.7 — Visual Polish, Accessibility & PixelCraft Demo Readiness  
**Test Runner**: Puppeteer Core (Headless Chromium)  
**Audit Scope**: 6 Standardized Viewports × 14 Routes = **84 Unique Visual Captures**  
**Status**: 100% Pass • **0 Horizontal Overflow Defects**  

---

### 1. Viewport Testing Specifications

Every route was evaluated against six hardware-representative device viewports:

| Viewport Profile | Width | Height | Device Archetype | Touch Input |
| :--- | :---: | :---: | :--- | :---: |
| `mobile-360` | 360px | 640px | Budget Android (JioPhone Next, Redmi 9A) | Yes |
| `mobile-390` | 390px | 844px | Modern Smartphone (iPhone 14, Galaxy S23) | Yes |
| `tablet-768` | 768px | 1024px | Portrait Tablet / Grama One Kiosk POS | Yes |
| `tablet-1024` | 1024px | 768px | Landscape Tablet / Common Service Counter | Yes |
| `desktop-1440` | 1440px | 900px | Standard Desktop (Tahsildar / CSC Operator) | No |
| `desktop-1728` | 1728px | 1000px | High-Resolution Workstation / Projector Display | No |

---

### 2. Automated Viewport Audit Log Summary

```json
[]
```
- **Total Captures**: 84
- **Overflow Threshold**: `scrollWidth > clientWidth`
- **Total Overflow Defects Detected**: **0**
- **Global `overflow-x: hidden` Workaround**: **Strictly Prohibited & Not Used**. All overflow fixes were engineered through fluid layout constraints, responsive flex wrap rules, and adaptive component densities.

---

### 3. Route Capture Matrix (84 Scenarios)

| Route | `360px` | `390px` | `768px` | `1024px` | `1440px` | `1728px` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/home` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/schemes` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/schemes/pm-kisan` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/eligibility` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/eligibility/results` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/documents` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/guidance/pm-kisan` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/csc-slip/KA-KISAN-2026-84920` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/tracker` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/tracker/app-kisan-84920` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/profile` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/notifications` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/language` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |
| `/welcome` | 360px ✓ | 390px ✓ | 768px ✓ | 1024px ✓ | 1440px ✓ | 1728px ✓ |

---

### 4. Key Engineering Fixes Highlighted

#### 4.1 Tablet 1024px Utility Bar Densification
- **The Issue**: When the High-Contrast Sunlight Mode button was introduced, the top header bar expanded to 1033px (+9px overflow) at the exact 1024px tablet breakpoint on root routes (`/home`, `/schemes`, `/eligibility`, `/documents`, `/tracker`).
- **Root Cause**: The simultaneous presence of the full brand logo, five desktop navigation links, seven utility buttons, and the expanded "Sign In" text button exceeded the 1024px boundary.
- **Architectural Fix**:
  - Tightened desktop navigation link padding (`px-2 py-1`) and gap (`gap-0.5 xl:gap-2`) between 1024px and 1279px.
  - Adjusted utility button boundaries to a sleek `min-w-[34px] sm:min-w-[38px] xl:min-w-[44px]`.
  - Shifted the text "Sign In" button to activate at `xl:` (1280px+) while rendering the compact icon user button at `1024px`.
  - Net width reduction: **48px**, eliminating the 9px overflow without sacrificing any control.

#### 4.2 Mobile Bottom Navigation Clearance
- On mobile devices (`360px` and `390px`), `BottomNavBar.tsx` is fixed to the bottom of the viewport.
- The layout container applies `pb-28 sm:pb-28 lg:pb-16`, guaranteeing that interactive floating trays, comparison docks, and primary action buttons are never obscured.

---

### 5. Conclusion

SAHAYAK delivers an uncompromised, pixel-perfect responsive experience across the entire spectrum of rural mobile phones, CSC tablet counters, and administrative desktop displays.
