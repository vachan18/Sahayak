# 04: Product Objectives & Core Feature Specifications

---

## 1. Product Vision & Value Proposition

### Vision Statement
> To eliminate administrative, linguistic, and informational barriers so that every citizen in India receives 100% of the government welfare, financial assistance, and public entitlements they are legally guaranteed, with absolute dignity, transparency, and zero intermediary loss.

### The "Radical Dignity" Design Principles
1. **Dignity over Charity**: Government welfare is a constitutional and statutory entitlement funded by public wealth, not an act of patronizing charity. The visual and conversational tone must be respectful, empowering, and polite.
2. **Zero Bureaucratic Jargon**: Replace "Direct Benefit Transfer via Aadhaar Bridge Payment System" with *"Money directly deposited into your bank account"*. Replace "Indemnity Bond" with *"Guaranteed declaration slip"*.
3. **Voice as a First-Class Citizen**: Reading complex text is optional; every screen must have an audible high-quality spoken summary powered by Bhashini TTS.
4. **Transparent Time Expectations**: Every scheme card must display expected processing duration (e.g., *"Typically approved in 14 days"*), statutory fee (*"Government Fee: ₹0.00"*), and direct grievance contacts.

---

## 2. Core Feature Specifications

### Feature F-1: Vernacular & Dialect Audio Navigator
- **Problem Solved**: High-level Hindi or formal literary Tamil alienates citizens who speak regional spoken dialects (e.g., Bhojpuri, Maithili, Awadhi, Marwari, Tulu, Sylheti).
- **Functionality**:
  - Floating, non-intrusive language bar accessible on every view.
  - One-tap switch between major Indian languages (Hindi, Bengali, Tamil, Telugu, Marathi, Kannada, Gujarati, Punjabi, Odia, Assamese, Malayalam, Urdu, English).
  - Dialect audio toggle (e.g., Hindi with Bhojpuri pronunciation / vocabulary cues).
  - Prominent "Audio Read" floating speaker pill on all content cards.

### Feature F-2: Life-Event Exploration Grid ("Jeevan Ke Padav")
- **Problem Solved**: Citizens do not know that maternity assistance is filed under "Ministry of Women and Child Development" or that street vendor loans are under "MoHUA".
- **Functionality**:
  - Replaces ministry drop-down lists with 6 intuitive life-event categories illustrated with high-contrast, culturally relatable iconography:
    1. **Farming & Rural Livelihood** (Kisan, Livestock, Crop Insurance, Irrigation).
    2. **Family, Motherhood & Child Care** (Maternity benefits, Girl child savings, Nutrition).
    3. **Healthcare & Elder Support** (Hospitalization cover, Senior pensions, Disability assistance).
    4. **Education, Youth & Skills** (Scholarships, Free books/uniforms, Vocational coaching).
    5. **Small Business & Street Vending** (Micro-loans, Toolkits, Artisan subsidies).
    6. **Housing, Water & Basic Utilities** (PMAY house subsidy, Tap water connection, Solar pump).

### Feature F-3: "Bolo Aur Jano" (Speak & Learn) Smart Eligibility Conversationalist
- **Problem Solved**: 20-page eligibility PDF criteria and 40-question forms cause 70%+ user abandonment.
- **Functionality**:
  - Conversational, voice-enabled eligibility engine.
  - Dynamically asks only 3 to 5 qualifying questions using progressive branching:
    - *Question 1*: What is your primary work / profession? (Farmer, Student, Street vendor, Daily wage, Homemaker).
    - *Question 2*: What is your gender and age group?
    - *Question 3*: Social category (General, OBC, SC, ST) and state of residence.
    - *Question 4* (Contextual): Land ownership (for farmers) OR Family annual income bracket.
  - **Zero-Dead-End Guarantee**: Even if a citizen is not eligible for Scheme A, the engine instantly computes and presents alternative matching schemes (e.g., *"You don't qualify for PM-KISAN because you don't own land, but you qualify for MGNREGA job card and PM Shram Yogi Maandhan pension!"*).

### Feature F-4: Visual Document Readiness Companion & DigiLocker Bridge
- **Problem Solved**: 30%+ rejections occur because citizens submit wrong pages, unreadable scans, or expired papers.
- **Functionality**:
  - **Visual Do's and Don'ts Gallery**: Shows an interactive graphic of the exact document needed.
    - *Example (Bank Passbook)*: Green checkmark on the front page showing account number, bank stamp, IFSC, and customer photo. Red cross mark on transaction history page.
    - *Example (Land Record / Khatauni)*: Green checkmark on certified portal printout with QR/seal. Red cross on handwritten expired survey slip.
  - **DigiLocker One-Tap Sync**: Securely fetches authentic digital documents (Aadhaar, Ration Card, Class 10 Certificate) directly from DigiLocker API, eliminating manual scanning completely.
  - **Smart Camera Capture with Edge & Blur Detection**: For physical documents, provides on-device optical checking: checks for sufficient lighting, warns if text is blurry, and auto-crops margins.

### Feature F-5: Dignified Omnichannel Submission & "CSC QR Tokenizer"
- **Problem Solved**: Not all rural citizens have net banking or personal OTP-linked phones to complete online payments/e-sign, forcing them to visit cyber cafes where they are cheated.
- **Functionality**:
  - **Direct Digital Submission**: For tech-capable users and youth proxies (Aadhaar OTP / DigiLocker e-Sign).
  - **Assisted Mode ("Seva Kendra Slip")**: Generates a tamper-proof digital summary card with a standard QR code and a plain-text token.
  - Displays the statutory government fee (e.g., *"Official Fee: ₹0.00 / Maximum CSC Convenience Charge: ₹30.00"*).
  - When the citizen hands this QR to the Village Level Entrepreneur (VLE) at the Common Service Centre, the VLE's portal instantly auto-fills the verified data in seconds, preventing overcharging and data entry errors.

### Feature F-6: Visual Lifecycle Tracker with Audio Status Updates
- **Problem Solved**: Citizens submit applications into a black hole; SMS updates are cryptic and infrequent.
- **Functionality**:
  - Intuitive 4-stage visual stepper:
    1. *Submitted & Acknowledged* (With unique token ID and date stamp).
    2. *Field / Document Verification* (Shows verifying authority, e.g., "Block Development Officer").
    3. *Sanction & Approval* (Displays sanctioned benefit amount and official sanction letter download).
    4. *Direct Benefit Transfer (DBT) Disbursed* (Shows destination bank name and last 4 digits of account).
  - **Audio Explainer**: A tap on the current step plays an audio briefing in the citizen's dialect: *"Your papers are currently with the Gorakhpur Tehsil officer. By law, they must complete verification by Thursday. You do not need to visit the office."*
  - **Direct Escalation Button**: If the statutory Citizens' Charter SLA expires (e.g., >21 days without update), a 1-tap "File Grievance / CPGRAMS" escalation is generated automatically.
