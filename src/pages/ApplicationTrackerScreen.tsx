import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';

export const ApplicationTrackerScreen: React.FC = () => {
  const { t, language } = useTranslation();
  const { applications } = useAppStore();

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('trackerTitle', 'Application Lifecycle Tracker')}
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
          {t('trackerSubtitle', 'Track real-time progress, officer handling, and statutory SLA timelines.')}
        </p>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <article
              key={app.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-crisp-sm hover:shadow-crisp-md transition-all space-y-4"
            >
              {/* Header: Token & Status Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                    {app.tokenNumber}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {app.schemeTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {app.isDelayed ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>SLA Overdue</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      In Progress (ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ)
                    </span>
                  )}
                  <AudioListenButton textToSpeak={app.audioStatusNarrationKey} size="sm" />
                </div>
              </div>

              {/* 4-Stage Visual Progress Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 relative">
                  {[1, 2, 3, 4].map((stepNum) => {
                    const isCompleted = app.currentStage > stepNum || (app.currentStage === stepNum && stepNum === 4);
                    const isCurrent = app.currentStage === stepNum && stepNum !== 4;

                    return (
                      <div key={stepNum} className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-1">
                          {stepNum === 1 ? 'Submitted' : stepNum === 2 ? 'Verification' : stepNum === 3 ? 'Sanction' : 'DBT Credit'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SLA & Handling Office Info Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Handling Office: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{app.handlingOffice}</strong>
                </div>

                <div className="flex items-center gap-1 font-semibold text-amber-800 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {app.slaDaysRemaining > 0 
                      ? `${app.slaDaysRemaining} ${t('daysRemaining', 'days remaining')}`
                      : 'Deadline Exceeded'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {app.isDelayed && (
                  <button
                    type="button"
                    onClick={() => alert("Redirecting to CPGRAMS Portal (pgportal.gov.in) with grievance docket...")}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('fileGrievanceBtn', 'File Grievance')}</span>
                  </button>
                )}

                <Link
                  to={`/tracker/${app.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy-900 dark:text-sky-400 hover:underline ml-auto"
                >
                  <span>View Milestone History (ಸಂಪೂರ್ಣ ವಿವರ)</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Clock className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('noActiveApps', 'No active applications found')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Check your eligibility or submit an application to track live progress here.
          </p>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy-900 text-white font-bold text-xs"
          >
            <span>Explore Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
