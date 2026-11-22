# SAHAYAK (सहायಕ / ಸಹಾಯಕ)
## Motion & Interaction Timing Guidelines
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 3 Deliverable

---

## 1. Motion Philosophy: Purposeful Restraint for Bharat

Public welfare applications are used in high-anxiety situations (medical emergencies, drought relief, impending scholarship deadlines). Gimmicky, slow, or excessive animations induce panic, drain battery on budget smartphones, and introduce cognitive clutter.

SAHAYAK's motion system follows three sovereign rules:
1. **Functional Utility Only**: Motion must communicate state transitions, spatial continuity, or confirmation of action.
2. **Snappy & Sub-400ms**: Transitions must never make a citizen wait. 
3. **Strict `prefers-reduced-motion` Parity**: Every motion curve degrades to an instantaneous, accessible opacity cross-fade when reduced motion is requested.

---

## 2. Timing Scale & Easing Curves

```css
:root {
  /* Duration Tokens */
  --duration-instant: 100ms;   /* Button press micro-feedback */
  --duration-snappy: 150ms;    /* Tab switches, chip selection, tooltips */
  --duration-normal: 250ms;    /* Card expansions, dropdown menus */
  --duration-enter: 300ms;     /* Bottom sheet drawers sliding up */
  --duration-exit: 200ms;      /* Modals & sheets dismissing */

  /* Easing Curves */
  /* Snappy Exit: Accelerates out */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  
  /* Decelerate: Natural entry into viewport */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  
  /* Standard Spring: Organic tactile drawer feel (Linear/Apple inspired) */
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
}
```

---

## 3. Interaction Transitions Specification

### 3.1 Slide-Up Bottom Drawers
- **Entry**: `transform: translateY(100%)` to `translateY(0)` in `300ms` using `--ease-spring`.
- **Exit**: `translateY(0)` to `translateY(100%)` in `200ms` using `--ease-in`.
- **Scrim Backdrop**: Opacity from `0` to `1` in `200ms`.

### 3.2 Single-Question Card Progression (Eligibility Quiz)
- When citizen selects an option or speaks their answer:
  - Current card fades and slides left: `opacity: 0; transform: translateX(-16px)` (`150ms`).
  - Next card enters from right: `opacity: 1; transform: translateX(0)` (`200ms`, delay `50ms`).
  - Total transition time: `<250ms`, providing immediate confirmation without disorientation.

### 3.3 Voice Waveform Pulse (`VoiceWaveform`)
- 4 vertical bars pulsing smoothly during active microphone speech input:
  - Scale transform `scaleY(0.3)` to `scaleY(1.0)` looping infinitely at `600ms` cycle with staggered delays (`0ms`, `150ms`, `300ms`, `450ms`).
  - Color transitions smoothly from Sovereign Ochre (`#B45309`) to Emerald (`#065F46`) upon successful speech recognition.

### 3.4 Button Press Tactile Response
- Tapping any primary CTA triggers an instantaneous physical press response:
  - `transform: scale(0.98); filter: brightness(0.96);` for `100ms`.
  - Releases with zero bounce to convey rock-solid dependability.

---

## 4. Reduced-Motion Implementation Mandate

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Accessible fallback: Instant opacity fade */
  .bottom-drawer-enter {
    opacity: 1 !important;
    transform: none !important;
  }
}
```
