import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, ShieldCheck, ArrowRight, Bookmark, BookmarkCheck, 
  CheckCircle2, FileText, Check, Landmark, Wheat, HeartPulse, 
  Users, GraduationCap, Store, Home, Scale 
} from 'lucide-react';
import { Scheme, BenefitType, LifeEventId } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { AudioListenButton } from '../feedback/AudioListenButton';
import { formatSchemeBenefit } from '../../utils/formatBenefit';

interface SchemeCardProps {
  scheme: Scheme;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const { t, language } = useTranslation();
  const { savedSchemeIds, toggleSaveScheme, compareSchemeIds, toggleCompareScheme } = useAppStore();

  const formattedBenefitDisplay = formatSchemeBenefit(scheme, language, t);

  const isSaved = savedSchemeIds.includes(scheme.id);
  const isCompared = compareSchemeIds.includes(scheme.id);

  const getAudioSummary = () => {
    return `${scheme.titleKey}. ${scheme.shortDescKey} Benefit: ${scheme.financialBenefit.formattedDisplay}. Expected approval in ${scheme.processingSlaDays} days. Government application fee is zero rupees.`;
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

  const getBenefitCategoryLabel = (benefitType: BenefitType) => {
    switch (benefitType) {
      case 'dbt_cash': return 'DIRECT BENEFIT TRANSFER (DBT)';
      case 'health_insurance': return 'HEALTH INSURANCE COVER';
      case 'credit_loan': return 'SUBSIDIZED CREDIT / LOAN';
      case 'scholarship': return 'EDUCATIONAL SCHOLARSHIP';
      case 'pension': return 'PENSION ASSISTANCE';
      default: return 'GOVERNMENT WELFARE BENEFIT';
    }
  };

  const getCategoryMeta = (lifeEventId: LifeEventId) => {
    switch (lifeEventId) {
      case 'farming':
        return { label: t('lifeEvent_farming', 'Agriculture & Farming'), icon: Wheat, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'health_elder':
        return { label: t('lifeEvent_health_elder', 'Health & Family'), icon: HeartPulse, color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'women_child':
        return { label: t('lifeEvent_women_child', 'Women & Child'), icon: Users, color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
      case 'education_youth':
        return { label: t('lifeEvent_education_youth', 'Education & Youth'), icon: GraduationCap, color: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'business_artisan':
        return { label: t('lifeEvent_business_artisan', 'Micro-Enterprise & Credit'), icon: Store, color: 'text-sky-700 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
      case 'housing_utilities':
        return { label: t('lifeEvent_housing_utilities', 'Housing & Utilities'), icon: Home, color: 'text-teal-700 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800' };
      default:
        return { label: 'Welfare Scheme', icon: Landmark, color: 'text-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const categoryMeta = getCategoryMeta(scheme.lifeEventId);
  const CategoryIcon = categoryMeta.icon;

  // Filter top mandatory documents to show on card
  const previewDocs = scheme.documents.slice(0, 3);

  return (
    <article 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-crisp-sm hover:shadow-crisp-lg hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-200 flex flex-col justify-between group relative"
    >
      <div>
        {/* Top Header: Category Pill, Ministry Tag, Verification & Bookmark */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {/* Category Pill */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${categoryMeta.color}`}>
              <CategoryIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[160px]">{categoryMeta.label}</span>
            </span>

            {/* Ministry Tag */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[150px] sm:max-w-[180px]" title={scheme.ministryKey}>
              {scheme.ministryKey}
            </span>

            {/* Verified Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
              scheme.verificationStatus === 'VERIFIED'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
            }`}>
              <ShieldCheck className="w-3 h-3 flex-shrink-0" />
              <span>{scheme.verificationStatus}</span>
            </span>
          </div>

          {/* Action Icons: Compare & Bookmark */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleCompareScheme(scheme.id)}
              className={`p-2.5 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isCompared 
                  ? 'text-amber-700 bg-amber-100 dark:bg-amber-950 font-bold' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isCompared ? "Remove from comparison" : "Add to comparison tray"}
              aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
            >
              <Scale className={`w-4 h-4 ${isCompared ? 'text-amber-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => toggleSaveScheme(scheme.id)}
              className={`p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isSaved ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isSaved ? "Saved to your list (Click to remove)" : "Save scheme for later"}
              aria-label={isSaved ? "Remove from saved schemes" : "Save scheme"}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 fill-amber-600 text-amber-600" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Scheme Title (Fluid typography & Indic length support) */}
        <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-brand-navy-900 dark:group-hover:text-sky-400 transition-colors break-words">
          <Link to={`/schemes/${scheme.id}`} className="focus:outline-none focus:underline">
            {scheme.titleKey}
          </Link>
        </h3>

        {/* Benefit Amount Hero Box */}
        <div className="my-3.5 sm:my-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider truncate">
              {getBenefitCategoryLabel(scheme.benefitType)}
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950 dark:text-emerald-200 tabular-nums mt-0.5 break-words">
              {formattedBenefitDisplay}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 line-clamp-1 font-medium">
              {getBenefitMechanismLabel(scheme.benefitType)}
            </div>
          </div>
          <div className="flex-shrink-0">
            <AudioListenButton textToSpeak={getAudioSummary()} size="sm" />
          </div>
        </div>

        {/* Plain Language Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
          {scheme.shortDescKey}
        </p>

        {/* Key Eligibility Summary Box */}
        <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Key Eligibility Criteria</span>
          </div>
          <div className="leading-relaxed line-clamp-2 text-slate-600 dark:text-slate-300">
            {scheme.whoIsEligibleListKeys[0]}
          </div>
        </div>

        {/* Required Documents Requirement Preview */}
        <div className="mb-4">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Key Required Documents ({scheme.documents.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {previewDocs.map((doc) => (
              <span
                key={doc.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
              >
                <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="truncate max-w-[130px]">{doc.nameKey.split('(')[0].trim()}</span>
                {doc.digiLockerSupported && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold uppercase tracking-tight">
                    DigiLocker
                  </span>
                )}
              </span>
            ))}
            {scheme.documents.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                +{scheme.documents.length - 3} more
              </span>
            )}
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

      {/* Action Footer: Clear CTAs (both >= 48px touch targets) */}
      <div className="flex items-center gap-2 sm:gap-3 pt-2">
        <Link
          to={`/eligibility?scheme=${scheme.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 rounded-2xl bg-brand-navy-900 hover:bg-brand-navy-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-crisp-sm hover:shadow-crisp-md active:scale-98 transition-all min-h-[48px] text-center"
        >
          <span>{t('checkEligibilityBtn', 'Check Eligibility')}</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Link>
        <Link
          to={`/schemes/${scheme.id}`}
          className="px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm transition-all text-center min-h-[48px] flex items-center justify-center flex-shrink-0 border border-slate-200/60 dark:border-slate-700/60"
        >
          {t('viewDetailsBtn', 'View Details')}
        </Link>
      </div>
    </article>
  );
};
