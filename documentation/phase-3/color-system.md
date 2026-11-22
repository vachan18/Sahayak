# SAHAYAK (सहायಕ / ಸಹಾಯಕ)
## Semantic Color System & Palette Specifications
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 3 Deliverable

---

## 1. Color Strategy & Sunlight Contrast Mandate

In rural India, citizens frequently interact with mobile devices in direct outdoor sunlight (at bus stands, village squares, fields, and open-air CSC kiosks). Typical modern web palettes using soft grays (`#94A3B8`) or pastel borders fail completely under 10,000+ lux ambient daylight.

SAHAYAK establishes an **Outdoor Sovereign Palette**:
- **Baseline Contrast Ratio**: Targets **> 12:1** for primary body text (exceeding WCAG AAA 7:1) and **> 5:1** for secondary metadata (exceeding WCAG AA 4.5:1).
- **Zero Ambiguity**: State changes (Eligible, Pending, Rejected, Action Needed) utilize dual encoding (unambiguous high-contrast color + distinct glyph + clear vernacular text).

---

## 2. Complete Semantic Palette (Light Theme — Primary Focus)

```
+-------------------------------------------------------------------------------------------------------------------------+
| Semantic Role            | Exact HEX    | Name / Token               | Contrast Ratio  | Primary UI Usage               |
+-------------------------------------------------------------------------------------------------------------------------+
| Primary Brand            | #0B2545      | sovereign-navy-900         | 15.2:1 on bg    | Primary buttons, top header,   |
|                          |              |                            |                 | brand emblems, active dock     |
+-------------------------------------------------------------------------------------------------------------------------+
| Primary Hover / Active   | #133966      | sovereign-navy-800         | 13.1:1 on bg    | Hover/pressed state for primary|
+-------------------------------------------------------------------------------------------------------------------------+
| Secondary Brand          | #1E3A8A      | sovereign-blue-700         | 11.4:1 on bg    | Section headers, secondary CTAs|
+-------------------------------------------------------------------------------------------------------------------------+
| Accent Brand             | #B45309      | saffron-ochre-700          | 5.8:1 on white  | Badges, focus rings, active    |
|                          |              |                            |                 | steppers, voice waveform       |
+-------------------------------------------------------------------------------------------------------------------------+
| Accent Light / Surface   | #FEF3C7      | saffron-ochre-100          | 1.3:1 (surface) | Highlight card backgrounds,    |
|                          |              |                            |                 | urgent seasonal notice chips   |
+-------------------------------------------------------------------------------------------------------------------------+
| Background (Canvas)      | #F8FAFC      | slate-canvas-50            | Base canvas     | Global application background  |
+-------------------------------------------------------------------------------------------------------------------------+
| Surface (Card / Container| #FFFFFF      | pure-white-0               | Base container  | Scheme cards, form containers, |
|                          |              |                            |                 | modal sheets                   |
+-------------------------------------------------------------------------------------------------------------------------+
| Elevated Surface         | #FFFFFF      | pure-white-elevated        | Base container  | Floating bottom nav, dialogs,  |
|                          |              |                            | + 8px shadow    | toast alerts, dropdown menus   |
+-------------------------------------------------------------------------------------------------------------------------+
| Text Primary             | #0F172A      | slate-text-900             | 16.4:1 on white | All primary headlines, body    |
|                          |              |                            |                 | copy, numbers, critical labels |
+-------------------------------------------------------------------------------------------------------------------------+
| Text Secondary           | #334155      | slate-text-700             | 9.8:1 on white  | Secondary descriptions, helper |
|                          |              |                            |                 | text, timestamps, subtitle     |
+-------------------------------------------------------------------------------------------------------------------------+
| Text Tertiary / Muted    | #64748B      | slate-text-500             | 4.6:1 on white  | Form field placeholders,       |
|                          |              |                            |                 | non-critical metadata tags     |
+-------------------------------------------------------------------------------------------------------------------------+
| Border Subdued           | #E2E8F0      | slate-border-200           | 1.3:1 (div)     | Card dividers, list item rules |
+-------------------------------------------------------------------------------------------------------------------------+
| Border Standard          | #CBD5E1      | slate-border-300           | 2.1:1 (box)     | Form input borders, inactive   |
|                          |              |                            |                 | button outlines, card borders  |
+-------------------------------------------------------------------------------------------------------------------------+
| Border Focus Ring        | #B45309      | saffron-focus-700          | 5.8:1 on white  | 3px outline on focused elements|
+-------------------------------------------------------------------------------------------------------------------------+
| Success Base (Eligible)  | #065F46      | emerald-success-800        | 7.2:1 on white  | Cash DBT amount, qualified     |
|                          |              |                            |                 | status, approved milestone     |
+-------------------------------------------------------------------------------------------------------------------------+
| Success Light Surface    | #ECFDF5      | emerald-surface-50         | 1.1:1 (surface) | Qualified scheme card backing, |
|                          |              |                            |                 | verified document badge backing|
+-------------------------------------------------------------------------------------------------------------------------+
| Warning Base (Action Reqd| #92400E      | amber-warning-800          | 6.4:1 on white  | Missing document alert, SLA    |
|                          |              |                            |                 | approaching countdown, review  |
+-------------------------------------------------------------------------------------------------------------------------+
| Warning Light Surface    | #FFFBEB      | amber-surface-50           | 1.1:1 (surface) | Warning banner background,     |
|                          |              |                            |                 | document blur alert container  |
+-------------------------------------------------------------------------------------------------------------------------+
| Error Base (Rejection/SLA| #991B1B      | crimson-error-800          | 7.8:1 on white  | SLA breached alert, document   |
|                          |              |                            |                 | rejection, critical failure    |
+-------------------------------------------------------------------------------------------------------------------------+
| Error Light Surface      | #FEF2F2      | crimson-surface-50         | 1.1:1 (surface) | Rejected document container,   |
|                          |              |                            |                 | error toast background         |
+-------------------------------------------------------------------------------------------------------------------------+
| Information Base         | #0369A1      | sky-info-700               | 6.2:1 on white  | DigiLocker link, statutory fee |
|                          |              |                            |                 | disclaimer, helpline contact   |
+-------------------------------------------------------------------------------------------------------------------------+
| Information Light Surface| #F0F9FF      | sky-surface-50             | 1.1:1 (surface) | Info banner backing, assisted  |
|                          |              |                            |                 | CSC fee notice background      |
+-------------------------------------------------------------------------------------------------------------------------+
| Disabled State Container | #F1F5F9      | slate-disabled-100         | 1.1:1 (surface) | Inactive CTA background,       |
|                          |              |                            |                 | locked form field container    |
+-------------------------------------------------------------------------------------------------------------------------+
| Disabled State Text      | #94A3B8      | slate-disabled-400         | 3.1:1 on disabled| Muted text on inactive buttons |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Dark Theme Specification (High-Contrast Night Mode)

While the light theme is the primary standard for high-sunlight outdoor usage, SAHAYAK provides an OLED-optimized, battery-conserving **High-Contrast Dark Theme** for evening usage on low-cost devices:

```
+-------------------------------------------------------------------------------------------------------------------------+
| Semantic Role            | Light Value  | Dark Value   | Token Name (Dark)          | Contrast Ratio on Dark    |
+-------------------------------------------------------------------------------------------------------------------------+
| Canvas Background        | #F8FAFC      | #0B1120      | dark-canvas-950            | Base dark surface         |
+-------------------------------------------------------------------------------------------------------------------------+
| Surface (Cards)          | #FFFFFF      | #131C31      | dark-surface-900           | 1.2:1 relative to canvas  |
+-------------------------------------------------------------------------------------------------------------------------+
| Elevated Surface         | #FFFFFF      | #1E293B      | dark-elevated-800          | Bottom dock, modals, menus|
+-------------------------------------------------------------------------------------------------------------------------+
| Text Primary             | #0F172A      | #F8FAFC      | dark-text-50               | 15.6:1 on dark surface    |
+-------------------------------------------------------------------------------------------------------------------------+
| Text Secondary           | #334155      | #CBD5E1      | dark-text-300              | 9.8:1 on dark surface     |
+-------------------------------------------------------------------------------------------------------------------------+
| Border Standard          | #CBD5E1      | #334155      | dark-border-700            | Crisp 1px card boundaries |
+-------------------------------------------------------------------------------------------------------------------------+
| Primary Accent           | #0B2545      | #38BDF8      | dark-sky-400               | 8.4:1 on dark surface     |
+-------------------------------------------------------------------------------------------------------------------------+
| Saffron Ochre Accent     | #B45309      | #F59E0B      | dark-amber-500             | 9.2:1 on dark surface     |
+-------------------------------------------------------------------------------------------------------------------------+
| Success Green            | #065F46      | #34D399      | dark-emerald-400           | 10.1:1 on dark surface    |
+-------------------------------------------------------------------------------------------------------------------------+
| Warning Amber            | #92400E      | #FBBF24      | dark-amber-400             | 11.2:1 on dark surface    |
+-------------------------------------------------------------------------------------------------------------------------+
| Error Red                | #991B1B      | #F87171      | dark-red-400               | 8.9:1 on dark surface     |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Semantic State Matrix & Validation Indicators

```
[ Default / Idle ]     Border: #CBD5E1 | Surface: #FFFFFF | Text: #0F172A
          ↓ (User Tap / Voice Trigger)
[ Active / Focused ]   Border: #B45309 (3px ring) | Surface: #FEF3C7 (tint) | Icon: Pulse #B45309
          ↓ (System Validation Check)
[ Success / Verified ] Border: #065F46 (1.5px) | Surface: #ECFDF5 | Badge: "✓ ಪರಿಶೀಲಿಸಲಾಗಿದೆ (Verified)"
          ↓ (Validation Error / Blur)
[ Attention Needed ]   Border: #92400E (1.5px) | Surface: #FFFBEB | Badge: "⚠ ಮರು-ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (Re-upload)"
          ↓ (Critical / SLA Breach)
[ Urgent Escalation ]  Border: #991B1B (2px)   | Surface: #FEF2F2 | Badge: "⛔ ಕಾಲಮಿತಿ ಮೀರಿದೆ (SLA Overdue)"
```

### Gradients & Transparency Prohibition Rules
- **No Linear Rainbow Gradients**: Gradient usage is restricted strictly to subtle single-hue illumination (e.g. `linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)`) on cards.
- **No Frosted Glass Over Text**: Translucent blurred backdrops (`backdrop-filter`) are permitted **only** on full-screen scrim backgrounds behind modals, never behind critical reading text or statutory numbers.
