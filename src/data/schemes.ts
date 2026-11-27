import { Scheme } from '../types';

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
      "Farmer families in which one or more members are: Constitutional post holders, Ministers/MPs/MLAs, serving/retired Govt/PSU employees (excluding MTS/Group D), monthly pensioners of ₹10,000+, Income Tax payees, or registered professionals (Doctors, Engineers, Lawyers, CAs)"
    ],
    rulesRegistry: [
      {
        ruleId: "PMK-R01",
        ruleDescription: "Universal landholder coverage: All farmer families owning cultivable land in state revenue records are eligible regardless of landholding size.",
        issuingAuthority: "Ministry of Agriculture & Farmers Welfare, GoI",
        officialDocumentTitle: "Operational Guidelines for Pradhan Mantri Kisan Samman Nidhi",
        exactSourceUrl: "https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf",
        applicableClauseOrSection: "Clause 2 (Definition of Beneficiary)",
        notificationDate: "2019-05-31",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      },
      {
        ruleId: "PMK-R02",
        ruleDescription: "Statutory Exclusion: Institutional landholders, serving/retired govt/PSU employees (excluding MTS/Group D), pensioners ≥ ₹10,000/mo, income tax payees, and professionals are excluded.",
        issuingAuthority: "Ministry of Agriculture & Farmers Welfare, GoI",
        officialDocumentTitle: "Operational Guidelines for Pradhan Mantri Kisan Samman Nidhi",
        exactSourceUrl: "https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf",
        applicableClauseOrSection: "Clause 2(b) (Exclusion Categories)",
        notificationDate: "2019-05-31",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      }
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
    sourceAttribution: "National Health Authority (NHA) Operational Guidelines & Ayushman Vay Vandana Notification • pmjay.gov.in",
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
      "Households covered under separate statutory comprehensive schemes (such as CGHS / ECHS / State Medical Attendance Rules), where departmental rules supersede general Ayushman Bharat coverage",
      "Households not mapped in SECC 2011 deprivation categories or active state NFSA food security ration records"
    ],
    rulesRegistry: [
      {
        ruleId: "PMJ-R01",
        ruleDescription: "SECC 2011 & NFSA Beneficiary Identification: Target families identified based on SECC 2011 deprivation criteria (D1-D7 rural, 11 occupational categories urban) or active state NFSA BPL cards.",
        issuingAuthority: "National Health Authority, MoHFW",
        officialDocumentTitle: "PM-JAY Guidelines on Beneficiary Identification",
        exactSourceUrl: "https://pmjay.gov.in/sites/default/files/2020-01/Operational-Guidelines-for-PMJAY.pdf",
        applicableClauseOrSection: "Section 3.1",
        notificationDate: "2018-09-23",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      },
      {
        ruleId: "PMJ-R02",
        ruleDescription: "Ayushman Vay Vandana: All senior citizens aged 70 and above are eligible for ₹5 Lakh hospitalization coverage regardless of household income.",
        issuingAuthority: "Ministry of Health & Family Welfare, GoI",
        officialDocumentTitle: "Ayushman Bharat PM-JAY Senior Citizens (70+) Gazette Notification S.O. 4668(E)",
        exactSourceUrl: "https://pmjay.gov.in",
        applicableClauseOrSection: "Gazette Notification S.O. 4668(E)",
        notificationDate: "2024-10-28",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      }
    ]
  },
  {
    id: "pmmvy",
    slug: "pradhan-mantri-matru-vandana",
    titleKey: "PMMVY (Pradhan Mantri Matru Vandana Yojana)",
    shortDescKey: "Direct maternity cash assistance of ₹5,000 for 1st child and ₹6,000 for 2nd girl child to support maternal nutrition and institutional health.",
    fullDescKey: "PMMVY is a centrally sponsored conditional cash transfer scheme under Mission Shakti for pregnant women and lactating mothers: ₹5,000 in two installments for the first living child, and ₹6,000 in a single installment for a second girl child to counter female foeticide and promote institutional health.",
    lifeEventId: "women_child",
    ministryKey: "Ministry of Women & Child Development",
    benefitType: "dbt_cash",
    benefitCategory: "one_time_cash",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 5000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹5,000 (1st child) / ₹6,000 (2nd girl child)"
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
      "1st Child: ₹3,000 upon early registration + 1 Antenatal Check-up (ANC); ₹2,000 upon birth registration + vaccination cycle",
      "2nd Child: ₹6,000 in single installment exclusively if the second child is a girl",
      "Direct DBT credit via PFMS to mother's individual Aadhaar-seeded bank account"
    ],
    whoIsEligibleListKeys: [
      "Pregnant women and lactating mothers aged 19+ who are not in regular service with Central/State Govt or PSUs",
      "Women registered with active Mother and Child Protection (MCP) card at Anganwadi/PHC"
    ],
    whoIsNotEligibleListKeys: [
      "Regular salaried government employees or PSU staff receiving paid statutory maternity leave",
      "Male applicants or families with parity beyond the second child"
    ],
    rulesRegistry: [
      {
        ruleId: "PMM-R01",
        ruleDescription: "First Child & Second Girl Child Benefit: ₹5,000 in two installments for the first child; ₹6,000 in single installment for the second child only if female.",
        issuingAuthority: "Ministry of Women & Child Development, GoI",
        officialDocumentTitle: "Mission Shakti Operational Guidelines - Samarthya Sub-scheme (PMMVY)",
        exactSourceUrl: "https://pmmvy.wcd.gov.in",
        applicableClauseOrSection: "Section 3.1 (Beneficiary Entitlements)",
        notificationDate: "2022-07-14",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      },
      {
        ruleId: "PMM-R02",
        ruleDescription: "Statutory Exclusion: Women in regular service with Central/State Govt or PSUs receiving statutory maternity leave are excluded.",
        issuingAuthority: "Ministry of Women & Child Development, GoI",
        officialDocumentTitle: "Mission Shakti Operational Guidelines - Samarthya Sub-scheme (PMMVY)",
        exactSourceUrl: "https://pmmvy.wcd.gov.in",
        applicableClauseOrSection: "Section 3.2 (Exclusions)",
        notificationDate: "2022-07-14",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      }
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
      occupations: ["street_vendor"],
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
      "Artisans and craftspersons not engaged in street vending (covered under PM Vishwakarma)"
    ],
    rulesRegistry: [
      {
        ruleId: "PMS-R01",
        ruleDescription: "Street Vendor Eligibility: Strictly restricted to urban vendors possessing Certificate of Vending (CoV) or Letter of Recommendation (LoR) issued by Town Vending Committee / Urban Local Body.",
        issuingAuthority: "Ministry of Housing & Urban Affairs, GoI",
        officialDocumentTitle: "Scheme Guidelines for PM Street Vendor’s AtmaNirbhar Nidhi",
        exactSourceUrl: "https://pmsvanidhi.mohua.gov.in",
        applicableClauseOrSection: "Section 2.1",
        notificationDate: "2020-06-01",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      }
    ]
  },
  {
    id: "post-matric-scholarship",
    slug: "post-matric-scholarship-sc-obc",
    titleKey: "Post-Matric Scholarship for SC/ST/OBC Students",
    shortDescKey: "Compulsory non-refundable fee reimbursement plus monthly maintenance allowance for SC/ST/OBC students in higher education.",
    fullDescKey: "Centrally sponsored scholarship scheme to boost higher education participation among students from SC, ST, and OBC communities with annual family income up to ₹2.50 Lakh.",
    lifeEventId: "education_youth",
    ministryKey: "Ministry of Social Justice & Empowerment",
    benefitType: "scholarship",
    benefitCategory: "scholarship",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 14000,
      frequencyKey: "perYear",
      formattedDisplay: "₹14,000+ / ವರ್ಷಕ್ಕೆ (Tuition + Maintenance)"
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
      socialCategories: ["sc", "st", "obc"],
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
    ],
    rulesRegistry: [
      {
        ruleId: "PMS-SC01",
        ruleDescription: "SC/ST/OBC Scholarship Criteria: Indian national, enrolled in recognized post-matric course, family annual income ≤ ₹2.50 Lakh.",
        issuingAuthority: "Ministry of Social Justice & Empowerment, GoI",
        officialDocumentTitle: "Guidelines for Centrally Sponsored Scheme of Post-Matric Scholarships for SC/OBC Students",
        exactSourceUrl: "https://socialjustice.gov.in",
        applicableClauseOrSection: "Clause 4 (Eligibility)",
        notificationDate: "2020-12-30",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      }
    ]
  },
  {
    id: "post-matric-scholarship-minority",
    slug: "post-matric-scholarship-minorities",
    titleKey: "Post-Matric Scholarship for Minority Communities",
    shortDescKey: "Tuition fee reimbursement and maintenance allowance for minority community students with family income ≤ ₹2.00 Lakh.",
    fullDescKey: "Centrally sponsored scheme administered by Ministry of Minority Affairs for students from notified minority communities (Muslims, Christians, Sikhs, Buddhists, Jains, Parsis) pursuing Class 11 to Ph.D. in recognized institutions with at least 50% marks in the previous exam.",
    lifeEventId: "education_youth",
    ministryKey: "Ministry of Minority Affairs",
    benefitType: "scholarship",
    benefitCategory: "scholarship",
    verificationStatus: "VERIFIED",
    financialBenefit: {
      amount: 10000,
      frequencyKey: "perYear",
      formattedDisplay: "₹10,000 / ವರ್ಷಕ್ಕೆ (Tuition + Maintenance)"
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
      statutoryRuleCitation: "Ministry of Minority Affairs Guidelines"
    },
    processingTimeline: {
      slaDays: 30,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "NSP verification window"
    },
    sourceAttribution: "Ministry of Minority Affairs Operational Guidelines • minorityaffairs.gov.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 30,
    handlingAuthorityKey: "State Directorate of Minorities Welfare",
    helplinePhone: "1800-11-2001",
    officialPortalUrl: "https://scholarships.gov.in",
    documents: [
      {
        id: "minority_cert",
        nameKey: "Self-Declaration / Minority Community Certificate",
        descriptionKey: "Affidavit or community certificate for notified minority.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 3,
        digiLockerSupported: true,
        status: "verified"
      },
      {
        id: "income_cert",
        nameKey: "Income Certificate (Current Year)",
        descriptionKey: "Annual family income certificate valid for current financial year (ceiling ₹2.00 Lakh).",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 3,
        digiLockerSupported: true,
        status: "pending"
      },
      {
        id: "marksheet",
        nameKey: "Previous Qualifying Exam Marksheet (50%+ Marks)",
        descriptionKey: "Marksheet confirming at least 50% marks in previous final exam.",
        isMandatory: true,
        acceptableFormats: ["PDF", "JPEG"],
        maxSizeMb: 4,
        digiLockerSupported: true,
        status: "verified"
      }
    ],
    eligibilityCriteria: {
      maxAnnualIncome: 200000,
      socialCategories: ["minority"],
      minAge: 15,
      maxAge: 35,
      requiresStudentEnrollment: true
    },
    keyBenefitsListKeys: [
      "Tuition fee up to ₹7,000/annum for Classes 11 and 12, technical and vocational courses",
      "Maintenance allowance up to ₹380/month for day scholars and ₹570/month for hostellers",
      "Direct benefit credit to bank account via National Scholarship Portal (NSP)"
    ],
    whoIsEligibleListKeys: [
      "Students belonging to notified minority communities (Muslims, Christians, Sikhs, Buddhists, Jains, Parsis)",
      "Total family income from all sources not exceeding ₹2.00 Lakh per annum",
      "Scored not less than 50% marks in the previous final examination"
    ],
    whoIsNotEligibleListKeys: [
      "Family income exceeding ₹2.00 Lakh per annum",
      "Scored below 50% marks in the previous final exam",
      "Students availing any other government scholarship for the same course"
    ],
    rulesRegistry: [
      {
        ruleId: "PMS-MIN01",
        ruleDescription: "Minority Scholarship Income Ceiling: Parental annual income must not exceed ₹2.00 Lakh (distinct from ₹2.5L SC ceiling).",
        issuingAuthority: "Ministry of Minority Affairs, GoI",
        officialDocumentTitle: "Operational Guidelines for Scheme of Post-Matric Scholarship for Students Belonging to Minority Communities",
        exactSourceUrl: "https://minorityaffairs.gov.in",
        applicableClauseOrSection: "Clause 3 (Eligibility Criteria)",
        notificationDate: "2022-04-01",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      }
    ]
  },
  {
    id: "pm-kcc",
    slug: "kisan-credit-card-crop-loan",
    titleKey: "Kisan Credit Card (KCC) Subsidized Crop Credit",
    shortDescKey: "Concessional credit limit up to ₹3,00,000 at an effective interest rate of just 4% per annum with prompt repayment incentive.",
    fullDescKey: "Kisan Credit Card scheme provides farmers (owner cultivators, tenant farmers, sharecroppers, oral lessees, SHGs/JLGs, animal husbandry and fisheries) with timely access to subsidized working capital credit at effective 4% interest.",
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
        nameKey: "Land Record / Tenancy Agreement / Dairy Certificate",
        descriptionKey: "Land record (Pahani/RTC) for owner cultivators, tenancy agreement for tenants, or animal husbandry/fishery proof.",
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
      "Interest subvention of 2% + additional 3% incentive for prompt repayment makes effective rate 4%",
      "Available to owner cultivators, recorded tenant farmers, oral lessees, animal husbandry and fisheries",
      "No collateral required for loans up to ₹1.60 Lakh; flexible withdrawal via ATM debit card"
    ],
    whoIsEligibleListKeys: [
      "Owner cultivators, tenant farmers, oral lessees, sharecroppers, and SHGs/JLGs of farmers",
      "Farmers engaged in animal husbandry, dairy, poultry, sheep/goat rearing, and inland/marine fisheries"
    ],
    whoIsNotEligibleListKeys: [
      "Defaulters with outstanding non-performing agricultural loans at commercial banks",
      "Individuals not engaged in agriculture, animal husbandry, or fisheries"
    ],
    rulesRegistry: [
      {
        ruleId: "KCC-R01",
        ruleDescription: "Tenure & Allied Activity Inclusivity: Owner cultivators, tenant farmers, oral lessees, sharecroppers, and farmers engaged in animal husbandry or fisheries are eligible under RBI guidelines.",
        issuingAuthority: "Reserve Bank of India / NABARD",
        officialDocumentTitle: "Master Direction - Kisan Credit Card (KCC) Scheme",
        exactSourceUrl: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11560",
        applicableClauseOrSection: "Section 3 (Beneficiary Categories)",
        notificationDate: "2019-07-04",
        lastVerifiedDate: "November 2026",
        verificationStatus: "VERIFIED"
      }
    ]
  }
];

// In development, validate schemes asynchronously without impacting production bundle
if ((import.meta as any).env?.DEV) {
  import('../types/schemeValidation').then(({ validateSchemes }) => {
    const validationResult = validateSchemes(verifiedSchemes);
    if (!validationResult.valid) {
      console.error("Scheme validation failed:", validationResult.errors);
    }
  }).catch(() => {});
}

/**
 * Catalogue extension (Aangan redesign).
 * Five widely-used schemes that close real gaps in the catalogue — Housing had none, and the
 * home screen's popular searches (Gruha Lakshmi, PM Surya Ghar, MUDRA) previously led nowhere.
 *
 * These are browsable and applicable, but are deliberately NOT part of `verifiedSchemes`:
 * the deterministic eligibility engine only evaluates schemes it has statute-level rules for,
 * so these are marked NEEDS_REVIEW until their rules are encoded and audited.
 * Figures are conservative public facts from the official portals listed.
 */
export const catalogExtensionSchemes: Scheme[] = [
  {
    id: "pmay-g",
    slug: "pradhan-mantri-awas-yojana-gramin",
    titleKey: "PM Awas Yojana – Gramin (PMAY-G)",
    shortDescKey: "Money to build a pucca house with a kitchen for rural families who are homeless or live in a kutcha or broken house.",
    fullDescKey: "Pradhan Mantri Awas Yojana – Gramin gives financial assistance of ₹1,20,000 in plain areas and ₹1,30,000 in hilly states, difficult areas and IAP districts to construct a pucca house of at least 25 sq. m with a hygienic cooking space. Beneficiaries are identified from the SECC 2011 / Awaas+ surveys and verified by the Gram Sabha. The amount is paid directly into the beneficiary's bank account in instalments linked to construction progress. Convergence also provides 90–95 days of unskilled MGNREGA wages and ₹12,000 for a toilet under Swachh Bharat Mission (Gramin).",
    lifeEventId: "housing_utilities",
    ministryKey: "Ministry of Rural Development",
    benefitType: "dbt_cash",
    benefitCategory: "one_time_cash",
    verificationStatus: "NEEDS_REVIEW",
    financialBenefit: {
      amount: 120000,
      frequencyKey: "oneTime",
      formattedDisplay: "₹1,20,000 (₹1,30,000 in hilly / difficult areas)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "No application fee — beneficiaries are selected from the Awaas+ / SECC list and approved by the Gram Sabha",
      cscAuthorizedCharge: "No charge for inclusion; CSC help for document upload at notified service rates"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "PMAY-G Framework for Implementation, Ministry of Rural Development"
    },
    processingTimeline: {
      slaDays: 90,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "Sanction and first instalment follow Gram Sabha approval; timelines vary by state"
    },
    sourceAttribution: "Ministry of Rural Development, PMAY-G Framework for Implementation • pmayg.nic.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 90,
    handlingAuthorityKey: "Block Development Officer / Gram Panchayat",
    helplinePhone: "1800-11-6446",
    officialPortalUrl: "https://pmayg.nic.in",
    documents: [
      { id: "aadhaar", nameKey: "Aadhaar Card", descriptionKey: "Identity of the beneficiary, with consent for Aadhaar use.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: true },
      { id: "bank_passbook", nameKey: "Bank Account Passbook", descriptionKey: "Front page with account number and IFSC — instalments are paid here.", isMandatory: true, acceptableFormats: ["JPEG", "PNG", "PDF"], maxSizeMb: 3, digiLockerSupported: false, commonErrorKey: "passbookDo" },
      { id: "mgnrega_job_card", nameKey: "MGNREGA Job Card", descriptionKey: "Needed to receive wages for working on your own house.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: false },
      { id: "sbm_number", nameKey: "Swachh Bharat Mission (Gramin) number", descriptionKey: "Only if you are also getting toilet assistance.", isMandatory: false, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: false }
    ],
    eligibilityCriteria: {
      socialCategories: ["all"],
      requiresSeccOrBplRationCard: true
    },
    keyBenefitsListKeys: [
      "₹1,20,000 to build your house (₹1,30,000 in hilly and difficult areas), paid into your bank in parts as the house is built",
      "Wages for 90–95 days of your own work on the house through MGNREGA",
      "₹12,000 extra for a toilet through Swachh Bharat Mission"
    ],
    whoIsEligibleListKeys: [
      "Rural families with no house, or living in a kutcha or broken house with zero, one or two rooms",
      "Families whose names are in the Awaas+ / SECC 2011 list, approved by the Gram Sabha"
    ],
    whoIsNotEligibleListKeys: [
      "Families who already own a pucca house",
      "Families with a member in a government job, paying income tax, or owning a motorised four-wheeler, mechanised farm equipment, or a Kisan Credit Card limit of ₹50,000 or more"
    ],
    rulesRegistry: [
      {
        ruleId: "PMAYG-R01",
        ruleDescription: "Unit assistance of ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly states, difficult areas and IAP districts.",
        issuingAuthority: "Ministry of Rural Development, GoI",
        officialDocumentTitle: "PMAY-G Framework for Implementation",
        exactSourceUrl: "https://pmayg.nic.in",
        lastVerifiedDate: "November 2026",
        verificationStatus: "NEEDS_REVIEW"
      }
    ]
  },
  {
    id: "pm-surya-ghar",
    slug: "pm-surya-ghar-muft-bijli-yojana",
    titleKey: "PM Surya Ghar: Muft Bijli Yojana",
    shortDescKey: "Government pays up to ₹78,000 towards solar panels on your roof, so your home gets up to 300 units of free electricity a month.",
    fullDescKey: "PM Surya Ghar: Muft Bijli Yojana supports households to install rooftop solar. Central Financial Assistance is ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, capped at ₹78,000 for systems of 3 kW or more. Households apply on the national portal, choose a registered vendor, and the subsidy is credited to their bank account after the system is installed, inspected and net-metered by the electricity distribution company.",
    lifeEventId: "housing_utilities",
    ministryKey: "Ministry of New and Renewable Energy",
    benefitType: "dbt_cash",
    benefitCategory: "subsidy",
    verificationStatus: "NEEDS_REVIEW",
    financialBenefit: {
      amount: 78000,
      frequencyKey: "oneTime",
      formattedDisplay: "Up to ₹78,000 solar subsidy"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "Free registration on the national portal pmsuryaghar.gov.in",
      cscAuthorizedCharge: "CSC help with registration at notified service rates"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "MNRE Operational Guidelines for PM Surya Ghar: Muft Bijli Yojana"
    },
    processingTimeline: {
      slaDays: 30,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "Subsidy is released after DISCOM inspection and net-meter installation"
    },
    sourceAttribution: "Ministry of New and Renewable Energy, Operational Guidelines • pmsuryaghar.gov.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 30,
    handlingAuthorityKey: "Electricity distribution company (DISCOM)",
    helplinePhone: "15555",
    officialPortalUrl: "https://pmsuryaghar.gov.in",
    documents: [
      { id: "electricity_bill", nameKey: "Latest electricity bill", descriptionKey: "Shows your consumer number — the connection must be in your name.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: false },
      { id: "aadhaar", nameKey: "Aadhaar Card", descriptionKey: "Identity of the person who owns the connection.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: true },
      { id: "bank_passbook", nameKey: "Bank Account Passbook", descriptionKey: "The subsidy is paid into this account.", isMandatory: true, acceptableFormats: ["JPEG", "PNG", "PDF"], maxSizeMb: 3, digiLockerSupported: false, commonErrorKey: "passbookDo" },
      { id: "roof_ownership", nameKey: "Proof that you own the house / roof", descriptionKey: "Property tax receipt, sale deed or similar.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 5, digiLockerSupported: false }
    ],
    eligibilityCriteria: {
      socialCategories: ["all"]
    },
    keyBenefitsListKeys: [
      "₹30,000 per kW for the first 2 kW and ₹18,000 for the 3rd kW — up to ₹78,000 in total",
      "Up to 300 units of free electricity every month from your own roof",
      "Low-interest bank loans are available for the remaining cost"
    ],
    whoIsEligibleListKeys: [
      "Any Indian household that owns a house with a roof suitable for solar panels",
      "Has a valid electricity connection in the household's name"
    ],
    whoIsNotEligibleListKeys: [
      "Households that have already received a government subsidy for rooftop solar"
    ],
    rulesRegistry: [
      {
        ruleId: "PMSG-R01",
        ruleDescription: "CFA of ₹30,000/kW up to 2 kW and ₹18,000/kW for additional capacity up to 3 kW; total CFA capped at ₹78,000.",
        issuingAuthority: "Ministry of New and Renewable Energy, GoI",
        officialDocumentTitle: "Operational Guidelines — PM Surya Ghar: Muft Bijli Yojana",
        exactSourceUrl: "https://pmsuryaghar.gov.in",
        lastVerifiedDate: "November 2026",
        verificationStatus: "NEEDS_REVIEW"
      }
    ]
  },
  {
    id: "gruha-lakshmi",
    slug: "gruha-lakshmi-karnataka",
    titleKey: "Gruha Lakshmi (Karnataka)",
    shortDescKey: "₹2,000 every month into the bank account of the woman who heads the family on the ration card.",
    fullDescKey: "Gruha Lakshmi is a Government of Karnataka guarantee scheme that pays ₹2,000 per month directly into the Aadhaar-linked bank account of the woman recorded as the head of the family on an Antyodaya, BPL or APL ration card. Registration is free through Seva Sindhu, Grama One, Karnataka One, Bangalore One or the Gram Panchayat.",
    lifeEventId: "women_child",
    ministryKey: "Department of Women and Child Development, Government of Karnataka",
    benefitType: "dbt_cash",
    benefitCategory: "annual_cash_transfer",
    verificationStatus: "NEEDS_REVIEW",
    financialBenefit: {
      amount: 2000,
      frequencyKey: "perMonth",
      formattedDisplay: "₹2,000 / ತಿಂಗಳಿಗೆ (₹2,000 per month)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "Free registration — Government of Karnataka guarantee scheme order",
      cscAuthorizedCharge: "Registration at Grama One / Karnataka One / Bangalore One is free of charge"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "Government of Karnataka, Gruha Lakshmi scheme order (2023)"
    },
    processingTimeline: {
      slaDays: 30,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "Monthly credit begins after verification of the ration card and bank seeding"
    },
    sourceAttribution: "Department of Women and Child Development, Government of Karnataka • sevasindhugs.karnataka.gov.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 30,
    handlingAuthorityKey: "CDPO, Women and Child Development Department",
    helplinePhone: "1902",
    officialPortalUrl: "https://sevasindhugs.karnataka.gov.in",
    documents: [
      { id: "ration_card", nameKey: "Ration Card (woman listed as head)", descriptionKey: "Antyodaya, BPL or APL card that names you as the head of the family.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: true },
      { id: "aadhaar", nameKey: "Aadhaar Card", descriptionKey: "Yours, and your husband's if listed on the ration card.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: true },
      { id: "bank_passbook", nameKey: "Aadhaar-linked Bank Passbook", descriptionKey: "Money is paid only to an account seeded with your Aadhaar.", isMandatory: true, acceptableFormats: ["JPEG", "PNG", "PDF"], maxSizeMb: 3, digiLockerSupported: false, commonErrorKey: "passbookDo" }
    ],
    eligibilityCriteria: {
      genderAllowed: ["female"],
      stateSpecific: ["Karnataka"],
      socialCategories: ["all"]
    },
    keyBenefitsListKeys: [
      "₹2,000 every month — ₹24,000 a year — straight into your bank account",
      "Free to register at Grama One, Karnataka One, Bangalore One or your Gram Panchayat"
    ],
    whoIsEligibleListKeys: [
      "Women who are named as head of the family on an Antyodaya, BPL or APL ration card in Karnataka",
      "Only one woman per family"
    ],
    whoIsNotEligibleListKeys: [
      "Families where the woman or her husband pays income tax or files GST returns"
    ],
    rulesRegistry: [
      {
        ruleId: "GL-R01",
        ruleDescription: "₹2,000 per month to the woman head of family as recorded on the ration card; income-tax and GST payers excluded.",
        issuingAuthority: "Department of Women and Child Development, Government of Karnataka",
        officialDocumentTitle: "Gruha Lakshmi Scheme Government Order",
        exactSourceUrl: "https://sevasindhugs.karnataka.gov.in",
        lastVerifiedDate: "November 2026",
        verificationStatus: "NEEDS_REVIEW"
      }
    ]
  },
  {
    id: "pm-mudra",
    slug: "pradhan-mantri-mudra-yojana",
    titleKey: "PM MUDRA Yojana (Business Loan)",
    shortDescKey: "Loans without collateral to start or grow a small shop, workshop or service — from ₹50,000 up to ₹20 lakh.",
    fullDescKey: "Pradhan Mantri MUDRA Yojana provides collateral-free loans through banks, NBFCs and microfinance institutions to non-farm micro and small enterprises in manufacturing, trading and services, and to activities allied to agriculture. Loans are offered in four categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 lakh), Tarun (₹5 lakh to ₹10 lakh) and Tarun Plus (₹10 lakh to ₹20 lakh, for those who have repaid a Tarun loan). There is no processing fee for Shishu loans.",
    lifeEventId: "business_artisan",
    ministryKey: "Department of Financial Services, Ministry of Finance",
    benefitType: "credit_loan",
    benefitCategory: "loan_credit_facility",
    verificationStatus: "NEEDS_REVIEW",
    financialBenefit: {
      amount: 1000000,
      frequencyKey: "oneTime",
      formattedDisplay: "Up to ₹10 lakh (₹20 lakh under Tarun Plus)"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "No government fee; no processing fee for Shishu loans (bank charges for larger loans as per bank policy)",
      cscAuthorizedCharge: "Apply directly at any bank branch or on jansamarth.in"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "MUDRA Operational Guidelines, Department of Financial Services"
    },
    processingTimeline: {
      slaDays: 14,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "Lending institution appraisal timelines vary"
    },
    sourceAttribution: "Department of Financial Services, Ministry of Finance • mudra.org.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 14,
    handlingAuthorityKey: "Bank branch manager / lending institution",
    helplinePhone: "1800-180-1111",
    officialPortalUrl: "https://www.mudra.org.in",
    documents: [
      { id: "aadhaar", nameKey: "Aadhaar Card", descriptionKey: "Identity and address of the applicant.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: true },
      { id: "business_proof", nameKey: "Proof of your business", descriptionKey: "Udyam registration, shop licence, artisan card or trade register — any one.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 5, digiLockerSupported: false },
      { id: "business_plan", nameKey: "Simple business plan or quotation", descriptionKey: "What you will buy with the loan — the bank can help you write this.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 5, digiLockerSupported: false },
      { id: "bank_statement", nameKey: "Bank statement (last 6 months)", descriptionKey: "Shows how money comes in and goes out of your business.", isMandatory: false, acceptableFormats: ["PDF"], maxSizeMb: 5, digiLockerSupported: false }
    ],
    eligibilityCriteria: {
      occupations: ["street_vendor", "artisan", "daily_wage"],
      socialCategories: ["all"]
    },
    keyBenefitsListKeys: [
      "No property or guarantor needed (collateral-free)",
      "Shishu: up to ₹50,000 · Kishore: ₹50,000–₹5 lakh · Tarun: ₹5–10 lakh · Tarun Plus: up to ₹20 lakh",
      "No processing fee on Shishu loans"
    ],
    whoIsEligibleListKeys: [
      "Anyone running or starting a small non-farm business — shop, tailoring, repair, weaving, food stall, transport",
      "Activities allied to farming such as dairy, poultry or fisheries"
    ],
    whoIsNotEligibleListKeys: [
      "People who have defaulted on an earlier bank loan",
      "Large companies and corporate borrowers"
    ],
    rulesRegistry: [
      {
        ruleId: "MUDRA-R01",
        ruleDescription: "Collateral-free loans to non-corporate, non-farm micro enterprises under Shishu, Kishore, Tarun and Tarun Plus categories.",
        issuingAuthority: "Department of Financial Services, Ministry of Finance, GoI",
        officialDocumentTitle: "Pradhan Mantri MUDRA Yojana — Scheme Guidelines",
        exactSourceUrl: "https://www.mudra.org.in",
        lastVerifiedDate: "November 2026",
        verificationStatus: "NEEDS_REVIEW"
      }
    ]
  },
  {
    id: "sukanya-samriddhi",
    slug: "sukanya-samriddhi-yojana",
    titleKey: "Sukanya Samriddhi Yojana (Savings for a Girl Child)",
    shortDescKey: "A savings account for your daughter with one of the highest safe interest rates, tax-free, ready when she turns 21.",
    fullDescKey: "Sukanya Samriddhi Account is a small savings scheme of the Government of India for a girl child below 10 years of age. Parents or guardians can open it at any post office or authorised bank with as little as ₹250, and deposit up to ₹1.5 lakh in a financial year for 15 years. The interest rate is notified every quarter by the Ministry of Finance; deposits, interest and maturity amount are tax-free. Up to 50% can be withdrawn for higher education after she turns 18, and the account matures at 21.",
    lifeEventId: "women_child",
    ministryKey: "Department of Economic Affairs, Ministry of Finance",
    benefitType: "dbt_cash",
    benefitCategory: "non_financial",
    verificationStatus: "NEEDS_REVIEW",
    financialBenefit: {
      amount: 250,
      frequencyKey: "schemes.freq.minDeposit",
      formattedDisplay: "Open with ₹250 · tax-free interest"
    },
    statutoryFee: {
      amount: 0,
      isFree: true,
      statutoryRuleCitation: "No fee to open the account at a post office or authorised bank",
      cscAuthorizedCharge: "Open directly at your post office or bank — no agent needed"
    },
    feeStructure: {
      governmentFee: 0,
      isStatutoryFree: true,
      statutoryRuleCitation: "Sukanya Samriddhi Account Scheme, 2019 (Ministry of Finance notification)"
    },
    processingTimeline: {
      slaDays: 1,
      isStatutoryGuarantee: false,
      timelineType: "administrative_estimate",
      authorityCitation: "Account is usually opened the same day at the post office"
    },
    sourceAttribution: "Department of Economic Affairs, Sukanya Samriddhi Account Scheme 2019 • indiapost.gov.in",
    lastVerifiedDate: "November 2026",
    processingSlaDays: 1,
    handlingAuthorityKey: "Post office / authorised bank branch",
    helplinePhone: "1800-266-6868",
    officialPortalUrl: "https://www.indiapost.gov.in",
    documents: [
      { id: "birth_certificate", nameKey: "Girl child's birth certificate", descriptionKey: "She must be under 10 years old when the account is opened.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: true },
      { id: "aadhaar", nameKey: "Parent or guardian's Aadhaar", descriptionKey: "Identity of the person opening the account.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: true },
      { id: "address_proof", nameKey: "Address proof", descriptionKey: "Ration card, electricity bill or voter ID.", isMandatory: true, acceptableFormats: ["PDF", "JPEG"], maxSizeMb: 2, digiLockerSupported: false }
    ],
    eligibilityCriteria: {
      maxAge: 10,
      genderAllowed: ["female"],
      socialCategories: ["all"]
    },
    keyBenefitsListKeys: [
      "Start with just ₹250; save up to ₹1.5 lakh a year, for 15 years",
      "Interest rate set by the government every quarter — among the highest for safe savings",
      "Deposits, interest and the final amount are all tax-free",
      "Withdraw up to half for her studies after she turns 18"
    ],
    whoIsEligibleListKeys: [
      "A girl child below 10 years of age, through a parent or legal guardian",
      "Up to two accounts per family (three if twins or triplets)"
    ],
    whoIsNotEligibleListKeys: [
      "Girls aged 10 years or older",
      "Non-resident Indians (NRIs)"
    ],
    rulesRegistry: [
      {
        ruleId: "SSA-R01",
        ruleDescription: "Account for a girl child below 10 years; minimum ₹250 and maximum ₹1.5 lakh deposit per financial year for 15 years; maturity at 21 years.",
        issuingAuthority: "Department of Economic Affairs, Ministry of Finance, GoI",
        officialDocumentTitle: "Sukanya Samriddhi Account Scheme, 2019",
        exactSourceUrl: "https://www.indiapost.gov.in",
        lastVerifiedDate: "November 2026",
        verificationStatus: "NEEDS_REVIEW"
      }
    ]
  }
];

/** Everything a citizen can browse: engine-verified schemes first, then the reviewed extension. */
export const allSchemes: Scheme[] = [...verifiedSchemes, ...catalogExtensionSchemes];
