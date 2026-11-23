import React, { useState } from 'react';
import { 
  AlertCircle, ExternalLink, PhoneCall, 
  FileText, CheckCircle2, X, Building2, 
  Copy, Check 
} from 'lucide-react';
import { ApplicationRecord } from '../../types';

interface GrievanceGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: ApplicationRecord;
}

export const GrievanceGuidanceModal: React.FC<GrievanceGuidanceModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [activeTab, setActiveTab] = useState<'cpgrams' | 'state' | 'documents'>('cpgrams');

  if (!isOpen) return null;

  const handleCopyToken = () => {
    if (application?.tokenNumber) {
      navigator.clipboard.writeText(application.tokenNumber);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grievance-modal-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-crisp-xl space-y-5 my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/80 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 id="grievance-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Official Citizen Grievance & Escalation Guide
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  How to lodge a legally binding complaint for delayed or rejected applications
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close grievance guidance"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Token Pill if available */}
          {application && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Application Reference: </span>
                <strong className="font-mono text-slate-900 dark:text-white">{application.tokenNumber}</strong>
                <span className="text-slate-500 dark:text-slate-400 ml-2">({application.schemeTitle})</span>
              </div>
              <button
                type="button"
                onClick={handleCopyToken}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all"
              >
                {copiedToken ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 pt-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('cpgrams')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'cpgrams'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Central CPGRAMS Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('state')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'state'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>State & Department Helplines</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents for Escalation</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-2 overflow-y-auto max-h-[50vh] space-y-4">
          {activeTab === 'cpgrams' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 leading-relaxed text-red-950 dark:text-red-200">
                <strong>What is CPGRAMS?</strong> Centralized Public Grievance Redress and Monitoring System (CPGRAMS) is an official online platform by the Department of Administrative Reforms & Public Grievances (DARPG), Government of India. Any complaint lodged here is assigned a time-bound statutory inquiry with a 30-day resolution deadline.
              </div>

              <div className="space-y-2">
                <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Step-by-Step Filing Procedure
                </div>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      1
                    </span>
                    <div>
                      <strong>Visit Official Portal:</strong> Open <code>pgportal.gov.in</code> and click <em>Lodge Public Grievance</em>.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      2
                    </span>
                    <div>
                      <strong>Select Ministry:</strong> Choose the respective nodal department (e.g., <em>Agriculture & Farmers Welfare</em> for PM-KISAN, <em>Housing & Urban Affairs</em> for PM-SVANidhi).
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      3
                    </span>
                    <div>
                      <strong>Enter Reference & Details:</strong> Paste your Token Number (<code>{application?.tokenNumber || 'KA-KISAN-2026-84920'}</code>) and state that statutory SLA period has elapsed without reasonable cause.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      4
                    </span>
                    <div>
                      <strong>Upload Evidence:</strong> Attach the PDF of your CSC pre-verified token slip or application acknowledgement receipt.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                >
                  <span>Go to CPGRAMS Portal (pgportal.gov.in)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'state' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 leading-relaxed text-amber-950 dark:text-amber-200">
                <strong>Karnataka Sakala Guarantee:</strong> Under the Karnataka Sakala Services Act 2011, designated services have a statutory guarantee. Delay beyond SLA entitles citizens to ₹20/day compensatory allowance from the defaulting officer's salary.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Sakala Call Center</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">1902 / 080-44554455</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Statewide toll-free grievance registration for all Grama One services.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">PM-KISAN Central Helpline</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">155261 / 011-24300606</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Ministry of Agriculture direct farmer assistance line.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Ayushman PM-JAY Grievance</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">14555</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    National Health Authority 24x7 toll-free grievance desk.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">PM SVANidhi Micro-Credit</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">1800-11-1979</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    MoHUA bank branch escalation helpline.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3.5 text-xs">
              <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Checklist: Evidence Needed for Escalation
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Application Acknowledgment / Token Slip:</strong> Containing the unique reference number (e.g. <code>{application?.tokenNumber || 'KA-KISAN-2026-84920'}</code>) and date of submission.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Proof of Statutory Time Expiry:</strong> Screenshot of your tracker timeline showing days elapsed beyond the statutory SLA limit ({application?.slaDeadlineDays || 21} days).
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>CSC Operator Fee Receipt:</strong> If an operator charged more than ₹30.00, attach a photo of the receipt or transaction statement as anti-extortion evidence.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Identity Verification Copy:</strong> Front copy of your Aadhaar or Voter ID confirming applicant identity.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-slate-500">
            Citizen Grievance Rights protected under Citizens' Charter
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
