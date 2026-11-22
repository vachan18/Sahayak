# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Navigation & Routing Specification
### Project: PIXEL THEORY | Track DS-02 | Phase 2 Deliverable

---

## 1. Navigational Topology & Architecture

SAHAYAK utilizes a dual-tier navigation system engineered specifically for mobile touch devices and high-stress public welfare scenarios:
1. **Primary Navigation**: 4-Tab Bottom Persistent Dock for core citizen life stages.
2. **Top Utility Bar**: Global controls for Language, Audio Voiceover, Accessibility, and Notifications.
3. **Secondary Contextual Navigation**: Steppers, category pills, filter drawers, and modal dismissals.

```
+---------------------------------------------------------------------------------------------------------+
| [Top Utility Bar]   [ 🌐 ಕನ್ನಡ ▼ ]   [ 🔊 Suniye ]   [ 🔔 (2) ]   [ 👤 Profile ]                        |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|                                        VIEWPORT / ACTIVE SCREEN                                         |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
| [Bottom Dock]   [ 🧭 Discover ]   [ 🛡 Eligibility ]   [ 📁 Documents ]   [ ⏱ Tracker ]                 |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Primary Navigation: 4-Tab Bottom Persistent Dock

```
+-------------------------------------------------------------------------------------------------------------------------+
| Tab Index | Route       | Label (Kannada / Hindi / English) | Icon Glyphs           | Primary Role                      |
+-------------------------------------------------------------------------------------------------------------------------+
| Tab 1     | /home       | ಮುಖಪುಟ / खोजें / Discover         | Compass / Home        | Life-event exploration, urgent    |
|           |             |                                   |                       | alerts, voice search trigger      |
+-------------------------------------------------------------------------------------------------------------------------+
| Tab 2     | /eligibility| ಅರ್ಹತೆ / पात्रता / Eligibility    | Shield with Checkmark | "Bolo Aur Jano" 3-5 question      |
|           |             |                                   |                       | dynamic conversational engine     |
+-------------------------------------------------------------------------------------------------------------------------+
| Tab 3     | /documents  | ದಾಖಲೆಗಳು / दस्तावेज़ / Documents   | Secure Folder         | Visual Do's & Don'ts guide, smart |
|           |             |                                   |                       | scanner, DigiLocker sync          |
+-------------------------------------------------------------------------------------------------------------------------+
| Tab 4     | /tracker    | ಸ್ಥಿತಿ / स्थिति / Tracker         | Progress Stepper Clock| 4-stage visual milestone tracker, |
|           |             |                                   |                       | SLA alerts & audio briefings      |
+-------------------------------------------------------------------------------------------------------------------------+
```

### Dock Interaction Rules
- **Active State**: Elevated glyph, solid fill, label bolded with `#D97706` indicator line.
- **Badge Counters**: Tab 4 (Tracker) displays an amber dot when an application status updates; Tab 3 (Documents) displays an alert badge if a document needs re-upload.
- **Deep Screen Auto-Hide**: When viewing `/schemes/:id` (Scheme Details) or `/documents/scan/:id` (Smart Camera), the bottom bar slides down smoothly (`transform: translateY(100%)`) to dedicate maximum screen estate to instructions and primary CTAs.

---

## 3. Top Utility Header Specification

- **Persistent Height**: 56px (60px on high-DPI displays).
- **Elements Left to Right**:
  1. **Brand / Navigation Anchor**:
     - On root views (`/home`, `/eligibility`, `/documents`, `/tracker`): Sovereign tricolor mini-emblem + "SAHAYAK (ಸಹಾಯಕ)".
     - On child views (`/schemes/:id`, `/tracker/:id`): Large high-contrast Back button `[ ← ಹಿಂದೆ / Back ]` (touch area 48 × 48px).
  2. **Language Switcher Pill (`#btn-lang-switcher`)**:
     - Format: `[ 🌐 ಕನ್ನಡ ▼ ]` (40px height, rounded-full, border `1.5px solid #CBD5E1`).
     - Tapping opens the Language & Dialect Drawer without navigating away or reloading.
  3. **Universal Voiceover Assistant Pill (`#btn-audio-voiceover`)**:
     - Speaker icon with text: *"ಕೇಳಿ (Listen)"*.
     - Single tap plays the high-priority spoken summary of the currently visible screen in the citizen's active language.
     - Animated equalizer bars appear during audio playback.
  4. **Notification Bell (`#btn-notifications`)**:
     - Displays badge with unread alert count (e.g., `2`).
     - Opens Notifications Center modal.

---

## 4. Secondary Navigation: Breadcrumbs, Steppers & Tabs

### Stepper Navigation (Eligibility & Tracker)
- **Non-Linear Navigation Prevention**: In the eligibility quiz, users cannot jump ahead to Step 4 without completing Step 1. However, they can freely jump backwards to inspect or amend previous responses.
- **Step Pill Bar**: Shows `[ ಹಂತ 1 ] — [ ಹಂತ 2 ] — [ ಹಂತ 3 ]` with clear completed ticks.

### Horizontal Category Filter Rail (Scheme Discovery)
- Sticky chip bar below search:
  `[ ಎಲ್ಲಾ (All) ]` • `[ 🌾 ಕೃಷಿ (Farming) ]` • `[ 🩺 ಆರೋಗ್ಯ (Health) ]` • `[ 🎓 ಶಿಕ್ಷಣ (Education) ]` • `[ 💼 ಸಣ್ಣ ವ್ಯಾಪಾರ (Business) ]`
- Smooth momentum scrolling with fade gradients on left/right edges to indicate overflow.

---

## 5. State Management & Navigation Memory

1. **Form State Preservation Across Language Changes**:
   - When a citizen switches language from English to Kannada while answering question 3 of the eligibility checker, the form state **MUST NOT RESET**.
   - Input fields, selected radio choices, and uploaded files persist in application state (`SessionStorage` + reactive store).
2. **Scroll Position Memory**:
   - Navigating from Scheme Catalog (`/schemes`) into a Scheme Detail view (`/schemes/pm-kisan`) and pressing "Back" restores the user's exact vertical scroll position in the catalog.
3. **Deep-Linking Schema**:
   - `sahayak.gov.in/schemes/:schemeId`: Opens direct scheme specification.
   - `sahayak.gov.in/tracker/:token`: Opens direct milestone status for that application.
   - `sahayak.gov.in/csc/:tokenId`: Opens the offline Assisted CSC QR Slip for physical printing or scanning.
