# PHASE 6.1 — RESPONSIVE AUDIT REPORT
**SAHAYAK — Citizen-First Sovereign Welfare Portal**  
**Audit Scope**: Mobile, Tablet, Desktop & CSC Kiosk Viewports  
**Audit Date**: November 2026  
**Auditor**: Senior Responsive UI Engineer & Mobile UX Specialist  

---

## 1. Executive Summary & Audit Methodology

An exhaustive responsive and mobile UX audit was conducted on SAHAYAK across 13 application routes and 6 standard sovereign viewports:
- **Mobile Compact**: `360 × 640` (Low-cost Android / Feature phones)
- **Mobile Modern**: `390 × 844` (Modern smartphones / iPhone standard)
- **Tablet Portrait**: `768 × 1024` (iPad Mini / Portrait tablets)
- **Tablet Landscape**: `1024 × 768` (iPad landscape / CSC Kiosk small touchscreen)
- **Desktop Standard**: `1440 × 900` (CSC Operator terminals / Laptops)
- **Desktop Sovereign**: `1728 × 1000` (Government service centre widescreen monitors)

### Automated Test Runner
Testing was executed using a headless Chromium testing pipeline (`scripts/capture_screenshots.cjs`) with `puppeteer-core`. The runner navigated every route, measured `document.documentElement.scrollWidth` versus `clientWidth`, identified elements exceeding the horizontal boundary (`rect.right > clientWidth + 1`), and captured high-resolution before-and-after screenshots stored in `documentation/phase-6.1/screenshots/`.

---

## 2. Baseline Audit Findings (Before State)

The baseline run identified **28 horizontal overflow defects** across the 78 route-viewport test cases:

| Viewport | Tested Resolution | Routes with Overflow | Max Overflow (px) | Primary Root Causes |
|---|---|---|---|---|
| **mobile-360** | 360 × 640 | 6 of 13 routes | +55px (scrollWidth 415px) | Hero search button overlap, top utility bar width, urgent alert card flex wrapping |
| **mobile-390** | 390 × 844 | 5 of 13 routes | +24px (scrollWidth 414px) | Top utility controls spacing, category chip rail boundaries |
| **tablet-768** | 768 × 1024 | 11 of 13 routes | +222px (scrollWidth 990px) | Desktop navigation bar prematurely visible at `md:` (768px) alongside full utility controls |
| **tablet-1024** | 1024 × 768 | 6 of 13 routes | +108px (scrollWidth 1132px) | Unconstrained desktop nav item labels, large padding gaps |
| **desktop-1440** | 1440 × 900 | 0 of 13 routes | 0px | Clean |
| **desktop-1728** | 1728 × 1000 | 0 of 13 routes | 0px | Clean |

---

## 3. Detailed Breakdown of Root Causes

### 3.1. Top Utility Header Overflow
- **Cause**: On mobile (< 400px), `TopUtilityBar` rendered the sovereign logo emblem (32px), brand title, language switcher pill, audio button, theme toggle, notification bell, and user avatar with generous margins (`gap-2` and `layout-container` 32px padding). Total inner width reached ~366px, causing a 6px horizontal scroll on 360px viewports.
- **Tablet Conflict**: At `md:` (768px), the desktop 5-item navigation bar became visible while retaining all 5 right utility controls (Language, Audio, Dark mode, Notifications, Sign In). The combined layout required 990px, causing +222px overflow on 768px screens.
- **1024px Conflict**: At 1024px (`lg:`), all navigation labels expanded to full length (e.g. "Check Eligibility", "All Schemes") and Sign In expanded to full text, forcing the header to 1132px (+108px overflow).

### 3.2. Hero Search & Voice Input Box (HomeScreen)
- **Cause**: The voice search input in `HomeScreen.tsx` had absolute positioning for the AI assistant trigger button (`absolute right-2.5`). The button contained text (`"ಸಹಾಯಕ ಸಾಥಿ (Voice)"`) which collided with the input field text and placeholder on viewports under 400px.
- **Fix Required**: Responsive voice button displaying icon-only on mobile screens with 44px min-width/height touch targets, and full label on larger breakpoints.

### 3.3. Seasonal Urgent Alert Card (HomeScreen)
- **Cause**: The urgent alert card used `flex items-center justify-between` on mobile. The alert description and action button ("Apply for Extension") competed horizontally, forcing the button to wrap awkwardly or overflow card boundaries.
- **Fix Required**: Responsive flex container transitioning from `flex-col sm:flex-row` with full-width button on mobile.

### 3.4. Category Chips & Avatar Rails
- **Cause**: Horizontal scrolling chip rails (`SchemeDiscoveryScreen.tsx`, `UserProfileScreen.tsx`) lacked `min-w-0` and `w-full max-w-full` constraints on parent flex containers, triggering page-level document scroll rather than isolated element-level scroll.
- **Fix Required**: Strict scroll isolation (`overscroll-x-contain`, `.no-scrollbar`, `w-full max-w-full min-w-0`).

### 3.5. Mobile Bottom Navigation Overlap
- **Cause**: `SchemeDetailScreen.tsx` featured a sticky bottom bar (`fixed bottom-0 left-0 right-0`) for primary application CTAs. On mobile viewports, this directly covered the persistent `BottomNavBar.tsx` (height 64px), preventing citizens from accessing either the scheme CTA or bottom navigation tabs.
- **Fix Required**: Computed bottom offset: `bottom: calc(4rem + env(safe-area-inset-bottom, 0px))`.

### 3.6. Touch Target Violations
- **Cause**: Several icon buttons and chip items had bounding boxes of 32px–36px, violating the 48px touch target standard for mobile and touchscreen kiosk accessibility.
- **Form Zoom**: Input font sizes in `AiAssistantDrawer.tsx` were `text-sm` (14px), triggering automatic viewport zoom on iOS Safari upon focus.

### 3.7. Missing Bengali Localization
- **Cause**: While English, Kannada, and Hindi were supported, Bengali (`bn`) was missing from types, translation dictionaries, and typography styling, causing language switching errors.

---

## 4. Viewport Verification Matrix

| Route | 360×640 | 390×844 | 768×1024 | 1024×768 | 1440×900 | 1728×1000 | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/home` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/schemes` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/schemes/pm-kisan` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/eligibility` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/eligibility/results` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/documents` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/guidance/pm-kisan` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/csc-slip/KA-KISAN-2026-84920` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/tracker` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/profile` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/notifications` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/language` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |
| `/welcome` | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | ✓ Clean | PASS |

**Total Tested**: 78 / 78 passing (0 horizontal overflow issues).
