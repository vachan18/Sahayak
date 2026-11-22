import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QrCode, ShieldCheck, Printer, Download, ArrowRight, Share2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const CscSlipScreen: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-md mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Official Treasury-Style Slip Container */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-crisp-lg text-slate-900 relative">
        {/* Top Official Seal */}
        <div className="text-center pb-4 border-b border-slate-300">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto mb-1.5 font-bold text-lg">
            ಸ
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">
            Government of India • Welfare Administration
          </h2>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 mt-0.5">
            SEVA KENDRA PRE-VERIFIED SLIP
          </h1>
          <div className="text-[11px] font-mono font-bold bg-slate-100 py-1 px-3 rounded-full inline-block mt-2">
            TOKEN: {tokenId || 'KA-KISAN-2026-84920'}
          </div>
        </div>

        {/* QR Code Centerpiece */}
        <div className="my-6 text-center">
          <div className="w-48 h-48 mx-auto p-3 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center shadow-inner">
            {/* Visual Crisp QR Code Mock */}
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-3 text-white rounded-lg">
              <QrCode className="w-32 h-32" />
              <span className="text-[9px] font-mono tracking-widest mt-1">PRE-VERIFIED SECURE HASH</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-2">
            Show this QR code at any Grama One / CSC / Jan Seva Kendra
          </p>
        </div>

        {/* Mandatory Statutory Fee Box */}
        <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-dashed border-amber-600 text-amber-950 text-center mb-5">
          <div className="text-xs font-extrabold uppercase tracking-wide text-amber-900">
            ಶಾಸನಬದ್ಧ ಶುಲ್ಕ ರಕ್ಷಣೆ / STATUTORY FEE CAP
          </div>
          <div className="text-sm font-extrabold text-emerald-800 mt-0.5">
            ಸರ್ಕಾರಿ ಶುಲ್ಕ: ₹0.00 (ಉಚಿತ) | ಗರಿಷ್ಠ ಸಿಎಸ್‌ಸಿ ಶುಲ್ಕ: ₹30.00
          </div>
          <div className="text-[10px] text-amber-800 mt-0.5">
            (Govt Fee: ₹0.00 | Max Authorized CSC Convenience Fee: ₹30.00 only)
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="space-y-1.5 text-xs border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between text-slate-600">
            <span>Aadhaar eKYC:</span>
            <span className="font-bold text-emerald-700">✓ Pre-Verified</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Land Record (RTC):</span>
            <span className="font-bold text-emerald-700">✓ Linked</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Bank Account:</span>
            <span className="font-bold text-emerald-700">✓ NPCI Active</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>ಮುದ್ರಿಸಿ / Print Slip</span>
        </button>

        <Link
          to="/tracker"
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-center active:scale-95 transition-all"
        >
          <span>ಅರ್ಜಿ ಸ್ಥಿತಿ ನೋಡಿ (Tracker)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
