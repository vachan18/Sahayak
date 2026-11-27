import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, 
  HelpCircle, ShieldAlert, ShieldCheck, XCircle, Info, FileText, 
  Calendar, CreditCard, HeartPulse, Landmark, 
  Check, ChevronRight
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { assessEligibility, AssessmentAnswers } from '../services/eligibilityEngine';
import { saveAssessmentToDb } from '../services/assessmentDbService';
import { AudioListenButton } from '../components/feedback/AudioListenButton';
import { Scheme } from '../types';
import { formatSchemeBenefit } from '../utils/formatBenefit';

export const EligibilityResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { 
    eligibilityAnswers, 
    resetEligibilityAnswers, 
    authUser, 
    recordAssessment,
    activeProfileId,
    profiles 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'eligible' | 'additional' | 'ineligible'>('eligible');

  const assessment = useMemo(() => {
    return assessEligibility(eligibilityAnswers);
  }, [eligibilityAnswers]);

  const savedFingerprintRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (assessment.status !== 'not_assessed' && assessment.status !== 'in_progress') {
      const activeProf = profiles.find(p => p.id === activeProfileId);
      const fingerprint = `${JSON.stringify(eligibilityAnswers)}-${assessment.status}`;
      if (savedFingerprintRef.current === fingerprint) return;
      savedFingerprintRef.current = fingerprint;

      recordAssessment({
        id: `assess-${Date.now()}`,
        completedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        profileId: activeProfileId,
        profileName: activeProf?.name || 'Self',
        status: assessment.status,
        eligibleCount: assessment.eligibleSchemes.length,
        totalAnnualBenefitValue: assessment.totalAnnualBenefitValue,
        answers: eligibilityAnswers
      });

      if (authUser?.id) {
        saveAssessmentToDb(authUser.id, eligibilityAnswers, assessment).catch(console.warn);
      }
    }
  }, [authUser?.id, assessment.status, eligibilityAnswers, assessment, recordAssessment, activeProfileId, profiles]);

  // If eligible list is empty but additional verification exists, default to additional tab
  useEffect(() => {
    if (assessment.eligibleSchemes.length === 0 && assessment.additionalVerificationSchemes.length > 0) {
      setActiveTab('additional');
    }
  }, [assessment.eligibleSchemes.length, assessment.additionalVerificationSchemes.length]);

  // Voice narration text based on assessment result
  const celebrationVoiceText = assessment.status === 'potentially_eligible'
    ? (language === 'kn'
        ? `ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣಗೊಂಡಿದೆ. ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ಸುಮಾರು ₹${assessment.totalAnnualCashBenefit.toLocaleString('en-IN')} ನಗದು ವರ್ಗಾವಣೆ ದೊರೆಯಬಹುದು.`
        : language === 'hi'
        ? `प्रारंभिक मूल्यांकन पूरा हुआ. आपके परिवार को प्रति वर्ष लगभग ₹${assessment.totalAnnualCashBenefit.toLocaleString('en-IN')} प्रत्यक्ष नकद हस्तांतरण मिल सकता है.`
        : language === 'bn'
        ? `প্রাথমিক মূল্যায়ন সম্পন্ন হয়েছে। আপনার পরিবার প্রতি বছর প্রায় ₹${assessment.totalAnnualCashBenefit.toLocaleString('en-IN')} সরাসরি নগদ সহায়তা পেতে পারে।`
        : `Preliminary assessment complete. Your household potentially qualifies for ₹${assessment.totalAnnualCashBenefit.toLocaleString('en-IN')} in direct annual cash transfers.`)
    : t('statusNotAssessed', 'Eligibility Status: Assessment Required');

  // Helper for installment explanation
  const getInstallmentExplanation = (schemeId: string) => {
    switch (schemeId) {
      case 'pm-kisan':
        return t('installment_pm_kisan');
      case 'pm-jay':
        return t('installment_pm_jay');
      case 'pmmvy':
        return t('installment_pmmvy');
      case 'pm-svanidhi':
        return t('installment_pm_svanidhi');
      case 'post-matric-scholarship':
      case 'post-matric-scholarship-minority':
        return t('installment_scholarship');
      case 'pm-kcc':
        return t('installment_pm_kcc');
      default:
        return t('installment_default');
    }
  };

  // Helper for next step recommendation
  const getNextActionRecommendation = (_schemeId: string, status: string) => {
    if (status === 'potentially_eligible') {
      return t('nextStepEligible');
    }
    if (status === 'additional_verification_required') {
      return t('nextStepAdditional');
    }
    return t('nextStepIneligible');
  };

  // Helper to extract evaluated conditions summary from citizen's answers
  const getEvaluatedConditionsSummary = (answers: AssessmentAnswers, scheme: Scheme) => {
    const list: string[] = [];
    if (answers.occupation) {
      const occMap: Record<string, string> = {
        farmer: t('opt_farmer_label'),
        street_vendor: t('opt_vendor_label'),
        student: t('opt_student_label'),
        daily_wage: t('opt_daily_wage_label'),
        homemaker: t('opt_homemaker_label'),
        artisan: t('opt_artisan_label'),
      };
      list.push(`${t('condOccupation')}: ${occMap[answers.occupation] || answers.occupation.replace('_', ' ')}`);
    }
    if (answers.landholdingAcres !== undefined) {
      list.push(`${t('condLand')}: ${answers.landholdingAcres} ${t('condAcres')}`);
    }
    if (answers.gender) {
      const genderMap: Record<string, string> = {
        female: t('opt_female_label'),
        male: t('opt_male_label'),
        other: t('opt_other_label'),
      };
      list.push(`${t('condGender')}: ${genderMap[answers.gender] || answers.gender}`);
    }
    if (answers.annualIncome !== undefined) {
      list.push(`${t('condIncome')}: ₹${answers.annualIncome.toLocaleString('en-IN')}`);
    }
    if (answers.isGovtEmployee !== undefined) {
      list.push(`${t('condGovtEmp')}: ${answers.isGovtEmployee ? t('condYes') : t('condNo')}`);
    }
    if (answers.isPregnantOrLactating !== undefined && scheme.id === 'pmmvy') {
      list.push(`${t('condMaternity')}: ${answers.isPregnantOrLactating ? t('condYes') : t('condNo')}`);
    }
    if (answers.isUrbanStreetVendor !== undefined && scheme.id === 'pm-svanidhi') {
      list.push(`${t('condUrbanVending')}: ${answers.isUrbanStreetVendor ? t('condYes') : t('condNo')}`);
    }
    if (answers.isEnrolledStudent !== undefined && scheme.lifeEventId === 'education_youth') {
      list.push(`${t('condHigherEd')}: ${answers.isEnrolledStudent ? t('condYes') : t('condNo')}`);
    }
    return list;
  };

  // Case 1: User has not taken the assessment
  if (assessment.status === 'not_assessed') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-fadeIn pb-24">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-500">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
            <span>{t('statusNotAssessed', 'Eligibility Status: Not Assessed')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('resultsTitle', 'No Assessment Completed Yet')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            Please answer the straightforward conversational questionnaire to discover which government schemes your family potentially qualifies for.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/eligibility"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-crisp-sm transition-all min-h-[48px]"
          >
            <span>{t('checkEligibilityBtn', 'Start 2-Minute Assessment')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/schemes"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-[48px]"
          >
            <span>{t('filterAll', 'Browse Schemes Directory')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Assessment In Progress
  if (assessment.status === 'in_progress') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-fadeIn pb-24">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-700">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2">
            <span>{t('statusInProgress', 'Assessment In Progress')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Questionnaire Partially Completed
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            You have answered some questions, but haven't finished the questionnaire. Complete all core questions to generate an accurate statutory eligibility report.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/eligibility"
            className="px-6 py-4 rounded-2xl bg-brand-navy-900 dark:bg-sky-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-crisp-sm transition-all min-h-[48px]"
          >
            <span>{t('navNext', 'Resume Questionnaire')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Case 3: Assessment Completed - Results View
  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl w-full mx-auto py-4 sm:py-6 animate-fadeIn pb-24">
      {/* Statutory Preliminary Guidance Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex items-start gap-3.5">
        <ShieldAlert className="w-6 h-6 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-black uppercase tracking-wide mr-1.5">Statutory Notice:</span>
          {t('preliminaryGuidanceDisclaimer', 'This assessment provides preliminary guidance based on self-reported inputs. Official scheme eligibility and benefit disbursement are determined exclusively by the designated government department upon physical or biometric document verification.')}
        </div>
      </div>

      {/* Hero Header Card with Segregated Transparent Benefit Cockpit */}
      <section className="bg-slate-900 bg-gradient-to-r from-slate-900 via-brand-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-crisp-lg relative overflow-hidden flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-white/10 text-sky-200 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('resultsCockpitTitle')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {t('resultsTitle', 'Your Preliminary Entitlement Results')}
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed">
              {t('resultsHeroDesc')}
            </p>
          </div>

          <div className="flex-shrink-0">
            <AudioListenButton textToSpeak={celebrationVoiceText} label={t('listenInLanguage', 'Listen')} size="lg" />
          </div>
        </div>

        {/* Categorized Transparent Benefit Cockpit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* 1. Direct Annual Cash Transfer */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              <span>{t('annualCashDbt')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              ₹{assessment.categorizedBenefits.annualCashTransferTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              {t('annualCashDbtDesc')}
            </div>
          </div>

          {/* 2. Health Insurance Hospital Coverage */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-black text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{t('hospitalHealthCover')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              {assessment.categorizedBenefits.healthInsuranceCoverTotal > 0
                ? `₹${(assessment.categorizedBenefits.healthInsuranceCoverTotal / 100000).toFixed(0)} Lakh`
                : '₹0'}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              {t('hospitalHealthCoverDesc')}
            </div>
          </div>

          {/* 3. Subsidized Credit & Loans */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t('subsidizedLoanLimit')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              {assessment.categorizedBenefits.loanCreditFacilityTotal > 0
                ? `₹${assessment.categorizedBenefits.loanCreditFacilityTotal.toLocaleString('en-IN')}`
                : '₹0'}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              {t('subsidizedLoanLimitDesc')}
            </div>
          </div>

          {/* 4. One-Time Grants / Scholarships */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('grantScholarship')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              ₹{(assessment.categorizedBenefits.oneTimeCashTotal + assessment.categorizedBenefits.subsidyTotal + (assessment.categorizedBenefits.scholarshipTotal || 0)).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              {t('grantScholarshipDesc')}
            </div>
          </div>
        </div>

        {/* Benefit Segregation Notice (Preventing Misleading Totals) */}
        <div className="text-xs text-slate-300 border-t border-white/10 pt-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            {t('noMisleadingTotals', 'Note: Loans and health covers are never counted as cash income. Only verified Direct Benefit Transfers (DBT) are paid directly into your bank account.')}
          </span>
        </div>
      </section>

      {/* Retake Assessment Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('detailedEvaluationTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('detailedEvaluationDesc')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetEligibilityAnswers();
            navigate('/eligibility');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <span>{t('editAnswer', 'Retake / Edit Assessment')}</span>
        </button>
      </div>

      {/* 3 Clear Category Selection Tabs (Accessible & High-Contrast) */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-3" 
        role="tablist" 
        aria-label="Eligibility Categories"
      >
        {/* Tab 1: Likely Eligible */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'eligible'}
          onClick={() => setActiveTab('eligible')}
          className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[64px] flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 ${
            activeTab === 'eligible'
              ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-sm ring-1 ring-emerald-600/30'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              activeTab === 'eligible' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-slate-900 dark:text-white">
                {t('likelyEligible', 'Likely Eligible')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('tabMeetsCriteria')}
              </div>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
            {assessment.eligibleSchemes.length}
          </span>
        </button>

        {/* Tab 2: Needs More Information */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'additional'}
          onClick={() => setActiveTab('additional')}
          className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[64px] flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 ${
            activeTab === 'additional'
              ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/60 shadow-sm ring-1 ring-amber-600/30'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              activeTab === 'additional' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
            }`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-slate-900 dark:text-white">
                {t('needsMoreInfo', 'Needs More Information')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('tabRequiresDocCheck')}
              </div>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-200/70 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
            {assessment.additionalVerificationSchemes.length}
          </span>
        </button>

        {/* Tab 3: Likely Not Eligible */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'ineligible'}
          onClick={() => setActiveTab('ineligible')}
          className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[64px] flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 ${
            activeTab === 'ineligible'
              ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 shadow-sm ring-1 ring-slate-500/30'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              activeTab === 'ineligible' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}>
              <XCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-slate-900 dark:text-white">
                {t('likelyNotEligible', 'Likely Not Eligible')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('tabCriteriaNotSatisfied')}
              </div>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
            {assessment.notEstablishedSchemes.length}
          </span>
        </button>
      </div>

      {/* Tab Panels Content */}

      {/* PANEL 1: LIKELY ELIGIBLE SCHEMES */}
      {activeTab === 'eligible' && (
        <div className="space-y-6">
          {assessment.eligibleSchemes.length > 0 ? (
            assessment.eligibleSchemes.map((scheme) => {
              const outcome = assessment.evaluations[scheme.id];
              const evaluatedConditions = getEvaluatedConditionsSummary(eligibilityAnswers, scheme);

              return (
                <div 
                  key={scheme.id}
                  className="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-7 shadow-crisp-sm space-y-5"
                >
                  {/* Scheme Header Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t('likelyEligible', 'Likely Eligible')}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {scheme.ministryKey}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {scheme.titleKey}
                      </h3>
                    </div>

                    {/* Benefit Figure */}
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-right sm:text-right flex-shrink-0">
                      <div className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-400 uppercase">
                        {t('benefitEntitlementLabel')}
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-200 tabular-nums">
                        {formatSchemeBenefit(scheme, language, t)}
                      </div>
                    </div>
                  </div>

                  {/* 1. Why it Matches */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 space-y-1">
                    <div className="font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('whyMatches', 'Why You Qualify')}:</span>
                    </div>
                    <p className="leading-relaxed font-medium">
                      {outcome?.satisfiedCriteria.join(' ') || t('allConditionsMetFallback')}
                    </p>
                  </div>

                  {/* 2. Conditions Evaluated Grid */}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('evaluatedConditions', 'Conditions Evaluated')}:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {evaluatedConditions.map((cond, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-slate-700/80"
                        >
                          ✓ {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. Installment Structure & Payment Clarity */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('installmentNotice', 'Installment & Payment Schedule')}:</span>
                    </div>
                    <p className="leading-relaxed">
                      {getInstallmentExplanation(scheme.id)}
                    </p>
                  </div>

                  {/* 4. What User Should Do Next & Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md">
                      <strong>{t('nextAction', 'Recommended Next Step')}:</strong> {getNextActionRecommendation(scheme.id, 'potentially_eligible')}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/guidance/${scheme.id}`}
                        className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <span>Apply / CSC Slip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/schemes/${scheme.id}`}
                        className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs min-h-[44px] flex items-center justify-center"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                No Fully Confirmed Matching Schemes Yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Based on self-reported inputs alone, schemes require additional document verification. Check the "Needs More Information" tab above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PANEL 2: NEEDS MORE INFORMATION SCHEMES */}
      {activeTab === 'additional' && (
        <div className="space-y-6">
          {assessment.additionalVerificationSchemes.length > 0 ? (
            assessment.additionalVerificationSchemes.map(({ scheme, explanation, missingCriteria }) => {
              const evaluatedConditions = getEvaluatedConditionsSummary(eligibilityAnswers, scheme);

              return (
                <div 
                  key={scheme.id}
                  className="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-6 sm:p-7 shadow-crisp-sm space-y-5"
                >
                  {/* Scheme Header Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{t('needsMoreInfo', 'Needs More Information')}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {scheme.ministryKey}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {scheme.titleKey}
                      </h3>
                    </div>

                    {/* Benefit Figure */}
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-right sm:text-right flex-shrink-0">
                      <div className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 uppercase">
                        Potential Entitlement
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-200 tabular-nums">
                        {formatSchemeBenefit(scheme, language, t)}
                      </div>
                    </div>
                  </div>

                  {/* 1. Why it Matches / Explanation */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1">
                    <div className="font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Verification Status & Potential Eligibility:</span>
                    </div>
                    <p className="leading-relaxed font-medium">
                      {explanation}
                    </p>
                  </div>

                  {/* 2. Conditions Evaluated */}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('evaluatedConditions', 'Conditions Evaluated')}:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {evaluatedConditions.map((cond, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-slate-700/80"
                        >
                          ✓ {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. Missing Information & Documents Required */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>{t('missingRequirements', 'Missing Documents or Verification Required')}:</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                      {missingCriteria.map((crit, i) => (
                        <li key={i}>{crit}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 4. What User Should Do Next & Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md">
                      <strong>{t('nextAction', 'Recommended Next Step')}:</strong> {getNextActionRecommendation(scheme.id, 'additional_verification_required')}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/documents?scheme=${scheme.id}`}
                        className="py-3 px-4 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect Required Docs</span>
                      </Link>
                      <Link
                        to={`/schemes/${scheme.id}`}
                        className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs min-h-[44px] flex items-center justify-center"
                      >
                        View Rules
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                No Schemes Pending Verification
              </h3>
              <p className="text-xs text-slate-500">
                All relevant programs are resolved as either eligible or excluded.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PANEL 3: LIKELY NOT ELIGIBLE SCHEMES */}
      {activeTab === 'ineligible' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            These welfare schemes did not match your self-reported profile, or statutory government exclusions apply (e.g. non-agricultural occupation, income taxpayer status, or permanent government employment).
          </div>

          {assessment.notEstablishedSchemes.map(({ scheme, explanation, disqualifyingExclusions }) => (
            <div 
              key={scheme.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>{t('likelyNotEligible', 'Likely Not Eligible')}</span>
                    </span>
                    <span className="text-xs text-slate-400">{scheme.ministryKey}</span>
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    {scheme.titleKey}
                  </h4>
                </div>

                <Link
                  to={`/schemes/${scheme.id}`}
                  className="text-xs font-bold text-brand-navy-900 dark:text-sky-400 hover:underline flex items-center gap-1 self-start sm:self-center"
                >
                  <span>Review Rules</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Rationale for non-match */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {t('whyDoesNotMatch', 'Reason for Non-Establishment')}:
                </div>
                <p className="leading-relaxed">
                  {disqualifyingExclusions.length > 0 ? disqualifyingExclusions[0] : explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prepare Documents Master CTA Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-navy-900 text-white shadow-crisp-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Assisted Guidance Slip</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">
            {t('prepareDocumentsBtn', 'Prepare Documents & Generate CSC Slip')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Inspect sample document guides, connect DigiLocker, or download an official statutory slip for your Grama One / Seva Sindhu VLE kiosk.
          </p>
        </div>

        <Link
          to="/documents"
          className="w-full md:w-auto px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-crisp-sm flex-shrink-0 active:scale-98 transition-all min-h-[48px]"
        >
          <span>{t('prepareDocumentsBtn', 'Go to Document Locker')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
