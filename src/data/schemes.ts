import { Scheme } from '../types';

export const verifiedSchemes: Scheme[] = [
  {
    id: "pm-kisan",
    slug: "pm-kisan-samman-nidhi",
    titleKey: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    shortDescKey: "₹6,000 yearly income support transferred directly in 3 equal installments of ₹2,000 to landholding farmer families.",
    fullDescKey: "Pradhan Mantri Kisan Samman Nidhi is a central sector scheme with 100% funding from Government of India. Under the scheme, income support of ₹6,000/- per year in three equal installments is provided to all landholding farmer families.",
    lifeEventId: "farming",
    ministryKey: "Ministry of Agriculture & Farmers Welfare",
    benefitType: "dbt_cash",
    financialBenefit: {
      amount: 6000,
      frequencyKey: "perYear",
      formattedDisplay: "₹6,000 / ವರ್ಷಕ್ಕೆ (₹6,000 / year)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true
    },
    processingSlaDays: 21,
    handlingAuthorityKey: "Tehsildar / District Agriculture Officer",
    helplinePhone: "155261 / 011-24300606",
    officialPortalUrl: "https://pmkisan.gov.in",
    documents: [
      {
        id: "aadhaar",
        nameKey: "Aadhaar Card (eKYC Linked)",
        descriptionKey: "Mandatory biometric/OTP verified identity linked to bank account.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 2,
        digiLockerSupported: true,
        status: "verified"
      },
      {
        id: "land_record",
        nameKey: "Land Record (RTC / Khatauni / Khasra)",
        descriptionKey: "Certified revenue record establishing cultivable land title in state database (Bhoomi/Bhulekh).",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 5,
        digiLockerSupported: true,
        status: "pending"
      },
      {
        id: "bank_passbook",
        nameKey: "Bank Account Passbook (NPCI Seeded)",
        descriptionKey: "First page showing Account Number, IFSC code, photo and clear official bank seal.",
        isMandatory: true,
        acceptableFormats: ["JPEG", "PNG", "PDF"],
        maxSizeMb: 3,
        digiLockerSupported: false,
        sampleCorrectUrl: "/samples/passbook-correct.jpg",
        sampleWrongUrl: "/samples/passbook-wrong.jpg",
        commonErrorKey: "passbookDo",
        status: "pending"
      }
    ],
    eligibilityCriteria: {
      occupations: ["farmer"],
      maxLandholdingAcres: 5.0,
      socialCategories: ["all"]
    },
    keyBenefitsListKeys: [
      "₹2,000 transferred directly every 4 months via Direct Benefit Transfer (DBT)",
      "Zero collateral requirements; continuous funding as long as land title is active",
      "Seamless integration with Kisan Credit Card (KCC) for subsidized credit"
    ],
    whoIsEligibleListKeys: [
      "Small and marginal farmer families with cultivable land in official land records",
      "Farmers with Aadhaar-linked NPCI active bank accounts"
    ],
    whoIsNotEligibleListKeys: [
      "Institutional landholders or tenant farmers without registered title in state database",
      "Families where any member pays income tax or holds a permanent government job"
    ]
  },
  {
    id: "pm-jay",
    slug: "ayushman-bharat-pmjay",
    titleKey: "Ayushman Bharat (PM-JAY)",
    shortDescKey: "Free cashless secondary and tertiary hospital treatment cover of up to ₹5,00,000 per family per year across 28,000+ hospitals.",
    fullDescKey: "Pradhan Mantri Jan Arogya Yojana is the flagship health assurance scheme providing a health cover of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.",
    lifeEventId: "health_elder",
    ministryKey: "National Health Authority (NHA), MoHFW",
    benefitType: "health_insurance",
    financialBenefit: {
      amount: 500000,
      frequencyKey: "perYear",
      formattedDisplay: "₹5,00,000 / ವರ್ಷಕ್ಕೆ (₹5 Lakh cover/year)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true
    },
    processingSlaDays: 7,
    handlingAuthorityKey: "District Health Society / Ayushman Mitra",
    helplinePhone: "14555",
    officialPortalUrl: "https://pmjay.gov.in",
    documents: [
      {
        id: "aadhaar",
        nameKey: "Aadhaar Card",
        descriptionKey: "Identity card for biometric verification.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 2,
        digiLockerSupported: true,
        status: "verified"
      },
      {
        id: "ration_card",
        nameKey: "Ration Card (BPL / Antyodaya / NFSA)",
        descriptionKey: "Food security ration card establishing family member composition.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 3,
        digiLockerSupported: true,
        status: "pending"
      }
    ],
    eligibilityCriteria: {
      maxAnnualIncome: 250000,
      socialCategories: ["all"]
    },
    keyBenefitsListKeys: [
      "Cashless and paperless treatment at all empaneled public and private hospitals across India",
      "Covers 3 days pre-hospitalization and 15 days post-hospitalization expenses including medicines",
      "No restriction on family size, age, or gender; pre-existing medical conditions covered from Day 1"
    ],
    whoIsEligibleListKeys: [
      "Households registered in SECC 2011 deprivation categories or active NFSA ration card holders",
      "All senior citizens aged 70+ (universal Ayushman Vay Vandana top-up)"
    ],
    whoIsNotEligibleListKeys: [
      "Households owning motorized 3/4 wheelers or agricultural equipment over 50,000 value",
      "Government employees entitled to CGHS/ECHS/State government health schemes"
    ]
  },
  {
    id: "pmmvy",
    slug: "pradhan-mantri-matru-vandana",
    titleKey: "PMMVY (Pradhan Mantri Matru Vandana Yojana)",
    shortDescKey: "Direct financial maternity cash benefit of ₹5,000 in two installments for pregnant women to support wage loss and nutrition.",
    fullDescKey: "PMMVY is a conditional cash transfer scheme for pregnant and lactating mothers for the first living child (and ₹6,000 for a second girl child) to promote institutional care and safe delivery.",
    lifeEventId: "women_child",
    ministryKey: "Ministry of Women & Child Development",
    benefitType: "dbt_cash",
    financialBenefit: {
      amount: 5000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹5,000 (ಒಮ್ಮೆ ಮಾತ್ರ / One-time)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true
    },
    processingSlaDays: 14,
    handlingAuthorityKey: "Anganwadi Worker / CDPO Office",
    helplinePhone: "1098 / 011-23382393",
    officialPortalUrl: "https://pmmvy.wcd.gov.in",
    documents: [
      {
        id: "mcp_card",
        nameKey: "Mother and Child Protection (MCP) Card",
        descriptionKey: "Issued at Anganwadi/Health Center with LMP date and ANC checkup stamps.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 3,
        digiLockerSupported: false,
        status: "pending"
      },
      {
        id: "aadhaar_couple",
        nameKey: "Aadhaar Card of Mother",
        descriptionKey: "Aadhaar card linked to beneficiary's bank account.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 2,
        digiLockerSupported: true,
        status: "verified"
      },
      {
        id: "bank_passbook",
        nameKey: "Bank Passbook of Mother",
        descriptionKey: "Individual bank account passbook with IFSC code.",
        isMandatory: true,
        acceptableFormats: ["JPEG", "PDF"],
        maxSizeMb: 3,
        digiLockerSupported: false,
        status: "pending"
      }
    ],
    eligibilityCriteria: {
      genderAllowed: ["female"],
      minAge: 19,
      maxAge: 45
    },
    keyBenefitsListKeys: [
      "Installment 1: ₹3,000 on early registration of pregnancy and at least 1 Antenatal Check-up (ANC)",
      "Installment 2: ₹2,000 on registration of child birth and first cycle of immunization (BCG, OPV, DPT)",
      "Special ₹6,000 assistance if second child born is a girl to counter gender imbalance"
    ],
    whoIsEligibleListKeys: [
      "Pregnant women and lactating mothers who are not in regular service with Central/State Govt or PSUs",
      "Women holding e-Shram card, BPL ration card, or having annual income below ₹8 Lakh"
    ],
    whoIsNotEligibleListKeys: [
      "Regular salaried government employees with paid maternity leave benefits"
    ]
  },
  {
    id: "pm-svanidhi",
    slug: "pm-street-vendors-atmanirbhar-nidhi",
    titleKey: "PM SVANidhi (Micro-Credit for Street Vendors)",
    shortDescKey: "Collateral-free working capital loan of ₹10,000 to ₹50,000 with 7% interest subsidy and digital cashback for urban hawkers and vendors.",
    fullDescKey: "PM SVANidhi provides affordable collateral-free working capital micro-loans to urban street vendors to resume their livelihoods with incentives for timely repayment and digital transactions.",
    lifeEventId: "business_artisan",
    ministryKey: "Ministry of Housing & Urban Affairs (MoHUA)",
    benefitType: "credit_loan",
    financialBenefit: {
      amount: 10000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹10,000 - ₹50,000 (ಸಾಲ / Loan)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true
    },
    processingSlaDays: 10,
    handlingAuthorityKey: "Urban Local Body (Municipality) & Lead Bank",
    helplinePhone: "1800-11-1979",
    officialPortalUrl: "https://pmsvanidhi.mohua.gov.in",
    documents: [
      {
        id: "cov_id",
        nameKey: "Certificate of Vending (CoV) / Identity Card",
        descriptionKey: "Issued by Town Vending Committee / Municipal Corporation or Letter of Recommendation (LoR).",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 3,
        digiLockerSupported: true,
        status: "pending"
      },
      {
        id: "aadhaar",
        nameKey: "Aadhaar Card",
        descriptionKey: "Aadhaar linked to active mobile number.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 2,
        digiLockerSupported: true,
        status: "verified"
      },
      {
        id: "bank_passbook",
        nameKey: "Bank Passbook",
        descriptionKey: "Savings bank account passbook for loan disbursement.",
        isMandatory: true,
        acceptableFormats: ["JPEG", "PDF"],
        maxSizeMb: 3,
        digiLockerSupported: false,
        status: "pending"
      }
    ],
    eligibilityCriteria: {
      occupations: ["street_vendor", "artisan", "self_employed"],
      minAge: 18
    },
    keyBenefitsListKeys: [
      "1st tranche: ₹10,000 loan with 1-year tenure; repaying on time unlocks 2nd tranche of ₹20,000 and 3rd of ₹50,000",
      "7% interest subsidy credited directly to bank account on early/timely repayment",
      "Up to ₹1,200 annual cashback on receiving customer payments through UPI QR codes"
    ],
    whoIsEligibleListKeys: [
      "Street vendors vending in urban areas possessing Certificate of Vending or Recommendation Letter",
      "Vendors from peri-urban/rural areas vending in geographical limits of urban local bodies"
    ],
    whoIsNotEligibleListKeys: [
      "Fixed store shopkeepers with permanent commercial property registration"
    ]
  },
  {
    id: "post-matric-scholarship",
    slug: "post-matric-scholarship-sc-obc",
    titleKey: "Post-Matric Scholarship for SC/OBC/Minority Students",
    shortDescKey: "Complete tuition fee reimbursement plus monthly maintenance allowance for students pursuing higher education (Class 11 to PG).",
    fullDescKey: "Centrally sponsored scholarship scheme to significantly boost Gross Enrolment Ratio (GER) of students from SC, OBC, and economically backward classes in higher secondary, college, and university courses.",
    lifeEventId: "education_youth",
    ministryKey: "Ministry of Social Justice & Empowerment",
    benefitType: "scholarship",
    financialBenefit: {
      amount: 14000,
      frequencyKey: "perYear",
      formattedDisplay: "₹14,000+ / ವರ್ಷಕ್ಕೆ (Tuition + Allowance)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true
    },
    processingSlaDays: 30,
    handlingAuthorityKey: "District Social Welfare Officer",
    helplinePhone: "0120-6619540",
    officialPortalUrl: "https://scholarships.gov.in",
    documents: [
      {
        id: "caste_cert",
        nameKey: "Caste Certificate",
        descriptionKey: "Issued by authorized revenue authority (Tahsildar/SDM) with digital barcode.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 3,
        digiLockerSupported: true,
        status: "verified"
      },
      {
        id: "income_cert",
        nameKey: "Income Certificate (Current Year)",
        descriptionKey: "Annual family income certificate valid for current financial year.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 3,
        digiLockerSupported: true,
        status: "pending"
      },
      {
        id: "marksheet",
        nameKey: "Previous Qualifying Exam Marksheet",
        descriptionKey: "Class 10/12/Degree marksheet with minimum passing grade.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 4,
        digiLockerSupported: true,
        status: "verified"
      }
    ],
    eligibilityCriteria: {
      maxAnnualIncome: 250000,
      socialCategories: ["sc", "st", "obc", "minority"],
      minAge: 15,
      maxAge: 35
    },
    keyBenefitsListKeys: [
      "100% compulsory non-refundable fees (tuition, examination, library) reimbursed directly to student bank account",
      "Monthly maintenance allowance up to ₹1,200/month for hostellers and ₹550/month for day scholars",
      "Additional allowance for books, study tours, and specialized equipment for students with disabilities"
    ],
    whoIsEligibleListKeys: [
      "Indian national students belonging to SC/ST/OBC categories enrolled in recognized colleges or ITIs",
      "Total family income from all sources not exceeding ₹2.5 Lakh per annum"
    ],
    whoIsNotEligibleListKeys: [
      "Students already receiving any other central/state scholarship for the same degree",
      "Students pursuing studies through unapproved private correspondence institutes"
    ]
  },
  {
    id: "pm-kcc",
    slug: "kisan-credit-card-crop-loan",
    titleKey: "Kisan Credit Card (KCC) Subsidized Crop Credit",
    shortDescKey: "Concessional credit limit up to ₹3,00,000 at an effective interest rate of just 4% per annum with prompt repayment incentive.",
    fullDescKey: "Kisan Credit Card scheme provides farmers with timely access to adequate short-term credit for cultivation, post-harvest expenses, and animal husbandry at heavily subsidized interest rates.",
    lifeEventId: "farming",
    ministryKey: "Ministry of Agriculture & NABARD",
    benefitType: "credit_loan",
    financialBenefit: {
      amount: 150000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹1,50,000 (ಸಾಲ ಮಿತಿ / Credit limit at 4%)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true
    },
    processingSlaDays: 14,
    handlingAuthorityKey: "Lead Commercial Bank / Regional Rural Bank (RRB)",
    helplinePhone: "1800-180-1551",
    officialPortalUrl: "https://pmkisan.gov.in",
    documents: [
      {
        id: "land_rtc",
        nameKey: "Land Record (Pahani / RTC)",
        descriptionKey: "Land record establishing crop pattern for the current agricultural season.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 5,
        digiLockerSupported: true,
        status: "pending"
      },
      {
        id: "aadhaar",
        nameKey: "Aadhaar Card",
        descriptionKey: "Identity and KYC verification.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 2,
        digiLockerSupported: true,
        status: "verified"
      }
    ],
    eligibilityCriteria: {
      occupations: ["farmer"],
      maxAnnualIncome: 500000
    },
    keyBenefitsListKeys: [
      "Interest subvention of 2% + additional 3% incentive for prompt repayment makes effective rate only 4%",
      "No collateral required for loans up to ₹1.60 Lakh; flexible withdrawal via ATM debit card",
      "Includes crop insurance under PM Fasal Bima Yojana (PMFBY)"
    ],
    whoIsEligibleListKeys: [
      "All farmers — individuals/joint borrowers who are owner cultivators or tenant farmers with registered tenancy",
      "Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers"
    ],
    whoIsNotEligibleListKeys: [
      "Defaulters with outstanding non-performing agricultural loans at commercial banks"
    ]
  }
];
