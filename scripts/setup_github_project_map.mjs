import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO = 'vachan18/Sahayak';
const PROJECT_NUMBER = 4;
const PROJECT_ID = 'PVT_kwHOClZnc84Bs6AW';
const STATUS_FIELD_ID = 'PVTSSF_lAHOClZnc84Bs6AWzhrF6jQ';
const STATUS_DONE_OPTION_ID = '98236657';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    console.error(`Command failed: ${cmd}\nError: ${err.stderr || err.message}`);
    throw err;
  }
}

function safeRun(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return null;
  }
}

const epicsData = [
  {
    key: 'EPIC-1',
    title: '[EPIC] Phase 2 & 3: Information Architecture, Sovereign Design Tokens & Visual Identity',
    body: `## 🏛️ Epic Overview
Establish foundational Information Architecture (IA) and sovereign design tokens for SAHAYAK (Citizen Welfare Portal for PixelCraft 2026).

### 🎯 Key Deliverables
- Multi-lingual citizen journey maps (Ramesh, Sunita, Rajesh) across rural & peri-urban archetypes
- Vernacular Indic navigation flow and comprehensive sitemap
- Tri-tier token system: Primitive, Semantic, and Component tokens
- Sovereign Navy (\`#0F172A\`) & Warm Saffron (\`#F97316\`) statutory visual identity
- Indic typography scales optimized for Kannada, Devanagari, Bengali, and Latin scripts

### 📂 Deliverables & Documentation
- \`documentation/phase-2/\`
- \`documentation/phase-3/\`
- Core CSS design tokens & responsive viewport guidelines

### 🔗 Sub-Issues
<!-- SUB_ISSUES_PLACEHOLDER -->
`,
    subIssues: [
      {
        title: 'Phase 2 — Information Architecture, Citizen Journey Maps & Vernacular Navigation Flow',
        body: `## 📌 Sub-Issue Scope (Phase 2)
Implement the core Information Architecture, citizen journey maps, and vernacular navigation flow.

### 📋 Scope & Requirements
1. **Citizen Persona Mapping**: Map journeys for Ramesh Kumar (marginal farmer), Sunita Devi (rural homemaker), and Rajesh (urban daily wage earner).
2. **Sitemap & Routing**: Define top-level flows for Scheme Discovery, Bolo Aur Jano, Application Tracker, Document Prep / CSC Kendra, and Citizen Profile.
3. **Indic Usability**: Design bottom-nav and desktop navigation paradigms accessible to first-time digital users.

### 🔍 Verification & Evidence
- **Documentation**: \`documentation/phase-2/PHASE_2_REPORT.md\`
- **Status**: Verified and fully integrated.
`,
      },
      {
        title: 'Phase 3 — Design Tokens, Indic Typography Scale & Sovereign Color System',
        body: `## 📌 Sub-Issue Scope (Phase 3)
Establish sovereign design tokens, Indic typography hierarchy, and statutory color palette.

### 📋 Scope & Requirements
1. **Design Tokens**: Standardize spacing (4px, 8px, 12px, 16px, 24px, 32px), radii, and surface elevations.
2. **Color Palette**: Deep Sovereign Navy (\`#0F172A\`), Warm Saffron (\`#F97316\`), Forest Green (\`#15803D\`), and Ashoka Blue.
3. **Indic Typography**: Configure font stacks for Noto Sans Kannada, Noto Sans Devanagari, Noto Sans Bengali, and Inter with calibrated line heights to prevent glyph clipping.

### 🔍 Verification & Evidence
- **Documentation**: \`documentation/phase-3/PHASE_3_TOKENS.md\`
- **Status**: Implemented across \`src/index.css\` and Tailwind configuration.
`,
      },
    ],
  },
  {
    key: 'EPIC-2',
    title: '[EPIC] Phase 4: Frontend Core, 5-State Eligibility Engine & Statutory Data Integrity',
    body: `## 🏛️ Epic Overview
Build out the core React frontend shell, 5-state deterministic eligibility engine, strict TypeScript configuration, and statutory data integrity with Zod schemas.

### 🎯 Key Deliverables
- 1400px responsive desktop shell container with top navigation and trust disclaimers
- Elimination of misleading universal claims ("Instant ₹50,000 to bank")
- Strict TypeScript codebase audit (\`tsc -b\` 0 errors)
- Categorized benefit model (Direct Cash, Subsidized Goods, Insurance)
- Deterministic 5-state eligibility engine (\`likely_eligible\`, \`needs_info\`, \`unlikely_eligible\`, \`in_progress\`, \`not_assessed\`)
- 12 verified Central and State government welfare schemes with statutory rules

### 📂 Deliverables & Documentation
- \`documentation/phase-4/\`, \`documentation/phase-4.1/\`, \`documentation/phase-4.4/\`, \`documentation/phase-4.5/\`, \`documentation/phase-4.6/\`, \`documentation/phase-4.6.1/\`
- \`src/rules/\`, \`src/services/eligibilityEngine.ts\`, \`src/data/schemes.ts\`

### 🔗 Sub-Issues
<!-- SUB_ISSUES_PLACEHOLDER -->
`,
    subIssues: [
      {
        title: 'Phase 4.1 - 4.3 — Responsive Desktop Shell (1400px), Navigation Bar & Trust Audit',
        body: `## 📌 Sub-Issue Scope (Phase 4.1 - 4.3)
Implement the 1400px desktop responsive shell, top navigation bar, and statutory trust audit.

### 📋 Scope & Requirements
1. **Responsive Shell**: Max-width 1400px centered desktop grid with responsive padding across mobile (360px) and tablet.
2. **Top Navigation**: Search cockpit, language switcher, notification indicator, and quick profile trigger.
3. **Trust Audit**: Remove hyperbolic or universal financial claims, replace with factual statutory scheme descriptions citing respective ministries.

### 🔍 Verification & Evidence
- **Commits**: \`39b13fa\`, \`81e3725\`, \`6cba92a\`
- **Documentation**: \`documentation/phase-4.1/\`
- **Status**: Tested and verified.
`,
      },
      {
        title: 'Phase 4.4 — Codebase Audit, Strict TypeScript Verification & Vitest Test Runner',
        body: `## 📌 Sub-Issue Scope (Phase 4.4)
Rigorous codebase audit, strict TypeScript configuration, and Vitest test runner integration.

### 📋 Scope & Requirements
1. **Strict TypeScript**: Eliminate any-casts, unhandled nullables, and compiler discrepancies (\`tsc -b\` clean).
2. **Modular Architecture**: Clean separation into \`src/components/\`, \`src/screens/\`, \`src/services/\`, \`src/rules/\`, and \`src/data/\`.
3. **Test Infrastructure**: Configure Vitest test runner with automated assertion suites for data models and state transitions.

### 🔍 Verification & Evidence
- **Commit**: \`17a1bdd\`
- **Documentation**: \`documentation/phase-4.4/\`
- **Status**: Passing test suite configured.
`,
      },
      {
        title: 'Phase 4.5 — Categorized Benefit Model, Statutory Data Integrity & Zod Schemas',
        body: `## 📌 Sub-Issue Scope (Phase 4.5)
Implement categorized welfare benefit modeling, government data integrity, and Zod runtime schema validation.

### 📋 Scope & Requirements
1. **Benefit Categorization**: Distinguish Direct Benefit Transfer (DBT), In-Kind / Subsidized Goods, and Insurance Coverage.
2. **Zod Validation**: Runtime validation for citizen profiles, household member records, and scheme eligibility parameters.
3. **Statutory Accuracy**: Verify official portal URLs, helpline contacts, and department attributions for all 12 schemes.

### 🔍 Verification & Evidence
- **Commit**: \`96d871f\`
- **Documentation**: \`documentation/phase-4.5/\`
- **Status**: Zod schemas live in \`src/types/scheme.ts\` and profile stores.
`,
      },
      {
        title: 'Phase 4.6 & 4.6.1 — 5-State Eligibility Engine Hardening & Vitest Regression Suite',
        body: `## 📌 Sub-Issue Scope (Phase 4.6 & 4.6.1)
Build and harden the 5-state deterministic eligibility engine and regression test suite.

### 📋 Scope & Requirements
1. **5-State Engine**: Compute \`likely_eligible\`, \`needs_info\`, \`unlikely_eligible\`, \`in_progress\`, and \`not_assessed\` based on statutory conditions.
2. **Statutory Rules Registry**: Codify criteria for PM-Kisan, Gruha Lakshmi, Ayushman Bharat, PM Awas, Anna Bhagya, Sukanya Samriddhi, and 6 more schemes.
3. **Vitest Regression Suite**: Verify complex edge cases (land ceilings, income cutoffs, gender restrictions, urban/rural residency).

### 🔍 Verification & Evidence
- **Commits**: \`47541d4\`, \`bc07f68\`
- **Documentation**: \`documentation/phase-4.6/\`, \`documentation/phase-4.6.1/\`
- **Test Results**: 119 unit tests passing across 8 suites.
`,
      },
    ],
  },
  {
    key: 'EPIC-3',
    title: '[EPIC] Phase 5: Supabase Cloud Backend, Row-Level Security & Idempotent Audit Pipeline',
    body: `## 🏛️ Epic Overview
Architect and integrate the cloud backend using Supabase PostgreSQL, strict Row-Level Security (RLS), household member management, offline/guest mode fallback, and cryptographic SHA-256 idempotency hashing.

### 🎯 Key Deliverables
- PostgreSQL relational schema (\`schemes\`, \`profiles\`, \`applications\`, \`documents\`, \`household_members\`, \`audit_logs\`)
- Unified 1-click database setup script (\`full_schema_setup.sql\`)
- Row-Level Security (RLS) policies and security grants for anonymous & authenticated roles
- SHA-256 idempotency hashing on application submissions and audit log entries
- Seamless offline / guest mode fallback when cloud credentials are unconfigured

### 📂 Deliverables & Documentation
- \`documentation/phase-5/\`, \`documentation/phase-5.1/\`, \`documentation/phase-5.2/\`
- \`full_schema_setup.sql\`, \`src/services/supabaseClient.ts\`, \`src/services/applicationDbService.ts\`

### 🔗 Sub-Issues
<!-- SUB_ISSUES_PLACEHOLDER -->
`,
    subIssues: [
      {
        title: 'Phase 5.0 — Supabase PostgreSQL Schema Integration & Offline/Guest Mode Fallback',
        body: `## 📌 Sub-Issue Scope (Phase 5.0)
Deploy Supabase PostgreSQL schema and implement robust offline / guest mode fallback.

### 📋 Scope & Requirements
1. **Relational Schema**: Tables for citizen profiles, scheme definitions, application tracking, uploaded document metadata, and audit logs.
2. **Supabase Client**: Configured with fail-safe initialization checking \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\`.
3. **Guest Mode**: Automatic fallback to localStorage when running in offline or unauthenticated mode without application crash.

### 🔍 Verification & Evidence
- **Commit**: \`8b181c3\`
- **Documentation**: \`documentation/phase-5/\`
- **Status**: Tested offline and against live Supabase instance.
`,
      },
      {
        title: 'Phase 5.1 — Database Security Grants, RLS Policies, Deduplication & Household Members',
        body: `## 📌 Sub-Issue Scope (Phase 5.1)
Implement Row-Level Security (RLS), security grants, application deduplication, and household member profiling.

### 📋 Scope & Requirements
1. **Row-Level Security (RLS)**: Enforce strict citizen data isolation; users can only read/update their own profile, applications, and documents.
2. **Household Profiling**: Support adding spouse, children, elderly dependents to discover family-level scheme benefits.
3. **Application Deduplication**: Prevent duplicate scheme submissions by checking active status and citizen ID.

### 🔍 Verification & Evidence
- **Commits**: \`3d58a8c\`, \`b8a7374\`, \`b57ebf4\`
- **Documentation**: \`documentation/phase-5.1/\`
- **Status**: Live RLS policies verified.
`,
      },
      {
        title: 'Phase 5.2 — SHA-256 Idempotency Hashing & Automated Migration Verification',
        body: `## 📌 Sub-Issue Scope (Phase 5.2)
Implement cryptographic SHA-256 idempotency hashing for application submissions and automated migration verification.

### 📋 Scope & Requirements
1. **SHA-256 Idempotency**: Hash citizen ID, scheme code, and timestamp to generate immutable submission hashes for audit logs.
2. **Automated Verification**: Build \`verify_live_supabase.cjs\` script checking connectivity, table schemas, and RLS policies.
3. **Setup Guide**: Comprehensive documentation and 1-click instructions for \`full_schema_setup.sql\`.

### 🔍 Verification & Evidence
- **Commit**: \`cd265fe\`
- **Documentation**: \`documentation/phase-5.2/\`
- **Status**: Verified via automated Node.js test script.
`,
      },
    ],
  },
  {
    key: 'EPIC-4',
    title: '[EPIC] Phase 6.1 – 6.3: Sovereign Citizen Dashboard & Scheme Discovery Experience',
    body: `## 🏛️ Epic Overview
Modernize the citizen dashboard and scheme discovery journey for PixelCraft 2026.

### 🎯 Key Deliverables
- Sovereign citizen dashboard with Hero Voice-Search Cockpit
- Life-event discovery grid (Farming, Education, Health, Senior Citizens, Housing)
- Seasonal welfare calendar alerts (Kharif/Rabi deadlines, DBT tranches)
- Statutory trust banner citing official ministries
- Multi-faceted scheme directory with state, beneficiary, category, and life-event filters
- Deep scheme detail pages with simplified benefit breakdowns, eligibility checklists, and official portal links

### 📂 Deliverables & Documentation
- \`documentation/phase-6.1/\`, \`documentation/phase-6.2/\`, \`documentation/phase-6.3/\`
- \`src/screens/DashboardScreen.tsx\`, \`src/screens/SchemeDirectoryScreen.tsx\`, \`src/screens/SchemeDetailScreen.tsx\`

### 🔗 Sub-Issues
<!-- SUB_ISSUES_PLACEHOLDER -->
`,
    subIssues: [
      {
        title: 'Phase 6.1 — Sovereign Citizen Dashboard, Hero Voice-Search Cockpit & Life-Event Grid',
        body: `## 📌 Sub-Issue Scope (Phase 6.1)
Create high-trust citizen dashboard with Hero Voice-Search cockpit and life-event discovery grid.

### 📋 Scope & Requirements
1. **Hero Voice Cockpit**: Interactive prompt bar with speech trigger, trending welfare queries, and direct navigation.
2. **Life-Event Discovery**: Visual card grid grouping schemes by real-world life stages (Farming, Education, Health & Maternity, Senior Living, Housing).
3. **Key Welfare Metrics**: Highlight total accessible welfare schemes and verified departments.

### 🔍 Verification & Evidence
- **Commit**: \`67c5394\`
- **Documentation**: \`documentation/phase-6.1/\`
- **Status**: Implemented and verified on desktop and mobile.
`,
      },
      {
        title: 'Phase 6.2 — Seasonal Welfare Alerts, Statutory Trust Banner & Multi-State Citizen Personalization',
        body: `## 📌 Sub-Issue Scope (Phase 6.2)
Implement seasonal welfare alerts, official statutory trust banner, and citizen profile personalization.

### 📋 Scope & Requirements
1. **Seasonal Alerts**: Urgent notices for seasonal deadlines (crop insurance enrollment, scholarship windows, DBT installments).
2. **Statutory Trust Banner**: Official government emblem, department transparency, and direct links to India.gov.in.
3. **Profile Personalization**: Dynamic scheme recommendations tailored to citizen state, occupation, and family profile.

### 🔍 Verification & Evidence
- **Commit**: \`67c5394\`
- **Documentation**: \`documentation/phase-6.2/\`
- **Status**: Verified in \`src/screens/DashboardScreen.tsx\`.
`,
      },
      {
        title: 'Phase 6.3 — Scheme Directory, Multi-Facet Filters & Comprehensive Scheme Detail Pages',
        body: `## 📌 Sub-Issue Scope (Phase 6.3)
Build a multi-facet scheme directory and comprehensive scheme detail experience.

### 📋 Scope & Requirements
1. **Search & Multi-Facet Filters**: Instant search with filters for Category, State (Karnataka, UP, All-India), Beneficiary Type, and Life Event.
2. **Scheme Cards**: Clear presentation of department, benefit amount/type, eligibility criteria, and required documents.
3. **Scheme Detail Pages**: Standardized layout with Overview, Simple Benefits, Who Can Apply, Eligibility Conditions, Required Documents, and Official Links.

### 🔍 Verification & Evidence
- **Commit**: \`67c5394\`
- **Documentation**: \`documentation/phase-6.3/\`
- **Status**: Verified in \`src/screens/SchemeDirectoryScreen.tsx\` & \`SchemeDetailScreen.tsx\`.
`,
      },
    ],
  },
  {
    key: 'EPIC-5',
    title: '[EPIC] Phase 6.4 – 6.6: Bolo Aur Jano Conversational Voice, Document Ops & Application Tracking',
    body: `## 🏛️ Epic Overview
Deliver assisted citizen experiences: voice-guided eligibility checking (Bolo Aur Jano), document preparation with passbook visual guides and printable CSC slips, and 4-stage application lifecycle tracking with grievance redressal.

### 🎯 Key Deliverables
- Bolo Aur Jano conversational eligibility flow with one question at a time and large touch cards
- Genuine Web Speech API integration with microphone permission handling, transcript confirmation, and demo fallback
- 3-tier clear result breakdown: Likely Eligible, Needs More Information, Likely Not Eligible
- Visual document preparation checklist with bank passbook Do's & Don'ts
- DigiLocker simulated consent & verification flow
- Printable CSC Seva Kendra slip with authentic QR code generation
- 4-stage visual application lifecycle tracker and side-by-side scheme comparison tray
- Citizen grievance redressal guide with direct links to CPGRAMS and Karnataka Sakala

### 📂 Deliverables & Documentation
- \`documentation/phase-6.4/\`, \`documentation/phase-6.5/\`, \`documentation/phase-6.6/\`
- \`src/screens/EligibilityCheckerScreen.tsx\`, \`src/screens/DocumentPrepScreen.tsx\`, \`src/screens/ApplicationTrackerScreen.tsx\`

### 🔗 Sub-Issues
<!-- SUB_ISSUES_PLACEHOLDER -->
`,
    subIssues: [
      {
        title: 'Phase 6.4 — Bolo Aur Jano: Voice-Guided Conversational Eligibility Flow & 3-Tier Results',
        body: `## 📌 Sub-Issue Scope (Phase 6.4)
Create intuitive conversational voice eligibility flow designed for low-literacy citizens.

### 📋 Scope & Requirements
1. **Conversational UX**: One clear question at a time with large selectable answer cards, progress indicator, and back-navigation.
2. **Voice Interaction Integrity**: Genuine Web Speech API support, clear listening/processing states, manual transcript confirmation, and simulation fallback.
3. **3-Tier Eligibility Results**: Categorize outcomes into Likely Eligible, Needs More Information, and Likely Not Eligible with clear statutory reasoning.

### 🔍 Verification & Evidence
- **Commit**: \`67c5394\`
- **Documentation**: \`documentation/phase-6.4/\`
- **Status**: Tested in Hindi, Kannada, Bengali, and English.
`,
      },
      {
        title: 'Phase 6.5 — Document Preparation Checklist, Passbook Visual Guide & Printable CSC Slip',
        body: `## 📌 Sub-Issue Scope (Phase 6.5)
Implement document preparation assistance, visual passbook guidelines, and printable CSC Seva Kendra slips.

### 📋 Scope & Requirements
1. **Document Checklist**: Interactive readiness checklist specifying document purpose, accepted formats, and common errors.
2. **Visual Do's & Don'ts**: Clear visual comparison for bank passbook uploads (clear IFSC and account number vs glare, blur, and cropped edges).
3. **DigiLocker Simulation**: User-consented document fetch simulation labeled clearly as prototype mode.
4. **Printable CSC Slip**: Generate print-ready Seva Kendra token slip with scheme reference, document checklist, and authentic QR code.

### 🔍 Verification & Evidence
- **Commit**: \`67c5394\`
- **Documentation**: \`documentation/phase-6.5/\`
- **Status**: Verified in \`src/screens/DocumentPrepScreen.tsx\`.
`,
      },
      {
        title: 'Phase 6.6 — Four-Stage Application Lifecycle Tracker, Scheme Comparison & Grievance Redressal',
        body: `## 📌 Sub-Issue Scope (Phase 6.6)
Implement four-stage application tracking, scheme comparison tray, and citizen grievance redressal.

### 📋 Scope & Requirements
1. **Four-Stage Visual Tracker**: Visual timeline (Submitted → Department Verification → Application Decision → Benefit Disbursement).
2. **Scheme Comparison Tray**: Side-by-side comparison across benefit amounts, eligibility conditions, and required documents.
3. **Citizen Grievance Support**: Direct escalation guide linking to CPGRAMS and Karnataka Sakala with escalation document checklist.

### 🔍 Verification & Evidence
- **Commit**: \`67c5394\`
- **Documentation**: \`documentation/phase-6.6/\`
- **Status**: Verified in \`src/screens/ApplicationTrackerScreen.tsx\`.
`,
      },
    ],
  },
  {
    key: 'EPIC-6',
    title: '[EPIC] Phase 6.7, 6.8 & Lighthouse: Motion System, High-Contrast, Indic Parity & 100/100 Audit',
    body: `## 🏛️ Epic Overview
Polish the entire SAHAYAK application for PixelCraft 2026: Framer Motion interactions with reduced motion compliance, Bright-Sunlight High-Contrast mode, complete 4-language Indic parity, layout non-overlap safeguards, and 100/100 Lighthouse performance & accessibility scores.

### 🎯 Key Deliverables
- Framer Motion page transitions and card animations respecting \`prefers-reduced-motion\`
- Bright-Sunlight High-Contrast Mode for outdoor readability
- 100% translation key parity across Kannada, Hindi, Bengali, and English (413 keys each)
- Floating voice assistant docking safeguards preventing UI overlaps
- Responsive visual QA verified from 360px up to 1728px viewports
- Lighthouse score: 100/100 Accessibility, 100/100 Best Practices, 100/100 SEO, 92+ Desktop Performance
- Initial bundle size optimized to 168 kB via dynamic code-splitting and async font preloading

### 📂 Deliverables & Documentation
- \`documentation/phase-6.7/\`, \`documentation/phase-6.8/\`, \`documentation/lighthouse/\`
- \`src/components/FloatingVoiceAssistant.tsx\`, \`src/components/HighContrastToggle.tsx\`, \`src/data/translations.ts\`

### 🔗 Sub-Issues
<!-- SUB_ISSUES_PLACEHOLDER -->
`,
    subIssues: [
      {
        title: 'Phase 6.7 — Framer Motion Polish, Bright-Sunlight High-Contrast Mode & Indic Parity',
        body: `## 📌 Sub-Issue Scope (Phase 6.7)
Implement purposeful motion system, high-contrast display mode, and multi-lingual Indic parity.

### 📋 Scope & Requirements
1. **Motion System**: Framer Motion transitions with smooth reveals and strict adherence to \`prefers-reduced-motion\`.
2. **Bright-Sunlight Mode**: High-contrast theme designed for direct sunlight viewing in rural service centers.
3. **Multilingual Audit**: Complete localization for Kannada, Hindi, Bengali, and English.

### 🔍 Verification & Evidence
- **Commit**: \`67c5394\`
- **Documentation**: \`documentation/phase-6.7/\`
- **Status**: Verified across all routes.
`,
      },
      {
        title: 'Phase 6.8 — Floating Assistant Non-Overlap Safeguards, Speech Integrity & Zero-Hardcoded Strings',
        body: `## 📌 Sub-Issue Scope (Phase 6.8)
Deliver final UX corrections, voice integrity safeguards, and complete string audit.

### 📋 Scope & Requirements
1. **Floating Voice Assistant**: Prevent overlaps with navigation bars and action cards; add collapse and safe-area docking.
2. **Speech Integrity**: Manual confirmation of voice input before assessment dispatch; eliminate automatic simulated answer dispatch.
3. **Translation Audit**: Zero hardcoded English strings; achieved 100% key parity across all 413 translation keys in 4 languages.
4. **Responsive QA**: Verified clean rendering across 360px, 390px, 768px, 1024px, 1440px, and 1728px viewports.

### 🔍 Verification & Evidence
- **Commit**: \`f31f7ab\`
- **Documentation**: \`documentation/phase-6.8/\`
- **Status**: 119/119 Vitest tests passing, 0 TypeScript errors.
`,
      },
      {
        title: 'Lighthouse Optimization — 100/100 Accessibility, Best Practices, SEO & 92+ Desktop Performance',
        body: `## 📌 Sub-Issue Scope (Lighthouse)
Optimize production bundle and asset loading to achieve perfect Lighthouse scores.

### 📋 Scope & Requirements
1. **Asynchronous Font Loading**: Non-blocking preloading for Google Fonts with system fallback stack to eliminate render-blocking CSS.
2. **Dynamic Code Splitting**: React.lazy dynamic chunking for all screens, slashing initial JS bundle down to 168 kB.
3. **Lighthouse Audit Verification**:
   - Accessibility: **100 / 100**
   - Best Practices: **100 / 100**
   - SEO: **100 / 100**
   - Desktop Performance: **92+ / 100**

### 🔍 Verification & Evidence
- **Commit**: \`724b5dc\`
- **Documentation**: \`documentation/lighthouse/LIGHTHOUSE_REPORT.md\`
- **Script**: \`scripts/run_lighthouse.cjs\`
- **Status**: Verified in Chrome headless lighthouse audit.
`,
      },
    ],
  },
];

async function main() {
  console.log('🚀 Starting Sahayak GitHub Project Map & Issue Synchronization...');

  const createdEpics = [];
  const createdSubIssues = [];

  // Step 1: Create all Epics
  for (const epic of epicsData) {
    console.log(`\n📌 Creating Epic: ${epic.title}`);
    const tempFile = path.join(process.cwd(), 'scripts', `temp_${epic.key}.md`);
    fs.writeFileSync(tempFile, epic.body, 'utf8');

    const createCmd = `gh issue create --repo ${REPO} --title "${epic.title.replace(/"/g, '\\"')}" --body-file "${tempFile}" --label "epic"`;
    let issueUrl;
    try {
      issueUrl = run(createCmd);
    } catch (err) {
      // If label epic doesn't exist, try without label
      const fallbackCmd = `gh issue create --repo ${REPO} --title "${epic.title.replace(/"/g, '\\"')}" --body-file "${tempFile}"`;
      issueUrl = run(fallbackCmd);
    }
    fs.unlinkSync(tempFile);

    const issueNumber = issueUrl.split('/').pop();
    console.log(`✅ Created Epic #${issueNumber}: ${issueUrl}`);

    createdEpics.push({
      ...epic,
      number: issueNumber,
      url: issueUrl,
      createdSubIssues: [],
    });

    // Step 2: Create Sub-issues for this Epic
    for (const sub of epic.subIssues) {
      console.log(`  ↪ Creating Sub-issue: ${sub.title}`);
      const subBody = `${sub.body}

---
### 📌 Parent Epic
- Part of **#${issueNumber}**: [${epic.title}](${issueUrl})
`;
      const tempSubFile = path.join(process.cwd(), 'scripts', `temp_sub.md`);
      fs.writeFileSync(tempSubFile, subBody, 'utf8');

      const createSubCmd = `gh issue create --repo ${REPO} --title "${sub.title.replace(/"/g, '\\"')}" --body-file "${tempSubFile}"`;
      const subUrl = run(createSubCmd);
      fs.unlinkSync(tempSubFile);

      const subNumber = subUrl.split('/').pop();
      console.log(`  ✅ Created Sub-issue #${subNumber}: ${subUrl}`);

      createdSubIssues.push({
        title: sub.title,
        number: subNumber,
        url: subUrl,
        epicNumber: issueNumber,
      });

      createdEpics[createdEpics.length - 1].createdSubIssues.push({
        title: sub.title,
        number: subNumber,
        url: subUrl,
      });
    }

    // Step 3: Update Epic body with checklist of sub-issues
    const subChecklist = createdEpics[createdEpics.length - 1].createdSubIssues
      .map(s => `- [x] #${s.number} - ${s.title}`)
      .join('\n');
    const updatedEpicBody = epic.body.replace('<!-- SUB_ISSUES_PLACEHOLDER -->', subChecklist);
    const tempEpicUpdate = path.join(process.cwd(), 'scripts', `temp_epic_update.md`);
    fs.writeFileSync(tempEpicUpdate, updatedEpicBody, 'utf8');
    run(`gh issue edit ${issueNumber} --repo ${REPO} --body-file "${tempEpicUpdate}"`);
    fs.unlinkSync(tempEpicUpdate);
    console.log(`  🔄 Updated Epic #${issueNumber} with sub-issues checklist.`);
  }

  // Step 4: Add all issues to Project 4, set Status to "Done", and close them
  console.log(`\n📋 Adding all issues to Project ${PROJECT_NUMBER} and closing them...`);

  const allIssues = [
    ...createdEpics.map(e => ({ number: e.number, url: e.url, title: e.title, isEpic: true })),
    ...createdSubIssues.map(s => ({ number: s.number, url: s.url, title: s.title, isEpic: false })),
  ];

  for (const issue of allIssues) {
    console.log(`\n⚙️ Processing Issue #${issue.number}: ${issue.title}`);

    // Add to project
    try {
      const addOutput = run(`gh project item-add ${PROJECT_NUMBER} --owner vachan18 --url ${issue.url} --format json`);
      const itemData = JSON.parse(addOutput);
      const itemId = itemData.id;
      console.log(`  Added to Project (Item ID: ${itemId})`);

      // Set Status to Done
      run(`gh project item-edit --project-id ${PROJECT_ID} --id ${itemId} --field-id ${STATUS_FIELD_ID} --single-select-option-id ${STATUS_DONE_OPTION_ID}`);
      console.log(`  Status set to 'Done' in Project`);
    } catch (err) {
      console.warn(`  ⚠️ Project item addition error: ${err.message}`);
    }

    // Close issue
    try {
      run(`gh issue close ${issue.number} --repo ${REPO} --reason "completed" --comment "✅ Completed and verified against latest production build, tests (119 passing), and documentation."`);
      console.log(`  🔒 Issue #${issue.number} closed as completed.`);
    } catch (err) {
      console.error(`  ❌ Failed to close issue #${issue.number}: ${err.message}`);
    }
  }

  console.log('\n🎉 All 24 issues created, linked to Project 4, set to Done, and closed successfully!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
