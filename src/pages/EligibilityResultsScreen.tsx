import React, { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle, AlertCircle, ArrowRight, RotateCcw, 
  HelpCircle, ShieldAlert, ShieldCheck, CheckCircle2, XCircle, Info 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { assessEligibility } from '../services/eligibilityEngine';
import { saveAssessmentToDb } from '../services/assessmentDbService';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { AudioListenButton } from '../components/feedback/AudioListenButton';

export const EligibilityResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { eligibilityAnswers, resetEligibilityAnswers, authUser } = useAppStore();

  const assessment = useMemo(() => {
    return assessEligibility(eligibilityAnswers);
  }, [eligibilityAnswers]);

  const savedFingerprintRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (authUser?.id && assessment.status !== 'not_assessed' && assessment.status !== 'in_progress') {
      const fingerprint = `${authUser.id}-${JSON.stringify(eligibilityAnswers)}-${assessment.status}`;
      if (savedFingerprintRef.current === fingerprint) return;
      savedFingerprintRef.current = fingerprint;
      saveAssessmentToDb(authUser.id, eligibilityAnswers, assessment).catch(console.warn);
    }
  }, [authUser?.id, assessment.status, eligibilityAnswers, assessment]);

  // Voice narration text based on assessment result
  const celebrationVoiceText = assessment.status === 'potentially_eligible'
    ? (language === 'kn'
        ? `ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣಗೊಂಡಿದೆ. ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ಸುಮಾರು ₹${assessment.totalAnnualCashBenefit.toLocaleString('en-IN')} ನಗದು ವರ್ಗಾವಣೆ ದೊರೆಯಬಹುದು.`
        : language === 'hi'
        ? `प्रारंभिक मूल्यांकन पूरा हुआ. आपके परिवार को प्रति वर्ष लगभग ₹${assessment.totalAnnualCashBenefit.toLocaleString('en-IN')} प्रत्यक्ष नकद हस्तांतरण मिल सकता है.`
        : `Preliminary assessment complete. Your household potentially qualifies for ₹${assessment.totalAnnualCashBenefit.toLocaleString('en-IN')} in direct annual cash transfers.`)
    : t('statusNotAssessed', 'Eligibility Status: Assessment Required');

  // Case 1: User has not taken the assessment
  if (assessment.status === 'not_assessed') {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-500">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
            <span>{t('statusNotAssessed', 'Eligibility Status: Not Assessed')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('resultsTitle', 'No Assessment Completed Yet')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            Please complete the 5-question self-assessment to discover which government schemes and benefits your family may potentially qualify for.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/eligibility"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{t('checkEligibilityBtn', 'Start 2-Minute Assessment')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/schemes"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>{t('filterAll', 'Browse All Schemes')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Assessment In Progress
  if (assessment.status === 'in_progress') {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-700">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2">
            <span>{t('statusInProgress', 'Assessment In Progress')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Questionnaire Partially Completed
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            You have answered some questions, but haven't completed the questionnaire. Finish all 5 core questions to establish an accurate eligibility profile.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/eligibility"
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
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
    <div className="space-y-8 max-w-6xl w-full mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Statutory Preliminary Guidance Disclaimer Banner */}
      <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-extrabold uppercase tracking-wide mr-1.5">Statutory Notice:</span>
          {t('preliminaryGuidanceDisclaimer', 'This assessment provides preliminary guidance based on self-reported inputs. Official scheme eligibility and benefit disbursement are determined exclusively by the designated government department upon physical or biometric document verification.')}
        </div>
      </div>

      {/* Hero Header Card with Categorized Benefit Cockpit */}
      <section className="bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-crisp-lg relative overflow-hidden flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 text-sky-200 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {assessment.status === 'potentially_eligible' 
                  ? t('statusPotentiallyEligible', 'Preliminary Assessment: Potentially Eligible')
                  : 'Assessment Completed: Additional Verification Required'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {t('resultsTitle', 'Your Preliminary Entitlement Results')}
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed">
              {t('resultsSubtitle', 'Benefits are segregated by category to distinguish direct cash from healthcare coverage and credit facilities:')}
            </p>
          </div>

          <div className="flex-shrink-0">
            <AudioListenButton textToSpeak={celebrationVoiceText} label="Listen (ಕೇಳಿ)" size="lg" />
          </div>
        </div>

        {/* Categorized Benefit Cockpit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* 1. Direct Annual Cash Transfer */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Annual Cash Transfer (DBT)
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              ₹{assessment.categorizedBenefits.annualCashTransferTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Credited directly to bank account via PFMS
            </div>
          </div>

          {/* 2. Health Insurance Hospital Coverage */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
              Hospitalization Health Cover
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              {assessment.categorizedBenefits.healthInsuranceCoverTotal > 0
                ? `₹${(assessment.categorizedBenefits.healthInsuranceCoverTotal / 100000).toFixed(0)} Lakh`
                : '₹0'}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Cashless hospital treatment per family/year
            </div>
          </div>

          {/* 3. Subsidized Credit & Loans */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Subsidized Credit / Loan Limit
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              {assessment.categorizedBenefits.loanCreditFacilityTotal > 0
                ? `₹${assessment.categorizedBenefits.loanCreditFacilityTotal.toLocaleString('en-IN')}`
                : '₹0'}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Collateral-free working capital loan limit
            </div>
          </div>

          {/* 4. One-Time Grants / Scholarships */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
              One-Time Grant / Scholarship
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1">
              ₹{(assessment.categorizedBenefits.oneTimeCashTotal + assessment.categorizedBenefits.subsidyTotal + (assessment.categorizedBenefits.scholarshipTotal || 0)).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Maternity / student assistance upon event
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Potentially Eligible Schemes Deck */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {t('qualifiedSchemesTab', 'Potentially Eligible Schemes')} ({assessment.eligibleSchemes.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              resetEligibilityAnswers();
              navigate('/eligibility');
            }}
            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ (Retake Assessment)</span>
          </button>
        </div>

        {assessment.eligibleSchemes.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {assessment.eligibleSchemes.map((scheme) => (
                <div key={scheme.id} className="flex flex-col">
                  <SchemeCard scheme={scheme} />
                  {/* Evaluation explanation card */}
                  <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Why You Qualify (Preliminary):</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {assessment.evaluations[scheme.id]?.satisfiedCriteria.slice(0, 2).map((crit, idx) => (
                        <li key={idx} className="truncate">{crit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              No schemes currently meet all required criteria based on self-reported inputs alone. Inspect schemes requiring additional verification below.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Additional Verification Required (Missing Info / Document Verification) */}
      {assessment.additionalVerificationSchemes.length > 0 && (
        <section className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Additional Verification Required ({assessment.additionalVerificationSchemes.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            These schemes may potentially apply, but require document verification or official database cross-checks before eligibility can be established:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.additionalVerificationSchemes.map(({ scheme, explanation, missingCriteria }) => (
              <div
                key={scheme.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 shadow-crisp-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {scheme.ministryKey}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      <Info className="w-3 h-3" />
                      <span>Verification Needed</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {scheme.titleKey}
                  </h3>

                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs">
                    <div className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                      Required for Confirmation:
                    </div>
                    <div className="text-amber-800 dark:text-amber-300 leading-relaxed">
                      {explanation}
                    </div>
                    {missingCriteria.length > 1 && (
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                        Also requires: {missingCriteria.slice(1).join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 font-medium">
                    Benefit: {scheme.financialBenefit.formattedDisplay}
                  </span>
                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Not Established / Ineligible Schemes */}
      {assessment.notEstablishedSchemes.length > 0 && (
        <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">
              Not Established for Current Profile ({assessment.notEstablishedSchemes.length})
            </h2>
          </div>

          <div className="space-y-2.5">
            {assessment.notEstablishedSchemes.map(({ scheme, explanation }) => (
              <div
                key={scheme.id}
                className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {scheme.titleKey}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">
                    — {explanation}
                  </span>
                </div>
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="text-xs text-brand-navy-900 dark:text-sky-400 font-bold hover:underline flex-shrink-0"
                >
                  Rules
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prepare Documents Master CTA Banner */}
      <div className="p-6 rounded-3xl bg-brand-navy-900 text-white shadow-crisp-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>{t('prepareDocumentsBtn', 'Prepare Documents & Apply')}</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            Inspect correct document samples, verify via DigiLocker, or generate your official CSC Seva Kendra assisted registration slip.
          </p>
        </div>
        <Link
          to="/documents"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm flex-shrink-0 active:scale-98 transition-all"
        >
          <span>{t('prepareDocumentsBtn', 'Go to Document Locker')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
