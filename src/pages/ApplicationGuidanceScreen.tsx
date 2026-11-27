import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';

export const ApplicationGuidanceScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { schemes, addApplication } = useAppStore();

  const [selectedPath, setSelectedPath] = useState<'online' | 'csc'>('csc');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scheme = schemes.find(s => s.id === id) || schemes[0];

  const handleProceed = () => {
    setIsSubmitting(true);
    const token = `KA-${scheme.id.toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      // Register into application store
      addApplication({
        id: `app-${Date.now()}`,
        tokenNumber: token,
        schemeId: scheme.id,
        schemeTitle: scheme.titleKey,
        submittedAt: "Today, Just now",
        currentStage: 1,
        statusBadge: "submitted",
        isDelayed: false,
        slaDeadlineDays: scheme.processingSlaDays,
        slaDaysRemaining: scheme.processingSlaDays,
        submittedVia: selectedPath === 'online' ? 'self_online' : 'csc_assisted',
        handlingOffice: scheme.handlingAuthorityKey,
        audioStatusNarrationKey: `Your application ${token} has been successfully acknowledged by the authority.`,
        milestones: [
          {
            stage: 1,
            titleKey: "Application Submitted & Acknowledged",
            date: "Today, Just now",
            isCompleted: true,
            isCurrent: true
          },
          {
            stage: 2,
            titleKey: "Revenue & Land Record Verification",
            date: "Upcoming (In 2 days)",
            isCompleted: false,
            isCurrent: false,
            handlingOfficer: scheme.handlingAuthorityKey
          },
          {
            stage: 3,
            titleKey: "Sanction Order Issuance",
            date: `Upcoming (Within ${scheme.processingSlaDays} days)`,
            isCompleted: false,
            isCurrent: false
          },
          {
            stage: 4,
            titleKey: "Direct Benefit Transfer (DBT Credit)",
            date: "Upcoming Disbursal Cycle",
            isCompleted: false,
            isCurrent: false
          }
        ]
      });

      if (selectedPath === 'csc') {
        navigate(`/csc-slip/${token}`);
      } else {
        navigate('/tracker');
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2 sm:py-4 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          {scheme.titleKey}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {t('guidanceTitle', 'Application Submission Guidance')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('guidanceSubtitle', 'Choose how you want to submit your application')}
        </p>
      </div>

      {/* Statutory Fee Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-dashed border-amber-400 text-amber-950 dark:text-amber-200">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Statutory Fee Transparency</span>
        </div>
        <p className="text-xs leading-relaxed">
          {t('statutoryFeeGuarantee', 'Government application fee is ₹0.00. The maximum authorized convenience charge at a CSC/Grama One is ₹30.00 only. Do not pay any extra agent fee.')}
        </p>
      </div>

      {/* Two Pathways Choice Cards */}
      <div className="space-y-4">
        {/* Option B: Assisted CSC Seva Kendra Slip (Recommended for Bharat) */}
        <div
          onClick={() => setSelectedPath('csc')}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            selectedPath === 'csc'
              ? 'border-brand-navy-900 dark:border-sky-500 bg-white dark:bg-slate-900 shadow-crisp-md ring-2 ring-brand-navy-900/10'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex-shrink-0 mt-0.5">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full mb-1">
                  ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ (Recommended)
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t('pathAssistedCsc', 'Option B: Assisted CSC Seva Kendra Slip')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {t('pathAssistedCscDesc', 'Generate an official pre-verified summary slip with QR code. Take it to any Gram Panchayat or Grama One centre.')}
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedPath === 'csc' ? 'border-brand-navy-900 bg-brand-navy-900 text-white' : 'border-slate-300'
            }`}>
              {selectedPath === 'csc' && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Option A: Self-Service Online */}
        <div
          onClick={() => setSelectedPath('online')}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            selectedPath === 'online'
              ? 'border-brand-navy-900 dark:border-sky-500 bg-white dark:bg-slate-900 shadow-crisp-md ring-2 ring-brand-navy-900/10'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 flex-shrink-0 mt-0.5">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t('pathSelfOnline', 'Option A: Self-Service Online')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {t('pathSelfOnlineDesc', 'Submit directly from this device using Aadhaar OTP e-Sign. Best if you have your own personal smartphone.')}
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedPath === 'online' ? 'border-brand-navy-900 bg-brand-navy-900 text-white' : 'border-slate-300'
            }`}>
              {selectedPath === 'online' && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Notice Disclaimer */}
      <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center px-4">
        {t('simulationNotice', 'Demonstration Mode: This simulates submission guidance and generates an authentic token. It does not file a real live legal affidavit.')}
      </div>

      {/* Master Submit CTA */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleProceed}
        className="w-full py-4 px-6 rounded-2xl bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-crisp-md active:scale-98 transition-all"
      >
        <span>
          {isSubmitting
            ? "ರಸೀದಿ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ (Generating...)"
            : selectedPath === 'csc'
            ? t('generateQrSlipBtn', 'Generate Official Seva Kendra Slip')
            : t('submitWithAadhaarBtn', 'Submit via Aadhaar e-Sign')}
        </span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
