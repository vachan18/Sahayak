# SAHAYAK — Phase 6.3 UX & Product Design Report
## Sovereign Scheme Discovery & Citizen Details Experience

**Role**: Senior Product Designer & React Engineer  
**Phase**: 6.3 — Scheme Discovery & Details Experience  
**Date**: November 2026  
**Audience**: Product Leadership, Engineering, Civic Tech Stakeholders  

---

### 1. UX Design Philosophy: Sovereign Citizen Transparency

In traditional citizen portals, welfare schemes are obscured behind dense administrative jargon, convoluted ministry departments, and fragmented PDFs. Citizens frequently fall victim to unaccredited middlemen charging illegitimate "application fees".

Phase 6.3 establishes the **Sovereign Citizen Transparency Framework**:
1. **Human Need Over Department Silos**: Schemes are organized by citizen life events (Farming, Healthcare, Maternity, Education, Micro-Credit, Housing).
2. **Statutory Fee Transparency**: Every card, hero box, and detail screen prominently communicates the official **₹0.00 government application fee** to eliminate middleman extortion.
3. **Plain-Language Entitlements**: Financial benefits are presented with large tabular numerals, clear frequency terms, and the exact DBT/cashless mechanism (e.g. *Direct Bank Transfer to NPCI Aadhaar-seeded account*).
4. **Dual Application Paths**: Recognizing India's digital-physical divide, citizens are given distinct, transparent workflows for **Self-Service Online** vs **Assisted CSC / Grama One**.

---

### 2. Scheme Discovery Directory Experience

#### 2.1 Multi-Dimensional Filtering Without Cognitive Overload
- **Primary Axis — Life Event Rail**: A horizontal scrolling rail allows one-tap switching between core life domains. Visual iconography (`Wheat`, `HeartPulse`, `Users`, `GraduationCap`, `Store`, `Home`) ensures instant recognition across languages.
- **Secondary Axis — Multi-Dropdown Control**:
  - *Jurisdiction*: Filters Central Sector (GoI) vs State (Karnataka).
  - *Beneficiary Type*: Tailored for Farmers, Women, Students, Street Vendors, and Senior Citizens.
  - *Benefit Type*: Distinguishes DBT Cash, Hospital Cover, Subsidized Credit, and Scholarships.
  - *Sorting Engine*: Empowers citizens to sort by **Recommended**, **Highest Benefit Amount**, or **Fastest Approval (SLA)**.
- **Immediate Transparency**:
  - Applied filters appear as individual dismissed badges (`X`).
  - Active filter counter badge informs the user of all active constraints.
  - One-click "Reset All Filters" button immediately restores the unconstrained directory.

#### 2.2 Engaging Empty States with Recovery Pathways
When search queries or filter combinations yield zero results, the user is never left stranded:
- Clear explanatory copy ("No schemes match your exact filter combination").
- Clickable suggestion chips for popular programs ("Kisan", "Ayushman", "Maternity", "Scholarship", "Street Vendor") that immediately repopulate the directory.
- Prominent primary action to reset all filters in a single tap.

---

### 3. SchemeCard Ergonomics

| Element | UX Rationale | Mobile Execution |
|---|---|---|
| **Life Event & Ministry Pills** | Establishes domain authority immediately | Badges wrap gracefully with `min-w-0` and text truncation |
| **Gazette Verified Badge** | Builds trust with sovereign visual cues (`ShieldCheck`) | High-contrast emerald badge (`bg-emerald-100`) |
| **Interactive Save Bookmark** | Allows citizens to curate their personal shortlist | 44×44px tactile tap target with instant visual toggle |
| **Benefit Hero Box** | Financial benefits must be scannable in under 2 seconds | High-contrast emerald box with tabular numerals and audio listen button |
| **Key Eligibility Summary** | Eliminates reading through complex legal clauses | 2-line summary with checkmark icon |
| **Document Preview Badges** | Prevents application drop-off by warning about required papers early | Compact badges highlighting DigiLocker availability |
| **48px Dual CTAs** | Distinguishes preliminary evaluation from deep reading | High-contrast Navy primary CTA + neutral Details button |

---

### 4. Scheme Detail Dossier: The Statutory Blueprint

The detail view (`/schemes/:id`) is designed as an exhaustive statutory dossier:
1. **Breadcrumbs & Social Sharing**:
   - Native Web Share API integration allows sharing schemes directly with family members via WhatsApp or SMS, with an automatic fallback copy toast.
2. **Audio Narration (`AudioListenButton`)**:
   - Synthesizes scheme title, benefits, SLA, and fee into a clean, spoken briefing for citizens with low literacy.
3. **Side-by-Side Eligibility vs Exclusions**:
   - Uses positive emerald styling for "Who Can Apply" alongside cautionary rose styling for "Who Cannot Apply / Exclusions" to prevent unqualified applications.
4. **Actionable Document Checklist**:
   - Clear indicators for file formats (PDF, JPEG), max sizes, and DigiLocker instant retrieval.
   - Direct link to inspect annotated samples of acceptable vs rejected documents.
5. **Dual Application Guidance**:
   - Step-by-step instructions for Self-Service online portal applications.
   - Assisted Grama One / CSC protocol with official notice capping operator fees at ₹15-₹30 and confirming ₹0 government charges.
6. **Citizens' Charter SLA Guarantee**:
   - Statutory timeline guarantee highlighting the responsible Tehsildar / District Officer and providing statutory CPGRAMS / Sakala grievance escalation rights.
7. **Mobile Sticky Action Dock**:
   - Elevated fixed bottom bar dynamically offset above the bottom navigation bar (`calc(4rem + env(safe-area-inset-bottom, 0px))`).
   - Ensures thumb-zone access to "Check Eligibility" and "Apply Now" from anywhere on the page without blocking page content.

---

### 5. Multi-Lingual & Indic Typography Handling

- **Text Expansion Accommodation**: Kannada, Hindi, and Bengali translations require 20% to 35% more horizontal width than English. The layout accommodates this via fluid `min-w-0`, responsive wrapping, and flexible container cards without rigid fixed-pixel widths.
- **Tabular Numerals**: All currency figures use `tabular-nums` to guarantee aligned decimal scanning across devices and regional number scripts.
- **Zero Horizontal Overflow**: Verified across all 6 target viewports down to 360px viewport width.
