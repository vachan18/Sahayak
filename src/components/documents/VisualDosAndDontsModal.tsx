import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, X, 
  AlertTriangle, Eye 
} from 'lucide-react';

interface VisualDosAndDontsModalProps {
  isOpen: boolean;
  onClose: () => void;
  docTitle?: string;
}

export const VisualDosAndDontsModal: React.FC<VisualDosAndDontsModalProps> = ({
  isOpen,
  onClose,
  docTitle = 'Bank Account Passbook (NPCI Seeded)'
}) => {
  const [activeTab, setActiveTab] = useState<'passbook' | 'land' | 'aadhaar'>('passbook');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dos-donts-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-crisp-xl space-y-5 my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-1">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Verification Quality Standard</span>
            </div>
            <h2 id="dos-donts-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {docTitle || "Visual Guide: Do's and Don'ts for Document Upload"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prevent immediate rejection by following these photo clarity guidelines.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close guide modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('passbook')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeTab === 'passbook'
                ? 'bg-brand-navy-900 text-white dark:bg-sky-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Bank Passbook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('land')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeTab === 'land'
                ? 'bg-brand-navy-900 text-white dark:bg-sky-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Land Record (RTC / Pahani)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aadhaar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeTab === 'aadhaar'
                ? 'bg-brand-navy-900 text-white dark:bg-sky-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Aadhaar Card
          </button>
        </div>

        {/* Visual Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
          {/* 1. THE CORRECT WAY (DO) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>CORRECT (Do This)</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                100% Legible
              </span>
            </div>

            {/* Simulated Clean Passbook Card Graphic */}
            <div className="bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl p-3.5 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    SBI
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">State Bank of India</span>
                </div>
                <span className="text-[9px] font-mono bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  BRANCH: MANDYA
                </span>
              </div>

              {/* Sample Clear Details */}
              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">A/C Name:</span>
                  <strong className="text-slate-900 dark:text-white">RAMESHWAR YADAV</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">A/C Number:</span>
                  <strong className="text-slate-900 dark:text-white">3849 2019 4820 11</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IFSC Code:</span>
                  <strong className="text-slate-900 dark:text-white">SBIN0040182</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aadhaar Status:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">NPCI SEEDED ACTIVE</strong>
                </div>
              </div>

              {/* Official Seal Mock */}
              <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-700">
                <span className="italic">Manager Signature & Seal</span>
                <span className="text-emerald-700 font-bold">✓ Clear & Crisp</span>
              </div>
            </div>

            {/* Checklist of Positive Attributes */}
            <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Clear Account Details:</strong> Name, 14-digit A/C number & 11-character IFSC clearly readable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Official Bank Seal:</strong> Branch stamp & officer initials unobscured.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Full Document Framing:</strong> All 4 edges and corners visible within the camera viewfinder.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Even Natural Lighting:</strong> Captured on flat table in daylight without direct phone flash glare.</span>
              </li>
            </ul>
          </div>

          {/* 2. THE WRONG WAY (DON'T) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-rose-600 text-white uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                <span>WRONG (Avoid This)</span>
              </span>
              <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                Will Cause Rejection
              </span>
            </div>

            {/* Simulated Defective Passbook Graphic */}
            <div className="bg-white/80 dark:bg-slate-800/80 border-2 border-dashed border-rose-300 dark:border-rose-700 rounded-xl p-3.5 space-y-2 relative opacity-90">
              {/* Harsh Flash Glare Mock */}
              <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-amber-300/60 blur-md pointer-events-none" />

              <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                <span className="text-xs font-bold text-slate-400 line-through">Cut-Off Bank Title...</span>
                <span className="text-[9px] font-mono text-rose-600 font-bold">BLURRED</span>
              </div>

              {/* Sample Cut-Off Blurred Details */}
              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>A/C Name:</span>
                  <span className="blur-xs">Ramesh... [CUT OFF]</span>
                </div>
                <div className="flex justify-between">
                  <span>A/C Number:</span>
                  <span className="text-amber-800 bg-amber-200 px-1 rounded">*** GLARE HIDDEN ***</span>
                </div>
                <div className="flex justify-between">
                  <span>IFSC Code:</span>
                  <span className="line-through">SBIN0040... [UNREADABLE]</span>
                </div>
              </div>

              {/* Wrong Page Warning */}
              <div className="pt-2 text-[10px] text-rose-600 font-bold text-center border-t border-rose-100">
                ✕ Uploading transaction withdrawal log instead of front cover!
              </div>
            </div>

            {/* Checklist of Negative Faults */}
            <ul className="text-xs text-rose-900 dark:text-rose-200 space-y-1.5 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>No Harsh Flash Glare:</strong> Phone flash reflecting off glossy paper wipes out account numbers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>No Cropped Borders:</strong> Do not crop so tightly that IFSC or customer name is cut off.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Do Not Upload Transaction Pages:</strong> Welfare authorities only accept the front profile page with photo & seal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>No Shaky/Out-of-Focus Photos:</strong> Hold phone steady with two hands to avoid blurred micro-text.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Practical Citizen Advice Strip */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Practical Tip for Faded Passbooks:</strong> If your bank passbook print has faded over time, visit your local bank branch and request a 1-page computerized account statement with bank seal, or a stamped cancelled cheque.
          </p>
        </div>

        {/* Modal Action Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-black text-xs sm:text-sm shadow-crisp-sm transition-all min-h-[48px]"
          >
            I Understand the Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};
