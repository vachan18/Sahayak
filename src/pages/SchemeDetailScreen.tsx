import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Clock, CheckCircle2, AlertTriangle, FileText, 
  ArrowRight, Phone, ExternalLink, HelpCircle, Share2 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';
import { StatutoryFeeBadge } from '../components/feedback/StatutoryFeeBadge';

export const SchemeDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { schemes } = useAppStore();

  const scheme = schemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scheme Not Found</h2>
        <Link to="/schemes" className="text-amber-600 hover:underline text-sm font-semibold">
          Return to Schemes Directory
        </Link>
      </div>
    );
  }

  const audioFullSummary = `${scheme.titleKey}. ${scheme.shortDescKey}. Benefit: ${scheme.financialBenefit.formattedDisplay}. Expected approval in ${scheme.processingSlaDays} days. Official government fee is zero rupees.`;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn pb-12">
      {/* Ministry Tag & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {scheme.ministryKey}
        </span>
        <div className="flex items-center gap-2">
          <AudioListenButton textToSpeak={audioFullSummary} label="Listen to Details (ಕೇಳಿ)" />
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
            className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Share with family"
            aria-label="Share scheme"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scheme Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
        {scheme.titleKey}
      </h1>

      {/* Financial Value Hero Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            {t('directDbtBank', 'Direct Bank Transfer / Government Benefit')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 tabular-nums mt-1">
            {scheme.financialBenefit.formattedDisplay}
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            Direct to NPCI Aadhaar-seeded bank account via DBT
          </div>
        </div>

        <StatutoryFeeBadge className="self-start sm:self-center" />
      </div>

      {/* Official Government Source Attribution & Last Verified Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div>
          <span className="font-semibold text-slate-500 dark:text-slate-400">Official Source: </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{scheme.sourceAttribution || 'Government of India Gazette & Ministry Portal'}</span>
        </div>
        <div className="text-slate-500 dark:text-slate-400">
          <span>Verified: </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{scheme.lastVerifiedDate || 'November 2026'}</span>
        </div>
      </div>

      {/* Plain Language Description */}
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <p>{scheme.fullDescKey}</p>
      </div>

      {/* Key Benefits (What you get) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-crisp-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>What Will You Receive? (ನಿಮಗೆ ಏನು ಸಿಗುತ್ತದೆ?)</span>
        </h2>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {scheme.keyBenefitsListKeys.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Who is Eligible & Exclusions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Eligible */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-crisp-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 text-emerald-800 dark:text-emerald-400">
            ✓ Who Can Apply (ಯಾರು ಅರ್ಹರು?)
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {scheme.whoIsEligibleListKeys.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Not Eligible */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-crisp-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 text-amber-800 dark:text-amber-400">
            ✕ Who is Not Covered (ಯಾರಿಗೆ ಸಿಗುವುದಿಲ್ಲ?)
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {scheme.whoIsNotEligibleListKeys.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Required Documents Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-crisp-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>{t('docChecklistTitle', 'Required Documents')}</span>
          </h2>
          <Link
            to={`/documents?scheme=${scheme.id}`}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
          >
            {t('seeCorrectSample', 'Inspect Correct Samples')}
          </Link>
        </div>

        <div className="space-y-2">
          {scheme.documents.map((doc) => (
            <div key={doc.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {doc.nameKey}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{doc.descriptionKey}</div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                {doc.isMandatory ? 'Mandatory' : 'Optional'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Statutory SLA & Anti-Bribery Notice */}
      <section className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Citizens' Charter & Statutory SLA Guarantee</span>
        </div>
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          By government mandate, your application must be processed within <strong>{scheme.processingSlaDays} working days</strong> by the {scheme.handlingAuthorityKey}. If delayed beyond this period, you are entitled to file a direct CPGRAMS grievance.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>Toll-Free Helpline: {scheme.helplinePhone}</span>
          </span>
          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-navy-900 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-crisp-xl">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            to={`/eligibility?scheme=${scheme.id}`}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 text-white font-bold text-sm text-center shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span>{t('checkEligibilityBtn', 'Check My Eligibility (ಅರ್ಹತೆ ತಿಳಿಯಿರಿ)')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/guidance/${scheme.id}`}
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center shadow-sm whitespace-nowrap active:scale-98 transition-all"
          >
            {t('prepareDocumentsBtn', 'Apply Now')}
          </Link>
        </div>
      </div>
    </div>
  );
};
