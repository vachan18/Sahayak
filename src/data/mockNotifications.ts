import { NotificationItem } from '../types';

export const mockNotificationsData: NotificationItem[] = [
  {
    id: "notif-1",
    titleKey: "PM-KISAN Status Update",
    summaryKey: "Your land record has been verified by the Revenue Inspector. File forwarded to Tahsildar for final sanction.",
    timestamp: "2 hours ago",
    type: "status_update",
    isRead: false,
    actionUrl: "/tracker/app-kisan-84920"
  },
  {
    id: "notif-2",
    titleKey: "Urgent: PM SVANidhi Overdue Alert",
    summaryKey: "Your loan application has exceeded the 14-day statutory SLA. Tap to file a 1-click CPGRAMS complaint.",
    timestamp: "1 day ago",
    type: "urgent_deadline",
    isRead: false,
    actionUrl: "/tracker/app-svanidhi-9481"
  },
  {
    id: "notif-3",
    titleKey: "New Scheme Matching Your Family",
    summaryKey: "Ayushman Bharat PM-JAY is now available for all senior citizens above 70 in your household without income limit.",
    timestamp: "3 days ago",
    type: "new_scheme",
    isRead: true,
    actionUrl: "/schemes/pm-jay"
  }
];
