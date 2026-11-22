import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';

export const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('notificationsTitle', 'Alerts & Audio Updates')}
          </h1>
          <p className="text-xs text-slate-500">Live milestone updates, DBT credit notices, and scheme alerts</p>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsAsRead}
          className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-4 h-4" />
          <span>{t('markAllRead', 'Mark All Read')}</span>
        </button>
      </div>

      {/* Notifications Cards */}
      <div className="space-y-3.5">
        {notifications.map((item) => {
          const isUnread = !item.isRead;
          return (
            <article
              key={item.id}
              onClick={() => markNotificationAsRead(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isUnread
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {isUnread && <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.titleKey}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {item.summaryKey}
              </p>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <AudioListenButton textToSpeak={`${item.titleKey}. ${item.summaryKey}`} size="sm" />

                {item.actionUrl && (
                  <Link
                    to={item.actionUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy-900 dark:text-sky-400 hover:underline"
                  >
                    <span>{t('viewDetailsBtn', 'View Details')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
