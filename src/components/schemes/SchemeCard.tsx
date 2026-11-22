import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, ArrowRight, Bookmark, BookmarkCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Scheme } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { AudioListenButton } from '../feedback/AudioListenButton';

interface SchemeCardProps {
  scheme: Scheme;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const { t } = useTranslation();
  const { savedSchemeIds, toggleSaveScheme } = useAppStore();

  const isSaved = savedSchemeIds.includes(scheme.id);

  const getAudioSummary = () => {
    return `${scheme.titleKey}. ${scheme.shortDescKey} ${scheme.financialBenefit.formattedDisplay}. ${t('statutoryFreeFee')}.`;
  };

  return (
    <article 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-crisp-sm hover:shadow-crisp-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Header: Department Badge & Save Button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {scheme.ministryKey}
          </span>
          <button
            type="button"
            onClick={() => toggleSaveScheme(scheme.id)}
            className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isSaved ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
            }`}
            title={isSaved ? "Saved to your list" : "Save scheme for later"}
            aria-label={isSaved ? "Remove from saved" : "Save scheme"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-600" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2.5 group-hover:text-brand-navy-900 dark:group-hover:text-sky-400 transition-colors">
          <Link to={`/schemes/${scheme.id}`} className="focus:outline-none">
            {scheme.titleKey}
          </Link>
        </h3>

        {/* Benefit Amount Hero Box */}
        <div className="my-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              {t('directDbtBank', 'Direct Bank Transfer / Benefit')}
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-emerald-200 tabular-nums">
              {scheme.financialBenefit.formattedDisplay}
            </div>
          </div>
          <AudioListenButton textToSpeak={getAudioSummary()} size="sm" />
        </div>

        {/* Plain Language Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5">
          {scheme.shortDescKey}
        </p>

        {/* Eligibility Brief Pill */}
        <div className="mb-3.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Key Criteria:</span>
          </div>
          <div className="line-clamp-2">
            {scheme.whoIsEligibleListKeys[0]}
          </div>
        </div>

        {/* Statutory Fee & Timeline Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>{scheme.processingSlaDays} {t('days', 'Days')} SLA</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>₹0.00 Govt Fee</span>
          </span>
        </div>

        {/* Source Reference & Last Verified Date */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between gap-1 mb-4">
          <span className="truncate" title={scheme.sourceAttribution}>
            {t('sourceAttributionLabel', 'Source')}: {scheme.sourceAttribution}
          </span>
          <span className="flex-shrink-0 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            {scheme.lastVerifiedDate}
          </span>
        </div>
      </div>

      {/* Action Footer: Prominent Primary CTA */}
      <div className="flex items-center gap-2 pt-1">
        <Link
          to={`/eligibility?scheme=${scheme.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 dark:hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-98 transition-all"
        >
          <span>{t('checkEligibilityBtn', 'Check Eligibility')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to={`/schemes/${scheme.id}`}
          className="px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all text-center"
        >
          {t('viewDetailsBtn', 'Details')}
        </Link>
      </div>
    </article>
  );
};
