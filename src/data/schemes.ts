import { Scheme } from '../types';
import { validateSchemes } from '../types/schemeValidation';

export const verifiedSchemes: Scheme[] = [
  {
    id: "pm-kisan",
    slug: "pm-kisan-samman-nidhi",
    titleKey: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    shortDescKey: "₹6,000 yearly income support transferred directly in 3 equal installments of ₹2,000 to landholding farmer families via DBT.",
    fullDescKey: "Pradhan Mantri Kisan Samman Nidhi is a central sector scheme with 100% funding from Government of India. Under the scheme, income support of ₹6,000/- per year in three equal installments is provided to all landholding farmer families with cultivable landholding in state revenue records, subject to statutory exclusions (amended May 31, 2019 to remove initial 2-hectare ceiling).",
    lifeEventId: "farming",
    ministryKey: "Ministry of Agriculture & Farmers Welfare",
    benefitType: "dbt_cash",
    benefitCategory: "annual_cash_transfer",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 6000,
      frequencyKey: "perYear",
      formattedDisplay: "₹6,000 / ವರ್ಷಕ್ಕೆ (₹6,000 / year cash DBT)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "Statutory Free Application (Order No. 1-1/2019-Credit-I)",
      cscAuthorizedCharge: "CSC VLE assistance charge capped at ₹15 for registration / eKYC"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "Order No. 1-1/2019-Credit-I, Dept of Agriculture & Farmers Welfare",
      cscAssistanceServiceCharge: {
        standardRate: 15,
        description: "Official CSC SPV facilitation charge for biometric eKYC / assisted form submission"
      }
    },
    processingTimeline: {
      slaDays: 21,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "State Nodal Department verification cycle"
    },
    sourceAttribution: "Ministry of Agriculture & Farmers Welfare, Revised Operational Guidelines (31.05.2019) • pmkisan.gov.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 21,
    handlingAuthorityKey: "Tehsildar / District Agriculture Officer",
    helplinePhone: "155261 / 011-24300606",
    officialPortalUrl: "https://pmkisan.gov.in",
    documents: [
      {
        id: "aadhaar",
        nameKey: "Aadhaar Card (eKYC Linked)",
        descriptionKey: "Biometric or OTP verified identity linked to bank account as mandated by Gazette Notification.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 2,
        digiLockerSupported: true,
        status: "verified"
      },
      {
        id: "land_record",
        nameKey: "Land Record (RTC / Khatauni / Khasra)",
        descriptionKey: "Certified revenue record establishing cultivable land title in state database (Bhoomi / Bhulekh).",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 5,
        digiLockerSupported: true,
        status: "pending"
      },
      {
        id: "bank_passbook",
        nameKey: "Bank Account Passbook (NPCI Seeded)",
        descriptionKey: "Front page showing Account Number, IFSC code, customer photo, and official bank seal.",
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
      socialCategories: ["all"],
      requiresLandTitle: true
    },
    keyBenefitsListKeys: [
      "₹2,000 transferred every 4 months directly via Public Financial Management System (PFMS)",
      "Universal landholding coverage (Cabinet decision dated 31.05.2019 removed 2-hectare ceiling)",
      "Seamless integration with Kisan Credit Card (KCC) for subsidized credit"
    ],
    whoIsEligibleListKeys: [
      "All farmer families who have cultivable land holding in their names in state land records (RTC/Khatauni)",
      "Aadhaar-seeded NPCI mapped active savings bank account holders"
    ],
    whoIsNotEligibleListKeys: [
      "Institutional landholders or tenant farmers without registered ownership title in state revenue records",
      "Farmer families in which one or more members are: Constitutional post holders, Ministers/MPs/MLAs, serving/retired Govt/PSU employees, monthly pensioners of ₹10,000+, Income Tax payees, or registered professionals (Doctors, Engineers, Lawyers, CAs)"
    ]
  },
  {
    id: "pm-jay",
    slug: "ayushman-bharat-pmjay",
    titleKey: "Ayushman Bharat (PM-JAY)",
    shortDescKey: "Secondary and tertiary hospital treatment cover of up to ₹5,00,000 per family per year across 28,000+ empaneled hospitals.",
    fullDescKey: "Pradhan Mantri Jan Arogya Yojana is the national health assurance scheme providing a cashless health cover of ₹5 Lakhs per family per year for secondary and tertiary hospitalization to families identified under SECC 2011 deprivation criteria, active NFSA/BPL cards, and senior citizens aged 70+ under Ayushman Vay Vandana.",
    lifeEventId: "health_elder",
    ministryKey: "National Health Authority (NHA), MoHFW",
    benefitType: "health_insurance",
    benefitCategory: "health_insurance_cover",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 500000,
      frequencyKey: "perYear",
      formattedDisplay: "₹5,00,000 / ವರ್ಷಕ್ಕೆ (₹5 Lakh hospital cover/year)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "Statutory Free Issuance at Public Hospitals (NHA Operational Guidelines)",
      cscAuthorizedCharge: "Nominal PVC Ayushman card print fee up to ₹30 at Common Service Centres"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "National Health Authority Operational Guidelines Clause 4.2",
      cscAssistanceServiceCharge: {
        standardRate: 30,
        description: "Authorized charge for laminated PVC Ayushman Card printing at CSC"
      }
    },
    processingTimeline: {
      slaDays: 7,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "NHA e-Card approval protocol"
    },
    sourceAttribution: "National Health Authority (NHA) Operational Guidelines • pmjay.gov.in",
    lastVerifiedDate: "November 2026",
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
      socialCategories: ["all"],
      requiresSeccOrBplRationCard: true
    },
    keyBenefitsListKeys: [
      "Cashless treatment at all empaneled public and private hospitals across India",
      "Covers 3 days pre-hospitalization and 15 days post-hospitalization diagnostics and medicines",
      "Pre-existing medical conditions covered from Day 1 without waiting periods"
    ],
    whoIsEligibleListKeys: [
      "Households identified in SECC 2011 deprivation criteria (D1-D7 rural, 11 occupational categories urban) or active state BPL/NFSA ration card records",
      "All senior citizens aged 70+ under the expanded Ayushman Vay Vandana card irrespective of household income"
    ],
    whoIsNotEligibleListKeys: [
      "Government employees entitled to CGHS/ECHS/State statutory medical schemes",
      "Households with active corporate or formal group health coverage exceeding statutory norms"
    ]
  },
  {
    id: "pmmvy",
    slug: "pradhan-mantri-matru-vandana",
    titleKey: "PMMVY (Pradhan Mantri Matru Vandana Yojana)",
    shortDescKey: "Direct maternity cash assistance of ₹5,000 in two installments for pregnant women to compensate wage loss and support nutrition.",
    fullDescKey: "PMMVY is a centrally sponsored conditional cash transfer scheme under Mission Shakti for pregnant women and lactating mothers for the first living child (₹5,000 in two installments) and ₹6,000 in a single installment for a second girl child to promote institutional health and counter female foeticide.",
    lifeEventId: "women_child",
    ministryKey: "Ministry of Women & Child Development",
    benefitType: "dbt_cash",
    benefitCategory: "one_time_cash",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 5000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹5,000 (ಒಮ್ಮೆ ಮಾತ್ರ / One-time maternity grant)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "Statutory Free Registration at Anganwadi / Health Centres (Mission Shakti Rules)",
      cscAuthorizedCharge: "Free assisted registration through Anganwadi / ASHA workers"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "Mission Shakti Operational Guidelines (WCD 2022)"
    },
    processingTimeline: {
      slaDays: 14,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "CDPO Project Office verification cycle"
    },
    sourceAttribution: "Ministry of Women & Child Development, Mission Shakti Operational Guidelines (2022) • pmmvy.wcd.gov.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 14,
    handlingAuthorityKey: "Anganwadi Worker / CDPO Office",
    helplinePhone: "1098 / 011-23382393",
    officialPortalUrl: "https://pmmvy.wcd.gov.in",
    documents: [
      {
        id: "mcp_card",
        nameKey: "Mother and Child Protection (MCP) Card",
        descriptionKey: "Issued at Anganwadi / Primary Health Centre with LMP date and ANC checkup stamps.",
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
      maxAge: 45,
      requiresMaternityStatus: true
    },
    keyBenefitsListKeys: [
      "Installment 1: ₹3,000 on early registration of pregnancy and at least 1 Antenatal Check-up (ANC) within 6 months of LMP",
      "Installment 2: ₹2,000 on registration of child birth and first cycle of immunization (BCG, OPV, DPT)",
      "Special ₹6,000 assistance if second child born is a girl to counter female foeticide"
    ],
    whoIsEligibleListKeys: [
      "Pregnant women and lactating mothers (PW&LM) who are not in regular service with Central/State Govt or PSUs",
      "Women holding e-Shram card, BPL ration card, or having annual family income below ₹8 Lakh"
    ],
    whoIsNotEligibleListKeys: [
      "Regular salaried government employees or those receiving paid maternity leave under the Maternity Benefit Act or service rules",
      "Male applicants or individuals who are not expectant/lactating mothers"
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
    benefitCategory: "loan_credit_facility",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 10000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹10,000 - ₹50,000 (ಸಾಲ / Working Capital Loan)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "No processing fee charged by lending institutions as per MoHUA guidelines",
      cscAuthorizedCharge: "CSC assisted loan application submission fee capped at ₹25"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "MoHUA Scheme Guidelines Clause 7.1",
      cscAssistanceServiceCharge: {
        standardRate: 25,
        description: "Authorized CSC VLE assisted application upload charge"
      }
    },
    processingTimeline: {
      slaDays: 10,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "Lead bank underwriting schedule"
    },
    sourceAttribution: "Ministry of Housing & Urban Affairs (MoHUA) Scheme Guidelines • pmsvanidhi.mohua.gov.in",
    lastVerifiedDate: "November 2026",
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
      minAge: 18,
      requiresStreetVendorCertificate: true
    },
    keyBenefitsListKeys: [
      "1st tranche: ₹10,000 loan with 1-year tenure; repaying on time unlocks 2nd tranche of ₹20,000 and 3rd of ₹50,000",
      "7% interest subsidy credited directly to bank account on early/timely repayment",
      "Up to ₹1,200 annual cashback on receiving customer payments through UPI QR codes"
    ],
    whoIsEligibleListKeys: [
      "Street vendors vending in urban areas possessing Certificate of Vending (CoV) or Letter of Recommendation (LoR) from Town Vending Committee",
      "Vendors from peri-urban/rural areas vending in geographical limits of urban local bodies"
    ],
    whoIsNotEligibleListKeys: [
      "Fixed store shopkeepers with permanent commercial property registration",
      "Individuals without verified street vending certification or municipality endorsement"
    ]
  },
  {
    id: "post-matric-scholarship",
    slug: "post-matric-scholarship-sc-obc",
    titleKey: "Post-Matric Scholarship for SC/OBC/Minority Students",
    shortDescKey: "Compulsory non-refundable fee reimbursement plus monthly maintenance allowance for students pursuing higher education.",
    fullDescKey: "Centrally sponsored scholarship scheme to significantly boost Gross Enrolment Ratio (GER) of students from SC, OBC, and economically backward classes in higher secondary, college, and university courses.",
    lifeEventId: "education_youth",
    ministryKey: "Ministry of Social Justice & Empowerment",
    benefitType: "scholarship",
    benefitCategory: "scholarship",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 14000,
      frequencyKey: "perYear",
      formattedDisplay: "₹14,000+ / ವರ್ಷಕ್ಕೆ (Tuition + Allowance)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "Statutory Free Application on National Scholarship Portal (NSP)",
      cscAuthorizedCharge: "National Scholarship Portal charges ₹0 official fee"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "Ministry of Social Justice Guidelines Section 8"
    },
    processingTimeline: {
      slaDays: 30,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "State scholarship portal verification window"
    },
    sourceAttribution: "Ministry of Social Justice & Empowerment Guidelines • scholarships.gov.in",
    lastVerifiedDate: "November 2026",
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
      maxAge: 35,
      requiresStudentEnrollment: true
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
    fullDescKey: "Kisan Credit Card scheme provides farmers with timely access to adequate short-term credit for cultivation, post-harvest expenses, and animal husbandry at subsidized interest rates.",
    lifeEventId: "farming",
    ministryKey: "Ministry of Agriculture & NABARD",
    benefitType: "credit_loan",
    benefitCategory: "loan_credit_facility",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 150000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹1,50,000 (ಸಾಲ ಮಿತಿ / Credit limit at 4%)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "Zero processing fee for loan limits up to ₹3.00 Lakh (RBI Master Circular)",
      cscAuthorizedCharge: "Bank loan application documentation fee ₹0 up to ₹3 Lakh"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "RBI Master Direction FIDD.CO.FSD.BC.No.12/05.05.010/2018-19"
    },
    processingTimeline: {
      slaDays: 14,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "Commercial Bank / RRB underwriting window"
    },
    sourceAttribution: "Reserve Bank of India (RBI) / NABARD Master Directions • rbi.org.in",
    lastVerifiedDate: "November 2026",
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
      maxAnnualIncome: 500000,
      requiresLandTitle: true
    },
    keyBenefitsListKeys: [
      "Interest subvention of 2% + additional 3% incentive for prompt repayment makes effective rate 4%",
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

// Perform runtime validation
const validationResult = validateSchemes(verifiedSchemes);
if (!validationResult.valid) {
  console.error("Scheme validation failed:", validationResult.errors);
}
