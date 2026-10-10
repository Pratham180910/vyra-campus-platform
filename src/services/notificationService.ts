import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { NotificationItem, NotificationType } from '../types/notification';

/**
 * Connected Notification Service
 *
 * Synchronizes user notifications directly with Supabase public.notifications.
 * Provides real-time read/dismiss persistence, calculates dynamic relative time,
 * and preserves proper routing to event and club destinations.
 */

type NotificationListener = (notifications: NotificationItem[]) => void;

function formatTimeAgo(isoString: string): string {
  try {
    const diff = Math.max(0, Date.now() - new Date(isoString).getTime());
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  } catch {
    return 'Recent';
  }
}

interface DbNotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  event_id?: string | null;
  club_id?: string | null;
  read: boolean;
  created_at: string;
}

function mapDbNotification(row: DbNotificationRow): NotificationItem {
  let route = '/dashboard';
  if (row.event_id) {
    route = `/events/${row.event_id}`;
  } else if (row.club_id) {
    route = `/clubs/${row.club_id}`;
  }

  const timestamp = row.created_at || new Date().toISOString();

  return {
    id: row.id,
    type: (row.type as NotificationType) || 'SYSTEM',
    title: row.title,
    message: row.message,
    timestamp,
    timeAgo: formatTimeAgo(timestamp),
    read: Boolean(row.read),
    eventId: row.event_id || undefined,
    clubId: row.club_id || undefined,
    route,
  };
}

class NotificationService {
  private notifications: NotificationItem[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private currentUserId: string | null = null;
  private isLoading = false;

  public getLoadingState(): boolean {
    return this.isLoading;
  }

  private notifyListeners(): void {
    const copy = [...this.notifications];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch {
        // Prevent listener error from breaking service
      }
    });
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Synchronize notifications with Supabase for the authenticated user.
   */
  async syncUserNotifications(userId: string | null): Promise<NotificationItem[]> {
    this.currentUserId = userId;

    if (!userId || !isSupabaseConfigured) {
      this.notifications = [];
      this.notifyListeners();
      return [];
    }

    this.isLoading = true;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[VYRA:Notifications] Error fetching from Supabase:', error.message);
        return [...this.notifications];
      }

      if (data && data.length > 0) {
        this.notifications = (data as DbNotificationRow[]).map(mapDbNotification);
      } else {
        this.notifications = [];
      }

      this.notifyListeners();
    } catch (err) {
      console.warn('[VYRA:Notifications] Sync error:', err);
    } finally {
      this.isLoading = false;
    }

    return [...this.notifications];
  }

  getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    this.notifications = this.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notifyListeners();

    if (this.currentUserId && isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId)
          .eq('user_id', this.currentUserId);
      } catch (err) {
        console.warn('[VYRA:Notifications] Failed to persist markAsRead:', err);
      }
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notifyListeners();

    if (this.currentUserId && isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', this.currentUserId);
      } catch (err) {
        console.warn('[VYRA:Notifications] Failed to persist markAllAsRead:', err);
      }
    }
  }

  async clearNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.notifyListeners();

    if (this.currentUserId && isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId)
          .eq('user_id', this.currentUserId);
      } catch (err) {
        console.warn('[VYRA:Notifications] Failed to persist clearNotification:', err);
      }
    }
  }

  resetToDefaults(): void {
    if (this.currentUserId) {
      this.syncUserNotifications(this.currentUserId);
    }
  }
}

export const notificationService = new NotificationService();
