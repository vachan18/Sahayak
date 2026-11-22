import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { Scheme } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { AudioListenButton } from '../feedback/AudioListenButton';

interface SchemeCardProps {
  scheme: Scheme;
  onCheckEligibility?: (schemeId: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onCheckEligibility }) => {
  const { t, language } = useTranslation();
  const { savedSchemeIds, toggleSaveScheme, compareSchemeIds, toggleCompareScheme } = useAppStore();

  const isSaved = savedSchemeIds.includes(scheme.id);
  const isCompared = compareSchemeIds.includes(scheme.id);

  const getAudioSummary = () => {
    return `${scheme.titleKey}. ${scheme.shortDescKey} ${scheme.financialBenefit.formattedDisplay}. ${t('statutoryFreeFee')}.`;
  };

  return (
    <article 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-crisp-sm hover:shadow-crisp-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Header: Ministry Tag & Save Button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {scheme.ministryKey}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleSaveScheme(scheme.id)}
              className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                isSaved ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
              }`}
              title={isSaved ? "Saved to your list" : "Save scheme for later"}
              aria-label={isSaved ? "Remove from saved" : "Save scheme"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-brand-navy-900 dark:group-hover:text-sky-400 transition-colors">
          <Link to={`/schemes/${scheme.id}`} className="focus:outline-none">
            {scheme.titleKey}
          </Link>
        </h3>

        {/* Benefit Hero Box (Green Sovereign Cash Badge) */}
        <div className="my-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              {t('directDbtBank', 'Direct Bank Transfer')}
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-900 dark:text-emerald-200 tabular-nums">
              {scheme.financialBenefit.formattedDisplay}
            </div>
          </div>
          <AudioListenButton textToSpeak={getAudioSummary()} size="sm" />
        </div>

        {/* Plain Language Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
          {scheme.shortDescKey}
        </p>

        {/* Metadata Strip: Processing SLA & Free Fee Guarantee */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{scheme.processingSlaDays} {t('days', 'Days')} {t('officialSla', 'SLA')}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('statutoryFreeFee', 'Fee: ₹0.00 (Free)')}</span>
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-1">
        <Link
          to={`/eligibility?scheme=${scheme.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 dark:hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm shadow-sm active:scale-98 transition-all"
        >
          <span>{t('checkEligibilityBtn', 'Check Eligibility')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/schemes/${scheme.id}`}
          className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-all"
        >
          {t('viewDetailsBtn', 'Details')}
        </Link>
      </div>
    </article>
  );
};
