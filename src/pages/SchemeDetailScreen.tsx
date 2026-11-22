import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, CheckCircle2, FileText, 
  ArrowRight, Phone, ExternalLink, Share2 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';
import { StatutoryFeeBadge } from '../components/feedback/StatutoryFeeBadge';

export const SchemeDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { schemes } = useAppStore();

  const scheme = schemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scheme Not Found</h2>
        <Link to="/schemes" className="text-amber-600 hover:underline text-sm font-semibold inline-flex items-center gap-1">
          <span>Return to Schemes Directory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const audioFullSummary = `${scheme.titleKey}. ${scheme.shortDescKey}. Benefit: ${scheme.financialBenefit.formattedDisplay}. Expected approval in ${scheme.processingSlaDays} days. Official government fee is zero rupees.`;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Link to="/schemes" className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white">
            Schemes
          </Link>
          <span className="text-slate-400">/</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {scheme.ministryKey}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AudioListenButton textToSpeak={audioFullSummary} label="Listen to Details (ಕೇಳಿ)" size="md" />
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: scheme.titleKey,
                  text: scheme.shortDescKey,
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Share with family"
            aria-label="Share scheme"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Main Scheme Dossier */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {scheme.titleKey}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {scheme.shortDescKey}
            </p>
          </div>

          {/* Plain Language Detailed Narrative */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              About the Scheme (ಯೋಜನೆಯ ವಿವರಣೆ)
            </h2>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>{scheme.fullDescKey}</p>
            </div>
          </section>

          {/* Key Benefits (What You Receive) */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>What Will You Receive? (ನಿಮಗೆ ಏನು ಸಿಗುತ್ತದೆ?)</span>
            </h2>
            <ul className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
              {scheme.keyBenefitsListKeys.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Who is Eligible & Exclusions (2-Column Subgrid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Eligible */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-crisp-sm">
              <h2 className="text-base font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <span>✓ Who Can Apply (ಯಾರು ಅರ್ಹರು?)</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {scheme.whoIsEligibleListKeys.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Not Eligible */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-crisp-sm">
              <h2 className="text-base font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                <span>✕ Who is Not Covered (ಯಾರಿಗೆ ಸಿಗುವುದಿಲ್ಲ?)</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {scheme.whoIsNotEligibleListKeys.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Required Documents Section */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-600" />
                <span>{t('docChecklistTitle', 'Required Documents')}</span>
              </h2>
              <Link
                to={`/documents?scheme=${scheme.id}`}
                className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                {t('seeCorrectSample', 'Inspect Correct Samples →')}
              </Link>
            </div>

            <div className="space-y-3">
              {scheme.documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {doc.nameKey}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doc.descriptionKey}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-bold flex-shrink-0">
                    {doc.isMandatory ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Citizens' Charter & Statutory SLA Notice */}
          <section className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Citizens' Charter & Statutory SLA Guarantee</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              By government mandate, your application must be processed within <strong>{scheme.processingSlaDays} working days</strong> by the {scheme.handlingAuthorityKey}. If delayed beyond this period, you are entitled to file a direct CPGRAMS / Sakala grievance.
            </p>
          </section>
        </div>

        {/* Right Column (4 cols): Sticky Action Cockpit on Desktop */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          {/* Benefit Box */}
          <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 shadow-crisp-md space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                {t('directDbtBank', 'Direct Bank Transfer / Benefit')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-950 dark:text-emerald-200 tabular-nums mt-1">
                {scheme.financialBenefit.formattedDisplay}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                Direct to NPCI Aadhaar-seeded bank account
              </div>
            </div>

            <StatutoryFeeBadge />

            {/* Source & Verified Notice */}
            <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div>
                <span className="font-semibold text-slate-500 dark:text-slate-400">Official Source: </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{scheme.sourceAttribution}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 dark:text-slate-400">Last Verified: </span>
                <span>{scheme.lastVerifiedDate}</span>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <Link
                to={`/eligibility?scheme=${scheme.id}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-extrabold text-sm text-center shadow-crisp-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>{t('checkEligibilityBtn', 'Check My Eligibility')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={`/guidance/${scheme.id}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm text-center shadow-crisp-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>{t('prepareDocumentsBtn', 'Apply Now / CSC Slip')}</span>
              </Link>
            </div>
          </div>

          {/* Helpline & Official Portal Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-crisp-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Official Assistance</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Helpline: {scheme.helplinePhone}</span>
            </div>
            <div>
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-brand-navy-900 dark:text-sky-400 hover:underline inline-flex items-center gap-1.5"
              >
                <span>Visit Official Ministry Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Mobile Bottom Bar (Hidden on Desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-crisp-xl">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link
            to={`/eligibility?scheme=${scheme.id}`}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-navy-900 dark:bg-sky-600 text-white font-bold text-xs sm:text-sm text-center shadow-sm flex items-center justify-center gap-2"
          >
            <span>{t('checkEligibilityBtn', 'Check Eligibility')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/guidance/${scheme.id}`}
            className="py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm text-center shadow-sm whitespace-nowrap"
          >
            {t('prepareDocumentsBtn', 'Apply Now')}
          </Link>
        </div>
      </div>
    </div>
  );
};