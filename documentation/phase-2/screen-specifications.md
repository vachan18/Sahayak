# SAHAYAK (सहायಕ / ಸಹಾಯಕ)
## Comprehensive Screen Specifications (15 Core Views)
### Project: PIXEL THEORY | Track DS-02 | Phase 2 Deliverable

---

## 1. Specifications Framework

Each screen is defined across 9 standardized architectural facets:
1. **Purpose & User Mental Model**
2. **Layout Structure & Wireframe Topology**
3. **Core UI Components & Widgets**
4. **Primary Call-to-Action (CTA)**
5. **Secondary Actions & Escape Hatches**
6. **User Interactions & Gestures**
7. **Validation & State Handling**
8. **Responsive Behaviour (360px Mobile to Desktop)**
9. **Accessibility & Screen-Reader Specs**

---

### Screen 01: Welcome / Splash & Language Gate (`/`)

- **1. Purpose**: Welcomes citizen into a trusted, sovereign environment; immediately establishes that this is a free, multilingual public service with no brokers.
- **2. Layout Structure**:
  - Top: Emblem of Trust & SAHAYAK bilingual logomark.
  - Middle: High-contrast greeting card with audio waveform preview.
  - Bottom: Sticky language selector container (Kannada, Hindi, English).
- **3. Components**:
  - `HeroEmblem`: Clean national tricolor subtle accent with sovereign typography.
  - `AudioWelcomePill`: Auto-plays or taps to hear: *"Welcome / ಸುಸ್ವಾಗತ / स्वागत है"*.
  - `LanguageTileGrid`: 3 large cards (min height 72px) with native scripts:
    - **ಕನ್ನಡ (Kannada)**
    - **हिन्दी (Hindi)**
    - **English**
  - `StatutoryTrustBadge`: "ಭಾರತ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಯೋಜನೆಗಳ ಮಾರ್ಗದರ್ಶಿ — 100% ಉಚಿತ" (Official Indian welfare guide — 100% Free).
- **4. Primary CTA**: Large button `[ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ & ಪ್ರಾರಂಭಿಸಿ / Select & Begin ]` (56px height, high-contrast green `#059669`).
- **5. Secondary Actions**: "English ನಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ" (Continue in English) text link.
- **6. User Interactions**: Tapping any language tile instantly plays a 2-second dialect voice snippet in that language to confirm comprehension before proceeding.
- **7. Validation**: Language selection must be chosen before primary CTA activates.
- **8. Responsive Behaviour**: Centered card layout on tablet/desktop (max-width 480px) to preserve intimate mobile app feel.
- **9. Accessibility**: `aria-live="polite"` announces: *"Language selection screen. Select Kannada, Hindi, or English"*.

---

### Screen 02: Language & Dialect Selection Modal (`/language`)

- **1. Purpose**: Allows instantaneous, non-destructive language and dialect switching at any point in the citizen's journey without losing form progress.
- **2. Layout Structure**:
  - Full-screen or bottom-sheet drawer with drag handle.
  - Top: Search input for languages.
  - Middle: Major languages list with audio preview buttons.
  - Bottom: Dialect accent selector (e.g. Bhojpuri, Awadhi, Uttara Kannada, Coastal).
- **3. Components**:
  - `LanguageSearchBar`: Voice-search enabled ("Say your language name").
  - `LanguageCardItem`: Contains native script, English romanized name, and "Play Sample Voice" pill.
  - `DialectAccordion`: Expands to show colloquial dialect inflection options.
  - `VoiceSpeedToggle`: Normal (1.0x) vs Gentle/Slow (0.8x) for elderly citizens.
- **4. Primary CTA**: `[ ಈ ಭಾಷೆಯನ್ನು ಖಚಿತಪಡಿಸಿ / Confirm Language ]`.
- **5. Secondary Actions**: `[ ರದ್ದುಮಾಡಿ / Cancel ]` returning to previous screen without modifications.
- **6. User Interactions**: Tap audio speaker on card to test voice clarity.
- **7. Validation**: Immediate hot-reloading of string bundle across the entire UI DOM in <200ms.
- **8. Responsive Behaviour**: Slides up from bottom on mobile; renders as a centered focus modal on desktop viewports.
- **9. Accessibility**: Focus is trapped within modal; Escape key or swipe down closes drawer.

---

### Screen 03: 3-Step Micro Onboarding (`/onboarding`)

- **1. Purpose**: Educates first-time users on how SAHAYAK protects them from middlemen, verifies eligibility, and checks documents.
- **2. Layout Structure**:
  - Top: Progress indicator dots (Step 1 of 3) + "Skip" button.
  - Middle: High-fidelity culturally resonant vector illustration + plain vernacular copy.
  - Bottom: Audio listen button + Primary navigation CTA.
- **3. Components**:
  - `SlideCarousel`:
    - Slide 1: **ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ (Discover Schemes)** — Life-event cards instead of complex ministry names.
    - Slide 2: **ಅರ್ಹತೆ ತಿಳಿಯಿರಿ (Check Eligibility)** — 3 voice questions to know your benefits.
    - Slide 3: **ದಲ್ಲಾಳಿಗಳಿಂದ ರಕ್ಷಣೆ (Protection from Brokers)** — Official fee is ₹0; know your rights.
  - `SpokenAudioPlayer`: Speaks the slide summary aloud in chosen language.
- **4. Primary CTA**: `[ ಮುಂದಿನ ಹಂತ / Next ]` (on final slide: `[ ಪ್ರಾರಂಭಿಸಿ / Get Started ]`).
- **5. Secondary Actions**: `[ ಬಿಟ್ಟುಬಿಡಿ / Skip ]` in top right corner.
- **6. User Interactions**: Horizontal swipe between slides with smooth spring physics.
- **7. Validation**: N/A.
- **8. Responsive Behaviour**: Touch gestures enabled on mobile; arrow keys supported on desktop.
- **9. Accessibility**: Each slide transition announces new slide title via `aria-live`.

---

### Screen 04: Home Dashboard (`/home`)

- **1. Purpose**: The central cockpit for welfare discovery; minimizes cognitive load by offering instant life-event exploration, urgent seasonal alerts, and quick voice search.
- **2. Layout Structure**:
  - Header: Location banner ("ಕರ್ನಾಟಕ / Karnataka"), Language pill, Audio toggle, Profile avatar.
  - Hero Section: "Bolo Aur Khojo" Voice Search Bar.
  - Middle Section 1: Urgent Welfare Banners (e.g., Drought relief, Scholarship deadlines).
  - Middle Section 2: "Jeevan Ke Padav" Life-Event Grid (6 high-contrast tiles).
  - Bottom: Persistent Bottom Navigation Dock (4 tabs).
- **3. Components**:
  - `VoiceSearchHero`: Prominent pill with pulsating mic icon: *"ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ..."* (Speak or type...).
  - `UrgentAlertCard`: Amber accent card with countdown clock and audio summary icon.
  - `LifeEventGrid`: 2-column grid of 6 cards with 48px icons and bold bilingual labels:
    1. Farming & Rural (ಕೃಷಿ & ಬೆಳೆ)
    2. Women & Child (ಮಹಿಳೆ ಮತ್ತು ಮಗು)
    3. Health & Elders (ಆರೋಗ್ಯ & ವೃದ್ಧಾಪ್ಯ)
    4. Education & Youth (ಶಿಕ್ಷಣ & ವಿದ್ಯಾರ್ಥಿವೇತನ)
    5. Street Business & Loans (ಸಣ್ಣ ವ್ಯಾಪಾರ & ಸಾಲ)
    6. Housing & Utilities (ಮನೆ & ವಿದ್ಯುತ್)
  - `QuickEntitlementCheckBanner`: "ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಸಿಗುವ ಒಟ್ಟು ಹಣ ಎಷ್ಟು? 2 ನಿಮಿಷದಲ್ಲಿ ತಿಳಿಯಿರಿ" (What is your family's total welfare amount? Find out in 2 minutes).
- **4. Primary CTA**: `[ ನನ್ನ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ / Check My Eligibility ]` inside hero banner.
- **5. Secondary Actions**: Tapping individual life-event cards to browse sector catalogs.
- **6. User Interactions**: Tapping mic initiates real-time voice listening with waveform feedback.
- **7. Validation**: N/A.
- **8. Responsive Behaviour**: 2 columns on mobile (360px), 3 columns on tablet (768px), 6-card row on desktop (1200px).
- **9. Accessibility**: Keyboard accessible with clear outline on focus (`3px solid #D97706`).

---

### Screen 05: Scheme Discovery Catalog (`/schemes`)

- **1. Purpose**: Comprehensive directory of verified central and state schemes with clear benefit numbers and zero bureaucratic jargon.
- **2. Layout Structure**:
  - Top: Search bar with voice mic + Filter trigger pill ("ಫಿಲ್ಟರ್‌ಗಳು (3)").
  - Sub-header: Category chips horizontal scroll (All, Farming, Health, Education, Business).
  - Body: Vertical scroll list of Scheme Benefit Cards.
  - Floating Action Button (FAB): "Sahayak Sathi" AI Voice Assistant.
- **3. Components**:
  - `SchemeBenefitCard`:
    - Header: Scheme name in vernacular + Central/State badge.
    - Highlight: Bold green financial benefit badge (e.g., *"₹6,000 / ವರ್ಷಕ್ಕೆ"*).
    - Meta: Processing time ("15 ದಿನಗಳು"), Application fee ("₹0.00 ಉಚಿತ").
    - Action Bar: "Listen / Suniye" audio pill + "Check Eligibility" button.
  - `FilterDrawerTrigger`: Shows badge with number of active filters.
- **4. Primary CTA**: `[ ಅರ್ಹತೆ ಪರೀಕ್ಷಿಸಿ / Check Eligibility ]` on each scheme card.
- **5. Secondary Actions**: `[ ವಿವರ ನೋಡಿ / View Details ]` to read full specifications; `[ ಹೋಲಿಕೆ / Compare ]` checkbox.
- **6. User Interactions**: Infinite scroll with smooth lazy-loading; swipe left on card to share on WhatsApp.
- **7. Validation**: Filter query matches sanitized against SQL/XSS.
- **8. Responsive Behaviour**: Single card stack on mobile; 2-column masonry grid on tablet/desktop.
- **9. Accessibility**: Screen reader reads: *"Scheme: PM-KISAN. Benefit: 6000 rupees per year. Government fee: Zero rupees. Press enter to check eligibility."*

---

### Screen 06: Search & Advanced Filters Drawer (`#drawer-filters`)

- **1. Purpose**: Allows citizens or tech proxies to drill down into schemes based on caste, income, gender, age, and state without complex paperwork.
- **2. Layout Structure**:
  - Drawer header: "ಫಿಲ್ಟರ್‌ಗಳು / Filters" + "ರೀಸೆಟ್ / Reset All".
  - Section 1: Beneficiary Category (SC, ST, OBC, General, Minority).
  - Section 2: Gender & Age (Women, Senior Citizen, Youth).
  - Section 3: Occupation (Farmer, Street Vendor, Student, Unorganized Worker).
  - Section 4: Maximum Processing Time (Within 7 days, Within 15 days, 30+ days).
  - Bottom sticky bar: Apply Filters button with matching count.
- **3. Components**:
  - `MultiSelectChips`: Minimum 44px height chips with tactile checkmark states.
  - `RangeSlider`: Annual income bracket slider with vernacular currency markings (₹1 ಲಕ್ಷ, ₹2.5 ಲಕ್ಷ, ₹5 ಲಕ್ಷ).
- **4. Primary CTA**: `[ ಫಿಲ್ಟರ್ ಅನ್ವಯಿಸಿ (24 ಯೋಜನೆಗಳು) / Apply Filters (24 Schemes) ]`.
- **5. Secondary Actions**: `[ ಎಲ್ಲಾ ಅಳಿಸಿ / Clear All ]`.
- **6. User Interactions**: Selecting a chip immediately updates the scheme count in the primary CTA button.
- **7. Validation**: Slider values bounded between ₹0 and ₹15,00,000.
- **8. Responsive Behaviour**: Slide-up sheet on mobile; right-hand sidebar drawer on desktop.
- **9. Accessibility**: Focus auto-transfers to drawer header; ESC key dismisses.

---

### Screen 07: Scheme Details & Benefits (`/schemes/:schemeId`)

- **1. Purpose**: Completely demystifies a specific government scheme; translates administrative statutory guidelines into empowering, plain-language bullet points.
- **2. Layout Structure**:
  - Top: Back button, Scheme Title, Audio Readout button, Official Ministry tag.
  - Hero Card: Big benefit payout summary + direct DBT bank credit indicator.
  - Section 1: "Who is Eligible?" (Plain language criteria with green ticks).
  - Section 2: "What Will You Get?" (Financial and non-financial benefits).
  - Section 3: "Required Documents" (Interactive visual preview chips).
  - Section 4: "Statutory Timeline & Fee" (Citizens' Charter SLA & Grievance Contact).
  - Bottom Sticky Bar: "Am I Eligible?" & "Prepare Documents" CTAs.
- **3. Components**:
  - `AudioExplainerHeader`: Large floating pill: *"ಈ ಯೋಜನೆಯ ವಿವರಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ"* (Listen to this scheme's details in Kannada).
  - `BenefitBreakdownCard`: Visual infographic showing how funds are disbursed (e.g. 3 installments of ₹2,000).
  - `CitizensCharterBox`: Transparent notice showing: Max Govt SLA (e.g., 21 days), Handling Officer (Tehsildar / BDO), Official Helpline (1800-XXX-XXXX).
  - `AntiBriberyNotice`: Bold red box: "ಈ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲ. ಯಾರಾದರೂ ಹಣ ಕೇಳಿದರೆ 1905 ಗೆ ಕರೆ ಮಾಡಿ" (This application is free. If anyone demands money, call 1905).
- **4. Primary CTA**: `[ ನನ್ನ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ / Check My Eligibility ]` (Full width 56px height).
- **5. Secondary Actions**: `[ ಅಗತ್ಯ ದಾಖಲೆಗಳು / Required Documents ]`, `[ WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ / Share on WhatsApp ]`.
- **6. User Interactions**: Scroll down reveals compact sticky bottom bar with CTA.
- **7. Validation**: Scheme data verified against official National Portal of India / myScheme API.
- **8. Responsive Behaviour**: Single column readable reading measure (65ch) on large displays.
- **9. Accessibility**: Semantic `<h2>`, `<h3>` tags used; audio player has accessible Play, Pause, and Replay controls.

---

### Screen 08: "Bolo Aur Jano" Eligibility Checker (`/eligibility`)

- **1. Purpose**: Low-stress, conversational questionnaire that determines entitlement without intimidating the citizen with long, complex forms.
- **2. Layout Structure**:
  - Top: Step indicator (ಹಂತ 2 / 4) + Voice Audio prompt.
  - Middle: Conversational Question Card with large visual illustration.
  - Input Zone: Voice input wave visualizer + 2 to 4 large touch options.
  - Bottom: Previous Step button & Next CTA.
- **3. Components**:
  - `ConversationalPrompt`: Question rendered in large Indic type (22px): *"ನಿಮ್ಮ ಬಳಿ ಎಷ್ಟು ಎಕರೆ ಜಮೀನು ಇದೆ?"* (How many acres of land do you own?).
  - `VoiceAnswerPill`: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ" (Press mic to speak your answer).
  - `VisualChoiceGrid`: E.g., Option 1: "2 ಎಕರೆಗಿಂತ ಕಡಿಮೆ (Small Farmer)", Option 2: "2 ರಿಂದ 5 ಎಕರೆ", Option 3: "ಜಮೀನು ಇಲ್ಲ (Landless Worker)".
- **4. Primary CTA**: `[ ಮುಂದಿನ ಪ್ರಶ್ನೆ / Next Question ]` (or auto-advances upon speech recognition).
- **5. Secondary Actions**: `[ ಹಿಂದಿನ ಪ್ರಶ್ನೆ / Previous Question ]`, `[ ಬಿಟ್ಟುಬಿಡಿ / Skip ]`.
- **6. User Interactions**: Citizen can answer via voice OR by tapping one of the large cards.
- **7. Validation**: Numeric voice answers parsed locally (e.g. "two acres" mapped to 2.0).
- **8. Responsive Behaviour**: Full-height viewport container with zero vertical scrolling required on mobile.
- **9. Accessibility**: Screen reader reads aloud each question automatically upon step transition.

---

### Screen 09: Eligibility Results Deck (`/eligibility/results`)

- **1. Purpose**: Celebrates the citizen's eligible welfare rights and organizes them into high-value entitlements, partial matches, and alternative welfare options.
- **2. Layout Structure**:
  - Header: Celebration Confetti Animation + Total Household Entitlement Banner.
  - Tab 1: "ಪೂರ್ಣ ಅರ್ಹತೆ (Fully Eligible - 4 Schemes)".
  - Tab 2: "ಭಾಗಶಃ ಅರ್ಹತೆ (1 Document Missing - 2 Schemes)".
  - Tab 3: "ಇತರ ಪ್ರಯೋಜನಗಳು (Alternative Schemes)".
  - Bottom Bar: "Save My Results" & "Start Applying".
- **3. Components**:
  - `EntitlementScorecard`: Hero banner: *"ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ₹18,000 ವರೆಗೆ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ ಸಿಗಬಹುದು"* (Congratulations! Your family is eligible for up to ₹18,000/yr in benefits).
  - `AudioSummaryPill`: Spoken breakdown of matching schemes.
  - `SchemeActionCard`: Displays each qualified scheme with a direct "Apply / ಸಿದ್ಧತೆ ಮಾಡಿ" CTA.
  - `MissingCriteriaAlert`: On partial matches, shows exactly what is needed (e.g., "Requires Income Certificate below ₹2.5L").
- **4. Primary CTA**: `[ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ / Prepare Documents ]`.
- **5. Secondary Actions**: `[ ಫಲಿತಾಂಶಗಳನ್ನು SMS ಮೂಲಕ ಪಡೆಯಿರಿ / Send Summary via SMS ]`.
- **6. User Interactions**: Tapping a scheme card expands quick actions without leaving the results deck.
- **7. Validation**: Results cached locally in IndexedDB to prevent loss on network disconnect.
- **8. Responsive Behaviour**: Cards expand smoothly to 2 columns on viewports > 768px.
- **9. Accessibility**: Dynamic ARIA live announcement: *"Eligibility results calculated. You qualify for 4 government schemes."*

---

### Screen 10: Document Checklist & Visual Verification (`/documents/checklist/:schemeId`)

- **1. Purpose**: Guides citizens to prepare 100% compliant documents, eliminating rejections due to blurry photos, wrong pages, or missing stamps.
- **2. Layout Structure**:
  - Top: Scheme Name, Document Readiness Meter ("2 of 3 Documents Ready").
  - Body: Interactive checklist of required documents (Aadhaar, Passbook, Caste Cert).
  - Slide-in Drawer: Visual "Do's and Don'ts" comparison guide for each document.
- **3. Components**:
  - `ReadinessMeter`: Circular progress ring showing 66% completion.
  - `DocumentChecklistItem`:
    - Document Name (Kannada + English).
    - Status Badge: `[ Verified via DigiLocker ✓ ]` or `[ Upload Photo ⚠ ]`.
    - Button: "See Correct Sample / ಸರಿಯಾದ ಮಾದರಿ ನೋಡಿ".
  - `VisualDosAndDontsModal`:
    - Side-by-side photos:
      - **DO**: Front page of passbook showing account number, IFSC, customer photo, and official round bank stamp highlighted in green.
      - **DON'T**: Transaction page or blurry photo with red X mark.
  - `DigiLockerSyncButton`: "ಡಿಜಿಲಾಕರ್‌ನಿಂದ ತಕ್ಷಣ ಪಡೆಯಿರಿ" (Fetch instantly from DigiLocker).
- **4. Primary CTA**: `[ ಫೋಟೋ ತೆಗೆಯಿರಿ / Take Photo ]` (Opens Smart Camera).
- **5. Secondary Actions**: `[ ನಂತರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ / Upload Later ]`.
- **6. User Interactions**: Tapping "See Correct Sample" triggers visual modal with audio explanation.
- **7. Validation**: Optical pre-check confirms file format (JPEG/PNG/PDF), file size (<5MB), and aspect ratio.
- **8. Responsive Behaviour**: Side-by-side cards stack vertically on 360px screens.
- **9. Accessibility**: All images have detailed alternative text describing the correct document orientation.

---

### Screen 11: Application Submission Guidance (`/guidance/:schemeId`)

- **1. Purpose**: Empowers the citizen with two transparent, scam-proof submission routes: Direct Online e-Sign OR an Assisted CSC "Seva Kendra Slip".
- **2. Layout Structure**:
  - Top: Scheme Title & "Choose How to Submit".
  - Middle: 2 Large Path Selection Cards:
    - Card A: **ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ನಾನೇ ಸಲ್ಲಿಸುತ್ತೇನೆ (Self-Service Online)** — For smartphone-literate users with Aadhaar OTP.
    - Card B: **ಗ್ರಾಮ ಒನ್ / ಸೇವಾ ಕೇಂದ್ರದ ಮೂಲಕ (Assisted CSC Kendra)** — For users wanting counter service with official fee protection.
  - Bottom: Nearby Government Kendra Locator.
- **3. Components**:
  - `SubmissionMethodCard`: High-contrast card with feature badges and time estimates.
  - `OfficialFeeGuaranteeBanner`: "ಗ್ರಾಮ ಒನ್ / ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರದಲ್ಲಿ ಗರಿಷ್ಠ ಅಧಿಕೃತ ಶುಲ್ಕ ₹30 ಮಾತ್ರ" (Maximum authorized CSC fee is ₹30 only).
  - `NearestKendraMapWidget`: Shows distance to nearest CSC (e.g. "Grama One Kendra - 800m away").
- **4. Primary CTA**:
  - If Card A selected: `[ ಆಧಾರ್ ಒಟಿಪಿ ಮೂಲಕ ಸಲ್ಲಿಸಿ / Submit via Aadhaar OTP ]`.
  - If Card B selected: `[ ಸೇವಾ ಕೇಂದ್ರದ ರಸೀದಿ ಪಡೆಯಿರಿ / Generate CSC Token Slip ]`.
- **5. Secondary Actions**: `[ ಕೇಂದ್ರದ ವಿಳಾಸವನ್ನು SMS ಮಾಡಿ / SMS Kendra Address ]`.
- **6. User Interactions**: Interactive card selection with instant tactile feedback.
- **7. Validation**: For online submission, Aadhaar number verified via Verhoeff checksum algorithm.
- **8. Responsive Behaviour**: Cards stack vertically on mobile; display side-by-side on tablet/desktop.
- **9. Accessibility**: Radio group ARIA semantics with keyboard arrow navigation between options.

---

### Screen 12: Application Tracker & Milestone History (`/tracker/:applicationId`)

- **1. Purpose**: Completely demystifies government processing; replaces opaque "Pending" status with a transparent 4-stage visual timeline, statutory countdown, and audio updates.
- **2. Layout Structure**:
  - Top: Application Token (`#KA-KISAN-2026-84920`), Scheme Name, Status Badge.
  - Hero: Spoken Audio Status Pill ("Listen to Status Update in Kannada").
  - Middle: 4-Stage Vertical Milestone Stepper with dates and officer designations.
  - SLA Monitor: "Statutory Deadline: 4 Days Remaining".
  - Bottom: Official Help & 1-Tap CPGRAMS Grievance Escalation.
- **3. Components**:
  - `AudioStatusBanner`: Tapping speaker icon plays: *"ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಕಂದಾಯ ಅಧಿಕಾರಿ ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ. ಗುರುವಾರದೊಳಗೆ ಅನುಮೋದನೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ"* (Your application is being verified by the Revenue Officer. Approval expected by Thursday).
  - `MilestoneStepper`:
    - Stage 1: Submitted & Acknowledged (ಸಲ್ಲಿಸಲಾಗಿದೆ) [Completed ✓ - 14 Nov]
    - Stage 2: Field / Revenue Verification (ದಾಖಲೆ ಪರಿಶೀಲನೆ) [In Progress ⏱ - Officer: Tahsildar]
    - Stage 3: Sanction Order Issued (ಅನುಮೋದನೆ) [Upcoming]
    - Stage 4: Direct Benefit Transfer (ಖಾತೆಗೆ ಜಮೆ) [Upcoming]
  - `GrievanceEscalationCard`: Appears if SLA is breached (>15 days without status change), providing a 1-tap grievance filing route.
- **4. Primary CTA**: `[ ಅಧಿಕೃತ ದೂರು ಸಲ್ಲಿಸಿ / File Grievance ]` (Active only if delayed) OR `[ ರಸೀದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ / Download Receipt ]`.
- **5. Secondary Actions**: `[ WhatsApp ನಲ್ಲಿ ಸ್ಟೇಟಸ್ ಪಡೆಯಿರಿ / Get Updates on WhatsApp ]`.
- **6. User Interactions**: Tapping any completed milestone reveals the official transaction hash and officer timestamp.
- **7. Validation**: Token lookup validated via checksum.
- **8. Responsive Behaviour**: Stepper adapts from vertical layout on mobile to horizontal timeline on desktop.
- **9. Accessibility**: Live status changes announced via `aria-live="assertive"`.

---

### Screen 13: "Sahayak Sathi" AI Voice Assistant Drawer (`/assistant`)

- **1. Purpose**: Sovereign conversational companion that answers citizen questions in natural spoken Kannada, Hindi, and English without hallucination.
- **2. Layout Structure**:
  - Slide-up bottom-sheet drawer covering 85% of mobile screen.
  - Header: "ಸಹಾಯಕ ಸಾಥಿ (Sahayak Sathi)" + Language badge + Close (X).
  - Body: Scrollable conversational bubble thread with audio playback pills.
  - Bottom: Large microphone button, audio waveform visualizer, and suggested prompt chips.
- **3. Components**:
  - `WaveformVisualizer`: Pulsing glowing amber bars when citizen is speaking.
  - `VernacularSpeechBubble`: Renders both transcribed text and a "Play Audio" speaker.
  - `SourceCitationBadge`: E.g., *"Source: PM-KISAN Gazette Notification 2026 / myScheme.gov.in"*.
  - `PromptSuggestionPills`: 3 tap-to-ask chips:
    - "ಕಂತಿನ ಹಣ ಯಾವಾಗ ಬರುತ್ತದೆ?" (When will installment arrive?).
    - "ಹೆಸರು ತಿದ್ದುಪಡಿ ಹೇಗೆ ಮಾಡುವುದು?" (How to correct name?).
    - "ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?" (What documents are required?).
- **4. Primary CTA**: `[ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ / Tap & Speak ]` (Centered 64px circular mic button).
- **5. Secondary Actions**: Keyboard icon to switch to text typing; Clear conversation button.
- **6. User Interactions**: Tap mic once to start listening; auto-stops upon silence detection or manual tap.
- **7. Validation**: Voice queries checked for profanity/abuse; grounded strictly in official government data.
- **8. Responsive Behaviour**: Right-side sliding panel on desktop (420px width); bottom drawer on mobile.
- **9. Accessibility**: Continuous audio feedback chimes on start-listening, stop-listening, and answer-received.

---

### Screen 14: User & Family Proxy Profile (`/profile`)

- **1. Purpose**: Enables a single smartphone owner (e.g. Sunita) to manage multiple family profiles (Father, Mother, Self, Children) and check entitlements for the entire household.
- **2. Layout Structure**:
  - Top: Active Profile Card with switcher dropdown.
  - Middle: Household Member Cards list.
  - Section 2: Demographic & Economic Attributes (Occupation, Landholding, Caste, Ration Card).
  - Section 3: Connected Sovereign Accounts (DigiLocker status).
  - Bottom: Add New Family Member CTA.
- **3. Components**:
  - `HouseholdMemberCarousel`: Horizontal avatar list:
    - [Rameshwar (Father) - Farmer]
    - [Sunita (Self) - Student]
    - [Lakshmi (Mother) - Homemaker]
  - `AttributePillList`: Non-editable badges showing verified traits (*"Land: 1.5 Acres", "Category: OBC"*).
  - `DigiLockerStatusCard`: Shows green lock with "DigiLocker Linked" or "Link Account" button.
- **4. Primary CTA**: `[ ಹೊಸ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ / Add Family Member ]`.
- **5. Secondary Actions**: `[ ವಿವರಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ / Edit Profile ]`, `[ ಲಾಗ್ ಔಟ್ / Clear Data ]`.
- **6. User Interactions**: Tapping another family member switches the entire app's context to that person's eligible schemes.
- **7. Validation**: Local data encrypted in browser storage using AES-GCM.
- **8. Responsive Behaviour**: Profile switcher expands into a clean grid on desktop.
- **9. Accessibility**: Clear focus indication across all member profile cards.

---

### Screen 15: Notifications & Audio Alerts Center (`/notifications`)

- **1. Purpose**: Centralized log of scheme updates, upcoming application deadlines, and audio voice messages regarding DBT credit status.
- **2. Layout Structure**:
  - Header: "ಸೂಚನೆಗಳು (Notifications)" + "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ (Mark All Read)".
  - Body: Chronological list of Alert Cards categorized by: Milestone Updates, Urgent Deadlines, and New Matching Schemes.
- **3. Components**:
  - `AudioAlertCard`:
    - Priority tag: Green (Success/Disbursed), Amber (Deadline approaching), Blue (New scheme).
    - Title & Plain-Language Summary.
    - Timestamp (e.g. "2 ಗಂಟೆಗಳ ಹಿಂದೆ / 2 hours ago").
    - "Listen in Kannada" speaker icon.
  - `ActionPill`: E.g., "Check Status" or "Renew Certificate".
- **4. Primary CTA**: `[ ಅರ್ಜಿಯ ಸ್ಥಿತಿ ನೋಡಿ / View Application Status ]` on active alerts.
- **5. Secondary Actions**: Swipe card right to dismiss; Filter by "Unread Only".
- **6. User Interactions**: Tapping speaker button plays 15-second audio notification.
- **7. Validation**: Auto-expires stale notifications older than 90 days.
- **8. Responsive Behaviour**: Full-width cards with clear padding; max-width 640px on desktop.
- **9. Accessibility**: Unread count badge has `aria-label="3 unread notifications"`.
