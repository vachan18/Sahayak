import React, { useState } from 'react';
import { 
  Scale, X, Check, ArrowRight 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';

export const SchemeComparisonTray: React.FC = () => {
  const { schemes, compareSchemeIds, toggleCompareScheme, clearCompareSchemes } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareSchemeIds.length === 0) return null;

  const comparedSchemes = schemes.filter(s => compareSchemeIds.includes(s.id));

  return (
    <>
      {/* Floating Bottom Comparison Tray Bar */}
      <aside 
        aria-label="Scheme Comparison Tray"
        className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-crisp-xl border border-slate-700 animate-slideUp flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {comparedSchemes.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 whitespace-nowrap"
              >
                <span className="truncate max-w-[120px] sm:max-w-[150px]">{s.titleKey}</span>
                <button
                  type="button"
                  onClick={() => toggleCompareScheme(s.id)}
                  className="text-slate-400 hover:text-white"
                  aria-label={`Remove ${s.titleKey} from comparison`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompareSchemes}
            className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all flex-shrink-0 min-h-[40px]"
          >
            <span>Compare ({comparedSchemes.length}/3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Side-by-Side Detailed Comparison Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="comparison-modal-title"
        >
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-crisp-xl space-y-4 my-auto max-h-[92vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="comparison-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Direct Scheme Comparison Matrix
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Compare benefits, eligibility hurdles, required paperwork, and application modes
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close comparison view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid (Responsive Table) */}
            <div className="overflow-x-auto scrollbar-thin py-1">
              <div className="min-w-[550px] divide-y divide-slate-100 dark:divide-slate-800">
                {/* 1. Scheme Title Header Row */}
                <div className="grid grid-cols-4 gap-2 pb-3 text-xs">
                  <div className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px] self-end">
                    Criterion
                  </div>
                  {comparedSchemes.map((s) => (
                    <div key={s.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="font-mono text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                        {s.id}
                      </div>
                      <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 leading-snug">
                        {s.titleKey}
                      </h3>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {s.ministryKey}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Benefit Type & Amount */}
                <div className="grid grid-cols-4 gap-2 py-3 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Benefit Type & Amount
                  </div>
                  {comparedSchemes.map((s) => (
                    <div key={s.id} className="text-slate-800 dark:text-slate-200">
                      <div className="font-black text-sm text-emerald-700 dark:text-emerald-400">
                        {s.financialBenefit.formattedDisplay}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium capitalize mt-0.5">
                        {s.benefitType.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. Core Eligibility Requirements */}
                <div className="grid grid-cols-4 gap-2 py-3 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Primary Eligibility
                  </div>
                  {comparedSchemes.map((s) => (
                    <div key={s.id} className="text-slate-700 dark:text-slate-300 space-y-1">
                      {s.eligibilityCriteria.occupations && (
                        <div>
                          <strong>Occupation: </strong>
                          <span className="capitalize">{s.eligibilityCriteria.occupations.join(', ')}</span>
                        </div>
                      )}
                      {s.eligibilityCriteria.requiresLandTitle && (
                        <div className="text-amber-800 dark:text-amber-300">
                          ✓ Agricultural Land Title (RTC) required
                        </div>
                      )}
                      {s.eligibilityCriteria.requiresMaternityStatus && (
                        <div className="text-rose-800 dark:text-rose-300">
                          ✓ Pregnant / Lactating Mothers
                        </div>
                      )}
                      {s.eligibilityCriteria.maxAnnualIncome && (
                        <div>
                          Income Cap: ₹{s.eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}/year
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 4. Required Documents */}
                <div className="grid grid-cols-4 gap-2 py-3 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Required Documents
                  </div>
                  {comparedSchemes.map((s) => (
                    <div key={s.id} className="space-y-1">
                      {s.documents.map((d) => (
                        <div key={d.id} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{d.nameKey}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* 5. Application Mode & Statutory SLA */}
                <div className="grid grid-cols-4 gap-2 py-3 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Application Mode & SLA
                  </div>
                  {comparedSchemes.map((s) => (
                    <div key={s.id} className="space-y-1 text-slate-700 dark:text-slate-300">
                      <div>
                        <strong>Mode: </strong> Self-Filing & Grama One / CSC
                      </div>
                      <div>
                        <strong>SLA Guarantee: </strong> {s.processingSlaDays} Days
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                        Govt Fee: ₹0.00 (Statutory Free)
                      </div>
                    </div>
                  ))}
                </div>

                {/* 6. Important Conditions */}
                <div className="grid grid-cols-4 gap-2 py-3 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Important Conditions
                  </div>
                  {comparedSchemes.map((s) => (
                    <div key={s.id} className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {s.whoIsNotEligibleListKeys?.[0] || 'Government employees & high taxpayers are statutorily excluded.'}
                    </div>
                  ))}
                </div>

                {/* Action Links */}
                <div className="grid grid-cols-4 gap-2 pt-3 text-xs">
                  <div className="font-bold text-slate-400">Actions</div>
                  {comparedSchemes.map((s) => (
                    <div key={s.id} className="flex flex-col gap-1.5">
                      <Link
                        to={`/schemes/${s.id}`}
                        onClick={() => setIsModalOpen(false)}
                        className="py-2 px-3 rounded-xl bg-brand-navy-900 text-white font-bold text-center text-xs hover:bg-slate-800 transition-colors"
                      >
                        View Full Details
                      </Link>
                      <Link
                        to={`/eligibility?scheme=${s.id}`}
                        onClick={() => setIsModalOpen(false)}
                        className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-center text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Check Eligibility
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                Official statutory data verified from respective Ministry gazette notifications.
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-slate-900 text-white font-bold"
              >
                Done Comparing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
