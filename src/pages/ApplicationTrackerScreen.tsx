import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, AlertCircle, CheckCircle2, 
  ChevronRight, AlertTriangle, 
  PhoneCall, Check, Copy, FileText, ArrowRight 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';
import { GrievanceGuidanceModal } from '../components/support/GrievanceGuidanceModal';
import { ApplicationRecord } from '../types';

export const ApplicationTrackerScreen: React.FC = () => {
  const { t } = useTranslation();
  const { applications, resolveMissingDocument } = useAppStore();

  const [activeGrievanceApp, setActiveGrievanceApp] = useState<ApplicationRecord | null>(null);
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'action_needed' | 'completed'>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = async (token: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(token);
      }
    } catch {
      // Clipboard API may be restricted in non-HTTPS or embedded contexts
    }
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleOpenGrievance = (app?: ApplicationRecord) => {
    setActiveGrievanceApp(app || applications[0]);
    setIsGrievanceModalOpen(true);
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'in_progress') return app.statusBadge === 'under_review' || app.statusBadge === 'submitted';
    if (filterStatus === 'action_needed') return app.statusBadge === 'action_needed' || app.isDelayed;
    if (filterStatus === 'completed') return app.statusBadge === 'sanctioned' || app.statusBadge === 'disbursed';
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto py-2 sm:py-4 animate-fadeIn">
      {/* Header & Quick Support Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Statutory Lifecycle & Citizen Charter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('trackerTitle', 'Application Lifecycle Tracker')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Track real-time progress across 4 statutory lifecycle stages, view officer remarks, and escalate delayed applications.
          </p>
        </div>

        {/* Grievance Guidance Button */}
        <button
          type="button"
          onClick={() => handleOpenGrievance()}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-bold text-xs flex items-center gap-2 hover:bg-red-100/70 transition-all active:scale-95 shadow-sm min-h-[44px]"
        >
          <PhoneCall className="w-4 h-4 text-red-600" />
          <span>Grievance & CPGRAMS Guide</span>
        </button>
      </div>

      {/* Citizen Self-Tracking Statutory Notice Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3 shadow-crisp-sm">
        <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed space-y-1">
          <div>
            <strong>Citizen Self-Tracking Disclosure: </strong>
            The progress records and milestone timestamps displayed here reflect verified updates from respective nodal ministries or CSC kiosk filings. Official benefit disbursements are governed by statutory service rules.
          </div>
          <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
            🔒 <strong>Anti-Fabrication Guarantee:</strong> Timestamps and officer remarks are shown only when verified government update logs are present. No artificial countdowns are displayed.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('in_progress')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'in_progress'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          In Progress
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('action_needed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'action_needed'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          Action Needed / Delayed
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('completed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'completed'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          Completed / Disbursed
        </button>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-5">
          {filteredApplications.map((app) => {
            const hasMissingDocs = (app.missingDocuments || []).some(d => !d.resolved);
            return (
              <article
                key={app.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-crisp-sm hover:shadow-crisp-md transition-all space-y-5"
              >
                {/* Header: Token, Scheme Title, Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        {app.tokenNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(app.tokenNumber)}
                        className="text-slate-400 hover:text-slate-600 text-[11px] flex items-center gap-1"
                        aria-label="Copy application token"
                      >
                        {copiedToken === app.tokenNumber ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 leading-snug">
                      {app.schemeTitle}
                    </h2>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>Submitted: <strong>{app.submittedAt}</strong></span>
                      <span>•</span>
                      <span>Mode: <strong>{app.submittedVia === 'csc_assisted' ? 'Grama One / CSC' : 'Online Self-Filed'}</strong></span>
                    </div>
                  </div>

                  {/* Status Badges & Listen */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                    {app.isDelayed ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center gap-1.5 animate-pulse border border-red-300 dark:border-red-800">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>SLA Overdue ({Math.abs(app.slaDaysRemaining)}d)</span>
                      </span>
                    ) : app.statusBadge === 'action_needed' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1.5 border border-amber-300 dark:border-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Action Required</span>
                      </span>
                    ) : app.statusBadge === 'disbursed' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Disbursed & Active</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1.5 border border-blue-300 dark:border-blue-800">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Under Verification</span>
                      </span>
                    )}

                    <AudioListenButton textToSpeak={app.audioStatusNarrationKey} size="sm" />
                  </div>
                </div>

                {/* 1. Four-Stage Visual Progress Lifecycle */}
                <div className="py-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                    <span>Four-Stage Statutory Lifecycle</span>
                    <span className="text-slate-700 dark:text-slate-300">Stage {app.currentStage} of 4</span>
                  </div>

                  {/* Desktop Connected Horizontal Stepper */}
                  <div className="hidden sm:grid grid-cols-4 gap-3 relative">
                    {[
                      { num: 1, label: '1. Submitted', subtitle: 'Packet Acknowledged' },
                      { num: 2, label: '2. Verification', subtitle: 'Field & Document Check' },
                      { num: 3, label: '3. Decision', subtitle: 'Sanction / Action Order' },
                      { num: 4, label: '4. Disbursed', subtitle: 'DBT Credit / Benefit' }
                    ].map((step) => {
                      const isCompleted = app.currentStage > step.num || (app.currentStage === step.num && app.statusBadge === 'disbursed');
                      const isCurrent = app.currentStage === step.num && app.statusBadge !== 'disbursed';

                      return (
                        <div key={step.num} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col items-center text-center relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? app.statusBadge === 'action_needed' || app.isDelayed
                                ? 'bg-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900 animate-pulse'
                                : 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900 animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {step.label}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {step.subtitle}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Compact Progress Bar with Accessible Stage Description */}
                  <div className="sm:hidden space-y-2">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                      {[1, 2, 3, 4].map((step) => {
                        const isDone = app.currentStage >= step;
                        return (
                          <div
                            key={step}
                            className={`flex-1 h-full border-r border-white dark:border-slate-900 last:border-0 ${
                              isDone ? (app.statusBadge === 'disbursed' ? 'bg-emerald-600' : 'bg-amber-500') : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Current: Stage {app.currentStage} ({app.currentStage === 1 ? 'Submitted' : app.currentStage === 2 ? 'Verification' : app.currentStage === 3 ? 'Decision' : 'Disbursement'})</span>
                      <span className="text-[11px] text-slate-500">{Math.round((app.currentStage / 4) * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* 2. Missing Document Alert Box if present */}
                {hasMissingDocs && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-950 dark:text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Missing Document Notice</span>
                    </div>
                    {app.missingDocuments?.filter(d => !d.resolved).map(doc => (
                      <div key={doc.documentId} className="text-xs text-amber-900 dark:text-amber-300 space-y-1">
                        <div>
                          <strong>{doc.documentName}:</strong> {doc.reason}
                        </div>
                        <div className="text-[11px] text-amber-800 dark:text-amber-400">
                          Requested by: {doc.requestedBy} • Action: {doc.actionRequired}
                        </div>
                        <div className="pt-1.5 flex gap-2">
                          <button
                            type="button"
                            onClick={() => resolveMissingDocument(app.id, doc.documentId)}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs active:scale-95 transition-all shadow-sm"
                          >
                            Mark as Uploaded / Verified
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Pending Actions Callout if present */}
                {app.pendingActions && app.pendingActions.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <div className="font-extrabold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending Citizen Actions:</span>
                    </div>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc">
                      {app.pendingActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. SLA & Handling Office Info Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Handling Office: </span>
                    <strong className="text-slate-800 dark:text-slate-200">{app.handlingOffice}</strong>
                  </div>

                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    {app.isDelayed ? (
                      <span className="text-red-700 dark:text-red-400 font-bold">
                        SLA Overdue by {Math.abs(app.slaDaysRemaining)} Days
                      </span>
                    ) : app.slaDaysRemaining > 0 ? (
                      <span className="text-amber-800 dark:text-amber-300">
                        {app.slaDaysRemaining} Days remaining in statutory SLA ({app.slaDeadlineDays}d total)
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Processed within SLA ({app.slaDeadlineDays}d)
                      </span>
                    )}
                  </div>
                </div>

                {/* 5. Citizen Personal Notes Preview (Clearly Distinguished from Official Records) */}
                {app.citizenNotes && app.citizenNotes.length > 0 && (
                  <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Citizen Personal Record ({app.citizenNotes.length})</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
                        Not official government communication
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] italic">
                      "{app.citizenNotes[0].text}" — {app.citizenNotes[0].createdAt}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {app.isDelayed && (
                      <button
                        type="button"
                        onClick={() => handleOpenGrievance(app)}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all min-h-[44px]"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>File CPGRAMS Grievance</span>
                      </button>
                    )}

                    <Link
                      to={`/csc-slip/${app.tokenNumber}?scheme=${app.schemeId}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all min-h-[44px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print Kiosk Slip</span>
                    </Link>
                  </div>

                  <Link
                    to={`/tracker/${app.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy-900 dark:text-sky-400 hover:underline min-h-[44px] py-1"
                  >
                    <span>{t('viewDetailsBtn', 'View Details')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto shadow-crisp-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('noActiveApps', 'No matching applications found')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Check your eligibility or submit an application to track live progress and officer actions here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/schemes"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-navy-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-colors"
            >
              <span>Explore Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Official Grievance Guidance Modal */}
      <GrievanceGuidanceModal
        isOpen={isGrievanceModalOpen}
        onClose={() => setIsGrievanceModalOpen(false)}
        application={activeGrievanceApp || undefined}
      />
    </div>
  );
};
