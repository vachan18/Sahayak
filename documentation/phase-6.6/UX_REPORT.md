# SAHAYAK — Phase 6.6 UX Report
## Application Tracking, Scheme Comparison & Citizen Support

**Portal**: SAHAYAK (Citizen Welfare Portal)  
**Phase**: 6.6 — Application Tracking & Citizen Support  
**Author**: Principal Product Designer & Accessibility Specialist  
**Status**: Completed & Verified  

---

### 1. The Citizen Experience Post-Submission

In conventional e-governance systems, submitting an application feels like dropping paperwork into an opaque void. Citizens are handed a receipt slip with a 16-digit alphanumeric reference number, after which communication ceases until an unexpected rejection or approval SMS arrives months later.

This "black hole" produces intense anxiety:
- *Did my application reach the right desk?*
- *Is the Revenue Inspector waiting on a missing document I don't know about?*
- *Has the statutory time limit passed?*
- *Who can I contact if the counter operator is unresponsive?*

Phase 6.6 establishes a transparent, empowering civic interface designed to answer these questions with total administrative honesty.

---

### 2. Core UX Principles in Phase 6.6

#### 2.1 The Four-Stage Cognitive Model
Government processing workflows involve dozens of bureaucratic sub-steps (clerical diarization, outward dispatch, junior surveyor inquest, tehsildar digital token signature). Exposing this raw bureaucratic machinery overwhelms citizens.

SAHAYAK compresses administrative complexity into four universal stages:
1. **Submitted**: The application packet was generated and acknowledged.
2. **Verification**: Field scrutiny, land revenue matching, and identity validation.
3. **Decision**: Formal administrative sanction or action-needed resolution.
4. **Disbursement**: Benefit realization (DBT cash credit or health card delivery).

This four-stage structure aligns with the citizen's mental model: *"Did you receive it? Are you checking it? Did you approve it? Did the benefit reach my account?"*

#### 2.2 Truth in Government Tech: No Fabricated Timestamps
A prevalent defect in government tech prototypes is showing artificial countdown timers (e.g., *"Approval guaranteed in 3 days, 4 hours"*) or fake processing timestamps. 

In real administration, such promises destroy trust:
- Delays occur due to election duties, natural calamities, or queue backlogs.
- When an app promises approval in 3 days and the benefit fails to arrive, the citizen loses faith in the welfare system.

**The SAHAYAK Anti-Fabrication Standard**:
- Verified timestamps and officer names are displayed **only** when official system logs confirm that an officer has taken action.
- Upcoming stages state qualitative expectations (e.g., *"Expected by 27 Nov"*, *"Pending Sanction"*) rather than false deterministic seconds.
- Every verified government event is marked with an `Official Record` badge.

#### 2.3 Citizen Notes vs Official Updates: Clear Demarcation
Applicants frequently take notes during physical visits:
- *"Spoke to Revenue Inspector on Thursday; he asked me to bring the original 2021 Pahani."*
- *"Grama One operator said the biometric machine was offline today."*

Allowing citizens to add personal notes empowers memory retention. However, mixing personal notes with government records creates legal liability and confusion.

**Design Resolution**:
- Personal notes are highlighted with a distinct blue badge: `Citizen Note (Personal Record)`.
- Accompanied by a clear disclaimer: *"Personal notes recorded below are saved to your local device profile. They are not official government departmental communications."*

#### 2.4 Scheme Comparison Tray: Cognitive Chunking
Citizens often qualify for multiple overlapping welfare schemes (e.g., PM-KISAN vs Kisan Credit Card, or PM-JAY vs state health schemes) and struggle to evaluate trade-offs.

The **Scheme Comparison Tray (`SchemeComparisonTray.tsx`)**:
- Uses a floating bottom tray that tracks selections without interrupting browsing.
- Caps comparisons at 3 schemes to avoid information overload on mobile devices.
- Chunks comparative data into 5 high-priority dimensions:
  1. *How much benefit do I get?* (DBT cash vs loan vs insurance cover)
  2. *Who can apply?* (Occupation, landholding limits, income ceiling)
  3. *What papers do I need?* (Document checklists)
  4. *How long does it take?* (SLA guarantee and fee structure)
  5. *What are the traps?* (Exclusions for income taxpayers or government staff)

#### 2.5 Grievance Redressal as Citizen Empowerment
When a statutory SLA deadline is breached, citizens often assume they are powerless. The **Grievance Guidance Modal (`GrievanceGuidanceModal.tsx`)**:
- Demystifies the **Central CPGRAMS portal (`pgportal.gov.in`)** with a 4-step plain-language guide.
- Educates citizens on their legal rights under the **Karnataka Sakala Services Act 2011**, explaining that unjustified delays entitle the applicant to statutory compensation.
- Provides direct toll-free numbers (**1902**, **155261**, **14555**, **1800-11-1979**).
- Includes a copyable token reference button and an escalation evidence checklist.

---

### 3. Responsive & Mobile Ergonomics

#### 3.1 Vertical Timeline Architecture
- Horizontal 4-stage steppers become illegible on 360px and 390px screens.
- On mobile devices:
  - The tracker overview renders a streamlined stage progress bar.
  - The detail screen renders a continuous vertical timeline with a connecting track, numbered beads, officer tags, and remarks boxes.
- Prevents horizontal text truncation while maintaining readability for long Indic scheme titles in Kannada, Hindi, and Bengali.

#### 3.2 Touch Targets & Zero-Overflow Assurance
- All buttons, copy triggers, and comparison toggles adhere to a minimum touch target of **44px to 52px**.
- Automated Puppeteer testing across 6 viewport widths (360px, 390px, 768px, 1024px, 1440px, 1728px) across 14 routes confirmed **0 horizontal overflow defects**.

---

### 4. Conclusion

Phase 6.6 closes the loop on citizen welfare delivery. By replacing administrative silence with a dignified 4-stage lifecycle, providing transparent multi-scheme comparison, honoring truth in timestamps, and equipping citizens with official grievance escalation channels, SAHAYAK safeguards citizen dignity throughout their welfare journey.
