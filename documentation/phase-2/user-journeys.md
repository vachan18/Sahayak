# SAHAYAK (सहायಕ / ಸಹಾಯಕ)
## End-to-End User Journeys (11 Critical Pathways)
### Project: PIXEL THEORY | Track DS-02 | Phase 2 Deliverable

---

## 1. Journey Overview & Matrix

Each journey is specified across five operational states:
- **Happy Path**: Seamless primary flow.
- **Empty State**: Zero records / first-time condition with constructive guidance.
- **Loading State**: Optimistic skeleton screens and low-bandwidth audio cues.
- **Error State**: Non-technical vernacular error explanation.
- **Recovery Flow**: Single-tap, low-stress resolution paths.

---

### Journey 1: First-Time User Onboarding

- **Actor**: Lakshmi Venkatesh (Domestic worker, Bengaluru, Kannada-speaking).
- **Goal**: Understand what SAHAYAK is and feel safe that it is an official, free public-service companion.
- **Happy Path**:
  1. Opens SAHAYAK via shared WhatsApp link or QR code at Anganwadi.
  2. Prompted with welcoming audio in Kannada: *"ನಮಸ್ಕಾರ! ಸರ್ಕಾರದ ಯೋಜನೆಗಳನ್ನು ಸುಲಭವಾಗಿ ತಿಳಿಯಲು ಇದು ನಿಮ್ಮ ಸಹಾಯಕ"* (Namaskara! This is your assistant to easily understand government schemes).
  3. 3 visual illustration cards glide in:
     - Card 1: Find schemes for your family (ನಿಮ್ಮ ಕುಟುಂಬದ ಯೋಜನೆಗಳು).
     - Card 2: Check your eligibility in 2 minutes without visiting an office (ಕಚೇರಿಗೆ ಹೋಗದೆ ಅರ್ಹತೆ ತಿಳಿಯಿರಿ).
     - Card 3: 100% Free Government Service — No agents or fees (ಯಾವುದೇ ದಲ್ಲಾಳಿಗಳಿಲ್ಲ — ಉಚಿತ ಸೇವೆ).
  4. Taps primary CTA: "ಮುಂದೆ ಹೋಗಿ" (Proceed). Land on Home Dashboard.
- **Empty State**: First-time splash auto-detects system language; if no location is available, defaults gracefully to state selection banner.
- **Loading State**: Clean high-contrast logo pulsing with a soft warm saffron glow (`#D97706`).
- **Error State**: Audio fails to load due to 2G connection.
- **Recovery Flow**: Fallback to prominent visual icons with large Kannada text; an audio retry button appears with caption: "ಧ್ವನಿಯನ್ನು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ" (Retry Audio).

---

### Journey 2: Language & Dialect Selection

- **Actor**: Rameshwar Yadav (Marginal farmer from Gorakhpur, UP).
- **Goal**: Switch to Hindi with colloquial Bhojpuri voice guidance.
- **Happy Path**:
  1. Citizen notices top language pill showing `[🌐 ಕನ್ನಡ / ಕ | ▼]`.
  2. Taps pill; full-height accessible bottom sheet opens.
  3. Displays 3 primary cards with native scripts:
     - **ಕನ್ನಡ (Kannada)** — "ನಮಸ್ಕಾರ, ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ" (Sample voice plays).
     - **हिन्दी (Hindi)** — "नमस्ते, मैं आपकी सरकारी योजनाओं में सहायता करूँगा" (Sample voice plays).
     - **English** — "Hello, I will assist you with government schemes".
  4. Under Hindi, citizen toggles dialect audio: *"भोजपुरी / अवधी उच्चारण"* (Bhojpuri/Awadhi voice inflection).
  5. Selects Hindi + Bhojpuri. System immediately re-renders all UI strings without reloading or losing state; audio greets him: *"राम-राम भैया! राउर स्वागत बा"* (Ram-ram brother! You are welcome).
- **Empty State**: N/A (Standard pre-populated list of Eighth Schedule languages).
- **Loading State**: Instant local script swap (zero network fetch; translations bundled locally).
- **Error State**: Unsupported dialect selected.
- **Recovery Flow**: Reverts gracefully to standard regional language (Hindi or Kannada) with a clear notification: "मानक हिन्दी में जारी रख रहे हैं" (Continuing in standard Hindi).

---

### Journey 3: User Profile Creation (Progressive, Non-Intrusive)

- **Actor**: Sunita Rathod (Student & family proxy, Maharashtra/Karnataka border).
- **Goal**: Create profiles for herself and her father to check household welfare eligibility.
- **Happy Path**:
  1. Sunita taps "ಪ್ರೊಫೈಲ್ / Profile" from bottom navigation.
  2. Selects "Add Family Member" (ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ).
  3. Conversational card appears asking 4 simple questions:
     - Who is this profile for? (Self / Father / Mother / Child).
     - Age & Gender: (e.g., Father: 54, Male).
     - Primary Work: Selects "Small Farmer / ಸಣ್ಣ ರೈತರು".
     - Land Ownership: Selects "1.5 Acres / 1.5 ಎಕರೆ".
     - Social Category: Selects "OBC".
  4. Taps "ಉಳಿಸಿ ಮತ್ತು ಯೋಜನೆಗಳನ್ನು ನೋಡಿ" (Save & View Eligible Schemes).
  5. Profile card created locally under "Father (Rameshwar)".
- **Empty State**: Friendly illustration showing family members holding hands with caption: "ಯಾವುದೇ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ. ನಿಮ್ಮ ಕುಟುಂಬದ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಲು ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ" (No members added yet. Add family members to discover your household entitlements).
- **Loading State**: Subtle card shimmer during local profile saving.
- **Error State**: User enters invalid age (e.g. 150) or negative land size.
- **Recovery Flow**: Inline conversational validation banner: "ದಯವಿಟ್ಟು ಸರಿಯಾದ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ (1-100)" (Please enter a valid age between 1-100) with microphone icon to speak age instead.

---

### Journey 4: Government Scheme Discovery

- **Actor**: Arindam Mondal (Handloom weaver, seeking working capital).
- **Goal**: Discover financial assistance for micro-entrepreneurs without knowing ministry names.
- **Happy Path**:
  1. Arindam lands on Home screen.
  2. Instead of a blank search bar, sees 6 visual Life-Event Cards:
     - Farming (ಕೃಷಿ)
     - Mother & Child (ತಾಯಿ ಮತ್ತು ಮಗು)
     - Health & Elders (ಆರೋಗ್ಯ)
     - Student & Youth (ಶಿಕ್ಷಣ)
     - **Small Business & Artisan (ಸಣ್ಣ ವ್ಯಾಪಾರ ಮತ್ತು ಕುಶಲಕರ್ಮಿ)**
     - Housing & Water (ವಸತಿ)
  3. Taps "Small Business & Artisan".
  4. Instant feed displays 3 matching central/state schemes:
     - **PM SVANidhi** (₹10,000 to ₹50,000 working capital loan with 7% interest subsidy).
     - **Pradhan Mantri MUDRA Yojana (Shishu Loan)** (Up to ₹50,000 collateral-free).
     - **National Handloom Development Programme**.
  5. Each card shows: Clear Cash Benefit in Green, Processing Time ("10 ದಿನಗಳಲ್ಲಿ ಅನುಮೋದನೆ"), and a "Suniye" (Listen) audio button.
- **Empty State**: When filtering by a rare combination (e.g., extreme income + specific caste with 0 schemes), shows: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ನಿಖರವಾದ ಯೋಜನೆಗಳು ಸಿಗಲಿಲ್ಲ. ಈ ಸಾಮಾನ್ಯ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" (No exact match. Explore these universal schemes instead).
- **Loading State**: Staggered skeleton cards with pulsating thumbnail placeholders.
- **Error State**: Filter network timeout.
- **Recovery Flow**: Instant fallback to locally cached offline scheme directory.

---

### Journey 5: "Bolo Aur Jano" Smart Eligibility Assessment

- **Actor**: Rameshwar Yadav (Marginal farmer).
- **Goal**: Determine if he qualifies for PM-KISAN (₹6,000/yr).
- **Happy Path**:
  1. Taps prominent microphone button on Home: "बोलकर पात्रता जांचें" (Speak to check eligibility).
  2. Voice prompt asks: *"भैया, आप क्या काम करते हैं?"* (Brother, what work do you do?).
  3. Ramesh speaks: *"हमार दु बीघा के खेत बा, खेती-बारी करीला"* (I have 2 bighas of land, I do farming).
  4. Natural language engine extracts:
     - Occupation: Farmer
     - Land Size: ~1.25 acres (< 2 hectares threshold).
  5. Dynamic question 2 appears visually with voiceover: *"क्या आप या आपके परिवार में कोई सरकारी नौकरी या पेंशन में है?"* (Is anyone in your family in a government job or receiving government pension?).
  6. Ramesh taps the large green card: "नहीं / No".
  7. **Instant Result Card**: Green celebration banner:
     *"बधाई हो! आप PM-KISAN (₹6,000/वर्ष) और किसान क्रेडिट कार्ड (KCC) के लिए पूरी तरह पात्र हैं!"* (Congratulations! You are fully eligible for PM-KISAN and KCC).
- **Empty State**: N/A (Always proceeds through 3-question ladder).
- **Loading State**: Animated voice wave visualizer with text: "आपकी बात समझी जा रही है..." (Understanding your speech...).
- **Error State**: Heavy background wind/tractor noise causes speech recognition failure.
- **Recovery Flow**: System displays: "आवाज़ साफ़ सुनाई नहीं दी. कृपया नीचे दिए गए विकल्पों में से एक चुनें" (Voice wasn't clear. Please tap one of the simple visual options below) with 4 large picture buttons.

---

### Journey 6: Scheme Comparison

- **Actor**: Sunita Rathod (Student).
- **Goal**: Compare Post-Matric SC/OBC Scholarship vs. Central Sector Scholarship to choose the best payout.
- **Happy Path**:
  1. In the Education schemes list, Sunita taps "Compare / ಹೋಲಿಕೆ ಮಾಡಿ" on both schemes.
  2. Bottom sticky dock pops up: "2 ಯೋಜನೆಗಳನ್ನು ಹೋಲಿಸಲಾಗುತ್ತಿದೆ (2 schemes selected)".
  3. Taps "Compare Now". Side-by-side card grid displays:
     - **Financial Benefit**: ₹12,000/yr + Tuition fee vs. Flat ₹10,000/yr.
     - **Income Ceiling**: ₹2.5 Lakh/yr vs. ₹4.5 Lakh/yr.
     - **Processing Time**: 21 days vs. 45 days.
     - **Required Papers**: Caste certificate required vs. Merit rank card.
  4. Taps "Best Fit for You" badge highlighted on Post-Matric Scholarship.
- **Empty State**: When 0 or 1 scheme is selected, tray prompts: "ಹೋಲಿಸಲು ಇನ್ನೊಂದು ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" (Select one more scheme to compare).
- **Loading State**: Clean column layout with sliding comparison columns.
- **Error State**: User selects incompatible categories (e.g. comparing a Maternity scheme with a Tractor subsidy).
- **Recovery Flow**: Gentle hint dialog: "ಈ ಎರಡು ಯೋಜನೆಗಳು ಬೇರೆ ಬೇರೆ ವರ್ಗಕ್ಕೆ ಸೇರಿವೆ. ಆದರೂ ಹೋಲಿಸಲು ಬಯಸುವಿರಾ?" (These belong to different sectors. Would you still like to compare?).

---

### Journey 7: Scheme Details & Plain-Language Benefits

- **Actor**: Lakshmi Venkatesh (Domestic worker).
- **Goal**: Understand Ayushman Bharat (PM-JAY) health coverage without confusing medical insurance jargon.
- **Happy Path**:
  1. Opens PM-JAY scheme card.
  2. Screen displays 4 distinct, clean sections:
     - **Hero Value**: "ವರ್ಷಕ್ಕೆ ₹5,00,000 ವರೆಗೆ ಉಚಿತ ಆಸ್ಪತ್ರೆ ಚಿಕಿತ್ಸೆ" (Free hospital treatment up to ₹5 Lakh per year).
     - **Who is covered?**: Your entire family (parents, children). No age limit.
     - **Where does it work?**: 28,000+ government and private hospitals across India.
     - **Cost to Apply**: **₹0.00 (ಸಂಪೂರ್ಣ ಉಚಿತ / Completely Free)**.
  3. Taps "Listen in Kannada / ಧ್ವನಿ ವಿವರಣೆ ಕೇಳಿ": Plays a 45-second audio explaining how to show the card at an empaneled hospital help desk (*Ayushman Mitra*).
  4. Primary CTA: "ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" (Check Required Documents).
- **Empty State**: N/A.
- **Loading State**: Content skeleton displaying hero card and bullet placeholders.
- **Error State**: Offline network drop while loading hospital list.
- **Recovery Flow**: Displays downloaded scheme core benefits with offline banner: "ಆಸ್ಪತ್ರೆಗಳ ಪಟ್ಟಿಯನ್ನು ನೋಡಲು ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿದೆ" (Internet needed to view live hospital network; core benefits saved offline).

---

### Journey 8: Required Document Checklist & Visual Verification

- **Actor**: Rameshwar Yadav (Farmer).
- **Goal**: Prepare his bank passbook and land record (*Khatauni*) correctly so his application is not rejected.
- **Happy Path**:
  1. On PM-KISAN document checklist, Rameshwar sees 3 items:
     - 1. Aadhaar Card (आधार कार्ड) - [Verified via DigiLocker ✓]
     - 2. Bank Passbook (बैंक पासबुक) - [Upload Required ⚠]
     - 3. Land Record Khatauni (खतौनी) - [Upload Required ⚠]
  2. Taps "बैंक पासबुक". An interactive **Visual Do's and Don'ts Guide** opens:
     - **DO (सही तरीका)**: Shows sample photo of passbook front page with clear green border: account number, IFSC code, customer photo, and official round bank stamp highlighted in green.
     - **DON'T (गलत तरीका)**: Shows sample of transaction history page with red border and warning: "लेन-देन वाला पन्ना मान्य नहीं है" (Transaction page is not acceptable).
  3. Taps "Take Photo". Camera opens with an overlay box: "Align the four corners of your passbook inside this box".
  4. Real-time smart validator confirms: "Lighting is good. Text is sharp". Photo captured.
- **Empty State**: For schemes with zero documents required (e.g. universal survey schemes), displays: "ಈ ಯೋಜನೆಗೆ ಯಾವುದೇ ದಾಖಲೆಗಳು ಬೇಕಾಗಿಲ್ಲ!" (No documents needed for this scheme!).
- **Loading State**: On-device processing spinner: "दस्तावेज़ की स्पष्टता जांची जा रही है..." (Checking document sharpness...).
- **Error State**: Citizen takes photo in dim light or text is blurry.
- **Recovery Flow**: Amber alert: "फोटो धुंधली है या बैंक का मुहर साफ़ नहीं दिख रहा है. कृपया रोशनी में दोबारा फोटो लें" (Photo is blurry or bank stamp is unreadable. Please retake photo in bright light) with a large "Retake Photo / दोबारा फोटो लें" button.

---

### Journey 9: Application Submission Guidance (Self vs. Assisted Mode)

- **Actor**: Lakshmi Venkatesh (Domestic worker).
- **Goal**: Submit maternity assistance application without being cheated by cyber café agents.
- **Happy Path**:
  1. Lakshmi reaches the submission stage.
  2. SAHAYAK presents two dignified, transparent pathways:
     - **Option A: Self-Service Online** ("ನಾನೇ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುತ್ತೇನೆ" - For users with Aadhaar OTP).
     - **Option B: Assisted CSC Seva Kendra Slip** ("ಗ್ರಾಮ ಒನ್ / ಸೇವಾ ಕೇಂದ್ರದ ಮೂಲಕ" - For users wanting physical counter assistance).
  3. Lakshmi selects **Option B (Assisted CSC Slip)**.
  4. SAHAYAK generates an official **"Seva Kendra Slip"**:
     - Includes a high-density QR code containing her verified pre-filled data.
     - Bold statutory warning banner in Kannada & English:
       **"ಸರ್ಕಾರಿ ಶುಲ್ಕ: ₹0.00 | ಸೇವಾ ಕೇಂದ್ರದ ಗರಿಷ್ಠ ಅಧಿಕೃತ ಶುಲ್ಕ: ₹30.00 ಮಾತ್ರ. ಹೆಚ್ಚಿನ ಹಣ ನೀಡಬೇಡಿ."**
       *(Govt Fee: ₹0.00 | Maximum authorized CSC charge: ₹30.00 only. Do not pay more).*
  5. Taps "Download / WhatsApp to Me".
  6. Takes the slip to her local Bangalore One / Grama One centre. The operator scans the QR; form is filed in 60 seconds without data entry errors.
- **Empty State**: N/A.
- **Loading State**: QR generation spinner with padlock security icon.
- **Error State**: Storage permission denied when downloading PDF slip.
- **Recovery Flow**: Displays QR code directly on screen with note: "ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಈ ಪರದೆಯನ್ನು ಆಪರೇಟರ್‌ಗೆ ತೋರಿಸಿ" (Take a screenshot or simply show this screen directly to the operator).

---

### Journey 10: Application Status Tracking & Grievance Escalation

- **Actor**: Arindam Mondal (Weaver).
- **Goal**: Track his PM SVANidhi loan application and know why it has been delayed past 15 days.
- **Happy Path**:
  1. Arindam taps "Application Tracker (ಸ್ಥಿತಿ / स्थिति)" in bottom navigation.
  2. Active application card appears: **PM SVANidhi Loan (₹10,000)** — Token: `#WB-SV-2026-9481`.
  3. A 4-stage visual progress stepper shows:
     - Stage 1: Submitted (12 Nov 2026) [Green ✓]
     - Stage 2: Municipal Vetting [Green ✓]
     - Stage 3: Bank Credit Sanction [Amber In-Progress ⏱ - 16 Days Elapsed]
     - Stage 4: DBT Loan Disbursement [Pending]
  4. A red "SLA Breached" badge appears: "Statutory deadline was 14 days. 2 days overdue."
  5. Audio button plays in Bengali/Hindi: *"আপনার আবেদনটি ব্যাংক কর্মকর্তার কাছে ১৬ দিন ধরে আটকে আছে। আপনি এখন সরাসরি অভিযোগ জানাতে পারেন"* (Your file has been with the bank officer for 16 days. You can now lodge an official grievance).
  6. Taps primary button: "Submit 1-Tap CPGRAMS Grievance" (ಅಧಿಕೃತ ದೂರು ದಾಖಲಿಸಿ).
- **Empty State**: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿಲ್ಲ" (You have not submitted any applications yet) with CTA: "ಹೊಸ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" (Discover Schemes).
- **Loading State**: Shimmering progress bar connecting 4 milestone dots.
- **Error State**: Invalid or unrecognised token number.
- **Recovery Flow**: Conversational prompt: "ಟೋಕನ್ ಸಂಖ್ಯೆ ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ" (Token number didn't match. Enter your registered mobile number to locate your application).

---

### Journey 11: "Sahayak Sathi" AI Assistance & Multilingual Voice Guidance

- **Actor**: Rameshwar Yadav (Farmer) & Sunita Rathod (Student).
- **Goal**: Ask open-ended questions in natural spoken vernacular and receive reliable, non-hallucinated answers grounded in official government gazettes.
- **Happy Path**:
  1. Rameshwar taps floating microphone button on any screen.
  2. Speaks in Bhojpuri/Hindi: *"हमार आधार कार्ड में नाम रमेश चंद्र बा, और खतौनी में रमेश यादव बा, का हमार पैसा रुक जाई?"* (My name is Ramesh Chandra on Aadhaar, but Ramesh Yadav on land record, will my money be stopped?).
  3. **Sahayak Sathi** processes the audio via Bhashini pipeline and answers with a clear visual card and soothing audio:
     *"हाँ भैया, नाम अलग होने से पैसा रुक सकता है. लेकिन घबराइए नहीं! आप अपनी खतौनी के साथ एक साधारण शपथ-पत्र (Affidavit) या पटवारी से नाम सुधार सत्यापन लगवा सकते हैं. क्या आप नाम सुधार की प्रक्रिया सुनना चाहते हैं?"*
     *(Yes brother, name mismatch can stop the payment. But do not worry! You can attach a simple name verification slip from your local Patwari. Would you like to hear the steps for name correction?).*
  4. Taps "हाँ, प्रक्रिया बताएं" (Yes, explain the steps).
- **Empty State**: Voice assistant opens with 3 suggested quick prompt chips:
  - "PM-KISAN की अगली किस्त कब आएगी?" (When will the next PM-KISAN installment arrive?).
  - "ರೇಷನ್ ಕಾರ್ಡ್ ತಿದ್ದುಪಡಿ ಹೇಗೆ ಮಾಡುವುದು?" (How to update Ration Card in Karnataka?).
  - "Scholarship income limit for OBC?"
- **Loading State**: Triple-dot bouncing audio equalizer bar with gentle pulse.
- **Error State**: AI engine cannot find official government rule for an obscure or unverified private scheme query.
- **Recovery Flow**: Truthful, grounded response: "यह सरकारी योजना डेटाबेस में नहीं है. हम केवल आधिकारिक केंद्र और राज्य योजनाओं की प्रमाणित जानकारी देते हैं. कृपया अपने नजदीकी ग्राम पंचायत से संपर्क करें" (This is not in the official government registry. We only provide verified public welfare information).
