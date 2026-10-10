import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';
import { NotificationsContext } from './notificationContextDefinition';
import type { NotificationItem } from '../types/notification';

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    notificationService.getNotifications()
  );

  // Sync notifications with Supabase for authenticated user
  useEffect(() => {
    notificationService.syncUserNotifications(user?.id ?? null);
  }, [user?.id]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updated) => {
      setNotifications(updated);
    });
    return unsubscribe;
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId);
  }, []);

  const markAllAsRead = useCallback(() => {
    notificationService.markAllAsRead();
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    notificationService.clearNotification(notificationId);
  }, []);

  const resetToDefaults = useCallback(() => {
    notificationService.resetToDefaults();
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotification,
      resetToDefaults,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, resetToDefaults]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
