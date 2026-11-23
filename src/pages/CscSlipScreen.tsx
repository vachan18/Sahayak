import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Printer, ArrowRight, ShieldCheck, 
  PhoneCall, CheckCircle2, FileText, 
  ChevronLeft, Clock 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { QrCodeSvg } from '../components/common/QrCodeSvg';

export const CscSlipScreen: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [searchParams] = useSearchParams();
  const schemeParam = searchParams.get('scheme');
  const { schemes, documentUploadStatus } = useAppStore();

  // Resolve current scheme
  const scheme = schemes.find(s => s.id === schemeParam) || schemes[0];

  const resolvedToken = tokenId || `KA-${scheme.id.toUpperCase()}-2026-84920`;
  const verificationUrl = `https://sahayak.gov.in/verify?token=${resolvedToken}&scheme=${scheme.id}&auth=preverified_sha256`;
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-6 animate-fadeIn pb-16 px-2 sm:px-0">
      {/* Top back navigation (hidden on print) */}
      <div className="no-print flex items-center justify-between mb-4">
        <Link
          to={`/documents?scheme=${scheme.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Document Checklist</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-400">
          Citizen Assistance Slip
        </span>
      </div>

      {/* Official Treasury / Citizen Service Slip Card */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 sm:p-7 shadow-crisp-lg text-slate-900 relative print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Slip Header & Dignified Civic Typography (No fake seals) */}
        <div className="text-center pb-4 border-b-2 border-slate-200">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-1.5">
            SAHAYAK • CITIZEN WELFARE PORTAL
          </div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Grama One / CSC Seva Kendra Assisted Token Slip
          </h2>
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mt-1">
            {scheme.titleKey}
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Department: {scheme.ministryKey}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] font-mono font-bold">
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              TOKEN: {resolvedToken}
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              DATE: {generatedDate}
            </span>
          </div>
        </div>

        {/* Real QR Code Centerpiece */}
        <div className="my-5 text-center">
          <div className="inline-block p-3 rounded-2xl bg-white border-2 border-slate-900 shadow-sm">
            <QrCodeSvg
              value={verificationUrl}
              size={180}
              ariaLabel={`Official token QR code for ${resolvedToken}`}
            />
          </div>
          <div className="mt-2 text-xs font-bold text-slate-900">
            Show this QR Code to the Village Level Entrepreneur (VLE) Operator
          </div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
            The counter operator will scan this to ingest your pre-verified document package directly into the portal.
          </p>
        </div>

        {/* Statutory Service Fee Transparency Box (Mandatory Citizen Protection) */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500/80 text-amber-950 mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider border-b border-amber-200 pb-1.5">
            <span className="flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>ಶಾಸನಬದ್ಧ ಶುಲ್ಕ ರಕ್ಷಣೆ / STATUTORY FEE GUARANTEE</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              Sakala Guarantee
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-xl bg-white/70 border border-amber-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Government Fee:</div>
              <div className="text-sm font-black text-emerald-700">₹0.00 (Statutory Free)</div>
            </div>
            <div className="p-2 rounded-xl bg-white/70 border border-amber-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Max CSC VLE Service Charge:</div>
              <div className="text-sm font-black text-slate-900">₹30.00 Maximum</div>
            </div>
          </div>

          <div className="text-[11px] text-amber-900 pt-1 leading-snug">
            <strong>Citizen Protection Notice:</strong> Charging more than ₹30.00 is a punishable offense under the Karnataka Sakala Services Act 2011. You are legally entitled to a printed receipt for any fee paid.
          </div>
        </div>

        {/* Pre-verified Document Checklist Table */}
        <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2.5 mb-5 bg-slate-50/50">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Pre-Verified Document Checklist</span>
            <span className="text-[10px] text-slate-500 font-normal">
              Status for {scheme.titleKey}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {scheme.documents.map((doc) => {
              const isVerified = documentUploadStatus[doc.id] === 'verified' || doc.status === 'verified';
              return (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-white border border-slate-200/80"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{doc.nameKey}</span>
                  </div>
                  {isVerified ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Pre-Verified
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Physical Copy Needed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Guarantee & Anti-Extortion Helplines */}
        <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <Clock className="w-3 h-3 text-slate-500" /> Expected Processing SLA:
            </span>
            <span className="font-bold text-slate-900">{scheme.processingSlaDays || 15} Working Days</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <PhoneCall className="w-3 h-3 text-slate-500" /> Sakala Anti-Extortion Helpline:
            </span>
            <span className="font-bold text-blue-700">1902 / 080-44554455</span>
          </div>

          <div className="text-[10px] text-slate-500 text-center pt-2">
            This token is issued for citizen facilitation by SAHAYAK. Validity: 30 days from generation.
          </div>
        </div>
      </div>

      {/* Action Buttons (no-print) */}
      <div className="no-print mt-5 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[48px] shadow-sm"
        >
          <Printer className="w-4 h-4 flex-shrink-0" />
          <span>ಮುದ್ರಿಸಿ / Print Token Slip</span>
        </button>

        <Link
          to="/tracker"
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-center active:scale-95 transition-all min-h-[48px] shadow-sm"
        >
          <span>ಅರ್ಜಿ ಸ್ಥಿತಿ ನೋಡಿ (Tracker)</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Link>
      </div>
    </div>
  );
};
