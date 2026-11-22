import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, ShieldCheck, AlertCircle, CheckCircle2, ChevronLeft, 
  FileText, Download, Phone, ExternalLink 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';

export const ApplicationTrackerDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { applications } = useAppStore();

  const app = applications.find(a => a.id === id) || applications[0];

  if (!app) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Application Not Found</h2>
        <Link to="/tracker" className="text-amber-600 hover:underline text-sm font-semibold">
          Return to Tracker
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
            {app.tokenNumber}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            {app.schemeTitle}
          </h1>
          <p className="text-xs text-slate-500">Submitted on {app.submittedAt}</p>
        </div>

        <AudioListenButton textToSpeak={app.audioStatusNarrationKey} label="Listen to Status (ಕೇಳಿ)" />
      </div>

      {/* SLA Alert Box */}
      <div className={`p-4 rounded-2xl border ${
        app.isDelayed
          ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
          : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
      }`}>
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
          {app.isDelayed ? <AlertCircle className="w-4 h-4 text-red-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
          <span>{app.isDelayed ? 'Statutory SLA Deadline Breached' : 'Within Statutory Time Limit'}</span>
        </div>
        <p className="text-xs leading-relaxed">
          {app.isDelayed
            ? t('slaOverdue', 'SLA OVERDUE: Processing has exceeded statutory citizen charter time limit. You may escalate.')
            : `Statutory approval SLA is ${app.slaDeadlineDays} days. ${app.slaDaysRemaining} days remaining for final order.`}
        </p>
      </div>

      {/* Detailed Milestone History Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-crisp-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">
          Detailed Milestone Progress
        </h2>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {app.milestones.map((m, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                m.isCompleted
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : m.isCurrent
                  ? 'bg-amber-600 border-amber-600 text-white animate-pulse'
                  : 'bg-white dark:bg-slate-900 border-slate-300'
              }`}>
                {m.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {m.titleKey}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">{m.date}</div>

                {m.handlingOfficer && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                    Officer: <strong>{m.handlingOfficer}</strong>
                  </div>
                )}

                {m.remarksKey && (
                  <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 mt-2">
                    {m.remarksKey}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {app.isDelayed && (
          <button
            type="button"
            onClick={() => alert("Connecting to CPGRAMS (Centralized Public Grievance Redress and Monitoring System)...")}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{t('fileGrievanceBtn', 'File Official CPGRAMS Grievance')}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{t('downloadReceipt', 'Download Official Receipt')}</span>
        </button>
      </div>
    </div>
  );
};
