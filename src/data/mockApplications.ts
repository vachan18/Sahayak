import { ApplicationRecord } from '../types';

export const mockApplicationsData: ApplicationRecord[] = [
  {
    id: "app-kisan-84920",
    tokenNumber: "KA-KISAN-2026-84920",
    schemeId: "pm-kisan",
    schemeTitle: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    submittedAt: "12 Nov 2026",
    currentStage: 2,
    statusBadge: "under_review",
    isDelayed: false,
    slaDeadlineDays: 21,
    slaDaysRemaining: 5,
    handlingOffice: "Tahsildar Office, Gorakhpur / Mandya Taluk",
    submittedVia: "csc_assisted",
    audioStatusNarrationKey: "Your PM-KISAN application is currently being verified by the Taluk Revenue Officer. Approval is expected within 5 days.",
    milestones: [
      {
        stage: 1,
        titleKey: "Application Submitted & Acknowledged",
        date: "12 Nov 2026, 11:30 AM",
        isCompleted: true,
        isCurrent: false,
        handlingOfficer: "Grama One CSC VLE #8102"
      },
      {
        stage: 2,
        titleKey: "Land Record (RTC) & Aadhaar eKYC Verification",
        date: "In Progress (Since 14 Nov)",
        isCompleted: false,
        isCurrent: true,
        handlingOfficer: "Revenue Inspector (RI), Circle 4",
        remarksKey: "Land plot boundaries verified against state Bhoomi database. Pending Tehsildar digital signature."
      },
      {
        stage: 3,
        titleKey: "Sanction Order & PFMS Portal Registration",
        date: "Upcoming (Target: 27 Nov)",
        isCompleted: false,
        isCurrent: false,
        handlingOfficer: "District Agriculture Officer"
      },
      {
        stage: 4,
        titleKey: "Direct Benefit Transfer (DBT ₹2,000 Installment Credit)",
        date: "Upcoming (Next Disbursal Cycle)",
        isCompleted: false,
        isCurrent: false
      }
    ]
  },
  {
    id: "app-svanidhi-9481",
    tokenNumber: "WB-SV-2026-9481",
    schemeId: "pm-svanidhi",
    schemeTitle: "PM SVANidhi Street Vendor Loan (₹10,000)",
    submittedAt: "28 Oct 2026",
    currentStage: 3,
    statusBadge: "action_needed",
    isDelayed: true,
    slaDeadlineDays: 14,
    slaDaysRemaining: -11,
    handlingOffice: "Lead District Bank / Municipal TVC",
    submittedVia: "self_online",
    audioStatusNarrationKey: "Warning: Your PM SVANidhi application has exceeded the statutory deadline of 14 days. You can submit an official CPGRAMS grievance immediately.",
    milestones: [
      {
        stage: 1,
        titleKey: "Online Application Filed via Aadhaar OTP",
        date: "28 Oct 2026",
        isCompleted: true,
        isCurrent: false
      },
      {
        stage: 2,
        titleKey: "Urban Local Body (Municipality) Vetting",
        date: "02 Nov 2026",
        isCompleted: true,
        isCurrent: false,
        handlingOfficer: "Town Vending Committee (TVC)"
      },
      {
        stage: 3,
        titleKey: "Bank Branch Credit Sanction",
        date: "Delayed (16 days elapsed at Bank)",
        isCompleted: false,
        isCurrent: true,
        handlingOfficer: "Branch Manager, Lead Bank",
        remarksKey: "Bank requires confirmation of vendor trade stall location."
      },
      {
        stage: 4,
        titleKey: "Loan Amount Credited to Bank Account",
        date: "Pending Sanction",
        isCompleted: false,
        isCurrent: false
      }
    ]
  }
];
