# PHASE 6.2 — USER EXPERIENCE & DESIGN REPORT
**SAHAYAK — Sovereign Welfare Portal Dashboard & Personalization**  
**Role**: Principal Product Designer & Senior Frontend Engineer  
**Date**: November 2026  
**Status**: Completed  

---

## 1. Executive Summary

Phase 6.2 transforms SAHAYAK’s core dashboard from a static landing page into a personalized, sovereign citizen experience. Citizens can discover schemes through six distinct life events, check preliminary eligibility with zero documents, review personalized recommendations based on actual household profile inputs, manage saved bookmarks, inspect browsing history, and track real application progress without middleman confusion or false timeline promises.

---

## 2. Design Pillars & Strategic Architecture

### 2.1. Sovereign Identity & Trust Framing
- **Navy & Saffron Heritage**: Preserved the deep navy authority (`#0B2545`) representing constitutional governance and warm saffron/amber (`#B45309`, `#F59E0B`) accents representing accessibility and warmth.
- **Gazette-Verified Badge**: Replaced generic marketing labels with official sovereign tags: `"Official Ministry Source"` and `"Gazette Verified"`.
- **Statutory Guidance Standard**: Citizens are clearly informed that online evaluations provide *preliminary guidance* based on self-reported answers, and that official sanction requires departmental statutory verification under citizen service charters.

### 2.2. Hero Cockpit Redesign
The hero section addresses three key citizen mental models:
1. **Immediate Discovery & Action**: Dual high-visibility primary actions:
   - Primary: **"Check 2-Minute Eligibility"** (`/eligibility`), badged with "Zero Documents Needed".
   - Secondary: **"Explore All Schemes"** (`/schemes`), badged with total catalog count.
2. **Accessible Voice & Search**: Large search input with an integrated microphone button that activates *Sahayak Sathi* (AI Voice Assistant) in Kannada, Hindi, Bengali, or English.
3. **Verified Information Panel**: A dedicated right-hand column detailing statutory fee exemptions (₹0.00 official government fee, ₹30 assisted CSC cap) and turnaround targets (10–45 days) under the Karnataka Sakala Services Act, 2011.

---

## 3. Life-Event Discovery Architecture ("Jeevan Ke Padav")

Citizens rarely know the formal bureaucratic names of ministries. To provide immediate cognitive recognition, six standardized life-need categories were structured:

| # | Category Name | Primary Icon | Representative Schemes & Scope |
|---|---|:---:|---|
| 1 | **Agriculture and Farming** | `Wheat` / `Sprout` | PM-KISAN, crop relief, fertilizer subsidies, Kisan Credit Card |
| 2 | **Health and Family** | `Heart` / `Stethoscope` | Ayushman Bharat (PM-JAY), Arogya Karnataka cashless cover |
| 3 | **Women and Child Welfare** | `ShieldCheck` / `Users` | Gruha Lakshmi DBT, PMMVY maternity benefits, Sukanya Samriddhi |
| 4 | **Youth and Education** | `GraduationCap` | Vidyasiri, Post-Matric scholarships, free laptop schemes |
| 5 | **Micro-Enterprise and Artisan Credit** | `Briefcase` / `Hammer` | PM Mudra Yojana, PM SVANidhi street vendor credit, PM Vishwakarma |
| 6 | **Housing and Utilities** | `Home` | Pradhan Mantri Awas Yojana (PMAY), PM Surya Ghar Muft Bijli |

Each card provides:
- High-contrast, recognizable Lucide iconography.
- Direct scheme count indicator (e.g. "14 Schemes").
- Readable localized titles and descriptions across Kannada, Hindi, Bengali, and English.
- Framer Motion hover elevation (`whileHover={{ y: -4 }}`) and tap response (`whileTap={{ scale: 0.98 }}`).

---

## 4. Personalized Citizen Dashboard Hub

The `PersonalizedDashboard` component delivers five tailored experiences:

### 4.1. Recommended for You (`recommended`)
- **Profile-Driven Recommendations**: Directly evaluates citizen attributes (e.g. occupation = farmer, landholding, income ≤ ₹2.5L, gender) or actual questionnaire answers from `assessEligibility()`.
- **Transparent Attribution**: Shows why each scheme is recommended (e.g., "Farmer Landholding Match", "Woman Head of Household").
- **Statutory Financial Display**: Summarizes the exact benefit frequency (`₹6,000 / year via DBT Bank Credit`, `₹5,00,000 / year Cashless Treatment`).
- **Unassessed Prompt**: If the citizen has not yet established eligibility, displays an encouraging banner to run the 2-minute assessment.

### 4.2. Saved Schemes (`saved`)
- Real-time bookmarking via `toggleSaveScheme()`.
- Enables citizens to shortlist schemes before visiting a Grama One / CSC center.
- Provides one-click unsaving, comparison, and detail exploration.
- **Empty State**: Friendly graphic with guidance on how to bookmark schemes.

### 4.3. Recently Viewed (`recent`)
- Automatically registers schemes as citizens explore their details.
- Allows citizens to resume reading requirements or guidelines without re-searching.
- Features a "Clear History" action for shared family devices.
- **Empty State**: Compass illustration prompting directory discovery.

### 4.4. Assessment History (`assessments`)
- Records completed evaluations with timestamp, profile evaluated, qualification status pill (`Potentially Eligible`, `Not Established`), and estimated annual benefit.
- Action triggers: "View Results Breakdown" (navigating to `/eligibility/results`) and "Retake Assessment".
- **Empty State**: Clipboard icon encouraging preliminary self-assessment.

### 4.5. Application Progress (`applications`)
- Displays real departmental tracking records from `applications`.
- Features a 4-stage visual stepper:
  1. *Submitted & Acknowledged*
  2. *Land Record (RTC) & eKYC Verification*
  3. *Sanction Order Issued*
  4. *Direct Benefit Transfer (DBT Credit)*
- Highlights official Citizen Charter SLA remaining days or overdue notices, identifying the specific jurisdictional office (e.g. *Tahsildar Office, Mandya Taluk*).
- **Empty State**: Explains how to track applications via token or CSC slip.

---

## 5. Trust, Transparency & Anti-Exploitation Measures

1. **No Unsupported Timelines**: Replaced vague promises like "Instant Approval in 24 Hours" with statutory accuracy: *"Statutory Citizen's Charter Target: 21 Days (Under Karnataka Sakala Services Act, 2011)"*.
2. **Grievance Redressal Transparency**: Delayed applications provide immediate escalations via Sakala helpline (1902) or CPGRAMS central portal.
3. **Statutory Fee Transparency**: Reaffirms that applying for government schemes online is 100% free (₹0.00), while physical CSC assistance fees are legally capped at ₹30 with mandatory receipt issuance.
