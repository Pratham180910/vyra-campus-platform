import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { EventItem } from '../types';
import { normalizeDbEvent, type DbEventRow } from './eventService';

/**
 * Connected Saved Events Service
 *
 * Integrates directly with Supabase public.saved_events for authenticated users.
 * Automatically synchronizes with local reactive listeners and provides a
 * graceful fallback for guest preview discovery.
 */

const STORAGE_KEY = 'vyra_saved_events';
type SavedEventsListener = (savedIds: string[]) => void;

class SavedEventsService {
  private savedIds: Set<string> = new Set();
  private listeners: Set<SavedEventsListener> = new Set();
  private currentUserId: string | null = null;
  private isLoading = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            this.savedIds = new Set(parsed.filter((id): id is string => typeof id === 'string'));
          }
        }
      }
    } catch {
      this.savedIds = new Set();
    }
  }

  private persistToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this.savedIds)));
      }
    } catch {
      // Storage write error ignored
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const ids = Array.from(this.savedIds);
    this.listeners.forEach((listener) => {
      try {
        listener(ids);
      } catch {
        // Listener error ignored
      }
    });
  }

  /**
   * Synchronize saved events with the authenticated user's Supabase records.
   */
  async syncUserSavedEvents(userId: string | null): Promise<string[]> {
    this.currentUserId = userId;

    if (!userId || !isSupabaseConfigured) {
      this.loadFromStorage();
      this.notifyListeners();
      return Array.from(this.savedIds);
    }

    this.isLoading = true;
    try {
      const { data, error } = await supabase
        .from('saved_events')
        .select('event_id')
        .eq('user_id', userId);

      if (error) {
        console.warn('[VYRA:SavedEvents] Failed to fetch saved events from Supabase:', error.message);
        return Array.from(this.savedIds);
      }

      if (data) {
        const dbIds = data.map((row: { event_id: string }) => row.event_id).filter(Boolean);
        this.savedIds = new Set(dbIds);
        this.persistToStorage();
      }
    } catch (err: unknown) {
      console.warn('[VYRA:SavedEvents] Error syncing saved events:', err);
    } finally {
      this.isLoading = false;
    }

    return Array.from(this.savedIds);
  }

  subscribe(listener: SavedEventsListener): () => void {
    this.listeners.add(listener);
    listener(Array.from(this.savedIds));
    return () => {
      this.listeners.delete(listener);
    };
  }

  isEventSaved(eventId: string): boolean {
    return this.savedIds.has(eventId);
  }

  /**
   * Save an event to Supabase and local state.
   */
  async saveEvent(eventId: string, userId?: string | null): Promise<boolean> {
    if (!eventId) return false;

    // Optimistic local update
    this.savedIds.add(eventId);
    this.persistToStorage();

    const targetUserId = userId || this.currentUserId;
    if (targetUserId && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('saved_events').insert({
          event_id: eventId,
          user_id: targetUserId,
        });

        if (error && error.code !== '23505') {
          console.warn('[VYRA:SavedEvents] DB insert error:', error.message);
          // Rollback local optimistic state if rejected by DB
          this.savedIds.delete(eventId);
          this.persistToStorage();
          return false;
        }
      } catch (err) {
        console.warn('[VYRA:SavedEvents] Network error saving event:', err);
        this.savedIds.delete(eventId);
        this.persistToStorage();
        return false;
      }
    }

    return true;
  }

  /**
   * Unsave an event from Supabase and local state.
   */
  async unsaveEvent(eventId: string, userId?: string | null): Promise<boolean> {
    if (!eventId) return false;

    // Optimistic local update
    const removed = this.savedIds.delete(eventId);
    if (removed) {
      this.persistToStorage();
    }

    const targetUserId = userId || this.currentUserId;
    if (targetUserId && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('saved_events')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', targetUserId);

        if (error) {
          console.warn('[VYRA:SavedEvents] DB delete error:', error.message);
          // Revert removal on delete failure
          this.savedIds.add(eventId);
          this.persistToStorage();
          return false;
        }
      } catch (err) {
        console.warn('[VYRA:SavedEvents] Network error unsaving event:', err);
        this.savedIds.add(eventId);
        this.persistToStorage();
        return false;
      }
    }

    return removed;
  }

  /**
   * Toggle saved status of an event.
   */
  async toggleSavedEvent(eventId: string, userId?: string | null): Promise<boolean> {
    if (this.isEventSaved(eventId)) {
      await this.unsaveEvent(eventId, userId);
      return false;
    } else {
      await this.saveEvent(eventId, userId);
      return true;
    }
  }

  getSavedEventIds(): string[] {
    return Array.from(this.savedIds);
  }

  async clearSavedEvents(userId?: string | null): Promise<void> {
    const targetUserId = userId || this.currentUserId;
    this.savedIds.clear();
    this.persistToStorage();

    if (targetUserId && isSupabaseConfigured) {
      try {
        await supabase.from('saved_events').delete().eq('user_id', targetUserId);
      } catch (err) {
        console.warn('[VYRA:SavedEvents] Failed to clear DB saved events:', err);
      }
    }
  }

  /**
   * Fetch full EventItem records for the user's saved events from Supabase
   */
  async getSavedEventsDetailed(userId?: string | null): Promise<EventItem[]> {
    const targetUserId = userId || this.currentUserId;
    if (!targetUserId || !isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('saved_events')
        .select(`
          event_id,
          events (*)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        if (error) console.warn('[VYRA:SavedEvents] Error fetching detailed saved events:', error.message);
        return [];
      }

      return data
        .map((row: any) => row.events ? normalizeDbEvent(row.events as DbEventRow) : null)
        .filter((e): e is EventItem => Boolean(e));
    } catch (err) {
      console.warn('[VYRA:SavedEvents] Failed to load saved events detailed:', err);
      return [];
    }
  }

  getLoadingState(): boolean {
    return this.isLoading;
  }
}

export const savedEventsService = new SavedEventsService();
