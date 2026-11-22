import React from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCheck, Bell, Clock, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { AudioListenButton } from '../feedback/AudioListenButton';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-crisp-xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 id="notif-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {t('notificationsTitle', 'Alerts & Audio Updates')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t('markAllRead', 'Mark All Read')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {notifications.map((item) => {
            const isUnread = !item.isRead;
            return (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUnread
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.titleKey}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {item.summaryKey}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <AudioListenButton textToSpeak={`${item.titleKey}. ${item.summaryKey}`} size="sm" />

                  {item.actionUrl && (
                    <Link
                      to={item.actionUrl}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy-900 dark:text-sky-400 hover:underline"
                    >
                      <span>{t('viewDetailsBtn', 'View Details')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
