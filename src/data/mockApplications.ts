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
        date: "12 Nov 2026",
        timestamp: "11:30 AM",
        description: "Application packet submitted via Grama One Center with verified Aadhaar biometric authentication.",
        isCompleted: true,
        isCurrent: false,
        handlingOfficer: "Grama One CSC VLE #8102",
        isOfficial: true
      },
      {
        stage: 2,
        titleKey: "Department Verification (Land Record RTC & eKYC)",
        date: "14 Nov 2026",
        timestamp: "03:15 PM",
        description: "Agricultural plot boundaries matched against state Bhoomi land database. Awaiting Tahsildar digital token signature.",
        isCompleted: false,
        isCurrent: true,
        handlingOfficer: "Revenue Inspector (RI), Circle 4",
        remarksKey: "Land plot boundaries verified against state Bhoomi database. Pending Tehsildar digital signature.",
        isOfficial: true
      },
      {
        stage: 3,
        titleKey: "Application Decision & Sanction Order",
        date: "Expected by 27 Nov 2026",
        description: "Formal sanction order generation and PFMS central beneficiary whitelist registration.",
        isCompleted: false,
        isCurrent: false,
        handlingOfficer: "District Agriculture Officer",
        isOfficial: true
      },
      {
        stage: 4,
        titleKey: "Benefit Disbursement (DBT ₹2,000 Installment Credit)",
        description: "Direct Benefit Transfer credit to NPCI-linked bank savings account during national release cycle.",
        isCompleted: false,
        isCurrent: false,
        isOfficial: true
      }
    ],
    pendingActions: [
      "Keep SMS notifications active on Aadhaar-linked mobile number.",
      "Ensure Bank Account remains active with NPCI Aadhaar seeding."
    ],
    citizenNotes: [
      {
        id: "note-1",
        createdAt: "15 Nov 2026, 10:45 AM",
        text: "Visited Taluk Revenue Office; Village Accountant confirmed RTC Pahani was endorsed and forwarded to Tehsildar.",
        author: "Citizen Self-Report"
      }
    ],
    disbursementDetails: {
      amount: 2000,
      accountMasked: "SBI •••• 4120",
      status: "pending"
    }
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
        titleKey: "Online Application Submitted via Aadhaar OTP",
        date: "28 Oct 2026",
        timestamp: "02:10 PM",
        description: "Self-filed by applicant on PM SVANidhi citizen portal using UIDAI Aadhaar OTP verification.",
        isCompleted: true,
        isCurrent: false,
        isOfficial: true
      },
      {
        stage: 2,
        titleKey: "Department Verification by Urban Local Body",
        date: "02 Nov 2026",
        timestamp: "11:00 AM",
        description: "Field verification of vending activity completed by municipal ward inspector.",
        isCompleted: true,
        isCurrent: false,
        handlingOfficer: "Town Vending Committee (TVC), Ward 12",
        isOfficial: true
      },
      {
        stage: 3,
        titleKey: "Application Decision (Bank Branch Credit Sanction)",
        date: "Action Required Since 06 Nov 2026",
        description: "Lead bank underwriting review. Bank requires physical vending certificate or letter of recommendation.",
        isCompleted: false,
        isCurrent: true,
        handlingOfficer: "Branch Manager, Lead District Bank",
        remarksKey: "Bank requires confirmation of vendor trade stall location / vending identity card.",
        isOfficial: true
      },
      {
        stage: 4,
        titleKey: "Benefit Disbursement (Loan Amount Credited)",
        description: "₹10,000 working capital loan disbursal with 7% interest subsidy benefit.",
        isCompleted: false,
        isCurrent: false,
        isOfficial: true
      }
    ],
    missingDocuments: [
      {
        documentId: "vending_certificate",
        documentName: "Town Vending Certificate / Letter of Recommendation (LoR)",
        reason: "Bank verification flagged missing municipal vendor endorsement.",
        requestedBy: "Lead District Bank Branch Manager",
        actionRequired: "Upload LoR extract or visit Municipal Office Ward 12 to collect physical certificate.",
        resolved: false
      }
    ],
    pendingActions: [
      "Submit Town Vending Certificate to Lead Bank Branch.",
      "Statutory SLA of 14 days has elapsed (11 days overdue) — CPGRAMS grievance escalation available."
    ],
    citizenNotes: [
      {
        id: "note-sv-1",
        createdAt: "08 Nov 2026, 04:20 PM",
        text: "Spoke to Bank Field Officer; requested time to collect vending certificate duplicate from Municipal Corporation.",
        author: "Citizen Self-Report"
      }
    ],
    disbursementDetails: {
      amount: 10000,
      accountMasked: "PNB •••• 9812",
      status: "pending"
    }
  },
  {
    id: "app-pmjay-55102",
    tokenNumber: "KA-JAY-2026-55102",
    schemeId: "pm-jay",
    schemeTitle: "Ayushman Bharat PM-JAY (₹5,00,000 Health Cover)",
    submittedAt: "15 Oct 2026",
    currentStage: 4,
    statusBadge: "disbursed",
    isDelayed: false,
    slaDeadlineDays: 10,
    slaDaysRemaining: 0,
    handlingOffice: "State Health Agency (Suvarna Arogya Suraksha Trust)",
    submittedVia: "csc_assisted",
    audioStatusNarrationKey: "Your Ayushman Bharat PM-JAY application is approved and active. Your Ayushman Card provides ₹5 Lakh annual cashless treatment.",
    milestones: [
      {
        stage: 1,
        titleKey: "Application Submitted via Ration Card eKYC",
        date: "15 Oct 2026",
        timestamp: "09:45 AM",
        description: "Beneficiary identity matched against BPL / SECC database at Grama One center.",
        isCompleted: true,
        isCurrent: false,
        handlingOfficer: "Arogya Mitra Counter Operator",
        isOfficial: true
      },
      {
        stage: 2,
        titleKey: "Department Verification by Health Agency",
        date: "18 Oct 2026",
        timestamp: "04:30 PM",
        description: "Household entitlement eligibility verified by District Health Officer.",
        isCompleted: true,
        isCurrent: false,
        handlingOfficer: "District Health Officer (DHO)",
        isOfficial: true
      },
      {
        stage: 3,
        titleKey: "Application Decision (Sanction & Card Generation)",
        date: "20 Oct 2026",
        timestamp: "10:15 AM",
        description: "Official sanction issued. Ayushman Golden Card ID AB-PMJAY-KA-9912 generated in National Health Authority repository.",
        isCompleted: true,
        isCurrent: false,
        handlingOfficer: "National Health Authority Approval System",
        isOfficial: true
      },
      {
        stage: 4,
        titleKey: "Benefit Disbursement (Active Cashless Cover)",
        date: "22 Oct 2026",
        timestamp: "12:00 PM",
        description: "₹5,00,000 cashless family floater cover active across all empaneled government & private hospitals nationwide.",
        isCompleted: true,
        isCurrent: false,
        isOfficial: true
      }
    ],
    pendingActions: [
      "Collect laminated PVC Ayushman Card from local Gram Panchayat or download e-Card."
    ],
    citizenNotes: [
      {
        id: "note-pmjay-1",
        createdAt: "23 Oct 2026, 02:00 PM",
        text: "Downloaded digital e-Card on phone; confirmed hospital empanelment at District Hospital.",
        author: "Citizen Self-Report"
      }
    ],
    disbursementDetails: {
      amount: 500000,
      accountMasked: "Ayushman ID: AB-PMJAY-KA-9912",
      utrNumber: "NHA-SANCTION-2026-88124",
      disbursedDate: "22 Oct 2026",
      status: "credited"
    }
  }
];
