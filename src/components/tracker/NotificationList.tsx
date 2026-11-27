import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Path, Clock, Gift, FileText, Check, Checks, BellSimple, type Icon } from '@phosphor-icons/react';
import type { NotificationItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { ListenButton } from '../../ui/ListenButton';
import { EmptyState } from '../../ui/Feedback';
import { toneTint, type Tone } from '../../ui/Surface';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';

const TYPE: Record<NotificationItem['type'], { icon: Icon; tone: Tone }> = {
  status_update: { icon: Path, tone: 'neel' },
  urgent_deadline: { icon: Clock, tone: 'kesar' },
  new_scheme: { icon: Gift, tone: 'patti' },
  document_alert: { icon: FileText, tone: 'sindoor' },
};

const isToday = (ts: string) => /just|min|hour|today/i.test(ts);

function Row({ n, onNavigate }: { n: NotificationItem; onNavigate?: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { markNotificationAsRead } = useAppStore();
  const meta = TYPE[n.type] ?? TYPE.status_update;
  const Icon = meta.icon;
  const x = useMotionValue(0);
  const revealOpacity = useTransform(x, [-110, -30, 0, 30, 110], [1, 0.3, 0, 0.3, 1]);
  const title = t(n.titleKey, n.titleKey);
  const summary = t(n.summaryKey, n.summaryKey);

  const markRead = () => {
    if (n.isRead) return;
    haptic('success');
    markNotificationAsRead(n.id);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 700) markRead();
  };

  const open = () => {
    markRead();
    if (n.actionUrl) {
      onNavigate?.();
      navigate(n.actionUrl);
    }
  };

  return (
    <motion.li layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative rounded-lg overflow-hidden">
      {/* Revealed behind the card while swiping */}
      <motion.div style={{ opacity: revealOpacity }} className="absolute inset-0 bg-patti text-white flex items-center justify-between px-6" aria-hidden>
        <Checks size={24} weight="bold" />
        <Checks size={24} weight="bold" />
      </motion.div>
      <motion.div
        drag={n.isRead ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.55}
        dragSnapToOrigin
        style={{ x }}
        onDragEnd={onDragEnd}
        className={cx('relative flex gap-3.5 p-4 rounded-lg transition-colors', n.isRead ? 'bg-surface shadow-hair' : 'bg-surface shadow-lift')}
      >
        <span className={cx('relative w-11 h-11 rounded-md grid place-items-center shrink-0', toneTint[meta.tone])}>
          <Icon size={22} weight="duotone" />
          {!n.isRead && <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-sindoor ring-2 ring-surface" aria-hidden />}
        </span>
        <div className="flex-1 min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 text-micro text-ink-3">
            <span className="font-semibold">{t(`tracker.n.type.${n.type}`)}</span>
            <span aria-hidden>·</span>
            <span>{n.timestamp}</span>
            {!n.isRead && <span className="sr-only">{t('tracker.n.unread', 'New')}</span>}
          </p>
          <button type="button" onClick={open} className={cx('block text-start mt-0.5 font-semibold leading-snug hover:underline underline-offset-4', n.isRead && 'text-ink-2')}>
            {title}
          </button>
          <p className="text-small text-ink-2 mt-1">{summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ListenButton text={`${title}. ${summary}`} />
            {!n.isRead && (
              <button type="button" onClick={markRead} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full text-small font-semibold text-ink-2 hover:bg-sunken">
                <Check size={16} weight="bold" /> {t('tracker.n.markRead', 'Mark as read')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

/** Grouped alert list (Today / Earlier) with swipe-to-read and an always-visible button alternative. */
export function NotificationList({ onNavigate, showHeaderActions = true }: { onNavigate?: () => void; showHeaderActions?: boolean }) {
  const { t } = useTranslation();
  const { notifications, markAllNotificationsAsRead, pushToast } = useAppStore();
  const unread = notifications.filter((n) => !n.isRead).length;
  const groups = [
    { key: 'today', label: t('tracker.n.today', 'Today'), items: notifications.filter((n) => isToday(n.timestamp)) },
    { key: 'earlier', label: t('tracker.n.earlier', 'Earlier'), items: notifications.filter((n) => !isToday(n.timestamp)) },
  ].filter((g) => g.items.length);

  if (!notifications.length) {
    return <EmptyState icon={<BellSimple size={30} weight="duotone" />} title={t('tracker.n.emptyTitle', 'You are all caught up')} body={t('tracker.n.emptyBody')} />;
  }

  return (
    <div>
      {showHeaderActions && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <p className="text-micro text-ink-3 lg:hidden">{t('tracker.n.swipeHint', 'Swipe an alert sideways to mark it read')}</p>
          <button
            type="button"
            disabled={!unread}
            onClick={() => {
              markAllNotificationsAsRead();
              haptic('success');
              pushToast({ message: t('tracker.n.allRead', 'All alerts marked as read'), tone: 'success' });
            }}
            className="ms-auto inline-flex items-center gap-1.5 h-10 px-3 rounded-full text-small font-semibold text-neel-ink hover:bg-neel-tint disabled:opacity-40 disabled:pointer-events-none"
          >
            <Checks size={18} weight="bold" /> {t('tracker.n.markAll', 'Mark all as read')}
          </button>
        </div>
      )}
      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g.key} aria-label={g.label}>
            <h3 className="text-small font-semibold text-ink-3 mb-2.5">{g.label}</h3>
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {g.items.map((n) => (
                  <Row key={n.id} n={n} onNavigate={onNavigate} />
                ))}
              </AnimatePresence>
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
