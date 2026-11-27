<p align="center">
  <img src="public/logo.svg" alt="Sahayak emblem — a shield holding a speech bubble and two people" width="120" />
</p>

<h1 align="center">SAHAYAK</h1>
<p align="center"><b>Government schemes, in your language.</b><br/>Voice-first welfare discovery for every Indian household — find, check, prepare, apply and track, without paying a middleman.</p>

<p align="center"><b>Team Pixel Theory</b> · PixelCraft 2026 UI/UX Competition · Track DS-02: Public Good &amp; Digital Inclusion</p>

---

## At a glance

| | |
| :-- | :-- |
| **Problem** | Welfare exists, but reaching it is hard: English/official-Hindi portals, jargon, ₹200–₹1,500 paid to middlemen, and black-box tracking. |
| **People** | A farmer who cannot type, a domestic worker who cannot read the state script, a weaver who needs a loan, a student applying for six relatives from one phone. |
| **Design language** | **Aangan** — colours taken from the emblem (navy = trust, orange = action, teal = help), Plus Jakarta Sans + Noto Sans for 10 scripts, a full motion system, real photography. |
| **Signature patterns** | The **Journey Thread** (Find → Check → Papers → Apply → Track) · central **Speak** button · **Listen** on every decision · **Checking for…** family switcher · ₹0 / ₹30 **fee promise** with one-tap fraud reporting. |
| **Languages** | **13** — English, हिन्दी, ಕನ್ನಡ, বাংলা, தமிழ், తెలుగు, मराठी, മലയാളം, ગુજરાતી, ଓଡ଼ିଆ, ਪੰਜਾਬੀ, **اردو (RTL)**, **অসমীয়া**. 1,152 interface strings per language, 100% parity (tested). |
| **Accessibility** | WCAG 2.2 AA in Day and Night themes, **Sunlight mode** for outdoor use, text size to 125%, **Data saver** for 2 GB phones, reduced motion, screen-reader labels, 48 px targets. |
| **Quality** | 133 automated tests · 0 TypeScript errors · zero horizontal overflow from 360 px to 1440 px. |

## The experience

1. **Welcome & language** — a greeting that cycles through every Indian language; each language shown in its own script with a speaker to hear it.
2. **Home** — tap and speak, a trust strip, the Journey Thread, life-event photo cards, picks for the active family member.
3. **Speak** — *Sahayak Sathi*: a voice orb that reacts to your real voice level, live transcript, answers with next-step buttons.
4. **Check** — one plain question per screen; results lead with yearly cash, shown separately from hospital cover and loans.
5. **Schemes** — 12 schemes organised by life events, with plain-language eligibility, papers, fees and legal time limits.
6. **Papers** — readiness ring, camera pre-check (blur, glare, corners), DigiLocker fetch, good-vs-bad photo examples.
7. **Apply** — help-centre or online path; a printable slip with QR code, checklist and the fee promise.
8. **Track** — four official stages, days left by law (or overdue), and complaints for delays or demands for money.
9. **Help centres** — nearby CSCs, open now, languages spoken, directions and call.
10. **Comfort & power use** — reading-comfort sheet, Ctrl/⌘ K command palette, PWA shortcuts, offline banner.

## Design system

The full rationale — audience, principles, colour theory, typography, motion, photography, patterns and accessibility — is in **[docs/design/AANGAN-DESIGN-SYSTEM.md](docs/design/AANGAN-DESIGN-SYSTEM.md)**.

| Where | What |
| :-- | :-- |
| `src/styles/index.css`, `tailwind.config.js` | Colour tokens (Day / Night / Sunlight), script-aware typography, type scale |
| `src/ui/` | Primitives — Button, Sheet, Surface, Chip, Segmented, Field, Photo, AnimatedNumber, JourneyThread, ListenButton, SplitText, motion tokens |
| `src/components/shell/` | Side rail, top bar, mobile dock, animated route transitions, language & comfort sheets, command palette |
| `src/utils/audioSpeech.ts`, `src/lib/voice/` | Natural-voice engine (best-voice ranking, speech-friendly text, sentence chunking, optional neural cloud voice) |
| `src/data/ux/` | Namespaced interface strings — English source + 12 regional files |
| `public/people/` | Photography (Unsplash License) with credits |

## Tech stack

React 18 · TypeScript · Vite (PWA) · Tailwind CSS · Framer Motion · Phosphor Icons · Zustand · Supabase (PostgreSQL + row-level security, optional — guest mode keeps everything on the device) · Vitest.

## Quick start

### 1. Local Development
```bash
git clone https://github.com/vachan18/Sahayak.git
cd Sahayak
npm install
cp .env.example .env
```
Configure `.env` (optional — leaves guest/offline mode active if omitted):
```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_STORAGE_BUCKET=user-documents
```
Run locally:
```bash
npm run dev      # Start Vite dev server (http://localhost:3000)
npm test         # Run 133 Vitest unit/integration tests
npm run build    # Typecheck (tsc -b) + Vite production build -> dist/
npm run preview  # Preview production build
```

### 2. Supabase 1-Click Schema Setup
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) ➔ **SQL Editor**.
2. Run [`supabase/full_schema_setup.sql`](supabase/full_schema_setup.sql) to provision all tables, RLS policies, idempotency RPCs, storage bucket, and seeded schemes.

### 3. Production Hosting (Vercel + GitHub Actions CI)
- **SPA Routing:** [`vercel.json`](vercel.json) handles `BrowserRouter` rewrites (`/(.*)` ➔ `/index.html`) and immutable asset caching.
- **CI Pipeline:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `npm ci`, `npm test`, and `npm run build` on every push/PR to `main`.

---


## Documentation

- **[Project Map & Issue Hierarchy Matrix](documentation/SAHAYAK_PROJECT_MAP.md)** — Full Epic/Sub-Issue graph (#1–#24) and commit milestones.
- **Phase 1 (`docs/`):** [Problem Definition](docs/01-problem-definition-and-research.md) • [Personas](docs/02-target-personas-and-pain-points.md) • [Service Blueprint](docs/03-user-journeys-and-service-blueprint.md) • [Objectives](docs/04-product-objectives-and-core-features.md) • [IA](docs/05-information-architecture-and-navigation.md) • [MVP Scope](docs/06-mvp-scope-and-roadmap.md) • [UX Metrics](docs/07-ux-success-criteria-and-metrics.md)
- **Phase 2–3 (`documentation/phase-2/`, `phase-3/`):** Citizen Journeys, 15 Screen Specs, Sovereign Color System, 1.75x Indic Typography, Design Tokens (`design-tokens.json`), GIGW 3.0 / WCAG AA Accessibility.
- **Phase 4–5 (`documentation/phase-4/`, `phase-5/`):** Frontend Architecture, 5-State Eligibility Hardening, Supabase Schema & RLS Security, SHA-256 Idempotency.
- **Phase 6 (`documentation/phase-6.1/` – `phase-6.8/`):** Voice Cockpit, Scheme Catalog, *Bolo Aur Jano*, Passbook Visual Guide, 4-Stage Tracker, High-Contrast Mode, Indic Parity, and Responsive Overflow Audits.

---

**Crafted for PixelCraft 2026 (Track DS-02) by [vachan18](https://github.com/vachan18) and [Muddassir](https://github.com/Muddassir7504)**
