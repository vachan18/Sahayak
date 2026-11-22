import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import { Scheme, BenefitType } from '../../types';
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
    return `${scheme.titleKey}. ${scheme.shortDescKey} ${scheme.financialBenefit.formattedDisplay}.`;
  };

  const getBenefitMechanismLabel = (benefitType: BenefitType) => {
    switch (benefitType) {
      case 'dbt_cash': return 'Direct bank credit via NPCI DBT';
      case 'health_insurance': return 'Cashless treatment at empaneled hospitals';
      case 'credit_loan': return 'Collateral-free institutional micro-loan';
      case 'scholarship': return 'Direct scholarship credit to student account';
      case 'pension': return 'Monthly pension DBT credit';
      default: return 'Government welfare benefit';
    }
  };

  return (
    <article 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-crisp-sm hover:shadow-crisp-lg hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Header: Department Badge & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            {scheme.ministryKey}
          </span>
          <button
            type="button"
            onClick={() => toggleSaveScheme(scheme.id)}
            className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isSaved ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-400'
            }`}
            title={isSaved ? "Saved to your list" : "Save scheme for later"}
            aria-label={isSaved ? "Remove from saved" : "Save scheme"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-600 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-brand-navy-900 dark:group-hover:text-sky-400 transition-colors">
          <Link to={`/schemes/${scheme.id}`} className="focus:outline-none">
            {scheme.titleKey}
          </Link>
        </h3>

        {/* Benefit Amount Hero Box */}
        <div className="my-4 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              {scheme.benefitType === 'dbt_cash' ? 'DIRECT BENEFIT TRANSFER (DBT)' : 'GOVERNMENT BENEFIT'}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-200 tabular-nums mt-0.5">
              {scheme.financialBenefit.formattedDisplay}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
              {getBenefitMechanismLabel(scheme.benefitType)}
            </div>
          </div>
          <AudioListenButton textToSpeak={getAudioSummary()} size="sm" />
        </div>

        {/* Plain Language Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {scheme.shortDescKey}
        </p>

        {/* Key Eligibility Criteria Brief Box */}
        <div className="mb-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Key Criteria:</span>
          </div>
          <div className="leading-relaxed">
            {scheme.whoIsEligibleListKeys[0]}
          </div>
        </div>

        {/* Statutory Fee & Timeline Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3.5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{scheme.processingSlaDays} {t('days', 'Days')} SLA</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Govt Fee: ₹{scheme.statutoryFee?.amount ? scheme.statutoryFee.amount.toFixed(2) : '0.00'}</span>
          </span>
        </div>

        {/* Official Source & Verification Timestamp */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2 mb-5">
          <span className="truncate" title={scheme.sourceAttribution}>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t('sourceAttributionLabel', 'Source')}:</span> {scheme.sourceAttribution}
          </span>
          <span className="flex-shrink-0 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300">
            {scheme.lastVerifiedDate}
          </span>
        </div>
      </div>

      {/* Action Footer: Prominent Primary CTA */}
      <div className="flex items-center gap-3 pt-2">
        <Link
          to={`/eligibility?scheme=${scheme.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-brand-navy-900 hover:bg-brand-navy-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm shadow-crisp-sm hover:shadow-crisp-md active:scale-98 transition-all"
        >
          <span>{t('checkEligibilityBtn', 'Check Eligibility')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to={`/schemes/${scheme.id}`}
          className="px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all text-center"
        >
          {t('viewDetailsBtn', 'Details')}
        </Link>
      </div>
    </article>
  );
};