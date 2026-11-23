import React, { useState } from 'react';
import { 
  ShieldCheck, AlertCircle, FileCheck2, Scale, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const TrustAndClarityBanner: React.FC = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-crisp-xs transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-brand-navy-900/10 dark:bg-sky-500/20 text-brand-navy-900 dark:text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-brand-navy-900 dark:text-sky-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                {t('gazetteVerifiedBadge', 'Gazette Verified')}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                Sakala Act Standards
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
              {t('statutoryNoticeTitle', 'Statutory Trust & Information Standard')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5 max-w-3xl">
              {t('statutoryNoticeDesc', 'Preliminary citizen guidance only. Official sanction requires departmental document verification. Zero official government fees.')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex-shrink-0 min-h-[38px] active:scale-95"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Hide Standards' : 'Read Trust Standards'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-700 dark:text-slate-300 animate-fadeIn">
          {/* Pillar 1: Official Sources */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Official Departmental Sources</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Criteria and exclusions directly cite official gazettes from the Ministry of Agriculture, MoHFW, and Karnataka State Departments. No private third-party rules.
            </p>
          </div>

          {/* Pillar 2: Statutory Fee Schedules */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Zero Government Application Fees</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Government scheme enrollment carries ₹0 statutory fee. At assisted Common Service Centres (CSC / Grama One), service charges are legally capped at ₹30 per submission.
            </p>
          </div>

          {/* Pillar 3: Realistic Timelines & Grievances */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <AlertCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Sakala Time Guarantees & Grievance</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Processing windows (10–45 days) are statutory Citizen's Charter targets. If an application is delayed beyond SLA, citizens can file an appeal on Sakala (1902) or CPGRAMS.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
