export const eligibilityEn = {
  // Question help text
  q_occupation_help: "Select your main source of household income to check matching vocational welfare schemes.",
  q_land_help: "Cultivable land registered in state revenue records (RTC/Pahani) for PM-KISAN / KCC schemes.",
  q_gender_help: "Helps match gender-specific entitlements such as maternity nutrition and women welfare.",
  q_maternity_help: "Pradhan Mantri Matru Vandana Yojana (PMMVY) provides ₹5,000 to ₹6,000 direct cash assistance.",
  q_vending_help: "PM SVANidhi provides collateral-free working capital loan of ₹10,000 to ₹50,000 with 7% interest subsidy.",
  q_student_help: "Post-Matric Scholarships reimburse 100% compulsory college/ITI tuition fees.",
  q_income_help: "Assesses poverty line status, Ayushman Bharat ₹5 Lakh health cover, and scholarships.",
  q_govt_help: "Statutory rules for schemes like PM-KISAN exclude regular government servants and pensioners ≥ ₹10,000/mo.",

  // Question 1: Occupation options
  opt_farmer_label: "Farmer / Cultivator",
  opt_farmer_sub: "Owner cultivator, tenant farmer, or allied agriculture",
  opt_vendor_label: "Street Vendor / Hawker",
  opt_vendor_sub: "Urban vegetable, food cart, or daily goods vendor",
  opt_student_label: "Student in Higher Education",
  opt_student_sub: "Enrolled in college, ITI, polytechnic, or university",
  opt_daily_wage_label: "Daily Wage / Construction Laborer",
  opt_daily_wage_sub: "Unorganized sector manual laborer or worker",
  opt_homemaker_label: "Homemaker / Mother",
  opt_homemaker_sub: "Managing household, pregnant woman or nursing mother",
  opt_artisan_label: "Artisan / Handloom Craftsperson",
  opt_artisan_sub: "Traditional craftsperson, carpenter, blacksmith, or weaver",

  // Question 2: Landholding options
  opt_land_small_label: "Less than 2.5 Acres (Small/Marginal)",
  opt_land_small_sub: "Small or marginal agricultural landholder",
  opt_land_med_label: "2.5 to 5 Acres (Medium Landholder)",
  opt_land_med_sub: "Medium agricultural landholding",
  opt_land_large_label: "More than 5 Acres (Large Landholder)",
  opt_land_large_sub: "Large agricultural landholding",
  opt_land_none_label: "No Agricultural Land (Landless)",
  opt_land_none_sub: "Landless household or tenant cultivator",

  // Question 3: Gender options
  opt_female_label: "Female",
  opt_female_sub: "Eligible for maternal welfare & women-centric grants",
  opt_male_label: "Male",
  opt_male_sub: "General central and state citizen entitlements",
  opt_other_label: "Other / Transgender",
  opt_other_sub: "Social welfare and livelihood protection schemes",

  // Question 4: Maternity options
  opt_maternity_yes_label: "Yes, currently pregnant or nursing mother",
  opt_maternity_yes_sub: "Pregnant or mother of child under 2 years (PMMVY eligible)",
  opt_maternity_no_label: "No, not currently pregnant or nursing",
  opt_maternity_no_sub: "Not currently pregnant or lactating",

  // Question 5: Street vending options
  opt_vending_yes_label: "Yes, vending in an urban town or city",
  opt_vending_yes_sub: "Street vending within municipal or town limits (PM SVANidhi)",
  opt_vending_no_label: "No, vending in rural village or stationary shop",
  opt_vending_no_sub: "Rural area or permanent fixed shop",

  // Question 6: Student enrollment options
  opt_student_yes_label: "Yes, enrolled in post-matric, college, or ITI",
  opt_student_yes_sub: "College, ITI, diploma, or degree student",
  opt_student_no_label: "In school below Class 10 / not enrolled",
  opt_student_no_sub: "Below Class 10 or not currently enrolled in college",

  // Question 7: Annual income options
  opt_income_bpl_label: "Below ₹1.2 Lakh (BPL / Antyodaya Ration Card)",
  opt_income_bpl_sub: "Eligible for Ayushman Bharat ₹5 Lakh free hospital cover",
  opt_income_low_label: "Between ₹1.2 Lakh and ₹2.5 Lakh",
  opt_income_low_sub: "Eligible for Post-Matric Scholarship schemes",
  opt_income_mid_label: "Between ₹2.5 Lakh and ₹8 Lakh",
  opt_income_mid_sub: "Middle-income household bracket",
  opt_income_high_label: "Above ₹8 Lakh (Taxpayer Bracket)",
  opt_income_high_sub: "Income tax payer bracket",

  // Question 8: Govt employment options
  opt_govt_no_label: "No, no government job or high pension",
  opt_govt_no_sub: "No regular government servant in the family (eligible)",
  opt_govt_yes_label: "Yes, regular government or PSU employee",
  opt_govt_yes_sub: "Permanent government employee (statutory exclusion applies)",

  // Eligibility checker & voice helper messages
  voiceHelperHint: "You can speak in Kannada, Hindi, Bengali, or English, or simply select an option above.",
  resultsCockpitTitle: "STATUTORY BENEFIT EVALUATION REPORT",
  resultsHeroDesc: "Benefits are segregated into distinct transparent categories to clearly distinguish direct cash from healthcare coverage and credit facilities.",
  annualCashDbt: "Annual Cash DBT",
  annualCashDbtDesc: "Transferred directly to bank account via PFMS",
  hospitalHealthCover: "Hospital Health Cover",
  hospitalHealthCoverDesc: "Cashless hospital treatment cap (Not a cash grant)",
  subsidizedLoanLimit: "Subsidized Loan Limit",
  subsidizedLoanLimitDesc: "Collateral-free credit limit (Repayable loan)",
  grantScholarship: "Grant / Scholarship",
  grantScholarshipDesc: "Maternity / college education allowance upon event",
  detailedEvaluationTitle: "Detailed Scheme-by-Scheme Evaluation",
  detailedEvaluationDesc: "Select a category below to review statutory qualifications, evaluated parameters, and next steps.",
  tabMeetsCriteria: "Meets preliminary criteria",
  tabRequiresDocCheck: "Requires document check",
  tabCriteriaNotSatisfied: "Criteria not satisfied",
  benefitEntitlementLabel: "Benefit Entitlement",
  allConditionsMetFallback: "All preliminary self-reported conditions are met.",

  // Results explanations
  installment_pm_kisan: "Paid in 3 equal installments of ₹2,000 every 4 months (April-July, August-November, December-March) directly via PFMS DBT.",
  installment_pm_jay: "Cashless indemnity insurance cover up to ₹5,00,000 per family per year at empaneled hospitals. Pre-existing conditions covered from day 1.",
  installment_pmmvy: "Paid in 2 installments: ₹3,000 upon early registration + 1 Antenatal Checkup (ANC); ₹2,000 upon child birth registration and first vaccination cycle.",
  installment_pm_svanidhi: "Tranche 1: ₹10,000 working capital loan (1-year tenure); timely repayment unlocks Tranche 2 (₹20,000) and Tranche 3 (₹50,000) with 7% interest subsidy.",
  installment_scholarship: "100% compulsory non-refundable fees reimbursed + monthly maintenance allowance (₹550 to ₹1,200/mo) credited across academic semesters.",
  installment_pm_kcc: "Revolving crop credit limit up to ₹3,00,000 at 4% effective interest rate with prompt repayment incentive (2% subvention + 3% prompt rebate).",
  installment_default: "Statutory government welfare benefit distributed in accordance with official scheme operational guidelines.",
  nextStepEligible: "Next Step: Inspect required documents checklist in Document Locker, or visit your nearest Grama One / CSC Kendra for biometric eKYC.",
  nextStepAdditional: "Next Step: Obtain or verify the missing revenue/caste documents listed below, then verify through DigiLocker or Seva Sindhu.",
  nextStepIneligible: "Next Step: Explore universal citizen schemes like Ayushman Bharat (70+ senior cover) or review alternative state assistance programs.",

  // Evaluated condition labels
  condOccupation: "Occupation",
  condLand: "Cultivable Land",
  condGender: "Gender",
  condIncome: "Annual Income",
  condGovtEmp: "Govt Employment",
  condMaternity: "Maternity Status",
  condUrbanVending: "Urban Vending",
  condHigherEd: "Higher Education",
  condYes: "Yes",
  condNo: "None in Family",
  condAcres: "Acres",
} as const;
