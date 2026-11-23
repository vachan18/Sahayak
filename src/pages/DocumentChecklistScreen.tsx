import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Shield, Camera, AlertCircle, CheckCircle2, 
  HelpCircle, ArrowRight, FileText, Sparkles, 
  Upload, Printer, Info, AlertTriangle, Eye
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { VisualDosAndDontsModal } from '../components/documents/VisualDosAndDontsModal';
import { DigiLockerSimulationModal } from '../components/documents/DigiLockerSimulationModal';
import { UploadConfirmationModal } from '../components/documents/UploadConfirmationModal';

export const DocumentChecklistScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSchemeId = searchParams.get('scheme') || 'pm-kisan';
  const { t } = useTranslation();
  const { schemes, documentUploadStatus, setDocumentStatus } = useAppStore();

  const [activeVisualGuide, setActiveVisualGuide] = useState<boolean>(false);
  const [activeDigiLockerModal, setActiveDigiLockerModal] = useState<boolean>(false);
  const [activeUploadModalDoc, setActiveUploadModalDoc] = useState<{ id: string; name: string } | null>(null);
  const [blurAlertDoc, setBlurAlertDoc] = useState<string | null>(null);
  const [simulatedScanningDoc, setSimulatedScanningDoc] = useState<string | null>(null);

  const scheme = schemes.find(s => s.id === currentSchemeId) || schemes[0];

  const handleSelectScheme = (schemeId: string) => {
    setSearchParams({ scheme: schemeId });
  };

  const handleSimulateCameraCapture = (docId: string) => {
    setSimulatedScanningDoc(docId);
    setTimeout(() => {
      setSimulatedScanningDoc(null);
      // Passbook triggers blur detection demonstration to showcase error handling UX
      if (docId === 'bank_passbook') {
        setBlurAlertDoc(docId);
      } else {
        setDocumentStatus(docId, 'verified');
      }
    }, 1200);
  };

  const handleRetakeInBrightLight = (docId: string) => {
    setBlurAlertDoc(null);
    setSimulatedScanningDoc(docId);
    setTimeout(() => {
      setDocumentStatus(docId, 'verified');
      setSimulatedScanningDoc(null);
    }, 1200);
  };

  const handleDigiLockerComplete = (verifiedIds: string[]) => {
    verifiedIds.forEach(id => setDocumentStatus(id, 'verified'));
  };

  const verifiedCount = scheme.documents.filter(d => documentUploadStatus[d.id] === 'verified').length;
  const totalCount = scheme.documents.length;
  const isAllReady = verifiedCount === totalCount;
  const progressPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  // Document metadata helpers for rich quality guidance
  const getDocRationale = (docId: string): string => {
    switch (docId) {
      case 'aadhaar_card':
        return 'Mandatory for statutory identity verification and direct subsidy routing under Aadhaar Act 2016.';
      case 'land_record':
      case 'land_record_rtc':
        return 'Authenticates agricultural ownership and land extent in state land revenue archives (Bhoomi).';
      case 'bank_passbook':
        return 'Ensures DBT cash transfer reaches an active, NPCI-seeded Aadhaar-linked savings account.';
      case 'ration_card':
        return 'Establishes household family composition and NFSA/BPL priority entitlement category.';
      case 'mcp_card':
        return 'Verifies ANC registration, institutional delivery, and child vaccination milestones.';
      case 'vending_certificate':
        return 'Validates urban street vending identity under National Street Vendors Act 2014.';
      case 'income_certificate':
        return 'Verifies family annual income limit as determined by authorized Tahsildar revenue officers.';
      default:
        return 'Required by official government department guidelines for scheme eligibility verification.';
    }
  };

  const getDocMistakes = (docId: string): string => {
    switch (docId) {
      case 'bank_passbook':
        return 'Uploading transaction statement pages instead of the front cover; cropped IFSC or branch stamp; light reflection on printed numbers.';
      case 'land_record':
      case 'land_record_rtc':
        return 'Uploading mutation notices instead of latest signed Record of Rights (Pahani); expired extracts or cut-off survey numbers.';
      case 'aadhaar_card':
        return 'Sharing unmasked 12 digits on insecure devices; blurry QR code; faded photograph on laminated card.';
      case 'ration_card':
        return 'Missing family member listing page; faded seal of Food & Civil Supplies Department.';
      default:
        return 'Low-resolution photograph, blurry text, cropped document margins, or expired official validity.';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto py-4 sm:py-6 animate-fadeIn pb-20 px-2 sm:px-0">
      {/* Top Banner & Scheme Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-crisp-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('officialAssistedPrep', 'Assisted Document Preparation & Verification')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('docChecklistTitle', 'Required Document Checklist')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Inspect quality requirements, check visual Do's & Don'ts, and pre-verify documents to eliminate Grama One / CSC counter rejection.
            </p>
          </div>

          {/* Dynamic Circular Readiness Meter */}
          <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 p-3.5 rounded-2xl self-start lg:self-center flex-shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isAllReady ? "text-emerald-500" : "text-amber-500"}
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900 dark:text-white">
                {progressPercent}%
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                {verifiedCount} of {totalCount} Ready
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {isAllReady ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Prepared
                  </span>
                ) : (
                  <span>Verification Pending</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scheme Selector Tabs */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Select Scheme to View Specific Document Standards:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {schemes.map((s) => {
              const isSelected = s.id === currentSchemeId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectScheme(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    isSelected
                      ? 'bg-brand-navy-900 text-white shadow-sm ring-2 ring-brand-navy-900/20 dark:ring-white/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{s.titleKey}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Tools Bar (DigiLocker Simulation & Visual Do's & Don'ts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={() => setActiveVisualGuide(true)}
          className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100/70 text-left transition-all flex items-start gap-3 group active:scale-[0.99]"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <span>Visual Do's and Don'ts Guide</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold">
                Passbook & RTC
              </span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
              Compare acceptable versus blurry, glare-affected, or cropped uploads with side-by-side examples.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveDigiLockerModal(true)}
          className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100/70 text-left transition-all flex items-start gap-3 group active:scale-[0.99]"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
              <span>DigiLocker 1-Click Pull</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold">
                PROTOTYPE SIMULATION
              </span>
            </div>
            <p className="text-[11px] text-blue-800 dark:text-blue-300/90 mt-0.5 leading-relaxed">
              Simulate instant government repository authorization to auto-verify Aadhaar, RTC, and Certificates.
            </p>
          </div>
        </button>
      </div>

      {/* Blur Detection Alert Box if triggered */}
      {blurAlertDoc && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-600 space-y-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-950 dark:text-amber-200">
                {t('blurDetected', 'Warning: Text looks blurry or bank seal is obscured.')}
              </h3>
              <p className="text-xs text-amber-900 dark:text-amber-300 mt-0.5 leading-relaxed">
                Our image check detected reflection glare or motion blur on the account number and IFSC code. Documents with illegible numbers are rejected at the treasury stage.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleRetakeInBrightLight(blurAlertDoc)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ಬೆಳಕಿನಲ್ಲಿ ಮತ್ತೊಮ್ಮೆ ಫೋಟೋ ತೆಗೆಯಿರಿ (Retake in Good Daylight)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVisualGuide(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold text-xs hover:bg-amber-50 transition-colors"
            >
              View Passbook Sample Guide
            </button>
          </div>
        </div>
      )}

      {/* Document Items List (6 required points on each card) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Required Documents for {scheme.titleKey} ({scheme.documents.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            100% Compliance Required for Approval
          </span>
        </div>

        {scheme.documents.map((doc) => {
          const status = documentUploadStatus[doc.id] || doc.status || 'pending';
          const isVerified = status === 'verified';
          const isScanning = simulatedScanningDoc === doc.id;

          return (
            <div
              key={doc.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                isVerified
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-crisp-sm'
              }`}
            >
              {/* Header: Name, Mandatory Pill, Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {doc.nameKey}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {doc.isMandatory ? 'Mandatory (ಕಡ್ಡಾಯ)' : 'Optional'}
                    </span>
                    {doc.digiLockerSupported && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" /> DigiLocker Ready
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {doc.descriptionKey}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="self-start sm:self-center flex-shrink-0">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ Verified (ಪರಿಶೀಲಿಸಲಾಗಿದೆ)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-black">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload Required</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Six Mandatory Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 py-3.5 text-xs border-b border-slate-100 dark:border-slate-800">
                {/* 1. Why Needed */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wide">
                    <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Why It Is Needed:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {getDocRationale(doc.id)}
                  </p>
                </div>

                {/* 2. Format & Size Limit */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>Accepted Format & Size:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    PDF, JPEG, or PNG format. Maximum file size: <strong>{doc.maxSizeMb || 3} MB</strong>.
                  </p>
                </div>

                {/* 3. Image Quality Guidance */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Image Quality Guidance:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Lay document flat on dark background in natural daylight. Ensure all 4 borders are captured without shadows or camera tilt.
                  </p>
                </div>

                {/* 4. Common Mistakes */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wide">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span>Common Mistakes to Avoid:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {getDocMistakes(doc.id)}
                  </p>
                </div>
              </div>

              {/* Action Buttons: DigiLocker vs Upload Confirmation vs Sample Visualizer */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  {!isVerified && doc.digiLockerSupported && (
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={() => setActiveDigiLockerModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 text-blue-900 dark:text-blue-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all min-h-[44px]"
                    >
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isScanning ? 'Connecting...' : t('digiLockerPull', 'Fetch via DigiLocker')}</span>
                    </button>
                  )}

                  {!isVerified ? (
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={() => setActiveUploadModalDoc({ id: doc.id, name: doc.nameKey })}
                      className="px-3.5 py-2 rounded-xl bg-brand-navy-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all min-h-[44px]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isScanning ? 'Processing...' : 'Upload & Verify'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveUploadModalDoc({ id: doc.id, name: doc.nameKey })}
                      className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs font-medium hover:underline flex items-center gap-1"
                    >
                      <span>Replace / Re-verify</span>
                    </button>
                  )}

                  {!isVerified && (
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={() => handleSimulateCameraCapture(doc.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all min-h-[44px]"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Quick Camera Scan</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVisualGuide(true)}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 py-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Inspect Sample (ಮಾದರಿ ನೋಡಿ)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSC Seva Kendra Token & Assisted Submission Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-crisp-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Printer className="w-3.5 h-3.5" />
              <span>Assisted Service Option</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">
              Prefer applying at a Grama One / CSC Seva Kendra?
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Generate an official pre-verified assistance slip with a scannable token QR code and statutory fee cap guarantee. The operator will instantly read your document checklist without re-entering data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
            <Link
              to={`/csc-slip/KA-${scheme.id.toUpperCase()}-2026-84920?scheme=${scheme.id}`}
              className="py-3 px-4 rounded-xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-95 transition-all min-h-[48px]"
            >
              <Printer className="w-4 h-4 text-slate-900" />
              <span>Generate CSC Kendra Slip</span>
            </Link>

            <Link
              to={`/guidance/${scheme.id}`}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all min-h-[48px]"
            >
              <span>{t('prepareDocumentsBtn', 'Proceed to Submit Online')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Legal Transparency Footnote */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            🔒 <strong>Statutory Transparency:</strong> Government fee is ₹0.00. Grama One / CSC operator convenience charge is strictly capped at ₹30.00 under Sakala.
          </span>
          <span className="text-slate-400">
            Local browser verification only • No biometric data saved
          </span>
        </div>
      </div>

      {/* Visual Do's and Don'ts Modal */}
      <VisualDosAndDontsModal
        isOpen={activeVisualGuide}
        onClose={() => setActiveVisualGuide(false)}
        docTitle="Official Document Photo Quality Standard"
      />

      {/* DigiLocker Simulation Modal */}
      <DigiLockerSimulationModal
        isOpen={activeDigiLockerModal}
        onClose={() => setActiveDigiLockerModal(false)}
        documents={scheme.documents}
        onCompleteVerification={handleDigiLockerComplete}
      />

      {/* Privacy and Quality Confirmation Modal before Upload */}
      {activeUploadModalDoc && (
        <UploadConfirmationModal
          isOpen={!!activeUploadModalDoc}
          onClose={() => setActiveUploadModalDoc(null)}
          documentId={activeUploadModalDoc.id}
          documentName={activeUploadModalDoc.name}
          onConfirmUpload={(docId) => setDocumentStatus(docId, 'verified')}
        />
      )}
    </div>
  );
};
