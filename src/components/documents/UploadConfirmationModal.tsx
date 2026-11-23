import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, 
  Upload, X, FileText 
} from 'lucide-react';

interface UploadConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentId: string;
  onConfirmUpload: (docId: string) => void;
}

export const UploadConfirmationModal: React.FC<UploadConfirmationModalProps> = ({
  isOpen,
  onClose,
  documentName,
  documentId,
  onConfirmUpload
}) => {
  const [hasAcknowledgedPrivacy, setHasAcknowledgedPrivacy] = useState(true);
  const [hasCheckedGlare, setHasCheckedGlare] = useState(true);
  const [hasCheckedNameMatch, setHasCheckedNameMatch] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onConfirmUpload(documentId);
      onClose();
    }, 1000);
  };

  const allChecked = hasAcknowledgedPrivacy && hasCheckedGlare && hasCheckedNameMatch;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-confirm-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-crisp-xl space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="upload-confirm-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Document Upload Confirmation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Citizen Privacy & Quality Verification Protocol
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close upload confirmation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Document Pill */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {documentName}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
            PDF / JPG &lt; 3MB
          </span>
        </div>

        {/* Privacy & Safeguard Warning */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Citizen Privacy Protection Guardrails</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11px]">
            <strong>Do not upload sensitive unmasked credentials:</strong> Never share ATM PINs, CVV codes, net banking passwords, or full biometric iris prints. For Aadhaar, masked copies showing only the last 4 digits are legally preferred.
          </p>
        </div>

        {/* Pre-upload Quality Checklist */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Confirm Document Quality
          </div>

          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={hasCheckedGlare} 
              onChange={(e) => setHasCheckedGlare(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold">No Glare & All Corners Visible:</span> All four borders of the document are within frame and account/reference text is sharp and readable.
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={hasCheckedNameMatch} 
              onChange={(e) => setHasCheckedNameMatch(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold">Name & Spelling Consistency:</span> Name on document matches the applicant's official records or includes valid affidavit/gazette proof.
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={hasAcknowledgedPrivacy} 
              onChange={(e) => setHasAcknowledgedPrivacy(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold">Local Device Storage:</span> I understand this document is verified in-browser for this session and is never sold to third-party advertisers.
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[48px]"
          >
            Cancel / ರದ್ದುಮಾಡಿ
          </button>

          <button
            type="button"
            disabled={!allChecked || isUploading}
            onClick={handleUpload}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[48px] ${
              allChecked && !isUploading
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Integrity...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Confirm & Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
