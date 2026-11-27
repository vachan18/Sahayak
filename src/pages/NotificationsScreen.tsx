import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { PageHeader } from '../ui';
import { NotificationList } from '../components/tracker/NotificationList';

export const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl">
      <PageHeader title={t('tracker.n.title', 'Alerts')} description={t('tracker.n.subtitle')} />
      <NotificationList />
    </div>
  );
};

export default NotificationsScreen;
