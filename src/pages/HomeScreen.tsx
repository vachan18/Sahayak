import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Mic, AlertTriangle, ArrowRight, Sparkles, 
  CheckCircle2, HelpCircle, Shield, Info, Compass 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { assessEligibility } from '../services/eligibilityEngine';
import { LifeEventGrid } from '../components/dashboard/LifeEventGrid';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { AudioListenButton } from '../components/feedback/AudioListenButton';
import { TrustAndClarityBanner } from '../components/dashboard/TrustAndClarityBanner';
import { PersonalizedDashboard } from '../components/dashboard/PersonalizedDashboard';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { schemes, setAiDrawerOpen, eligibilityAnswers } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredSchemes = schemes.slice(0, 3);

  const assessment = useMemo(() => {
    return assessEligibility(eligibilityAnswers);
  }, [eligibilityAnswers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-8 lg:space-y-12 animate-fadeIn pb-12">
      {/* 1. Hero: Voice & Search Cockpit (Deliberate Desktop 12-Column Responsive Layout) */}
      <section className="bg-gradient-to-br from-brand-navy-900 via-brand-navy-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 xl:p-12 text-white shadow-crisp-lg relative overflow-hidden">
        {/* Ambient Glow Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Title, Subtitle, Search Form, Popular Chips */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-white/15 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{t('sovereignMotto', 'ಅಧಿಕೃತ ಕಲ್ಯಾಣ ಮಾಹಿತಿ ಪೋರ್ಟಲ್ • GOI & GOK Portal')}</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-tight">
              {t('tagline', 'Government Schemes in Your Language')}
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl">
              {t('onboard2Desc', 'Discover welfare benefits, check preliminary eligibility with plain-language questions, and review official application procedures.')}
            </p>

            {/* Primary High-Visibility Actions: Scheme Discovery & Eligibility Checking */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                to="/eligibility"
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-crisp-md active:scale-95 transition-all min-h-[48px]"
              >
                <span>{t('checkEligibilityBtn', 'Check 2-Minute Eligibility')}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
              <Link
                to="/schemes"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 flex items-center justify-center gap-2 backdrop-blur-sm active:scale-95 transition-all min-h-[48px]"
              >
                <Compass className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{t('viewDetailsBtn', 'Explore All Schemes')}</span>
              </Link>
            </div>

            {/* Voice-First Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center pt-1 sm:pt-2 w-full max-w-2xl lg:max-w-3xl">
              <Search className="absolute left-3.5 sm:left-5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('heroVoiceSearchPrompt', 'Speak or type in your language (e.g. farmer loan, Gruha Lakshmi)...')}
                className="w-full pl-10 sm:pl-14 pr-24 sm:pr-32 py-3 sm:py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-base font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/40 shadow-crisp-md"
              />
              <button
                type="button"
                onClick={() => setAiDrawerOpen(true)}
                className="absolute right-1.5 sm:right-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-sm active:scale-95 transition-all min-h-[44px] min-w-[44px] justify-center"
              >
                <Mic className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('heroVoiceSearchCta', 'Speak')}</span>
              </button>
            </form>

            {/* Quick-Search Category Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-xs text-slate-300">
              <span className="font-semibold text-amber-300 w-full sm:w-auto">ಜನಪ್ರಿಯ (Popular):</span>
              {['PM-KISAN (ಕೃಷಿ)', 'Gruha Lakshmi (ಮಹಿಳೆ)', 'PM Surya Ghar (ಸೌರ)', 'Ayushman Bharat (ಆರೋಗ್ಯ)', 'Mudra Loan (ಉದ್ಯಮ)'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/schemes?q=${encodeURIComponent(tag.split(' ')[0])}`)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors border border-white/10 text-xs font-medium max-w-full truncate min-h-[36px]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Verified Source Standards Panel (Factual & Source-Backed) */}
          <div className="lg:col-span-5 xl:col-span-4 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 xl:p-7 text-white space-y-4 shadow-crisp-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-300">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Statutory Information Guide</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Gazette Verified
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <strong className="text-white block">Official Ministry Sources:</strong>
                    <span className="text-slate-300 text-xs">Criteria and rules verified against central and state departmental gazettes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <strong className="text-white block">Scheme-Specific Fee Schedules:</strong>
                    <span className="text-slate-300 text-xs">Official government fees displayed per scheme; authorized CSC fee capped at ₹30.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <strong className="text-white block">Citizens' Charter SLAs:</strong>
                    <span className="text-slate-300 text-xs">Official processing targets (10–45 days) with Sakala/CPGRAMS grievance avenues.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 mb-3">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Demonstration portal with sample evaluation profiles.</span>
                </div>
                <Link
                  to="/eligibility"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Check 2-Minute Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Trust, Source Transparency & Citizen Charter Standard */}
      <section aria-label="Statutory Trust Standards">
        <TrustAndClarityBanner />
      </section>

      {/* 2. Urgent Seasonal Welfare Alert Banner (Responsive Card) */}
      <section aria-labelledby="seasonal-alert-heading">
        <div className="bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-crisp-sm">
          <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  SEASONAL NOTICE
                </span>
                <h2 id="seasonal-alert-heading" className="text-sm sm:text-base md:text-lg font-bold text-amber-950 dark:text-amber-100">
                  {t('urgentNoticeTitle', 'Seasonal Welfare Alert')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed mt-1 max-w-4xl break-words">
                {t('urgentNoticeDesc', 'Kharif crop relief enrollment window is active. Review guidelines and verify your land records (RTC) on the official state revenue portal before the deadline.')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start pt-2 sm:pt-0 border-t border-amber-200/60 dark:border-amber-900/40 sm:border-0 flex-shrink-0">
            <AudioListenButton textToSpeak={`${t('urgentNoticeTitle')}. ${t('urgentNoticeDesc')}`} size="md" />
            <Link
              to="/schemes/pm-kisan"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm min-h-[48px]"
            >
              <span>View Scheme Details</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Distinct 5-State Eligibility Cockpit Banner (Responsive Grid) */}
      <section aria-labelledby="eligibility-status-banner">
        {assessment.status === 'potentially_eligible' ? (
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-crisp-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 text-emerald-200 border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{t('statusPotentiallyEligible', 'Preliminary Assessment: Potentially Eligible')}</span>
              </div>
              <h2 id="eligibility-status-banner" className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                {t('totalAnnualBenefit')}: ₹{assessment.totalAnnualBenefitValue.toLocaleString('en-IN')} / year
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
                {t('preliminaryGuidanceDisclaimer', 'Preliminary guidance based on self-reported inputs. Official scheme sanction requires statutory verification by the respective government department.')}
              </p>
            </div>
            <Link
              to="/eligibility/results"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-crisp-sm flex-shrink-0 active:scale-95 transition-all min-h-[48px]"
            >
              <span>{t('resultsTitle', 'View Eligibility Breakdown')}</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </Link>
          </div>
        ) : assessment.status === 'in_progress' ? (
          <div className="bg-amber-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-crisp-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 text-amber-200 border border-white/20">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>{t('statusInProgress', 'Assessment In Progress')}</span>
              </div>
              <h2 id="eligibility-status-banner" className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Complete Your Questionnaire
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed max-w-2xl">
                You have unanswered questions. Complete all 4 questions to calculate your complete preliminary welfare entitlement.
              </p>
            </div>
            <Link
              to="/eligibility"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-crisp-sm flex-shrink-0 active:scale-95 transition-all min-h-[48px]"
            >
              <span>{t('navNext', 'Resume Questionnaire')}</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </Link>
          </div>
        ) : assessment.status === 'not_established' ? (
          <div className="bg-slate-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-crisp-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 text-slate-300 border border-white/20">
                <HelpCircle className="w-4 h-4 text-slate-300" />
                <span>{t('statusNotEstablished', 'Eligibility Not Established')}</span>
              </div>
              <h2 id="eligibility-status-banner" className="text-xl sm:text-2xl font-extrabold tracking-tight">
                No Direct Scheme Matches on Current Inputs
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Review your questionnaire inputs or browse the comprehensive public scheme directory.
              </p>
            </div>
            <Link
              to="/eligibility"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-crisp-sm flex-shrink-0 active:scale-95 transition-all min-h-[48px]"
            >
              <span>Review Assessment</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </Link>
          </div>
        ) : (
          /* Default: not_assessed - Deliberate Two-Column Layout */
          <div className="bg-gradient-to-r from-brand-navy-900 to-slate-900 dark:from-slate-900 dark:to-slate-950 text-white border border-brand-navy-800 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-crisp-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{t('statusNotAssessed', 'Eligibility Status: Not Assessed (ಮೌಲ್ಯಮಾಪನ ಮಾಡಿಲ್ಲ)')}</span>
                </div>
                <h2 id="eligibility-status-banner" className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
                  {t('resultsSubtitle', 'Check Your Household\'s Welfare Entitlement')}
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed">
                  Answer 4 plain-language questions. Sahayak provides preliminary guidance on cash transfers, subsidies, and free health covers under verified Union & Karnataka state scheme rules.
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Self-assessment only (No docs required)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Statutory fee schedules</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Assisted CSC slip generation</span>
                  </span>
                </div>
              </div>
              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  to="/eligibility"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-crisp-md active:scale-95 transition-all min-h-[48px]"
                >
                  <span>{t('checkEligibilityBtn', 'Start 2-Min Assessment')}</span>
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Personalized Citizen Dashboard Hub (Recommended, Saved, Recently Viewed, Assessments, Applications) */}
      <PersonalizedDashboard />

      {/* 5. Life-Event Exploration Grid ("Jeevan Ke Padav") */}
      <section aria-labelledby="life-events-heading">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 id="life-events-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {t('lifeEventsTitle', 'Explore by Life Need')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t('lifeEventsSubtitle', 'Select the category that applies to your household')}
            </p>
          </div>
          <Link to="/schemes" className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">
            <span>{t('filterAll', 'All Schemes')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <LifeEventGrid />
      </section>

      {/* 5. High-Impact Featured Government Schemes (Responsive 3-Column Desktop Grid) */}
      <section aria-labelledby="featured-schemes-heading">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 id="featured-schemes-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {t('catalogTitle', 'Government Schemes Directory')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t('statutoryBadge', 'Official Sovereign Welfare Information Guide • Statutory Citizen Portal')}
            </p>
          </div>
          <Link to="/schemes" className="text-xs sm:text-sm font-bold text-brand-navy-900 dark:text-sky-400 hover:underline flex items-center gap-1">
            <span>{t('viewDetailsBtn', 'View All Schemes')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>
    </div>
  );
};