import { createContext } from 'react';
import type { NotificationItem } from '../types/notification';

export interface NotificationsContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  resetToDefaults: () => void;
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);
