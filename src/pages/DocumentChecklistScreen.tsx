import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Shield, Camera, AlertCircle, CheckCircle2, 
  HelpCircle, X, ArrowRight 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';

export const DocumentChecklistScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const schemeId = searchParams.get('scheme') || 'pm-kisan';
  const { t } = useTranslation();
  const { schemes, documentUploadStatus, setDocumentStatus } = useAppStore();

  const [activeModalDoc, setActiveModalDoc] = useState<string | null>(null);
  const [simulatedScanningDoc, setSimulatedScanningDoc] = useState<string | null>(null);
  const [blurAlertDoc, setBlurAlertDoc] = useState<string | null>(null);

  const scheme = schemes.find(s => s.id === schemeId) || schemes[0];

  const handleSimulateDigiLocker = (docId: string) => {
    setSimulatedScanningDoc(docId);
    setTimeout(() => {
      setDocumentStatus(docId, 'verified');
      setSimulatedScanningDoc(null);
    }, 1200);
  };

  const handleSimulateCameraCapture = (docId: string) => {
    setSimulatedScanningDoc(docId);
    setTimeout(() => {
      setSimulatedScanningDoc(null);
      // Randomly show blur detection check on passbook to demonstrate error recovery
      if (docId === 'bank_passbook') {
        setBlurAlertDoc(docId);
      } else {
        setDocumentStatus(docId, 'verified');
      }
    }, 1500);
  };

  const handleRetakeInBrightLight = (docId: string) => {
    setBlurAlertDoc(null);
    setSimulatedScanningDoc(docId);
    setTimeout(() => {
      setDocumentStatus(docId, 'verified');
      setSimulatedScanningDoc(null);
    }, 1400);
  };

  const verifiedCount = scheme.documents.filter(d => documentUploadStatus[d.id] === 'verified').length;
  const totalCount = scheme.documents.length;
  const isAllReady = verifiedCount === totalCount;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            {scheme.titleKey}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t('docChecklistTitle', 'Required Document Checklist')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('docChecklistSubtitle', 'Ensure documents are 100% compliant before applying to prevent rejections.')}
          </p>
        </div>

        {/* Readiness Meter Ring */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm self-start sm:self-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-sm text-emerald-800 dark:text-emerald-300 tabular-nums">
            {verifiedCount}/{totalCount}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {t('readinessMeter', 'Readiness Meter')}
            </div>
            <div className="text-[11px] text-slate-500">
              {isAllReady ? "All papers verified! ✓" : "Verification in progress"}
            </div>
          </div>
        </div>
      </div>

      {/* Document Items List */}
      <div className="space-y-4">
        {scheme.documents.map((doc) => {
          const status = documentUploadStatus[doc.id] || doc.status || 'pending';
          const isVerified = status === 'verified';
          const isScanning = simulatedScanningDoc === doc.id;
          const hasBlurAlert = blurAlertDoc === doc.id;

          return (
            <div
              key={doc.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isVerified
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : hasBlurAlert
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-crisp-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {doc.nameKey}
                    </h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {isVerified ? '✓ Verified (ಪರಿಶೀಲಿಸಲಾಗಿದೆ)' : 'Upload Required'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {doc.descriptionKey}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalDoc(doc.id)}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 self-start sm:self-center"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{t('seeCorrectSample', 'Inspect Sample (ಮಾದರಿ ನೋಡಿ)')}</span>
                </button>
              </div>

              {/* Blur Detection Alert Box if triggered */}
              {hasBlurAlert && (
                <div className="mb-3 p-3 rounded-xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <strong>{t('blurDetected', 'Warning: Text looks blurry or bank seal is obscured.')}</strong>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => handleRetakeInBrightLight(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
                      >
                        ಬೆಳಕಿನಲ್ಲಿ ಮತ್ತೊಮ್ಮೆ ಫೋಟೋ ತೆಗೆಯಿರಿ (Retake Photo in Light)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: DigiLocker vs Smart Camera */}
              {!isVerified && !hasBlurAlert && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {doc.digiLockerSupported && (
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={() => handleSimulateDigiLocker(doc.id)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 text-blue-900 dark:text-blue-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isScanning ? 'Connecting...' : t('digiLockerPull', 'Fetch via DigiLocker')}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleSimulateCameraCapture(doc.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isScanning ? 'Scanning...' : t('takePhoto', 'Take Photo with Scanner')}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Do's and Don'ts Modal */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-crisp-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('dosAndDontsTitle', 'Visual Guide: How to Upload')}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModalDoc(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* DO */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800">
                <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('correctWay', 'CORRECT (Do This / ಸರಿ)')}</span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {t('passbookDo', 'Clear front page showing Account Number, IFSC Code, Bank Seal & Photo.')}
                </p>
              </div>

              {/* DON'T */}
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800">
                <div className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5 mb-1 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{t('wrongWay', 'WRONG (Avoid This / ತಪ್ಪು)')}</span>
                </div>
                <p className="text-red-800 dark:text-red-300 leading-relaxed">
                  {t('passbookDont', 'Do not upload transaction history pages or blurry photos where numbers are cut off.')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModalDoc(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              ಅರ್ಥವಾಯಿತು (I Understand)
            </button>
          </div>
        </div>
      )}

      {/* Primary Proceed CTA */}
      <div className="p-5 rounded-3xl bg-brand-navy-900 text-white shadow-crisp-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">
            {isAllReady ? "All Documents Ready! (ದಾಖಲೆಗಳು ಸಿದ್ಧವಾಗಿವೆ)" : "Ready to proceed to submission?"}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Choose online self-service or generate your official CSC Seva Kendra token slip.
          </p>
        </div>
        <Link
          to={`/guidance/${scheme.id}`}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm flex-shrink-0 active:scale-95 transition-all"
        >
          <span>{t('prepareDocumentsBtn', 'Proceed to Submit')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
