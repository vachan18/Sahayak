# Aangan — the Sahayak design language

> *Aangan* (आँगन) is the open courtyard at the heart of an Indian home — the shared space where neighbours sit, news is exchanged and help is asked for. Sahayak is built to feel like that: warm, open, unhurried, and nobody is made to feel small.

This document explains **what** the interface looks and moves like, and **why** — every decision traces back to a real constraint of the people we design for.

---

## 1. Who we design for

| Persona | Reality that shapes the UI | Design response |
| :-- | :-- | :-- |
| **Rameshwar, 52, smallholder farmer** | Reads numbers and signage only; 2 GB Android phone; uses the phone outdoors at midday | Voice-first entry, big rupee figures, Sunlight mode, Data saver, 48–72 px targets |
| **Lakshmi, 36, domestic worker** | Cannot read the state script; loses ₹500 for every day spent in a queue | Read-aloud ("Listen") on every decision, "What to bring" lists, help-centre opening hours |
| **Arindam, 28, weaver** | Proud, business-minded; dislikes being treated as a charity case | Respectful copy ("what you are entitled to", never "beneficiary"), loan limits shown separately from grants |
| **Sunita, 19, student & family "tech proxy"** | Applies on behalf of six relatives from one phone | Family switcher ("Checking for: …") always visible, keyboard command palette on desktop, shareable summaries |
| **CSC operator** | Serves dozens of citizens a day on a laptop | Persistent side rail, Ctrl/⌘ K palette, printable slips |

**Context of use:** shared phones, patchy 4G, bright sun, noisy surroundings, deep distrust of officials and agents (*dalals*), and 13 languages across 10 scripts.

---

## 2. Design principles

1. **Speak first, read second.** Voice is the primary input (the central dock button), text is the fallback. Every important block carries a *Listen* control.
2. **Show the money.** The amount a family can receive is the largest thing on the screen — set in display type and counted up when it appears. Cash, hospital cover and loan limits are never summed together.
3. **One decision per screen.** The eligibility check asks exactly one question at a time (Hick's law; reduced cognitive load).
4. **Always say what comes next.** The *Journey Thread* (Find → Check → Papers → Apply → Track) shows where the family is and the next step is always one tap away.
5. **Trust is a feature.** ₹0 government fee and the ₹30 CSC cap are stated plainly and repeatedly; there is a one-tap path to report anyone asking for more.
6. **Never a dead end.** No-match results suggest alternatives; empty search suggests speaking; offline mode says what still works.
7. **Respect the device.** Fonts stream per language, effects switch off in Data saver, motion collapses with *prefers-reduced-motion*.

---

## 3. Colour — derived from the Sahayak emblem

The palette comes straight from the logo: a **navy shield**, a **teal speech bubble** and **orange people**. Together they form a split-complementary scheme (orange ↔ blue-teal), the classic way to get warmth *and* trust without clashing.

| Token | Light | Role | Meaning in the emblem |
| :-- | :-- | :-- | :-- |
| `neel` / `ink` | `#111E33` | Text, navigation, deep "hero" panels | The shield — protection, the State's guarantee |
| `haldi` | `#FC7C24` | **The one primary action** per screen; the voice button | The people — warmth, energy, action |
| `patti` | `#0A765F` (text) · `#1DAF8F` (brand) | Eligible, done, help, success | The speech bubble — conversation, help received |
| `paper` / `surface` | `#F6F7FA` / `#FFFFFF` | Canvas and cards | The white field of the emblem |
| `kesar` | `#B04608` | Needs a check / deadline | — |
| `sindoor` | `#B42318` | Error, overdue, fraud | — |

**60 · 30 · 10:** ~60% neutral canvas, ~30% navy structure, ~10% orange accent. Teal is used only where it carries meaning ("you qualify", "done", "help").
Primary buttons are **orange with navy text (6.4 : 1)**. White on orange would fail contrast, so we never use it.

**Life-event hues** — farming, health, women & child, education, business, housing — each always travels with its icon, so colour is never the only signal (WCAG 1.4.1).

**Verified contrast:** every text/surface pairing in Day and Night themes meets WCAG 2.2 AA (≥ 4.5 : 1).

### Themes
* **Day** — default; cool white canvas, navy ink.
* **Night** — deep navy canvas (`#090E19`); brand colours lifted for legibility; respects the OS in *Auto*.
* **Sunlight** — pure white, pure black, 2 px borders, heavier text. Implemented as tokens rather than a CSS filter.

---

## 4. Typography — professional, and complete across 13 languages

* **Plus Jakarta Sans** for Latin text, numerals and the wordmark. It is a clean geometric sans that matches the "SAHAYAK" lettering in the logo, with true tabular figures so rupee amounts line up.
* **Noto Sans** (Devanagari, Kannada, Bengali, Tamil, Telugu, Malayalam, Gujarati, Oriya, Gurmukhi) for Indic scripts, and **Noto Nastaliq Urdu** for Urdu. Google designed Noto to harmonise across scripts, and it is the standard for multi-script public services.
* Font stack is *Latin first, then script*, so "PM-KISAN" and "₹6,000" look identical in every language.
* **Script-aware streaming:** only the Latin face ships with the page. The matching Noto script is fetched when that language is chosen, and pre-fetched on hover in the picker.
* **Script-specific line height:** Latin body 1.55, Indic 1.70–1.75, Urdu 2.15. Headings get extra room for *matras* and conjuncts.
* **Fluid, rem-based scale:** `micro 13 · small 15 · body 17 · lead 19 · h3 21 · h2 24–32 · h1 30–46 · display 40–72 px`. The text-size control scales everything to 112.5% or 125%.

---

## 5. Shape, space, depth

* **Radius:** 6 · 10 · 12 · 16 · 22. Buttons 12, cards 16, sheets 22 — restrained, institutional.
* **Depth:** hairline edges and warm-tinted shadows (`shadow-hair`, `shadow-lift`, `shadow-float`). No glassmorphism on content, no glow blobs.
* **Touch targets:** minimum 48 × 48 px; primary actions 52–56 px; eligibility answers ≥ 72 px.

---

## 6. Motion — explain, don't decorate

Motion tokens live in `src/ui/motion.ts`.

| Token | Value | Used for |
| :-- | :-- | :-- |
| `ease.out` | `cubic-bezier(0.2, 0, 0, 1)` | Anything entering (decelerate) |
| `ease.in` | `cubic-bezier(0.3, 0, 1, 1)` | Anything leaving (accelerate) |
| `dur.micro / short / medium / long` | 120 / 200 / 320 / 480 ms | Press · toggle · page · large reveal |
| `spring.snappy` | 520 / 40 | Tab indicators, segmented pills |
| `spring.gentle` | 280 / 32 | Sheets, toasts |

**Choreography rules**

* **Spatial page transitions** — going deeper (list → detail) slides in from the reading-end edge; Back reverses; switching tabs is a quiet rise-and-fade. Direction flips automatically in Urdu (RTL).
* **Shared elements** — the scheme's life-event tile and amount morph from card to detail hero (`layoutId`).
* **Indicators that travel** — the dock's haldi tab marker, the rail highlight, segmented pills and the command-palette cursor slide between positions instead of blinking.
* **Count-up** — entitlement totals count up once, when scrolled into view.
* **Headline reveal** — page titles rise word by word from a soft blur into focus (split on spaces, so Indic conjuncts and Urdu ligatures are never broken). Screen readers hear the sentence once.
* **Route progress** — a 3 px brand-orange line sweeps across the top on every navigation.
* **Photo parallax** — hero photographs drift ±6% against the scroll; images fade up from a shimmer placeholder instead of popping in.
* **Affordance nudges** — trailing arrows in buttons slide 2 px toward the reading direction on hover (mirrored in Urdu).
* **Live signals only loop** — the only infinite animations are the "listening" rings and read-aloud bars, because they represent something that is happening *now*.
* **Haptics** — a small vocabulary (`tap`, `select`, `success`, `warning`, `error`) confirms actions for users not looking at the screen.
* **Reduced motion** — `prefers-reduced-motion` and Data saver collapse everything to opacity changes of 120 ms or less.

---

## 7. Signature patterns

| Pattern | What it is | UX rationale |
| :-- | :-- | :-- |
| **Journey Thread** | A stitched thread with five knots — Find, Check, Papers, Apply, Track — derived from real app state | Makes an invisible bureaucratic process visible (visibility of system status); reduces anxiety; always offers the next step |
| **Speak button in the dock** | Raised haldi button in the thumb zone on every screen | Voice is the most natural input for low-literacy users; Fitts's law: large, central, near the thumb |
| **Natural voice** | Voices ranked by quality (neural/online first), text rewritten for speech ("₹6,000" → "6,000 rupees", "PM-KISAN" → "P M Kisan"), spoken sentence-by-sentence; optional neural cloud voice; the comfort sheet shows voice quality and how to install a better one | Robotic speech erodes trust; a human-sounding voice is the interface for non-readers |
| **Listen everywhere** | Read-aloud on every decision-bearing block, with animated "speaking" bars | Recognition over recall; no one is locked out by reading ability |
| **Checking for…** | Family switcher in the rail / avatar; household members on the Family screen | Matches the shared-phone reality; prevents mixing up people's answers (error prevention) |
| **The promise** | ₹0 government fee · ₹30 CSC cap, plus "Someone asked me for money" | Trust signal and anti-middleman intervention at the point of fear |
| **Comfort sheet** | Text size with live preview, Day/Night/Auto, Sunlight, Data saver, Read aloud | All accessibility affordances in plain words, in one place |
| **Command palette** | Ctrl/⌘ K search across schemes and actions | Accelerator for expert users (CSC operators, proxies) without cluttering the novice path |
| **Offline honesty** | Slim banner that says what still works; confirms when back online | Keeps users oriented on patchy rural networks |
| **Remind me** | Deadlines download a calendar reminder (.ics) with a 1-day alert | Bridges the gap between "found it" and "acted on it" |
| **WhatsApp-first sharing** | Summaries and slips share to WhatsApp / native share | Information travels through family and village groups |

---

## 7a. Photography

Real people, not illustrations or stock-office imagery: a farmer in his rice field (Kerala), a new mother (Assam), handloom weavers (Pochampally, Majuli), an elder (Chandrapur), a student (Delhi), a woman at her village home (Coimbatore). All are from Unsplash under the Unsplash License, credited in `public/people/CREDITS.md`.

* Every life event owns a photograph, so a non-reader can recognise "this is about farming" from the picture alone.
* Photos ship as 640 px and 1200 px WebP (≈40 KB on phones), lazy-loaded, with focal points set so faces survive every crop.
* On dark hero panels a navy scrim keeps text at AA contrast over any photo.
* Data saver removes photos entirely.
* The "Built for people like them" stories are labelled as illustrative research personas, never presented as testimonials.

## 8. Layout & navigation

* **Phones (< 1024 px):** top bar (logo or Back · language · comfort · alerts · family avatar) that slides away while reading and returns on scroll-up; content; a dock with **Home · Check · Speak · Papers · Track**.
* **Desktop (≥ 1024 px):** a persistent side rail (all hubs + Speak + family switcher), a top bar with a full search field, and a 1240 px content column.
* **Information architecture:** life events, not ministries. Maximum depth of two taps from any hub to an actionable result.
* **RTL:** logical CSS properties throughout (`ms`, `pe`, `start`, `end`); directional icons flip via `.flip-rtl`; the `dir` attribute switches with the language.

---

## 9. Language coverage

13 languages: English, हिन्दी, ಕನ್ನಡ, বাংলা, தமிழ், తెలుగు, मराठी, മലയാളം, ગુજરાતી, ଓଡ଼ିଆ, ਪੰਜਾਬੀ, **اردو** (new, right-to-left) and **অসমীয়া** (new). The picker shows each language in its own script, with the English name small underneath for proxies, and a speaker button to *hear* each option before choosing.

---

## 10. Accessibility checklist

* WCAG 2.2 AA contrast in all themes; Sunlight mode for outdoor AAA-level legibility
* Skip link, landmarks, one `h1` per page, `aria-current` on navigation, `aria-live` toasts and transcripts
* Focus trap, Esc-to-close and focus return on every sheet; visible 3 px focus ring
* All icon buttons have accessible names; colour never the only signal
* Text scales to 125% without horizontal scrolling down to a 360 px viewport
* Reduced-motion and Data saver respected everywhere

---

## 11. Where things live

| Path | Contents |
| :-- | :-- |
| `src/styles/index.css` | Tokens, themes, script typography, print |
| `tailwind.config.js` | Token → utility mapping, type scale, radii, shadows |
| `src/ui/` | Primitives: Button, IconButton, Sheet, Surface, Tag, Chip, Segmented, Field, Disclosure, Reveal, AnimatedNumber, Progress, EmptyState, ListenButton, JourneyThread, Toaster, motion tokens |
| `src/components/shell/` | Side rail, top bar, dock, animated outlet, language / comfort sheets, command palette, family switcher, offline banner |
| `src/lib/` | Font streaming, haptics, calendar reminders, sharing |
| `src/data/ux/` | Namespaced strings for the redesign (English source + 12 regional files) |
