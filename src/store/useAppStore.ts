import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { 
  SupportedLanguage, UserProfile, ApplicationRecord, NotificationItem, 
  Scheme, EligibilityAssessmentStatus, AssessmentHistoryRecord 
} from '../types';
import { verifiedSchemes } from '../data/schemes';
import { mockApplicationsData } from '../data/mockApplications';
import { mockNotificationsData } from '../data/mockNotifications';
import { getCurrentUser, onAuthStateChange, logoutUser as apiLogoutUser } from '../services/authService';
import { saveSchemeToDb, removeSavedSchemeFromDb, fetchSavedSchemeCodes } from '../services/savedSchemesDbService';
import { createApplicationInDb, fetchApplicationsFromDb } from '../services/applicationDbService';
import { fetchHouseholdMembersFromDb, createHouseholdMemberInDb } from '../services/householdMembersDbService';

interface AppState {
  // Authentication & Guest Mode
  authUser: User | null;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register' | 'forgot_password';
  setAuthUser: (user: User | null) => void;
  openAuthModal: (view?: 'login' | 'register' | 'forgot_password') => void;
  closeAuthModal: () => void;
  initializeAuth: () => Promise<void>;
  logoutUser: () => Promise<void>;

  // Localization
  language: SupportedLanguage;
  dialect: string;
  setLanguage: (lang: SupportedLanguage) => void;
  setDialect: (dialect: string) => void;

  // Accessibility & Theme
  isAudioAssistanceEnabled: boolean;
  toggleAudioAssistance: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isHighSunlightMode: boolean;
  toggleHighSunlightMode: () => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  // Profiles (Family Proxy)
  profiles: UserProfile[];
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  addProfile: (profile: Omit<UserProfile, 'id'>) => void;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;

  // Schemes & Discovery
  schemes: Scheme[];
  savedSchemeIds: string[];
  toggleSaveScheme: (schemeId: string) => void;
  compareSchemeIds: string[];
  toggleCompareScheme: (schemeId: string) => void;
  clearCompareSchemes: () => void;
  recentlyViewedSchemeIds: string[];
  addRecentlyViewedScheme: (schemeId: string) => void;
  clearRecentlyViewedSchemes: () => void;

  // Eligibility Engine State
  eligibilityStatus: EligibilityAssessmentStatus;
  setEligibilityStatus: (status: EligibilityAssessmentStatus) => void;
  eligibilityAnswers: {
    occupation?: string;
    landholdingAcres?: number;
    gender?: string;
    age?: number;
    annualIncome?: number;
    socialCategory?: string;
    isGovtEmployee?: boolean;
  };
  setEligibilityAnswer: (field: string, value: any) => void;
  resetEligibilityAnswers: () => void;
  assessmentHistory: AssessmentHistoryRecord[];
  recordAssessment: (record: AssessmentHistoryRecord) => void;

  // Applications
  applications: ApplicationRecord[];
  addApplication: (newApp: ApplicationRecord) => void;
  addCitizenNote: (applicationId: string, noteText: string) => void;
  resolveMissingDocument: (applicationId: string, documentId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Active AI Drawer & Floating Trigger
  isAiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  isAiFabDismissed: boolean;
  setAiFabDismissed: (dismissed: boolean) => void;

  // Document Verification States
  documentUploadStatus: Record<string, 'verified' | 'uploaded' | 'pending' | 'rejected'>;
  setDocumentStatus: (docId: string, status: 'verified' | 'uploaded' | 'pending' | 'rejected') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Authentication & Guest Mode
  authUser: null,
  isAuthModalOpen: false,
  authModalView: 'login',
  setAuthUser: (user) => set({ authUser: user }),
  openAuthModal: (view = 'login') => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  initializeAuth: async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ authUser: user });
        // Sync saved schemes from database
        const { savedCodes } = await fetchSavedSchemeCodes(user.id);
        if (savedCodes.length > 0) {
          set((state) => ({
            savedSchemeIds: Array.from(new Set([...state.savedSchemeIds, ...savedCodes]))
          }));
        }
        // Sync applications from database
        const { applications: dbApps } = await fetchApplicationsFromDb(user.id);
        if (dbApps.length > 0) {
          set((state) => ({
            applications: [...dbApps, ...state.applications.filter(a => !dbApps.some(da => da.id === a.id))]
          }));
        }
        // Sync household members from database
        const { members: dbMembers } = await fetchHouseholdMembersFromDb(user.id);
        if (dbMembers.length > 0) {
          set({ profiles: dbMembers, activeProfileId: dbMembers[0].id });
        }
      }
      // Listen for session changes
      onAuthStateChange(async (updatedUser: User | null) => {
        set({ authUser: updatedUser });
        if (updatedUser) {
          const { savedCodes } = await fetchSavedSchemeCodes(updatedUser.id);
          if (savedCodes.length > 0) {
            set((state) => ({
              savedSchemeIds: Array.from(new Set([...state.savedSchemeIds, ...savedCodes]))
            }));
          }
        }
      });
    } catch (err) {
      console.warn("Auth initialization running in guest mode fallback:", err);
    }
  },
  logoutUser: async () => {
    await apiLogoutUser();
    set({ authUser: null, isAuthModalOpen: false });
  },

  // Defaults
  language: 'kn', // Defaults to Kannada for Bharat-first demonstration
  dialect: 'standard',
  setLanguage: (lang) => {
    document.documentElement.lang = lang;
    set({ language: lang });
  },
  setDialect: (dialect) => set({ dialect }),

  isAudioAssistanceEnabled: true,
  toggleAudioAssistance: () => set((state) => ({ isAudioAssistanceEnabled: !state.isAudioAssistanceEnabled })),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: next };
  }),
  isHighSunlightMode: false,
  toggleHighSunlightMode: () => set((state) => {
    const next = !state.isHighSunlightMode;
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    return { isHighSunlightMode: next };
  }),

  hasCompletedOnboarding: false,
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  profiles: [
    {
      id: "prof-1",
      name: "Rameshwar Yadav (ರಮೇಶ್ವರ್)",
      relation: "self",
      age: 52,
      gender: "male",
      occupation: "farmer",
      state: "Karnataka",
      district: "Mandya",
      socialCategory: "obc",
      landholdingAcres: 1.5,
      annualIncome: 110000,
      isAadhaarLinkedBank: true,
      isDigiLockerLinked: true
    },
    {
      id: "prof-2",
      name: "Sunita (daughter / ವಿದ್ಯಾರ್ಥಿನಿ)",
      relation: "child",
      age: 19,
      gender: "female",
      occupation: "student",
      state: "Karnataka",
      district: "Mandya",
      socialCategory: "obc",
      landholdingAcres: 0,
      annualIncome: 0,
      isAadhaarLinkedBank: true,
      isDigiLockerLinked: true
    }
  ],
  activeProfileId: "prof-1",
  setActiveProfileId: (id) => set({ activeProfileId: id }),
  addProfile: (newP) => {
    const state = get();
    const tempId = `prof-${Date.now()}`;
    set((s) => ({
      profiles: [...s.profiles, { ...newP, id: tempId }],
      activeProfileId: tempId
    }));
    if (state.authUser?.id) {
      createHouseholdMemberInDb(state.authUser.id, newP).then((res) => {
        if (res.success && res.member) {
          set((s) => ({
            profiles: s.profiles.map(p => p.id === tempId ? res.member! : p),
            activeProfileId: s.activeProfileId === tempId ? res.member!.id : s.activeProfileId
          }));
        }
      }).catch(console.warn);
    }
  },
  updateProfile: (id, updates) => set((state) => ({
    profiles: state.profiles.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  schemes: verifiedSchemes,
  savedSchemeIds: ["pm-kisan", "pm-jay"],
  toggleSaveScheme: (schemeId) => {
    const state = get();
    const isCurrentlySaved = state.savedSchemeIds.includes(schemeId);
    set({
      savedSchemeIds: isCurrentlySaved
        ? state.savedSchemeIds.filter(id => id !== schemeId)
        : [...state.savedSchemeIds, schemeId]
    });
    // Cloud sync when authenticated
    if (state.authUser?.id) {
      if (isCurrentlySaved) {
        removeSavedSchemeFromDb(state.authUser.id, schemeId).catch(console.warn);
      } else {
        saveSchemeToDb(state.authUser.id, schemeId).catch(console.warn);
      }
    }
  },

  compareSchemeIds: [],
  toggleCompareScheme: (schemeId) => set((state) => {
    if (state.compareSchemeIds.includes(schemeId)) {
      return { compareSchemeIds: state.compareSchemeIds.filter(id => id !== schemeId) };
    }
    if (state.compareSchemeIds.length >= 3) {
      return state;
    }
    return { compareSchemeIds: [...state.compareSchemeIds, schemeId] };
  }),
  clearCompareSchemes: () => set({ compareSchemeIds: [] }),

  recentlyViewedSchemeIds: (() => {
    try {
      const stored = localStorage.getItem('sahayak_recent_schemes');
      return stored ? JSON.parse(stored) : ['pm-kisan', 'gruha-lakshmi'];
    } catch {
      return ['pm-kisan', 'gruha-lakshmi'];
    }
  })(),
  addRecentlyViewedScheme: (schemeId: string) => {
    set((state) => {
      const updated = [schemeId, ...state.recentlyViewedSchemeIds.filter(id => id !== schemeId)].slice(0, 8);
      try { localStorage.setItem('sahayak_recent_schemes', JSON.stringify(updated)); } catch {}
      return { recentlyViewedSchemeIds: updated };
    });
  },
  clearRecentlyViewedSchemes: () => {
    try { localStorage.removeItem('sahayak_recent_schemes'); } catch {}
    set({ recentlyViewedSchemeIds: [] });
  },

  // Eligibility Engine State: Starts as 'not_assessed' with empty inputs
  eligibilityStatus: 'not_assessed',
  setEligibilityStatus: (status) => set({ eligibilityStatus: status }),
  eligibilityAnswers: {},
  setEligibilityAnswer: (field, value) => set((state) => ({
    eligibilityAnswers: { ...state.eligibilityAnswers, [field]: value },
    eligibilityStatus: 'in_progress'
  })),
  resetEligibilityAnswers: () => set({ 
    eligibilityAnswers: {}, 
    eligibilityStatus: 'not_assessed' 
  }),

  assessmentHistory: (() => {
    try {
      const stored = localStorage.getItem('sahayak_assessment_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),
  recordAssessment: (record: AssessmentHistoryRecord) => {
    set((state) => {
      const updated = [record, ...state.assessmentHistory.filter(h => h.id !== record.id)].slice(0, 10);
      try { localStorage.setItem('sahayak_assessment_history', JSON.stringify(updated)); } catch {}
      return { assessmentHistory: updated };
    });
  },

  applications: mockApplicationsData,
  addApplication: (newApp) => {
    set((state) => ({
      applications: [newApp, ...state.applications]
    }));
    const state = get();
    if (state.authUser?.id) {
      createApplicationInDb(state.authUser.id, {
        scheme_id: newApp.schemeId,
        status: newApp.statusBadge || 'submitted',
        application_reference: newApp.tokenNumber,
        notes: `Application filed via SAHAYAK portal on ${newApp.submittedAt}`
      }).catch(console.warn);
    }
  },
  addCitizenNote: (applicationId, noteText) => {
    const newNote = {
      id: `note-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      text: noteText,
      author: 'Citizen Self-Report (Personal Record)'
    };
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId
          ? { ...app, citizenNotes: [newNote, ...(app.citizenNotes || [])] }
          : app
      )
    }));
  },
  resolveMissingDocument: (applicationId, documentId) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              missingDocuments: (app.missingDocuments || []).map((doc) =>
                doc.documentId === documentId ? { ...doc, resolved: true } : doc
              ),
              statusBadge: 'under_review'
            }
          : app
      )
    }));
  },

  notifications: mockNotificationsData,
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),

  isAiDrawerOpen: false,
  setAiDrawerOpen: (open) => set({ isAiDrawerOpen: open }),
  isAiFabDismissed: false,
  setAiFabDismissed: (dismissed) => set({ isAiFabDismissed: dismissed }),

  documentUploadStatus: {
    aadhaar: "verified",
    land_record: "pending",
    bank_passbook: "pending"
  },
  setDocumentStatus: (docId, status) => set((state) => ({
    documentUploadStatus: { ...state.documentUploadStatus, [docId]: status }
  }))
}));
