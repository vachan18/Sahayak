import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertCircle, CheckCircle2, ChevronLeft, 
  Clock, AlertTriangle, PhoneCall, Plus, 
  Check, UserCheck, CreditCard, Printer 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { AudioListenButton } from '../components/feedback/AudioListenButton';
import { GrievanceGuidanceModal } from '../components/support/GrievanceGuidanceModal';

export const ApplicationTrackerDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { applications, addCitizenNote, resolveMissingDocument } = useAppStore();

  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);

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

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addCitizenNote(app.id, newNoteText.trim());
    setNewNoteText('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2 sm:py-4 animate-fadeIn">
      {/* Top back navigation */}
      <div>
        <Link
          to="/tracker"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('navBack', 'Back')}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-crisp-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {app.tokenNumber}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Filed on {app.submittedAt}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {app.schemeTitle}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Nodal Office: <strong>{app.handlingOffice}</strong> • Mode: <strong>{app.submittedVia === 'csc_assisted' ? 'Grama One / CSC Assisted' : 'Citizen Self-Filed'}</strong>
            </p>
          </div>

          <div className="self-start sm:self-center flex-shrink-0">
            <AudioListenButton textToSpeak={app.audioStatusNarrationKey} />
          </div>
        </div>

        {/* SLA Status Bar */}
        <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          app.isDelayed
            ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
            : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
        }`}>
          <div className="flex items-center gap-2 font-bold">
            {app.isDelayed ? <AlertCircle className="w-4 h-4 text-red-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
            <span>
              {app.isDelayed
                ? `Statutory SLA Overdue (${Math.abs(app.slaDaysRemaining)} days past legal limit)`
                : `Within Statutory Time Limit (${app.slaDaysRemaining} days remaining)`}
            </span>
          </div>
          <span className="text-[11px] font-medium opacity-90">
            Citizen Charter Target: {app.slaDeadlineDays} Working Days
          </span>
        </div>
      </div>

      {/* Citizen Self-Tracking Disclosure */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Citizen Self-Tracking Disclosure: </strong>
          Milestones shown reflect records generated during your application filing or CSC kiosk assistance. Official processing status is determined directly on the designated government department portal.
        </p>
      </div>

      {/* Missing Document Notice if any */}
      {app.missingDocuments && app.missingDocuments.some(d => !d.resolved) && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-700 space-y-3">
          <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-amber-950 dark:text-amber-200 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Missing Document Requirement</span>
          </div>
          {app.missingDocuments.filter(d => !d.resolved).map(doc => (
            <div key={doc.documentId} className="text-xs text-amber-900 dark:text-amber-300 space-y-1.5">
              <div>
                <strong>{doc.documentName}</strong>
              </div>
              <p className="text-[11px] leading-relaxed">
                {doc.reason} Requested by: <strong>{doc.requestedBy}</strong>.
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 font-medium text-[11px]">
                <strong>Action Needed:</strong> {doc.actionRequired}
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => resolveMissingDocument(app.id, doc.documentId)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
                >
                  Confirm Document Handover / Upload
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Four-Stage Vertical Milestone Progress Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-crisp-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Four-Stage Visual Lifecycle
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Timestamps and descriptions reflect verified administrative updates
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300">
            Stage {app.currentStage} of 4
          </span>
        </div>

        {/* Vertical Connected Timeline (Optimized for Mobile & Desktop) */}
        <div className="relative pl-7 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {app.milestones.map((m, idx) => {
            const isCompleted = m.isCompleted;
            const isCurrent = m.isCurrent;

            return (
              <div key={idx} className="relative">
                {/* Milestone Node Bead */}
                <div className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-[11px] transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-amber-600 border-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900 animate-pulse'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : m.stage}
                </div>

                {/* Milestone Content */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                      Stage {m.stage}: {m.titleKey}
                    </h3>
                    {m.isOfficial && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Official Record
                      </span>
                    )}
                  </div>

                  {/* Timestamp ONLY shown when actual info is available */}
                  {(m.date || m.timestamp) && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{m.date}{m.timestamp ? `, ${m.timestamp}` : ''}</span>
                    </div>
                  )}

                  {/* Handling Officer */}
                  {m.handlingOfficer && (
                    <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Action Officer: <strong>{m.handlingOfficer}</strong></span>
                    </div>
                  )}

                  {/* Description */}
                  {m.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                      {m.description}
                    </p>
                  )}

                  {/* Officer Remarks Box */}
                  {m.remarksKey && (
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-0.5 mt-2">
                      <div className="font-extrabold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300">
                        Official Officer Remarks:
                      </div>
                      <p>{m.remarksKey}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefit Disbursement Details Card if applicable */}
      {app.disbursementDetails && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-crisp-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-300">
                Benefit Disbursement Ledger
              </h3>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              app.disbursementDetails.status === 'credited'
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {app.disbursementDetails.status === 'credited' ? 'Disbursed / Active' : 'Pending Disbursal Cycle'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">Sanctioned Amount:</div>
              <div className="text-base font-black text-white mt-0.5">
                ₹{app.disbursementDetails.amount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">Target Credited Account / Card:</div>
              <div className="text-xs font-mono font-bold text-white mt-0.5">
                {app.disbursementDetails.accountMasked}
              </div>
            </div>
          </div>

          {app.disbursementDetails.utrNumber && (
            <div className="text-[11px] font-mono text-slate-400 pt-1">
              Statutory Transaction Hash / ID: {app.disbursementDetails.utrNumber}
            </div>
          )}
        </div>
      )}

      {/* Citizen Notes Section (User-Entered Notes vs Official Records) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-crisp-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Citizen Personal Activity Notes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record your kiosk visits, officer phone calls, or physical document submissions
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Private Notes
          </span>
        </div>

        {/* Anti-Deception Notice */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300">
          <strong>Important Notice:</strong> Personal notes recorded below are saved to your local device profile. They are <u>not</u> official government departmental communications and are not shared with inspecting officers.
        </div>

        {/* Existing Notes List */}
        {app.citizenNotes && app.citizenNotes.length > 0 ? (
          <div className="space-y-2.5">
            {app.citizenNotes.map((note) => (
              <div key={note.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{note.author}</span>
                  <span>{note.createdAt}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No citizen personal notes recorded yet.</p>
        )}

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label htmlFor="note-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Add Personal Note for this Application:
          </label>
          <div className="flex gap-2">
            <input
              id="note-input"
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g. Visited Grama One on 18th Nov; operator says verification pending with RI..."
              className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
            />
            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Note</span>
            </button>
          </div>
          {noteSuccess && (
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Note saved to your local profile.
            </div>
          )}
        </form>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => setIsGrievanceOpen(true)}
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm min-h-[48px]"
        >
          <PhoneCall className="w-4 h-4 flex-shrink-0" />
          <span>File Grievance / CPGRAMS Guide</span>
        </button>

        <Link
          to={`/csc-slip/${app.tokenNumber}?scheme=${app.schemeId}`}
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-center active:scale-95 transition-all min-h-[48px]"
        >
          <Printer className="w-4 h-4 flex-shrink-0" />
          <span>Print Kiosk Slip (ಮುದ್ರಿಸಿ)</span>
        </Link>
      </div>

      {/* Grievance Modal */}
      <GrievanceGuidanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        application={app}
      />
    </div>
  );
};
