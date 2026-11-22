import { EligibilityQuestion } from '../types';

export const eligibilityQuestions: EligibilityQuestion[] = [
  {
    id: "q_occupation",
    order: 1,
    textKey: "question1_text",
    audioVoiceKey: "audio_q1",
    type: "single_choice",
    fieldName: "occupation",
    options: [
      { value: "farmer", labelKey: "Farmer / Agricultural Worker (ರೈತ / किसान)", iconName: "Wheat" },
      { value: "street_vendor", labelKey: "Street Vendor / Small Merchant (ಬೀದಿ ಬದಿ ವ್ಯಾಪಾರಿ / फेरीवाला)", iconName: "Store" },
      { value: "student", labelKey: "Student / Youth in College (ವಿದ್ಯಾರ್ಥಿ / छात्र)", iconName: "GraduationCap" },
      { value: "daily_wage", labelKey: "Daily Wage Laborer (ದಿನಗೂಲಿ ಕಾರ್ಮಿಕ / दिहाड़ी मजदूर)", iconName: "Hammer" },
      { value: "homemaker", labelKey: "Homemaker / Mother (ಗೃಹಿಣಿ / ತಾಯಿ / महिला)", iconName: "Heart" },
      { value: "artisan", labelKey: "Handloom / Craftsperson (ಕುಶಲಕರ್ಮಿ / कारीगर)", iconName: "Scissors" }
    ]
  },
  {
    id: "q_land",
    order: 2,
    textKey: "question2_text",
    audioVoiceKey: "audio_q2",
    type: "single_choice",
    fieldName: "landholdingAcres",
    options: [
      { value: 1.5, labelKey: "Less than 2.5 Acres (Small/Marginal Farmer)", sublabelKey: "2.5 ಎಕರೆಗಿಂತ ಕಡಿಮೆ (ಸಣ್ಣ ರೈತರು)" },
      { value: 4.0, labelKey: "2.5 to 5 Acres (Medium Landholder)", sublabelKey: "2.5 ರಿಂದ 5 ಎಕರೆ" },
      { value: 10.0, labelKey: "More than 5 Acres (Large Landholder)", sublabelKey: "5 ಎಕರೆಗಿಂತ ಹೆಚ್ಚು" },
      { value: 0, labelKey: "No Agricultural Land (Landless)", sublabelKey: "ಜಮೀನು ಇಲ್ಲ (ಭೂಹೀನರು)" }
    ]
  },
  {
    id: "q_gender_age",
    order: 3,
    textKey: "question3_text",
    audioVoiceKey: "audio_q3",
    type: "single_choice",
    fieldName: "gender",
    options: [
      { value: "female", labelKey: "Female (ಮಹಿಳೆ / महिला)", iconName: "User" },
      { value: "male", labelKey: "Male (ಪುರುಷ / पुरुष)", iconName: "User" },
      { value: "other", labelKey: "Other / Transgender (ಇತರ / अन्य)", iconName: "Users" }
    ]
  },
  {
    id: "q_income",
    order: 4,
    textKey: "question4_text",
    audioVoiceKey: "audio_q4",
    type: "single_choice",
    fieldName: "annualIncome",
    options: [
      { value: 100000, labelKey: "Below ₹1.2 Lakh (BPL / Yellow Ration Card)", sublabelKey: "₹1.2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ (ಬಿಪಿಎಲ್)" },
      { value: 240000, labelKey: "Between ₹1.2 Lakh and ₹2.5 Lakh", sublabelKey: "₹1.2 ಲಕ್ಷದಿಂದ ₹2.5 ಲಕ್ಷ" },
      { value: 500000, labelKey: "Between ₹2.5 Lakh and ₹8 Lakh", sublabelKey: "₹2.5 ಲಕ್ಷದಿಂದ ₹8 ಲಕ್ಷ" },
      { value: 1000000, labelKey: "Above ₹8 Lakh (Taxpayer Bracket)", sublabelKey: "₹8 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು" }
    ]
  },
  {
    id: "q_govt_emp",
    order: 5,
    textKey: "question5_text",
    audioVoiceKey: "audio_q5",
    type: "boolean",
    fieldName: "isGovtEmployee",
    options: [
      { value: false, labelKey: "No (ಯಾರೂ ಇಲ್ಲ / कोई नहीं - Eligible)", iconName: "CheckCircle2" },
      { value: true, labelKey: "Yes (ಹೌದು / हाँ - Govt Job)", iconName: "XCircle" }
    ]
  }
];
