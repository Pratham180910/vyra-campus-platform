export type NotificationType =
  | 'EVENT_REGISTERED'
  | 'EVENT_SAVED'
  | 'EVENT_UPCOMING'
  | 'COMMUNITY_ACTIVITY'
  | 'EVENT_UPDATE'
  | 'SYSTEM';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO 8601 string used for dynamic date grouping
  timeAgo: string;
  read: boolean;
  eventId?: string;
  clubId?: string;
  route?: string;
}

export type NotificationFilter = 'ALL' | 'UNREAD' | 'EVENTS' | 'COMMUNITIES';
