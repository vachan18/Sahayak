import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, AlertCircle, ArrowRight, RotateCcw, Share2, FileCheck } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { assessEligibility } from '../services/eligibilityEngine';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { AudioListenButton } from '../components/feedback/AudioListenButton';

export const EligibilityResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { eligibilityAnswers, resetEligibilityAnswers } = useAppStore();

  const assessment = useMemo(() => {
    return assessEligibility(eligibilityAnswers);
  }, [eligibilityAnswers]);

  const celebrationVoiceText = language === 'kn'
    ? `ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ಸುಮಾರು ₹${assessment.totalAnnualBenefitValue.toLocaleString('en-IN')} ವರೆಗೆ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು ದೊರೆಯಬಹುದು.`
    : language === 'hi'
    ? `बधाई हो! आपके परिवार को प्रति वर्ष लगभग ₹${assessment.totalAnnualBenefitValue.toLocaleString('en-IN')} तक के सरकारी लाभ मिल सकते हैं.`
    : `Congratulations! Your household qualifies for approximately ₹${assessment.totalAnnualBenefitValue.toLocaleString('en-IN')} in annual welfare benefits.`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Celebration Header Card */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-crisp-md relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-emerald-200 border border-white/20 mb-3">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ಅಭಿನಂದನೆಗಳು / Congratulations!</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('resultsTitle', 'Your Entitlement Results')}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed mt-1">
            {t('resultsSubtitle', 'Based on your verified criteria, your household qualifies for the following benefits:')}
          </p>

          <div className="mt-4 inline-flex items-baseline gap-2 bg-emerald-950/60 px-4 py-2 rounded-2xl border border-emerald-700/50">
            <span className="text-xs text-emerald-200 font-semibold">{t('totalAnnualBenefit')}:</span>
            <span className="text-2xl font-extrabold text-amber-300 tabular-nums">
              ₹{assessment.totalAnnualBenefitValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <AudioListenButton textToSpeak={celebrationVoiceText} label="Listen (ಕೇಳಿ)" size="lg" />
        </div>
      </section>

      {/* Tabs / Section Indicator */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('qualifiedSchemesTab', 'Fully Eligible')} ({assessment.eligibleSchemes.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            resetEligibilityAnswers();
            navigate('/eligibility');
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ (Retake Quiz)</span>
        </button>
      </div>

      {/* Qualified Schemes Deck */}
      {assessment.eligibleSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessment.eligibleSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No exact matches found for this specific questionnaire. Explore our complete directory.
          </p>
        </div>
      )}

      {/* Partial Matches / Action Needed Section */}
      {assessment.partialMatchSchemes.length > 0 && (
        <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('partialSchemesTab', 'Action Needed / Additional Schemes')} ({assessment.partialMatchSchemes.length})
            </h2>
          </div>

          <div className="space-y-3">
            {assessment.partialMatchSchemes.map(({ scheme, missingRequirementKey }) => (
              <div
                key={scheme.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 shadow-crisp-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {scheme.titleKey}
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-400 mt-0.5">
                    Requirement: {missingRequirementKey}
                  </p>
                </div>
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap self-start sm:self-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prepare Documents Master CTA Banner */}
      <div className="p-6 rounded-3xl bg-brand-navy-900 text-white shadow-crisp-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">
            {t('prepareDocumentsBtn', 'Prepare Documents & Apply')}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            Inspect correct document samples, verify via DigiLocker, or generate your official CSC Seva Kendra QR slip.
          </p>
        </div>
        <Link
          to="/documents"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm flex-shrink-0 active:scale-95 transition-all"
        >
          <span>{t('prepareDocumentsBtn', 'Go to Document Locker')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
