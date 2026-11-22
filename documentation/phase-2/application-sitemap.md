# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Application Sitemap & Route Hierarchy
### Project: PIXEL THEORY | Track DS-02 | Phase 2 Deliverable

---

## 1. Visual Sitemap (Mermaid)

```mermaid
graph TD
    %% Root & Language
    Root["/ (Root Entrance)"] --> LangGate{"Language Chosen?"}
    LangGate -->|No| Screen_Lang["/language (Language & Dialect Selection)"]
    LangGate -->|Yes| Screen_Home["/home (Discovery Dashboard)"]
    Screen_Lang --> Screen_Onboard["/onboarding (3-Step Micro Onboarding)"]
    Screen_Onboard --> Screen_Home

    %% Tab 1: Discovery & Schemes
    Screen_Home --> Screen_Disc["/schemes (Scheme Catalog & Filter Engine)"]
    Screen_Home --> Screen_Assistant["/assistant (Sahayak Sathi AI Voice Drawer)"]
    Screen_Disc --> Screen_Search["/search (Voice & Vernacular Text Search)"]
    Screen_Disc --> Screen_SchemeDetail["/schemes/:schemeId (Zero-Jargon Details & SLA)"]
    Screen_SchemeDetail --> Screen_Compare["/compare?schemes=id1,id2 (Scheme Comparison Tray)"]
    Screen_SchemeDetail --> Screen_DocPrep["/documents/checklist/:schemeId (Scheme Doc Checklist)"]
    Screen_SchemeDetail --> Screen_ApplyGuide["/guidance/:schemeId (Submission Roadmap)"]

    %% Tab 2: Eligibility Checker
    Screen_Home --> Screen_Elig["/eligibility (Bolo Aur Jano Dynamic Quiz)"]
    Screen_Elig --> Screen_EligResults["/eligibility/results (Matched Schemes Deck)"]
    Screen_EligResults --> Screen_SchemeDetail
    Screen_EligResults --> Screen_ApplyGuide

    %% Tab 3: Document Locker
    Screen_Home --> Screen_Docs["/documents (Visual Locker & DigiLocker)"]
    Screen_Docs --> Screen_DocScan["/documents/scan/:docType (Smart Camera & Blur Check)"]
    Screen_Docs --> Screen_DigiLockerSync["/documents/digilocker-bridge (DigiLocker Auth)"]
    Screen_Docs --> Screen_DocGuide["/documents/guide/:docType (Visual Do's & Don'ts)"]

    %% Tab 4: Application Tracker
    Screen_Home --> Screen_Tracker["/tracker (Active Applications List)"]
    Screen_Tracker --> Screen_TrackDetail["/tracker/:applicationId (4-Stage Stepper & SLA)"]
    Screen_TrackDetail --> Screen_Grievance["/tracker/:applicationId/grievance (SLA Escalation)"]
    Screen_TrackDetail --> Screen_QRSlip["/csc-slip/:tokenId (Offline CSC QR Slip)"]

    %% User & Utilities
    Screen_Home --> Screen_Profile["/profile (Family Members, Saved Profile)"]
    Screen_Home --> Screen_Notifs["/notifications (SMS & Status Audio Alerts)"]
```

---

## 2. Route Directory & Endpoint Mapping

```
+-------------------------------------------------------------------------------------------------------------------------+
| URL Path                     | Screen / Modal Name               | Query / Route Parameters    | Purpose                |
+-------------------------------------------------------------------------------------------------------------------------+
| /                            | Root Route / Splash              | None                        | Checks local storage   |
|                              |                                   |                             | for language token     |
+-------------------------------------------------------------------------------------------------------------------------+
| /language                    | Language & Dialect Selection      | ?returnUrl=/schemes         | Select Kannada, Hindi, |
|                              |                                   |                             | English + voice check  |
+-------------------------------------------------------------------------------------------------------------------------+
| /onboarding                  | 3-Step Micro Onboarding           | None                        | Visual/audio guide of  |
|                              |                                   |                             | SAHAYAK features       |
+-------------------------------------------------------------------------------------------------------------------------+
| /home                        | Discovery Dashboard               | None                        | Life-event grid, urgent|
|                              |                                   |                             | alerts, voice trigger  |
+-------------------------------------------------------------------------------------------------------------------------+
| /schemes                     | Scheme Discovery Catalog          | ?category=farming&sort=payout| Sector browsing, filter|
|                              |                                   |                             | drawer, search bar     |
+-------------------------------------------------------------------------------------------------------------------------+
| /schemes/:schemeId           | Scheme Details & Benefits         | :schemeId (e.g. pm-kisan)   | Plain-language specs,  |
|                              |                                   |                             | benefits, SLA, costs   |
+-------------------------------------------------------------------------------------------------------------------------+
| /compare                     | Scheme Comparison Tray            | ?ids=pm-kisan,kcc-loan      | Side-by-side comparison|
+-------------------------------------------------------------------------------------------------------------------------+
| /eligibility                 | "Bolo Aur Jano" Quiz              | ?step=1&flow=quick          | Dynamic 3-5 question   |
|                              |                                   |                             | voice/tap wizard       |
+-------------------------------------------------------------------------------------------------------------------------+
| /eligibility/results         | Eligibility Results Deck          | ?session=xyz                | Qualified schemes,     |
|                              |                                   |                             | partial matches        |
+-------------------------------------------------------------------------------------------------------------------------+
| /documents                   | Document Locker Hub               | None                        | Saved docs, DigiLocker |
|                              |                                   |                             | status, missing alert  |
+-------------------------------------------------------------------------------------------------------------------------+
| /documents/checklist/:schemeId| Scheme Document Checklist        | :schemeId                   | Mandatory vs optional  |
|                              |                                   |                             | papers for scheme      |
+-------------------------------------------------------------------------------------------------------------------------+
| /documents/guide/:docType    | Visual Do's & Don'ts Guide        | :docType (e.g. passbook)    | Interactive visual of  |
|                              |                                   |                             | correct vs wrong scan  |
+-------------------------------------------------------------------------------------------------------------------------+
| /documents/scan/:docType     | Smart Camera Scanner              | :docType                    | On-device blur check   |
|                              |                                   |                             | & edge auto-crop       |
+-------------------------------------------------------------------------------------------------------------------------+
| /guidance/:schemeId          | Application Submission Roadmap    | :schemeId                   | Self eSign vs Assisted |
|                              |                                   |                             | CSC Token option       |
+-------------------------------------------------------------------------------------------------------------------------+
| /csc-slip/:tokenId           | Assisted CSC Token Slip           | :tokenId                    | QR code, doc checklist,|
|                              |                                   |                             | max ₹30 fee warning    |
+-------------------------------------------------------------------------------------------------------------------------+
| /tracker                     | Application Tracker Hub           | None                        | All active & past      |
|                              |                                   |                             | scheme tokens          |
+-------------------------------------------------------------------------------------------------------------------------+
| /tracker/:applicationId      | Application Milestone Tracker     | :applicationId              | 4-Stage visual timeline|
|                              |                                   |                             | with spoken audio note |
+-------------------------------------------------------------------------------------------------------------------------+
| /tracker/:appId/grievance    | CPGRAMS Grievance Escalation      | :appId                      | Direct breach report   |
+-------------------------------------------------------------------------------------------------------------------------+
| /assistant                   | "Sahayak Sathi" Voice Assistant   | Modal / Persistent Drawer   | Conversational audio AI|
|                              |                                   |                             | helper in Kannada/Hindi|
+-------------------------------------------------------------------------------------------------------------------------+
| /profile                     | User & Family Proxy Profile       | None                        | Switch member, age,    |
|                              |                                   |                             | land size, caste cat.  |
+-------------------------------------------------------------------------------------------------------------------------+
| /notifications               | Notification & Voice Alerts Center| None                        | Scheme alerts, urgent  |
|                              |                                   |                             | milestone SMS audios   |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Modal Views, Drawers & System Overlays

1. **Language & Dialect Switcher Overlay (`#modal-lang-switch`)**:
   - Accessible from top navigation bar at all times.
   - Allows changing between Kannada, Hindi, and English with instant voice preview.
2. **"Sahayak Sathi" AI Voice Assistant Drawer (`#drawer-ai-voice`)**:
   - Bottom sheet drawer with animated audio waveform, microphone toggle, and real-time vernacular transcript.
3. **Filter & Sort Bottom Sheet (`#drawer-filters`)**:
   - Allows filtering schemes by: Life Stage, Benefit Type (Cash/Loan/Insurance), Maximum Processing Time (<7 days, <15 days), and Gender/Social category.
4. **Document Preview & Inspection Modal (`#modal-doc-preview`)**:
   - Shows high-resolution view of verified document with green verified checkmark or amber "blur detected" notice.
5. **Offline & Low-Bandwidth Network Toast (`#toast-offline`)**:
   - Informs citizen that SAHAYAK is operating from local cache and cached audio recordings are available offline.
