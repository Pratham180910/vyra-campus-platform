import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { OrganizerEvent, OrganizerEventStatus } from '../types/organizer';
import type { DbEventRow } from './eventService';

function normalizeDbToOrganizer(row: DbEventRow): OrganizerEvent {
  const status: OrganizerEventStatus =
    row.status === 'published' ? 'PUBLISHED' : row.status === 'closed' ? 'CLOSED' : 'DRAFT';

  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || undefined,
    shortDescription: row.subtitle || row.description.substring(0, 100),
    description: row.description,
    category: (['Hackathons', 'Cultural', 'Workshops', 'Sports', 'Tech', 'Competitions', 'Social'].includes(row.category)
      ? row.category
      : 'Tech') as OrganizerEvent['category'],
    eventType: row.event_type === 'Paid' ? 'Paid' : 'Free',
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time || '',
    time: row.end_time ? `${row.start_time} - ${row.end_time}` : `${row.start_time} IST`,
    venue: row.venue,
    organizer: 'Campus Organization',
    capacity: row.capacity || 500,
    maxCapacity: row.capacity || 500,
    registrations: 0,
    registrationCount: 0,
    status,
    badge: status === 'PUBLISHED' ? 'LIVE' : status === 'DRAFT' ? 'DRAFT' : 'CLOSED',
    image: row.cover_image || '/images/events/hacksrm.jpg',
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.created_at,
  };
}

class OrganizerEventService {
  private events: OrganizerEvent[] = [];
  private listeners: Set<() => void> = new Set();
  private currentUserId: string | null = null;
  private isLoading = false;

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Sync events owned by the authenticated organizer from Supabase public.events
   */
  public async syncOrganizerEvents(userId: string | null): Promise<OrganizerEvent[]> {
    this.currentUserId = userId;
    if (!userId || !isSupabaseConfigured) {
      this.events = [];
      this.notify();
      return [];
    }

    this.isLoading = true;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[VYRA:Organizer] Error loading organizer events:', error.message);
        this.isLoading = false;
        return this.events;
      }

      if (data && data.length > 0) {
        const eventIds = data.map((e) => e.id);
        const regCounts: Record<string, number> = {};

        try {
          const { data: regRows } = await supabase
            .from('registrations')
            .select('event_id')
            .in('event_id', eventIds);

          if (regRows) {
            regRows.forEach((r: { event_id: string }) => {
              regCounts[r.event_id] = (regCounts[r.event_id] || 0) + 1;
            });
          }
        } catch {
          // ignore registration count query error
        }

        this.events = (data as DbEventRow[]).map((row) => {
          const item = normalizeDbToOrganizer(row);
          const count = regCounts[row.id] || 0;
          item.registrations = count;
          item.registrationCount = count;
          return item;
        });
      } else {
        this.events = [];
      }

      this.notify();
    } catch (err) {
      console.warn('[VYRA:Organizer] Sync error:', err);
    } finally {
      this.isLoading = false;
    }

    return this.events;
  }

  public getAllEvents(): OrganizerEvent[] {
    return [...this.events];
  }

  public getEventById(id: string): OrganizerEvent | undefined {
    return this.events.find((ev) => ev.id === id);
  }

  /**
   * Create new event in Supabase
   */
  public async createEvent(
    data: Omit<OrganizerEvent, 'id' | 'createdAt' | 'updatedAt' | 'registrations'>,
    userId?: string | null
  ): Promise<OrganizerEvent> {
    const targetUserId = userId || this.currentUserId;
    if (!targetUserId || !isSupabaseConfigured) {
      throw new Error('Organizer authentication required to create campus events.');
    }

    const cleanSlug = `${data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

    const newId = cleanSlug;

    const insertPayload = {
      id: newId,
      slug: cleanSlug,
      title: data.title.trim(),
      subtitle: data.subtitle?.trim() || null,
      description: data.description.trim(),
      category: data.category,
      event_type: data.eventType || 'Free',
      date: data.date.includes('-') ? data.date : new Date().toISOString().split('T')[0],
      start_time: data.startTime || '09:00 AM',
      end_time: data.endTime || null,
      venue: data.venue.trim(),
      organizer_id: targetUserId,
      capacity: data.capacity || 500,
      cover_image: data.image || null,
      status: data.status?.toLowerCase() === 'published' ? 'published' : 'draft',
      tags: data.tags || [],
    };

    const { data: inserted, error } = await supabase
      .from('events')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      console.error('[VYRA:Organizer] DB insert error:', error.message);
      throw new Error(error.message);
    }

    const created = normalizeDbToOrganizer(inserted as DbEventRow);
    this.events = [created, ...this.events];
    this.notify();
    return created;
  }

  /**
   * Save draft in Supabase
   */
  public async saveDraft(
    data: Partial<OrganizerEvent>,
    userId?: string | null
  ): Promise<OrganizerEvent> {
    const targetUserId = userId || this.currentUserId;
    if (data.id) {
      return this.updateEvent(data.id, { ...data, status: 'DRAFT' }, targetUserId);
    }

    const cleanSlug = `draft-${Date.now().toString().slice(-6)}`;
    const newId = cleanSlug;

    const insertPayload = {
      id: newId,
      slug: cleanSlug,
      title: (data.title || 'Untitled Draft Event').trim(),
      subtitle: data.subtitle?.trim() || null,
      description: (data.description || data.shortDescription || 'Draft event notes').trim(),
      category: data.category || 'Tech',
      event_type: data.eventType || 'Free',
      date: data.date || new Date().toISOString().split('T')[0],
      start_time: data.startTime || '09:00 AM',
      end_time: data.endTime || null,
      venue: (data.venue || 'TBA').trim(),
      organizer_id: targetUserId,
      capacity: data.capacity || 100,
      cover_image: data.image || null,
      status: 'draft',
      tags: data.tags || [],
    };

    const { data: inserted, error } = await supabase
      .from('events')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      console.error('[VYRA:Organizer] DB draft error:', error.message);
      throw new Error(error.message);
    }

    const created = normalizeDbToOrganizer(inserted as DbEventRow);
    this.events = [created, ...this.events];
    this.notify();
    return created;
  }

  /**
   * Update existing event in Supabase
   */
  public async updateEvent(
    id: string,
    updates: Partial<OrganizerEvent>,
    userId?: string | null
  ): Promise<OrganizerEvent> {
    const targetUserId = userId || this.currentUserId;
    if (!targetUserId || !isSupabaseConfigured) {
      throw new Error('Organizer authentication required.');
    }

    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.title) dbUpdates.title = updates.title.trim();
    if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle?.trim() || null;
    if (updates.description) dbUpdates.description = updates.description.trim();
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.venue) dbUpdates.venue = updates.venue.trim();
    if (updates.capacity) dbUpdates.capacity = updates.capacity;
    if (updates.status) dbUpdates.status = updates.status.toLowerCase();
    if (updates.date) dbUpdates.date = updates.date;
    if (updates.startTime) dbUpdates.start_time = updates.startTime;
    if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime || null;
    if (updates.image) dbUpdates.cover_image = updates.image;
    if (updates.tags) dbUpdates.tags = updates.tags;

    const { data: updatedData, error } = await supabase
      .from('events')
      .update(dbUpdates)
      .eq('id', id)
      .eq('organizer_id', targetUserId)
      .select('*')
      .single();

    if (error) {
      console.error('[VYRA:Organizer] Update error:', error.message);
      throw new Error(error.message);
    }

    const updated = normalizeDbToOrganizer(updatedData as DbEventRow);
    const existingIndex = this.events.findIndex((e) => e.id === id);
    if (existingIndex !== -1) {
      this.events[existingIndex] = { ...this.events[existingIndex], ...updated };
    } else {
      this.events.unshift(updated);
    }

    this.notify();
    return updated;
  }

  public async setStatus(
    id: string,
    status: OrganizerEventStatus,
    userId?: string | null
  ): Promise<OrganizerEvent> {
    return this.updateEvent(
      id,
      {
        status,
        badge: status === 'PUBLISHED' ? 'LIVE' : status === 'DRAFT' ? 'DRAFT' : 'CLOSED',
      },
      userId
    );
  }

  public async deleteEvent(id: string, userId?: string | null): Promise<boolean> {
    const targetUserId = userId || this.currentUserId;
    if (!targetUserId || !isSupabaseConfigured) {
      throw new Error('Organizer authentication required.');
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('organizer_id', targetUserId);

    if (error) {
      console.error('[VYRA:Organizer] Delete error:', error.message);
      throw new Error(error.message);
    }

    this.events = this.events.filter((ev) => ev.id !== id);
    this.notify();
    return true;
  }

  public async duplicateEvent(id: string, userId?: string | null): Promise<OrganizerEvent | null> {
    const original = this.getEventById(id);
    if (!original) return null;
    return this.saveDraft(
      {
        ...original,
        id: undefined,
        title: `${original.title} (Copy)`,
        status: 'DRAFT',
      },
      userId
    );
  }
}

export const organizerEventService = new OrganizerEventService();
