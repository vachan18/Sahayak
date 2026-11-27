import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Sheet } from '../../ui/Sheet';
import { NotificationList } from '../tracker/NotificationList';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Alerts panel — bottom sheet on phones, side panel on desktop. Stays mounted so it can animate out. */
export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      title={t('tracker.n.title', 'Alerts')}
      description={t('tracker.n.subtitle')}
      closeLabel={t('navClose', 'Close')}
      desktop="side"
      size="md"
      footer={
        <Link to="/notifications" onClick={onClose} className="flex items-center justify-center gap-1.5 h-11 font-semibold text-neel-ink hover:underline underline-offset-4">
          {t('tracker.n.seeAll', 'See all alerts')}
          <ArrowRight size={16} weight="bold" className="flip-rtl" />
        </Link>
      }
    >
      <NotificationList onNavigate={onClose} />
    </Sheet>
  );
};

export default NotificationsModal;
