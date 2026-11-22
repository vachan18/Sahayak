# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Interaction Design Specifications
### Project: PIXEL THEORY | Track DS-02 | Phase 2 Deliverable

---

## 1. Navigational Interactions & State Persistence

### Bottom Navigation Bar (Mobile Ergonomics)
- **Geometry**: Height 64px, anchored to bottom viewport with `env(safe-area-inset-bottom)`.
- **States**: 4 permanent tabs:
  1. Discovery (`/home` & `/schemes`) — Icon: Compass / Map
  2. Eligibility (`/eligibility`) — Icon: Badge with Checkmark
  3. Documents (`/documents`) — Icon: Folder with Shield
  4. Tracker (`/tracker`) — Icon: Clock / Stepper
- **Interaction Model**:
  - Tap active tab: Smooth scroll to top.
  - Switch tabs: Instant cross-fade (150ms ease-out) without full page reload.
  - Active indicator: Top border pill in Sovereign Ochre (`#D97706`), bold icon fill, high-contrast label.
  - Sub-page behavior: Deep pages (e.g. `/schemes/:id`) hide the bottom navigation to grant 100% viewport to reading and primary action buttons.

### Persistent Top Utility Header
- Left: Back chevron button (with label in active language: "ಹಿಂದೆ / वापस / Back") or SAHAYAK logomark on root views.
- Center: Active context title (e.g., "ಯೋಜನೆಗಳ ವಿವರ / Scheme Details").
- Right: 
  - `LanguagePill`: `[ 🌐 ಕನ್ನಡ ▼ ]` (40px touch height).
  - `AudioVoiceoverPill`: Speaker icon with animated sound wave bars when active.
  - `NotificationBell`: Badge counter with unread notifications.

---

## 2. Form Interactions & Progressive Disclosure

### Single-Question Card Architecture
- Traditional government forms present 40 fields at once, triggering cognitive panic.
- SAHAYAK breaks inputs into **single-question conversational cards**:
  - Only one primary decision is visible at a time.
  - Answer options are presented as **large tactile cards (min 60px height)** with clear visual icons.
  - Example: For land ownership, three large selectable cards:
    - `[ 🌾 2 ಎಕರೆಗಿಂತ ಕಡಿಮೆ (Small Farmer) ]`
    - `[ 🚜 2 ರಿಂದ 5 ಎಕರೆ (Medium Farmer) ]`
    - `[ 🛠 ಜಮೀನು ಇಲ್ಲ (Landless Worker) ]`
- **Auto-Advance**: Selecting an option triggers a gentle 200ms highlight followed by an automatic glide transition to the next question.
- **Immediate Undo**: A persistent "ಹಿಂದಿನ ಪ್ರಶ್ನೆ (Previous Question)" button is always visible to reverse any accidental tap without losing state.

### Voice-to-Field Filling ("Bolo Aur Bhariye")
- Microphone button pulses with a 1.2s ease-in-out breathing ring when tapped.
- While speaking, an audio waveform visualizer expands smoothly from bottom.
- Recognized entities (e.g., "Gorakhpur", "OBC", "Farmer") highlight with green badges in real-time as the user speaks.
- The user can review the interpreted text and tap "ಸರಿ ಇದೆ / Confirm" or re-speak.

---

## 3. Search, Voice Query & Filtering Interactions

### Voice-First Search Modal
```
[ User Taps Microphone ] 
       ↓ (Plays soft 440Hz "listen" chime)
[ Full-Screen Audio Waveform Visualizer Appears ]
       ↓ (Citizen speaks in Kannada / Hindi: "ರೈತರಿಗೆ ಕೊಡುವ ಹಣದ ಯೋಜನೆಗಳು")
[ Real-Time Speech-to-Text via Bhashini Engine ]
       ↓ (Displays live transcript on screen: "ರೈತರಿಗೆ ಕೊಡುವ ಯೋಜನೆಗಳು...")
[ Intent Extractor Maps to: Category = Farming, Benefit = Direct Cash DBT ]
       ↓ (Plays completion chime)
[ Instantly Routes to Matching Scheme Cards Deck ]
```

### Vernacular Auto-Suggestions
- Typing in Kannada, Hindi, or English activates instantaneous type-ahead matching against both official names and colloquial synonyms:
  - Query: *"Kisan"* → Suggests: *PM-KISAN (₹6000)*, *Kisan Credit Card*, *Kisan Maandhan Pension*.
  - Query: *"ಹಸು / Cow"* → Suggests: *Pashu Kisan Credit Card (ಪಶು ಕಿಸಾನ್ ಯೋಜನೆ)*.
  - Query: *"ವಿದ್ಯಾರ್ಥಿವೇತನ / Scholarship"* → Suggests: *Post-Matric Scholarship*, *National Merit Scholarship*.

---

## 4. Progress Indicators & Skeleton States

- **Deterministic Steppers**:
  - Horizontal or vertical 4-step progress tracks for both Eligibility Check and Application Lifecycle.
  - States: `Upcoming` (Gray circle, dashed line), `Current` (Pulsing amber circle with glowing border), `Completed` (Filled green circle with white checkmark).
- **Skeleton Shimmer Loading**:
  - When fetching data over slow 2G/3G rural networks, SAHAYAK avoids jarring blank screens.
  - Replaces content with soft gray-to-warm-ochre shimmering placeholder shapes matching exact card geometry.
  - No infinite spinning circles; placeholders indicate layout stability.

---

## 5. Modal Sheets, Drawers & Scrim Handling

- **Bottom-Sheet Drawer Mechanics**:
  - Slides up from bottom with spring physics (`cubic-bezier(0.32, 0.72, 0, 1)`).
  - Anchored with a top tactile drag handle (width 36px, height 4px, rounded).
  - Background scrim: 60% opacity dark navy (`rgba(11, 37, 69, 0.6)`) with `backdrop-filter: blur(4px)`.
  - Dismissal: Swipe down past 30% threshold, tap outside on scrim, or tap dedicated "ಮುಚ್ಚಿ / Close" button.
- **Focus Management**:
  - Focus is automatically trapped within the modal; background elements receive `aria-hidden="true"`.
  - On dismissal, focus restores smoothly to the triggering button.

---

## 6. Notifications, Snackbars & Dialogs

### Toast Notifications & Snackbars
- Appear at bottom of screen (above bottom navigation).
- Duration: 4000ms for confirmations; persistent until dismissed for network errors.
- Always accompanied by an action button: E.g., `[ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ / Downloaded ]` with action `[ ತೆರೆಯಿರಿ / Open ]`.
- Accompanied by optional subtle haptic vibration (Android `navigator.vibrate(50)`).

### Confirmation Dialogs
- Reserved strictly for high-impact actions:
  - Switching language when a citizen is halfway through a multi-step application form.
  - Clearing stored family profile data.
- Design: High-contrast modal card with two unmistakable buttons:
  - Destructive/Proceed: `[ ಹೌದು, ಬದಲಾಯಿಸಿ / Yes, Change ]` (Red or Amber).
  - Cancel/Safe: `[ ಬೇಡ, ಇಲ್ಲೇ ಇರಿ / No, Stay Here ]` (Neutral Sovereign Navy).

---

## 7. Error Recovery & Offline Fallbacks

- **Zero-Dead-End Philosophy**: No screen ever displays a raw HTTP code (e.g. `404` or `500`) or generic "Something went wrong".
- **Network Disconnect Flow**:
  1. Subtle non-blocking banner slides down from header:
     *"📶 ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ — ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ"* (No internet — Working offline).
  2. All previously viewed schemes and documents remain fully interactive via ServiceWorker and IndexedDB cache.
  3. Actions taken offline (e.g. saving a document scan or completing an eligibility check) are queued in local cache and automatically synchronized once connectivity restores.
- **Input Error Recovery**:
  - Errors are highlighted inline directly below the field in bold vernacular text with an alert icon.
  - The submit button remains disabled with a tooltip explaining what is missing: *"ದಯವಿಟ್ಟು ನಿಮ್ಮ 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ"* (Please complete your 10-digit mobile number).

---

## 8. Micro-Interactions & Sensory Delight

- **Tactile Audio Chimes**:
  - Subtle acoustic cues designed using traditional Indian instruments (soft bamboo flute tone for success, resonant temple bell chime for application submission).
- **Celebration Feedback**:
  - When an eligibility check reveals qualified schemes, an eco-friendly visual confetti burst (using Tiranga and festive gold particles) animates across the header, reinforcing positive emotional dignity.
- **Card Press States**:
  - Cards depress slightly (`transform: scale(0.98)`) with shadow reduction upon finger press, confirming physical registration of the touch.
