import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, AlertCircle, X, ArrowRight, 
  Lock, KeyRound, FileCheck, Check 
} from 'lucide-react';
import { DocumentSpec } from '../../types';

interface DigiLockerSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentSpec[];
  onCompleteVerification: (verifiedDocIds: string[]) => void;
}

type DigiLockerStep = 'disclaimer' | 'auth' | 'select' | 'confirmed';

export const DigiLockerSimulationModal: React.FC<DigiLockerSimulationModalProps> = ({
  isOpen,
  onClose,
  documents,
  onCompleteVerification
}) => {
  const [step, setStep] = useState<DigiLockerStep>('disclaimer');
  const [otpValue, setOtpValue] = useState<string>('123456');
  const [selectedDocs, setSelectedDocs] = useState<string[]>(
    documents.filter(d => d.digiLockerSupported).map(d => d.id)
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const digiLockerDocs = documents.filter(d => d.digiLockerSupported);

  const handleToggleDoc = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleAuthorize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('select');
    }, 900);
  };

  const handleConfirmFetch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('confirmed');
      onCompleteVerification(selectedDocs);
    }, 1100);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="digilocker-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-crisp-xl space-y-5 my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Header with Prominent Demo Disclaimer */}
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 id="digilocker-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  DigiLocker Integration
                </h2>
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">
                  MeitY Digital Locker API Protocol
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close DigiLocker simulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mandatory Explicit Prototype Notice Banner */}
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="uppercase tracking-wider text-[10px] block text-amber-900 dark:text-amber-300">
                Simulation Prototype Mode
              </strong>
              <span>
                This is an interactive demonstration of DigiLocker document retrieval. No actual government databases are queried, and no real Aadhaar OTP or personal documents are accessed or stored.
              </span>
            </div>
          </div>
        </div>

        {/* STEP 1: DISCLAIMER & PERMISSIONS CONSENT */}
        {step === 'disclaimer' && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Simulated Authorization Scope:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                SAHAYAK requests one-time read access to retrieve digitally signed government certificates from your simulated DigiLocker account:
              </p>
              <ul className="text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1 list-disc pl-4">
                {digiLockerDocs.map(d => (
                  <li key={d.id}>{d.nameKey}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-crisp-sm transition-all min-h-[48px]"
              >
                <span>Proceed to Simulated Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm min-h-[48px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED AUTH / OTP */}
        {step === 'auth' && (
          <div className="space-y-4 py-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Simulate Aadhaar OTP Authentication
              </h3>
              <p className="text-xs text-slate-500">
                A simulated OTP has been prefilled to test the verification pipeline.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-xl font-mono font-bold tracking-widest py-3 px-4 rounded-2xl border-2 border-blue-400 dark:border-blue-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              />
              <span className="text-[11px] text-slate-400 block text-center">
                Demo OTP: <strong>123456</strong>
              </span>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleAuthorize}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-crisp-sm transition-all min-h-[48px]"
            >
              <span>{isProcessing ? 'Authenticating with DigiLocker...' : 'Verify Simulated OTP & Connect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: DOCUMENT SELECTION */}
        {step === 'select' && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Available DigiLocker Digital Certificates ({digiLockerDocs.length})
              </h3>
              <p className="text-xs text-slate-500">
                Select which issued certificates to link with your SAHAYAK welfare dossier:
              </p>
            </div>

            <div className="space-y-2.5">
              {digiLockerDocs.map(doc => {
                const isSelected = selectedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleToggleDoc(doc.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {doc.nameKey}
                        </div>
                        <div className="text-[11px] text-blue-700 dark:text-blue-300">
                          Digitally Attested by State Authority
                        </div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={isProcessing || selectedDocs.length === 0}
              onClick={handleConfirmFetch}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-crisp-sm transition-all min-h-[48px]"
            >
              <span>{isProcessing ? 'Fetching Certificates...' : `Link & Verify Selected (${selectedDocs.length})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: CONFIRMED */}
        {step === 'confirmed' && (
          <div className="space-y-4 py-4 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Simulated DigiLocker Fetch Successful!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                {selectedDocs.length} documents have been marked as pre-verified in your checklist readiness meter.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
              Verified Token: DL-SIM-2026-{Math.floor(100000 + Math.random() * 900000)}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-black text-xs sm:text-sm shadow-crisp-sm transition-all min-h-[48px]"
            >
              Return to Document Checklist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
