const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const bnTranslations = {
  // Brand & App
  appName: "সহায়ক",
  tagline: "আপনার ভাষায় সরকারি যোজনা",
  statutoryBadge: "সার্বভৌম কল্যাণ তথ্য নির্দেশিকা • সংবিধিবদ্ধ নাগরিক পোর্টাল",
  sovereignMotto: "অফিসিয়াল কল্যাণ তথ্য পোর্টাল • GOI ও রাজ্য সরকারি গাইড",

  // Navigation
  navHome: "আবিষ্কার",
  navEligibility: "যোগ্যতা যাচাই",
  navDocuments: "নথি নির্দেশিকা",
  navTracker: "আবেদন ট্র্যাকার",
  navProfile: "নাগরিক প্রোফাইল",
  navNotifications: "বিজ্ঞপ্তি",
  navBack: "পেছনে",
  navSkip: "এড়িয়ে যান",
  navNext: "পরবর্তী",
  navPrevious: "আগের",
  navSubmit: "জমা দিন",
  navCancel: "বাতিল",
  navClose: "বন্ধ করুন",
  navSave: "সংরক্ষণ",
  navReset: "রিসেট",
  navSearch: "প্রকল্প অনুসন্ধান...",

  // Language
  langSelectTitle: "আপনার ভাষা বেছে নিন",
  langSelectSubtitle: "সহায়ক কীভাবে আপনার সাথে কথা বলবে এবং তথ্য প্রদর্শন করবে তা নির্বাচন করুন:",
  langEn: "English",
  langKn: "ಕನ್ನಡ (Kannada)",
  langHi: "हिन्दी (Hindi)",
  langBn: "বাংলা (Bengali)",
  langVoiceTestKn: "ನಮಸ್ಕಾರ! ಸರ್ಕಾರದ ಯೋಜನೆಗಳನ್ನು ತಿಳಿಯಲು ಇದು ನಿಮ್ಮ ಸಹಾಯಕ.",
  langVoiceTestHi: "नमस्ते! मैं आपकी सरकारी योजनाओं में सहायता करूँगा.",
  langVoiceTestEn: "Welcome! I am your official welfare guide.",
  langVoiceTestBn: "নমস্কার! সরকারি প্রকল্প জানতে এটি আপনার সহায়ক।",
  dialectTitle: "আঞ্চলিক কথ্য রূপ (ঐচ্ছিক)",
  dialectStandard: "প্রমিত / সাহিত্যিক",
  dialectBhojpuri: "ভোজপুরী / অবধি সুর",
  dialectNorthKarnataka: "উত্তর কর্ণাটক টান",
  confirmLanguage: "ভাষা নিশ্চিত করে এগিয়ে যান",

  // Onboarding
  onboard1Title: "জীবনের প্রয়োজন অনুযায়ী প্রকল্প খুঁজুন",
  onboard1Desc: "জটিল মন্ত্রকের নামের বদলে কৃষি, শিক্ষা ও স্বাস্থ্যের মতো সাধারণ মানুষের প্রয়োজন অনুযায়ী সরকারি প্রকল্প খুঁজুন।",
  onboard2Title: "২ মিনিটে যোগ্যতা যাচাই করুন",
  onboard2Desc: "ভয়েস বা ট্যাপের মাধ্যমে ৪টি সহজ প্রশ্নের উত্তর দিন। কোনো জটিল ফর্ম নেই, কোনো বিভ্রান্তি নেই।",
  onboard3Title: "শূন্য দালাল ও সংবিধিবদ্ধ ফি স্বচ্ছতা",
  onboard3Desc: "অফিসিয়াল সরকারি আবেদন ফি ₹০.০০। একটি প্রাক-যাচাইকৃত সিএসসি স্লিপ তৈরি করুন যাতে কোনো দালাল অতিরিক্ত টাকা দাবি করতে না পারে।",
  getStarted: "এখনই শুরু করুন",

  // Home & Life Events
  heroVoiceSearchPrompt: "আপনার ভাষায় বলুন বা লিখুন (যেমন: কৃষক ঋণ, গৃহলক্ষ্মী)...",
  heroVoiceSearchCta: "কথা বলুন",
  urgentNoticeTitle: "মৌসুমি কল্যাণ সতর্কতা",
  urgentNoticeDesc: "খরিফ ফসল সহায়তার আবেদন চলছে। রাজস্ব পোর্টালে আপনার জমির রেকর্ড (RTC/খতিয়ান) যাচাই করে সময়সীমার আগে আবেদন করুন।",
  lifeEventsTitle: "পারিবারিক প্রয়োজন অনুযায়ী অন্বেষণ",
  lifeEventsSubtitle: "আপনার পরিবারের জন্য প্রযোজ্য কল্যাণ ক্ষেত্রটি নির্বাচন করুন:",
  catalogTitle: "সরকারি প্রকল্প ডিরেক্টরি",
  viewDetailsBtn: "বিস্তারিত দেখুন",
  checkEligibilityBtn: "যোগ্যতা যাচাই করুন",
  sourceAttributionLabel: "উৎস",
  lastVerifiedLabel: "যাচাইয়ের তারিখ",
  officialSla: "সংবিধিবদ্ধ এসএলএ",
  statutoryFreeFee: "সরকারি ফি: ₹০.০০ (বিনামূল্যে)",
  demoDataBadge: "প্রমাণীকরণ প্রোটোটাইপ",
  filterAll: "সকল প্রকল্প",
  days: "দিন",
  perYear: "প্রতি বছর",
  directDbtBank: "সরাসরি ডিবিটি ব্যাংক ক্রেডিট",

  // Life Events Categories
  lifeEvent_farming: "কৃষি ও চাষাবাদ",
  lifeEvent_farming_desc: "ফসল সহায়তা, বীজ ভর্তুকি ও কিষাণ ক্রেডিট কার্ড",
  lifeEvent_women_child: "মহিলা ও শিশু কল্যাণ",
  lifeEvent_women_child_desc: "গৃহলক্ষ্মী ডিবিটি, পুষ্টি ও মাতৃত্বকালীন সহায়তা",
  lifeEvent_health_elder: "স্বাস্থ্য ও প্রবীণ যত্ন",
  lifeEvent_health_elder_desc: "আয়ুষ্মান ভারত ₹৫ লক্ষ ক্যাশলেস কভার ও পেনশন",
  lifeEvent_education_youth: "শিক্ষা ও যুব সহায়তা",
  lifeEvent_education_youth_desc: "মেধা বৃত্তি, বিনামূল্যে ল্যাপটপ ও যুবনিধি ভাতা",
  lifeEvent_business_artisan: "ব্যবসা ও কারিগর ঋণ",
  lifeEvent_business_artisan_desc: "মুদ্রা ও পিএম বিশ্বকর্মা জামানতমুক্ত ঋণ",
  lifeEvent_housing_utilities: "আবাসন ও সৌর বিদ্যুৎ",
  lifeEvent_housing_utilities_desc: "পিএম আবাস গৃহনির্মাণ ও পিএম সূর্য ঘর বিনামূল্যে বিদ্যুৎ",

  // Results & Evaluation
  resultsTitle: "আপনার সম্ভাব্য অধিকার ফলাফল",
  resultsSubtitle: "আপনার পরিবারের সরকারি কল্যাণ অধিকার যাচাই করুন",
  totalAnnualBenefit: "মোট সম্ভাব্য বার্ষিক সুবিধা",
  preliminaryGuidanceDisclaimer: "এই মূল্যায়ন স্ব-প্রতিবেদিত তথ্যের ভিত্তিতে প্রাথমিক নির্দেশিকা প্রদান করে। সরকারি প্রকল্পের চূড়ান্ত অনুমোদন উপযুক্ত সরকারি বিভাগের নথিপত্র যাচাইকরণের ওপর নির্ভরশীল।",
  cashBenefitBreakdown: "প্রত্যক্ষ নগদ হস্তান্তর (ডিবিটি)",
  nonCashBenefitBreakdown: "স্বাস্থ্য কভার ও অন্যান্য সুবিধা",
  actionableNextSteps: "পরবর্তী পদক্ষেপ নির্দেশিকা",
  noEligibleSchemesFound: "বর্তমান তথ্যের ভিত্তিতে সরাসরি কোনো প্রকল্প মেলেনি",
  matchingSchemesTab: "যোগ্য প্রকল্পসমূহ",
  alternateSchemesTab: "বিকল্প সুবিধাসমূহ",
  prepareDocumentsBtn: "নথি প্রস্তুত করুন ও আবেদন করুন",

  // Eligibility 5 Distinct Statuses
  statusNotAssessed: "মূল্যায়ন সম্পন্ন হয়নি",
  statusNotAssessedDesc: "আপনি এখনও যোগ্যতা মূল্যায়ন সম্পন্ন করেননি। সম্ভাব্য অধিকার জানতে ৪টি প্রশ্নের উত্তর দিন।",
  statusInProgress: "মূল্যায়ন প্রক্রিয়াধীন",
  statusInProgressDesc: "প্রশ্নাবলী আংশিক সম্পন্ন। সম্পূর্ণ অধিকার হিসাব করতে অনুগ্রহ করে সব প্রশ্নের উত্তর দিন।",
  statusPotentiallyEligible: "সম্ভাব্য যোগ্য",
  statusPotentiallyEligibleDesc: "আপনার দেওয়া তথ্যের ভিত্তিতে আপনি এই কল্যাণমূলক প্রকল্পগুলির প্রাথমিক মানদণ্ড পূরণ করেন।",
  statusNotEstablished: "যোগ্যতা প্রতিষ্ঠিত হয়নি",
  statusNotEstablishedDesc: "আপনার বর্তমান তথ্যের সাথে মিল রেখে কোনো সরকারি প্রকল্প সনাক্ত করা যায়নি।",
  statusAdditionalVerification: "অতিরিক্ত যাচাইকরণ প্রয়োজন",
  statusAdditionalVerificationDesc: "নির্দিষ্ট রাজস্ব নথি বা সনদের ওপর ভিত্তি করে আপনি যোগ্য হতে পারেন।",

  // Disclaimers
  disclaimer_preliminary_guidance: "সংবিধিবদ্ধ সতর্কতা: এটি ব্যবহারকারীর স্ব-প্রতিবেদিত তথ্যের ভিত্তিতে কেবল প্রাথমিক নির্দেশিকা। এটি কোনো আইনি বা সরকারি গ্যারান্টি নয়। চূড়ান্ত সুবিধা সংশ্লিষ্ট সরকারি আধিকারিকের যাচাইয়ের ওপর নির্ভরশীল।",
  disclaimer_not_assessed: "এখনও মূল্যায়ন করা হয়নি। আপনার প্রযোজ্য অধিকার দেখতে ২ মিনিটের মূল্যায়ন সম্পন্ন করুন।",
  disclaimer_in_progress: "প্রশ্নাবলী অসমাপ্ত। প্রাথমিক নির্দেশিকা পেতে সব প্রয়োজনীয় তথ্য পূরণ করুন।",

  // Document Checklist
  docChecklistTitle: "প্রয়োজনীয় নথি তালিকা",
  docChecklistSubtitle: "আবেদন বাতিল হওয়া এড়াতে আবেদন করার আগেই নথিপত্র ১০০% প্রস্তুত রাখুন।",
  readinessMeter: "প্রস্তুতি মিটার",
  seeCorrectSample: "সঠিক নমুনা দেখুন",
  dosAndDontsTitle: "নথিপত্র আপলোড করার সঠিক পদ্ধতি",
  correctWay: "সঠিক পদ্ধতি (পরামর্শযোগ্য)",
  wrongWay: "ভুল পদ্ধতি (এটি করবেন না)",
  passbookDo: "পাসবইয়ের প্রথম পৃষ্ঠা যেখানে অ্যাকাউন্ট নম্বর, IFSC কোড, ব্যাংকের সিল ও ছবি পরিষ্কার দেখা যায়।",
  passbookDont: "লেনদেনের পৃষ্ঠা বা অস্পষ্ট ঝাপসা ছবি যেখানে নম্বর কাটা পড়েছে তা আপলোড করবেন না।",
  digiLockerPull: "ডিজিলকার থেকে আনুন (নমুনা)",
  takePhoto: "ক্যামেরা দিয়ে স্ক্যান করুন",
  blurDetected: "সতর্কতা: ছবি ঝাপসা বা সিল অস্পষ্ট। অনুগ্রহ করে পর্যাপ্ত আলোতে পুনরায় ছবি তুলুন।",

  // Guidance
  guidanceTitle: "আবেদন জমা দেওয়ার নির্দেশিকা",
  guidanceSubtitle: "আপনি কীভাবে আবেদন জমা দিতে চান তা নির্বাচন করুন:",
  pathSelfOnline: "পদ্ধতি ১: আমি নিজে অনলাইনে আবেদন করব",
  pathSelfOnlineDesc: "আধার ওটিপির মাধ্যমে অফিশিয়াল সরকারি পোর্টালে সরাসরি আবেদন করুন।",
  pathAssistedCsc: "পদ্ধতি ২: জনসেবা কেন্দ্র (CSC) সহায়তাপ্রাপ্ত স্লিপ",
  pathAssistedCscDesc: "কিউআর কোডযুক্ত অফিসিয়াল প্রাক-যাচাইকৃত রসিদ স্লিপ তৈরি করুন। এটি যেকোনো সিএসসি বা গ্রাম ওয়ান কেন্দ্রে দেখান।",
  statutoryFeeGuarantee: "অফিসিয়াল ফি নিয়ন্ত্রণ: সরকারি আবেদন ফি ₹০.০০। জনসেবা কেন্দ্রের সর্বোচ্চ অনুমোদিত সুবিধা চার্জ মাত্র ₹৩০.০০। অতিরিক্ত কোনো দালালি ফি দেবেন না।",
  generateQrSlipBtn: "সিএসসি স্লিপ প্রস্তুত করুন",
  submitWithAadhaarBtn: "আধার ওটিপি দিয়ে জমা দিন",
  simulationNotice: "প্রোটোটাইপ প্রদর্শন নোটিশ: এটি একটি নির্দেশমূলক ডেমো। এটি কোনো আনুষ্ঠানিক সরকারি রেকর্ড পরিবর্তন করে না।",

  // Tracker
  trackerTitle: "আবেদন অগ্রগতি ট্র্যাকার",
  trackerSubtitle: "স্বচ্ছ ৪-ধাপের সময়সীমা এবং অফিসার হ্যান্ডলিং সহ আপনার আবেদনের অবস্থান জানুন।",
  tokenNumber: "আবেদন টোকেন নম্বর",
  submittedOn: "আবেদনের তারিখ",
  currentStage: "বর্তমান অবস্থা",
  handlingOfficer: "যাচাইকারী আধিকারিক",
  statutoryDeadline: "সংবিধিবদ্ধ সময়সীমা",
  daysRemaining: "দিন বাকি আছে",
  slaOverdue: "সময়সীমা উত্তীর্ণ: সিটিজেন চার্টারের নির্ধারিত সময় অতিক্রান্ত হয়েছে। আপনি অভিযোগ দায়ের করতে পারেন।",
  fileGrievanceBtn: "অফিসিয়াল অভিযোগ দায়ের করুন (CPGRAMS)",
  downloadReceipt: "অফিসিয়াল রসিদ ডাউনলোড করুন",
  noActiveApps: "আপনার কোনো সক্রিয় আবেদন নেই। প্রকল্প খুঁজুন এবং যোগ্যতা যাচাই করুন।",

  // AI Assistant
  aiAssistantTitle: "সহায়ক সাথী (এআই ভয়েস)",
  aiAssistantSubtitle: "সরকারি গেজেট ও বিধিবিধানের ভিত্তিতে যেকোনো সরকারি প্রকল্প সম্পর্কে আপনার ভাষায় জিজ্ঞাসা করুন।",
  promptChip1: "পিএম-কিসানের পরবর্তী কিস্তি কবে আসবে?",
  promptChip2: "আয়ুষ্মান কার্ডের জন্য কী কী নথি লাগবে?",
  promptChip3: "ভাগচাষি কি ফসল সহায়তা পেতে পারেন?",
  aiListening: "শুনছি... আপনার ভাষায় কথা বলুন",
  aiThinking: "সরকারি নিয়ম যাচাই করা হচ্ছে...",
  aiPlaceholder: "সরকারি প্রকল্প সম্পর্কে যেকোনো প্রশ্ন করুন...",

  // Profile & Notifications
  profileTitle: "নাগরিক ও পারিবারিক প্রোফাইল",
  householdMembers: "পরিবারের সদস্যবৃন্দ",
  addMemberBtn: "নতুন সদস্য যোগ করুন",
  notificationsTitle: "সতর্কতা ও অডিও বার্তা",
  markAllRead: "সব পড়া হয়েছে হিসেবে চিহ্নিত করুন",
  unreadBadge: "নতুন",
  themeToggle: "থিম পরিবর্তন করুন"
};

// Check if bn is already present
if (!content.includes('  bn: {')) {
  const insertionPoint = content.lastIndexOf('  }\n};');
  if (insertionPoint !== -1) {
    const bnString = '  },\n  bn: ' + JSON.stringify(bnTranslations, null, 4) + '\n};';
    content = content.slice(0, insertionPoint) + bnString;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected bn dictionary into translations.ts');
  } else {
    console.error('Could not find insertion point in translations.ts');
  }
} else {
  console.log('bn already present in translations.ts');
}
