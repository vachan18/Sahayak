# 03: User Journeys & Omnichannel Service Blueprint

---

## 1. As-Is Journey: The "Bureaucratic Maze" (Today)

The current citizen experience for discovering and applying for a government scheme is characterized by high friction, financial loss, emotional exhaustion, and frequent abandonment.

```mermaid
journey
    title The Current Broken Journey of a Rural Citizen (e.g. Rameshwar)
    section Discovery
      Hears rumor at tea stall: 3: Citizen
      Visits Tehsil office (40km bus trip): 1: Citizen
      Waits 3 hours outside clerk window: 1: Citizen
    section Intermediation
      Clerk says "Go to Cyber Café": 2: Citizen
      Cyber café broker charges ₹200 fee: 1: Citizen
      Broker inputs data without explaining: 2: Citizen
    section Document Turmoil
      Photo of passbook rejected (blur/IFSC cut): 1: Citizen
      Citizen loses 1 day agricultural wage: 1: Citizen
      Citizen borrows neighbor's tractor for land record copy: 2: Citizen
    section Black Box
      Gets SMS in English: "Status: Pending Dept Verif": 2: Citizen
      3 months pass with zero updates: 1: Citizen
      Installment never credited, assumes scam: 1: Citizen
```

### Critical Breakpoints in the As-Is Journey:
1. **Breakpoint 1 (Cognitive Blindness)**: The citizen does not know what schemes exist for their specific demographic context.
2. **Breakpoint 2 (Exploitative Gateway)**: Because official portals are hostile, the citizen is forced into the hands of unregulated local brokers who extract bribes/fees.
3. **Breakpoint 3 (The Document Bounce)**: 30%+ of applications bounce because citizen uploads a passbook without a visible bank stamp or an expired caste certificate.
4. **Breakpoint 4 (Silent Rejection)**: When an application is flagged for deficiency, the system sends an obscure English text message; the citizen has no idea how to cure the defect within the 15-day rectification window.

---

## 2. To-Be Journey: The PIXEL THEORY Experience

PIXEL THEORY reimagines this journey as an empowering, audio-visual, vernacular dialog that guides the citizen from curiosity to confirmed bank credit.

```mermaid
flowchart TD
    subgraph S1["1. Multilingual Entry & Life-Event Discovery"]
        A["Citizen Opens PIXEL THEORY PWA"] --> B["Selects Language & Dialect\n(e.g., Bhojpuri / Kannada / Bengali)"]
        B --> C["Voice Greeting in Dialect:\n'Namaste! How can the Government support you today?'"]
        C --> D["Selects Life-Event Card\n(Farming / Education / Health / Street Business)"]
    end

    subgraph S2["2. Smart Conversational Eligibility Engine"]
        D --> E["Voice / Tap 4-Question Dynamic Quiz\n(e.g. Land size, Caste category, Family income)"]
        E --> F["Zero-Jargon Instant Result:\n'You qualify for PM-KISAN (₹6,000/yr) & KCC Loan'"]
    end

    subgraph S3["3. Visual Document Companion & DigiLocker"]
        F --> G["Visual Interactive Document Checklist\n(Interactive Do's & Don'ts for Passbook / Aadhaar / Khasra)"]
        G --> H{"DigiLocker Linked?"}
        H -- "Yes" --> I["1-Tap Verified Pull\n(Zero scan errors)"]
        H -- "No / Physical Paper" --> J["Guided Smart Camera Capture\n(Edge detection + Auto-blur warning)"]
    end

    subgraph S4["4. Dignified Omnichannel Submission"]
        I --> K["Direct In-App E-Sign / Aadhaar OTP"]
        J --> L["Generate 'Assisted CSC Token' (QR Code + Plain Audio Summary)"]
        L --> M["Citizen takes QR to any Govt CSC / Panchayat\n(Fee capped at official statutory ₹0 - ₹30)"]
    end

    subgraph S5["5. Transparent Lifecycle Tracking & Audio Updates"]
        K --> N["Interactive 4-Stage Visual Progress Bar"]
        M --> N
        N --> O["SMS & In-App Status in Citizen's Dialect\n('Document Verified by Tehsildar -> Next: DBT Transfer in 6 Days')"]
    end
```

---

## 3. Omnichannel Service Blueprint

The table below maps the frontstage citizen experience directly to backstage digital public infrastructure (India Stack, Bhashini, DigiLocker, state e-District databases).

```
+-------------------------------------------------------------------------------------------------------------------------+
| Layer                  | Phase 1: Discover           | Phase 2: Verify        | Phase 3: Prepare        | Phase 4: Track        |
+-------------------------------------------------------------------------------------------------------------------------+
| Physical / Touchpoint  | Mobile Web / PWA / CSC     | Interactive Voice /    | Physical Documents /    | SMS / WhatsApp Audio /|
|                        | Kiosk Display               | Vernacular Cards       | DigiLocker Storage      | Gram Panchayat Notice |
+-------------------------------------------------------------------------------------------------------------------------+
| Citizen Actions        | Listens to dialect greeting;| Answers 3-4 voice/tap  | Snaps photo of papers   | Plays audio message   |
| (Frontstage)           | picks life event card       | questions in dialect   | or connects DigiLocker  | to hear next step     |
+-------------------------------------------------------------------------------------------------------------------------+
| System UI Responses    | Audio prompt playback;      | Real-time scheme match;| Side-by-side visual     | Color-coded milestone |
|                        | dynamic font rendering      | entitlement value card | checklist & crop guide  | timeline with SLA     |
+-------------------------------------------------------------------------------------------------------------------------+
| Backstage Services &   | Bhashini ASR/TTS Engine;    | myScheme Rules Engine; | DigiLocker REST API;    | PFMS / DBT Bharat API;|
| Integrations           | Language dialect CDN;       | State Welfare Database | Tesseract/OCR engine    | State e-District API; |
|                        | Geo-IP state detector       | for quota matching     | for name/IFSC match     | SMS gateway (CDAC)    |
+-------------------------------------------------------------------------------------------------------------------------+
| Support & Governance   | Local dialect corpus        | Scheme gazette updates | CSC operator guidelines;| Grievance officer     |
| Processes              | curation; Bhashini training | maintained by NeGD/NIC | statutory fee charter   | 15-day SLA escalation |
+-------------------------------------------------------------------------------------------------------------------------+
```
