import { EligibilityQuestion } from '../types';

export const eligibilityQuestions: EligibilityQuestion[] = [
  {
    id: "q_occupation",
    order: 1,
    textKey: "question1_text",
    audioVoiceKey: "audio_q1",
    helpKey: "Select your main source of household income to check matching vocational welfare schemes.",
    type: "single_choice",
    fieldName: "occupation",
    options: [
      { value: "farmer", labelKey: "Farmer / Cultivator (ರೈತ / किसान)", iconName: "Wheat", sublabelKey: "Owner cultivator, tenant farmer, or allied agriculture" },
      { value: "street_vendor", labelKey: "Street Vendor / Hawkers (ಬೀದಿ ಬದಿ ವ್ಯಾಪಾರಿ / फेरीवाला)", iconName: "Store", sublabelKey: "Urban vegetable, food cart, or daily goods vendor" },
      { value: "student", labelKey: "Student in Higher Education (ವಿದ್ಯಾರ್ಥಿ / छात्र)", iconName: "GraduationCap", sublabelKey: "Enrolled in college, ITI, polytechnic, or university" },
      { value: "daily_wage", labelKey: "Daily Wage / Construction Laborer (ದಿನಗೂಲಿ / दिहाड़ी)", iconName: "Hammer", sublabelKey: "Unorganized sector manual laborer or worker" },
      { value: "homemaker", labelKey: "Homemaker / Mother (ಗೃಹಿಣಿ / महिला)", iconName: "Heart", sublabelKey: "Managing household, pregnant woman or nursing mother" },
      { value: "artisan", labelKey: "Artisan / Handloom Craftsperson (ಕುಶಲಕರ್ಮಿ / कारीगर)", iconName: "Scissors", sublabelKey: "Traditional craftsperson, carpenter, blacksmith, or weaver" }
    ]
  },
  {
    id: "q_land",
    order: 2,
    textKey: "question2_text",
    audioVoiceKey: "audio_q2",
    helpKey: "Cultivable land registered in state revenue records (RTC/Pahani) for PM-KISAN / KCC schemes.",
    type: "single_choice",
    fieldName: "landholdingAcres",
    options: [
      { value: 1.5, labelKey: "Less than 2.5 Acres (Small/Marginal)", sublabelKey: "2.5 ಎಕರೆಗಿಂತ ಕಡಿಮೆ (ಸಣ್ಣ ರೈತರು)" },
      { value: 4.0, labelKey: "2.5 to 5 Acres (Medium Landholder)", sublabelKey: "2.5 ರಿಂದ 5 ಎಕರೆ ಕೃಷಿ ಭೂಮಿ" },
      { value: 10.0, labelKey: "More than 5 Acres (Large Landholder)", sublabelKey: "5 ಎಕರೆಗಿಂತ ಹೆಚ್ಚು ಕೃಷಿ ಭೂಮಿ" },
      { value: 0, labelKey: "No Agricultural Land (Landless)", sublabelKey: "ಜಮೀನು ಇಲ್ಲ (ಭೂಹೀನರು / ಬಾಡಿಗೆದಾರರು)" }
    ]
  },
  {
    id: "q_gender_age",
    order: 3,
    textKey: "question3_text",
    audioVoiceKey: "audio_q3",
    helpKey: "Helps match gender-specific entitlements such as maternity nutrition and women welfare.",
    type: "single_choice",
    fieldName: "gender",
    options: [
      { value: "female", labelKey: "Female (ಮಹಿಳೆ / महिला)", iconName: "User", sublabelKey: "Eligible for maternal welfare & women-centric grants" },
      { value: "male", labelKey: "Male (ಪುರುಷ / पुरुष)", iconName: "User", sublabelKey: "General central and state citizen entitlements" },
      { value: "other", labelKey: "Other / Transgender (ಇತರ / अन्य)", iconName: "Users", sublabelKey: "Social welfare and livelihood protection schemes" }
    ]
  },
  {
    id: "q_maternity",
    order: 4,
    textKey: "question_maternity_text",
    audioVoiceKey: "audio_qmaternity",
    helpKey: "Pradhan Mantri Matru Vandana Yojana (PMMVY) provides ₹5,000 to ₹6,000 direct cash assistance.",
    type: "boolean",
    fieldName: "isPregnantOrLactating",
    condition: (answers) => answers?.gender === 'female',
    options: [
      { 
        value: true, 
        labelKey: "Yes, currently pregnant or nursing mother", 
        sublabelKey: "ಗರ್ಭಿಣಿ ಅಥವಾ 2 ವರ್ಷದೊಳಗಿನ ಮಗುವಿನ ತಾಯಿ (PMMVY ಅರ್ಹರು)", 
        iconName: "Heart",
        payload: { isPregnantOrLactating: true, maternityParity: 'first_child' }
      },
      { 
        value: false, 
        labelKey: "No, not currently pregnant or nursing", 
        sublabelKey: "ಗರ್ಭಿಣಿ ಅಥವಾ ಬಾಣಂತಿ ಅಲ್ಲ", 
        iconName: "CheckCircle2",
        payload: { isPregnantOrLactating: false }
      }
    ]
  },
  {
    id: "q_vending",
    order: 5,
    textKey: "question_vending_text",
    audioVoiceKey: "audio_qvending",
    helpKey: "PM SVANidhi provides collateral-free working capital loan of ₹10,000 to ₹50,000 with 7% interest subsidy.",
    type: "boolean",
    fieldName: "isUrbanStreetVendor",
    condition: (answers) => answers?.occupation === 'street_vendor',
    options: [
      { 
        value: true, 
        labelKey: "Yes, vending in an urban town or city", 
        sublabelKey: "ನಗರ ಅಥವಾ ಪುರಸಭೆ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಬೀದಿಬದಿ ವ್ಯಾಪಾರ (PM SVANidhi)", 
        iconName: "Store",
        payload: { isUrbanStreetVendor: true, hasStreetVendorCertificate: true }
      },
      { 
        value: false, 
        labelKey: "No, vending in rural village or stationary shop", 
        sublabelKey: "ಗ್ರಾಮೀಣ ಪ್ರದೇಶ ಅಥವಾ ಖಾಯಂ ಅಂಗಡಿ", 
        iconName: "XCircle",
        payload: { isUrbanStreetVendor: false }
      }
    ]
  },
  {
    id: "q_student",
    order: 6,
    textKey: "question_student_text",
    audioVoiceKey: "audio_qstudent",
    helpKey: "Post-Matric Scholarships reimburse 100% compulsory college/ITI tuition fees.",
    type: "boolean",
    fieldName: "isEnrolledStudent",
    condition: (answers) => answers?.occupation === 'student',
    options: [
      { 
        value: true, 
        labelKey: "Yes, enrolled in post-matric, college, or ITI", 
        sublabelKey: "ಕಾಲೇಜು, ಐಟಿಐ, ಡಿಪ್ಲೋಮಾ ಅಥವಾ ಪದವಿ ವಿದ್ಯಾರ್ಥಿ", 
        iconName: "GraduationCap",
        payload: { isEnrolledStudent: true }
      },
      { 
        value: false, 
        labelKey: "In school below Class 10 / not enrolled", 
        sublabelKey: "10ನೇ ತರಗತಿಗಿಂತ ಕಡಿಮೆ ಅಥವಾ ಕಾಲೇಜಿನಲ್ಲಿಲ್ಲ", 
        iconName: "XCircle",
        payload: { isEnrolledStudent: false }
      }
    ]
  },
  {
    id: "q_income",
    order: 7,
    textKey: "question4_text",
    audioVoiceKey: "audio_q4",
    helpKey: "Assesses poverty line status, Ayushman Bharat ₹5 Lakh health cover, and scholarships.",
    type: "single_choice",
    fieldName: "annualIncome",
    options: [
      { 
        value: 100000, 
        labelKey: "Below ₹1.2 Lakh (BPL / Antyodaya Ration Card)", 
        sublabelKey: "₹1.2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ (ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ₹5 ಲಕ್ಷ ಉಚಿತ ಚಿಕಿತ್ಸೆ)",
        payload: { annualIncome: 100000, hasBplOrRationCard: true }
      },
      { 
        value: 240000, 
        labelKey: "Between ₹1.2 Lakh and ₹2.5 Lakh", 
        sublabelKey: "₹1.2 ಲಕ್ಷದಿಂದ ₹2.5 ಲಕ್ಷ (ಪೋಸ್ಟ್ ಮೆಟ್ರಿಕ್ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಅರ್ಹ)",
        payload: { annualIncome: 240000 }
      },
      { 
        value: 500000, 
        labelKey: "Between ₹2.5 Lakh and ₹8 Lakh", 
        sublabelKey: "₹2.5 ಲಕ್ಷದಿಂದ ₹8 ಲಕ್ಷ (ಮಧ್ಯಮ ಆದಾಯ)",
        payload: { annualIncome: 500000 }
      },
      { 
        value: 1000000, 
        labelKey: "Above ₹8 Lakh (Taxpayer Bracket)", 
        sublabelKey: "₹8 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು (ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿದಾರರು)",
        payload: { annualIncome: 1000000, isIncomeTaxPayee: true }
      }
    ]
  },
  {
    id: "q_govt_emp",
    order: 8,
    textKey: "question5_text",
    audioVoiceKey: "audio_q5",
    helpKey: "Statutory rules for schemes like PM-KISAN exclude regular government servants and pensioners ≥ ₹10,000/mo.",
    type: "boolean",
    fieldName: "isGovtEmployee",
    options: [
      { 
        value: false, 
        labelKey: "No, no government job or high pension (ಯಾರೂ ಇಲ್ಲ)", 
        sublabelKey: "ಕುಟುಂಬದಲ್ಲಿ ಯಾರೂ ಸರ್ಕಾರಿ ನೌಕರರಿಲ್ಲ (ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರು)", 
        iconName: "CheckCircle2",
        payload: { isGovtEmployee: false, govtEmploymentType: 'none', isIncomeTaxPayee: false }
      },
      { 
        value: true, 
        labelKey: "Yes, regular government or PSU employee (ಸರ್ಕಾರಿ ನೌಕರರು)", 
        sublabelKey: "ಖಾಯಂ ಸರ್ಕಾರಿ ನೌಕರರು (ಕೆಲವು ಯೋಜನೆಗಳಿಗೆ ಶಾಸನಬದ್ಧ ವಿನಾಯಿತಿ)", 
        iconName: "XCircle",
        payload: { isGovtEmployee: true, govtEmploymentType: 'central_state_regular' }
      }
    ]
  }
];
