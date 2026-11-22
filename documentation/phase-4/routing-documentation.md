# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Routing & Deep-Link Architecture
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 4 Deliverable

---

## 1. Route Table & Navigation Map

```
+-------------------------------------------------------------------------------------------------------------------------+
| URL Path                     | Component                       | Layout Context    | Purpose & Params                   |
+-------------------------------------------------------------------------------------------------------------------------+
| /                            | WelcomeScreen                   | Standalone        | Language selection entry gate      |
+-------------------------------------------------------------------------------------------------------------------------+
| /language                    | LanguageSelectionScreen         | Standalone        | Dedicated dialect tuning view      |
+-------------------------------------------------------------------------------------------------------------------------+
| /onboarding                  | OnboardingScreen                | Standalone        | 3-step micro-onboarding carousel   |
+-------------------------------------------------------------------------------------------------------------------------+
| /home                        | HomeScreen                      | AppLayout Shell   | Central discovery cockpit          |
+-------------------------------------------------------------------------------------------------------------------------+
| /schemes                     | SchemeDiscoveryScreen           | AppLayout Shell   | ?category=farming&q=kisan          |
+-------------------------------------------------------------------------------------------------------------------------+
| /schemes/:id                 | SchemeDetailScreen              | AppLayout Shell   | Full specifications & SLA          |
+-------------------------------------------------------------------------------------------------------------------------+
| /eligibility                 | EligibilityCheckerScreen        | AppLayout Shell   | "Bolo Aur Jano" 5-question wizard  |
+-------------------------------------------------------------------------------------------------------------------------+
| /eligibility/results         | EligibilityResultsScreen        | AppLayout Shell   | Entitlement summary deck           |
+-------------------------------------------------------------------------------------------------------------------------+
| /documents                   | DocumentChecklistScreen         | AppLayout Shell   | ?scheme=pm-kisan (Do's & Don'ts)   |
+-------------------------------------------------------------------------------------------------------------------------+
| /guidance/:id                | ApplicationGuidanceScreen       | AppLayout Shell   | Self e-Sign vs Assisted CSC path   |
+-------------------------------------------------------------------------------------------------------------------------+
| /csc-slip/:tokenId           | CscSlipScreen                   | AppLayout Shell   | Official printable QR slip         |
+-------------------------------------------------------------------------------------------------------------------------+
| /tracker                     | ApplicationTrackerScreen        | AppLayout Shell   | Active applications overview       |
+-------------------------------------------------------------------------------------------------------------------------+
| /tracker/:id                 | ApplicationTrackerDetailScreen  | AppLayout Shell   | 4-stage milestones & CPGRAMS link  |
+-------------------------------------------------------------------------------------------------------------------------+
| /profile                     | UserProfileScreen               | AppLayout Shell   | Household member switcher          |
+-------------------------------------------------------------------------------------------------------------------------+
| /notifications               | NotificationsScreen             | AppLayout Shell   | Live updates & audio log           |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Deep-Link Specifications for Physical/SMS Touchpoints

1. **SMS Notification Link**:
   - Format: `sahayak.gov.in/tracker/app-kisan-84920`
   - Action: Directly launches the application tracker for application `#KA-KISAN-2026-84920` with audio status playback in the citizen's mother tongue.
2. **CSC / Gram Panchayat Poster QR Code**:
   - Format: `sahayak.gov.in/schemes?category=farming`
   - Action: Opens filtered directory directly to Agricultural welfare entitlements in Kannada or Hindi.
3. **Physical Assisted Token QR Slip**:
   - Format: `sahayak.gov.in/csc-slip/:tokenId`
   - Action: Renders high-density QR code with pre-verified document hash and the mandatory ₹30 statutory fee guarantee banner for instant VLE scanning.
