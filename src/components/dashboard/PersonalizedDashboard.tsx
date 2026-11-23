import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Bookmark, Clock, History, FileText, 
  ArrowRight, Trash2, User, Compass 
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { Scheme } from '../../types';
import { assessEligibility } from '../../services/eligibilityEngine';
import { SchemeCard } from '../schemes/SchemeCard';

export const PersonalizedDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { 
    schemes, 
    savedSchemeIds, 
    recentlyViewedSchemeIds, 
    clearRecentlyViewedSchemes,
    assessmentHistory,
    applications,
    eligibilityAnswers,
    profiles,
    activeProfileId,
    setActiveProfileId,
    authUser
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'recommended' | 'saved' | 'recent' | 'assessments' | 'applications'>('recommended');

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // 1. Compute Recommended Schemes based on actual assessment or active profile attributes
  const assessment = useMemo(() => {
    return assessEligibility(eligibilityAnswers);
  }, [eligibilityAnswers]);

  const recommendedSchemes = useMemo(() => {
    if (assessment.eligibleSchemes.length > 0) {
      return assessment.eligibleSchemes;
    }
    // Profile-informed recommendation heuristics
    if (activeProfile) {
      const matches: Scheme[] = [];
      const occ = (activeProfile.occupation || '').toLowerCase();
      if (occ.includes('farmer') || activeProfile.landholdingAcres > 0) {
        const kisan = schemes.find(s => s.id === 'pm-kisan');
        if (kisan) matches.push(kisan);
      }
      if (activeProfile.gender === 'female') {
        const lakshmi = schemes.find(s => s.id === 'gruha-lakshmi');
        if (lakshmi) matches.push(lakshmi);
      }
      if (activeProfile.annualIncome <= 250000 || activeProfile.annualIncome === 0) {
        const ayushman = schemes.find(s => s.id === 'pm-jay');
        if (ayushman && !matches.some(m => m.id === ayushman.id)) matches.push(ayushman);
      }
      const surya = schemes.find(s => s.id === 'pm-surya-ghar');
      if (surya && !matches.some(m => m.id === surya.id)) matches.push(surya);

      if (matches.length > 0) return matches;
    }
    // Default top 4 verified schemes
    return schemes.slice(0, 4);
  }, [assessment.eligibleSchemes, activeProfile, schemes]);

  // 2. Saved schemes list
  const savedSchemes = useMemo(() => {
    return schemes.filter(s => savedSchemeIds.includes(s.id));
  }, [schemes, savedSchemeIds]);

  // 3. Recently viewed schemes list
  const recentSchemes = useMemo(() => {
    return recentlyViewedSchemeIds
      .map(id => schemes.find(s => s.id === id))
      .filter((s): s is Scheme => !!s);
  }, [schemes, recentlyViewedSchemeIds]);

  const tabs = [
    { 
      id: 'recommended', 
      label: t('tabRecommended', 'Recommended'), 
      icon: Sparkles,
      count: recommendedSchemes.length
    },
    { 
      id: 'saved', 
      label: t('tabSaved', 'Saved Schemes'), 
      icon: Bookmark,
      count: savedSchemes.length
    },
    { 
      id: 'recent', 
      label: t('tabRecentlyViewed', 'Recently Viewed'), 
      icon: Clock,
      count: recentSchemes.length
    },
    { 
      id: 'assessments', 
      label: t('tabAssessmentHistory', 'Assessment History'), 
      icon: History,
      count: assessmentHistory.length
    },
    { 
      id: 'applications', 
      label: t('tabApplicationProgress', 'Application Progress'), 
      icon: FileText,
      count: applications.length
    },
  ] as const;

  return (
    <section aria-labelledby="personalized-dashboard-heading" className="space-y-6">
      {/* Header with Title and Household Member Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {authUser ? 'Citizen Welfare Cockpit' : 'Guest Mode Active'}
            </span>
          </div>
          <h2 id="personalized-dashboard-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'kn' ? 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕಲ್ಯಾಣ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : language === 'hi' ? 'आपका व्यक्तिगत कल्याण डैशबोर्ड' : language === 'bn' ? 'আপনার ব্যক্তিগত কল্যাণ ড্যাশবোর্ড' : 'Your Personalized Welfare Hub'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'kn' ? 'ಶಿಫಾರಸುಗಳು, ಉಳಿಸಿದ ಯೋಜನೆಗಳು ಮತ್ತು ಅರ್ಜಿಗಳ ಸ್ಥಿತಿಯನ್ನು ಇಲ್ಲಿ ನಿರ್ವಹಿಸಿ' : 'Track customized entitlements, saved bookmarks, and real statutory progress'}
          </p>
        </div>

        {/* Family Member Context Selector */}
        {profiles.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <User className="w-4 h-4 text-slate-500 ml-2 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden md:inline">Profile:</span>
            <select
              value={activeProfileId}
              onChange={(e) => setActiveProfileId(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Select household member profile"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.relation.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs Rail with Count Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar overscroll-x-contain">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 min-h-[44px] active:scale-95 ${
                isActive
                  ? 'bg-brand-navy-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-crisp-xs ring-2 ring-brand-navy-900/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive 
                    ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          {/* 1. RECOMMENDED SCHEMES */}
          {activeTab === 'recommended' && (
            <motion.div
              key="recommended"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {assessment.status === 'not_assessed' && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      {t('recommendedBannerNotice', 'Currently showing schemes based on your profile. Complete the 2-minute check to establish verified eligibility.')}
                    </span>
                  </div>
                  <Link
                    to="/eligibility"
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0 min-h-[38px]"
                  >
                    <span>{t('checkEligibilityBtn', 'Check Eligibility')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {recommendedSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. SAVED SCHEMES */}
          {activeTab === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {savedSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {savedSchemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('savedEmptyTitle', 'No Saved Schemes Yet')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('savedEmptyDesc', 'Click the bookmark icon on any scheme to pin it here for comparison or offline review.')}
                  </p>
                  <Link
                    to="/schemes"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy-900 dark:bg-sky-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                  >
                    <span>Browse All Schemes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. RECENTLY VIEWED SCHEMES */}
          {activeTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {recentSchemes.length > 0 ? (
                <>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearRecentlyViewedSchemes}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('clearRecentHistory', 'Clear History')}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {recentSchemes.map((scheme) => (
                      <SchemeCard key={scheme.id} scheme={scheme} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('recentEmptyTitle', 'No Recently Viewed Schemes')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('recentEmptyDesc', 'Schemes you inspect in the portal will appear here for fast re-access.')}
                  </p>
                  <Link
                    to="/schemes"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy-900 dark:bg-sky-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                  >
                    <span>Explore Schemes Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. ASSESSMENT HISTORY */}
          {activeTab === 'assessments' && (
            <motion.div
              key="assessments"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {assessmentHistory.length > 0 ? (
                <div className="space-y-3">
                  {assessmentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-crisp-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-slate-500">{item.completedAt}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Profile: {item.profileName || 'Household'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'potentially_eligible'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          {item.eligibleCount} Qualified Schemes • Potential Annual Benefit: ₹{item.totalAnnualBenefitValue.toLocaleString('en-IN')}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          to="/eligibility/results"
                          className="px-3.5 py-2 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm min-h-[38px]"
                        >
                          <span>View Results</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to="/eligibility"
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all min-h-[38px] flex items-center justify-center"
                        >
                          <span>Retake</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <History className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('assessmentEmptyTitle', 'No Assessment History')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('assessmentEmptyDesc', 'Take our 2-minute plain-language assessment to calculate statutory entitlements for your household.')}
                  </p>
                  <Link
                    to="/eligibility"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                  >
                    <span>Start 2-Minute Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* 5. APPLICATION PROGRESS */}
          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-crisp-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                            Token: {app.tokenNumber}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {app.schemeTitle}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            app.isDelayed 
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' 
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {app.isDelayed ? 'Overdue Beyond SLA' : 'In Progress (ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ)'}
                          </span>
                          <Link
                            to={`/tracker`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                          >
                            <span>Track</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* 4-Stage Stepper Preview */}
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {[1, 2, 3, 4].map((stepNum) => {
                          const isDone = app.currentStage > stepNum || (app.currentStage === stepNum && stepNum === 4);
                          const isCurrent = app.currentStage === stepNum && stepNum !== 4;
                          return (
                            <div key={stepNum} className="text-center">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-1 ${
                                isDone 
                                  ? 'bg-emerald-600 text-white' 
                                  : isCurrent 
                                  ? 'bg-amber-600 text-white ring-2 ring-amber-300' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}>
                                {isDone ? '✓' : stepNum}
                              </div>
                              <span className="text-[10px] text-slate-500 line-clamp-1">
                                {stepNum === 1 ? 'Applied' : stepNum === 2 ? 'Verify' : stepNum === 3 ? 'Sanction' : 'DBT Credit'}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Handling Office: <strong>{app.handlingOffice}</strong></span>
                        <span>SLA: <strong>{app.slaDaysRemaining} days remaining</strong> (Under Sakala Charter)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('applicationEmptyTitle', 'No Active Applications Yet')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('applicationEmptyDesc', 'Once you file an application or obtain a CSC acknowledgment slip, track departmental verification here.')}
                  </p>
                  <Link
                    to="/tracker"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy-900 dark:bg-sky-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                  >
                    <span>Track with Application Token</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
