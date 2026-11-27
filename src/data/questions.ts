import { EligibilityQuestion } from '../types';

export const eligibilityQuestions: EligibilityQuestion[] = [
  {
    id: "q_occupation",
    order: 1,
    textKey: "question1_text",
    audioVoiceKey: "audio_q1",
    helpKey: "q_occupation_help",
    type: "single_choice",
    fieldName: "occupation",
    options: [
      { value: "farmer", labelKey: "opt_farmer_label", iconName: "Wheat", sublabelKey: "opt_farmer_sub" },
      { value: "street_vendor", labelKey: "opt_vendor_label", iconName: "Store", sublabelKey: "opt_vendor_sub" },
      { value: "student", labelKey: "opt_student_label", iconName: "GraduationCap", sublabelKey: "opt_student_sub" },
      { value: "daily_wage", labelKey: "opt_daily_wage_label", iconName: "Hammer", sublabelKey: "opt_daily_wage_sub" },
      { value: "homemaker", labelKey: "opt_homemaker_label", iconName: "Heart", sublabelKey: "opt_homemaker_sub" },
      { value: "artisan", labelKey: "opt_artisan_label", iconName: "Scissors", sublabelKey: "opt_artisan_sub" }
    ]
  },
  {
    id: "q_land",
    order: 2,
    textKey: "question2_text",
    audioVoiceKey: "audio_q2",
    helpKey: "q_land_help",
    type: "single_choice",
    fieldName: "landholdingAcres",
    options: [
      { value: 1.5, labelKey: "opt_land_small_label", sublabelKey: "opt_land_small_sub" },
      { value: 4.0, labelKey: "opt_land_med_label", sublabelKey: "opt_land_med_sub" },
      { value: 10.0, labelKey: "opt_land_large_label", sublabelKey: "opt_land_large_sub" },
      { value: 0, labelKey: "opt_land_none_label", sublabelKey: "opt_land_none_sub" }
    ]
  },
  {
    id: "q_gender_age",
    order: 3,
    textKey: "question3_text",
    audioVoiceKey: "audio_q3",
    helpKey: "q_gender_help",
    type: "single_choice",
    fieldName: "gender",
    options: [
      { value: "female", labelKey: "opt_female_label", iconName: "User", sublabelKey: "opt_female_sub" },
      { value: "male", labelKey: "opt_male_label", iconName: "User", sublabelKey: "opt_male_sub" },
      { value: "other", labelKey: "opt_other_label", iconName: "Users", sublabelKey: "opt_other_sub" }
    ]
  },
  {
    id: "q_maternity",
    order: 4,
    textKey: "question_maternity_text",
    audioVoiceKey: "audio_qmaternity",
    helpKey: "q_maternity_help",
    type: "boolean",
    fieldName: "isPregnantOrLactating",
    condition: (answers) => answers?.gender === 'female',
    options: [
      {
        value: true,
        labelKey: "opt_maternity_yes_label",
        sublabelKey: "opt_maternity_yes_sub",
        iconName: "Heart",
        payload: { isPregnantOrLactating: true, maternityParity: 'first_child' }
      },
      {
        value: false,
        labelKey: "opt_maternity_no_label",
        sublabelKey: "opt_maternity_no_sub",
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
    helpKey: "q_vending_help",
    type: "boolean",
    fieldName: "isUrbanStreetVendor",
    condition: (answers) => answers?.occupation === 'street_vendor',
    options: [
      {
        value: true,
        labelKey: "opt_vending_yes_label",
        sublabelKey: "opt_vending_yes_sub",
        iconName: "Store",
        payload: { isUrbanStreetVendor: true, hasStreetVendorCertificate: true }
      },
      {
        value: false,
        labelKey: "opt_vending_no_label",
        sublabelKey: "opt_vending_no_sub",
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
    helpKey: "q_student_help",
    type: "boolean",
    fieldName: "isEnrolledStudent",
    condition: (answers) => answers?.occupation === 'student',
    options: [
      {
        value: true,
        labelKey: "opt_student_yes_label",
        sublabelKey: "opt_student_yes_sub",
        iconName: "GraduationCap",
        payload: { isEnrolledStudent: true }
      },
      {
        value: false,
        labelKey: "opt_student_no_label",
        sublabelKey: "opt_student_no_sub",
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
    helpKey: "q_income_help",
    type: "single_choice",
    fieldName: "annualIncome",
    options: [
      {
        value: 100000,
        labelKey: "opt_income_bpl_label",
        sublabelKey: "opt_income_bpl_sub",
        payload: { annualIncome: 100000, hasBplOrRationCard: true }
      },
      {
        value: 240000,
        labelKey: "opt_income_low_label",
        sublabelKey: "opt_income_low_sub",
        payload: { annualIncome: 240000 }
      },
      {
        value: 500000,
        labelKey: "opt_income_mid_label",
        sublabelKey: "opt_income_mid_sub",
        payload: { annualIncome: 500000 }
      },
      {
        value: 1000000,
        labelKey: "opt_income_high_label",
        sublabelKey: "opt_income_high_sub",
        payload: { annualIncome: 1000000, isIncomeTaxPayee: true }
      }
    ]
  },
  {
    id: "q_govt_emp",
    order: 8,
    textKey: "question5_text",
    audioVoiceKey: "audio_q5",
    helpKey: "q_govt_help",
    type: "boolean",
    fieldName: "isGovtEmployee",
    options: [
      {
        value: false,
        labelKey: "opt_govt_no_label",
        sublabelKey: "opt_govt_no_sub",
        iconName: "CheckCircle2",
        payload: { isGovtEmployee: false, govtEmploymentType: 'none', isIncomeTaxPayee: false }
      },
      {
        value: true,
        labelKey: "opt_govt_yes_label",
        sublabelKey: "opt_govt_yes_sub",
        iconName: "XCircle",
        payload: { isGovtEmployee: true, govtEmploymentType: 'central_state_regular' }
      }
    ]
  }
];
