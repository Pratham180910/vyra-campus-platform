import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { EventItem } from '../types';

export interface DbEventRow {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string | null;
  description: string;
  category: string;
  event_type: string;
  date: string;
  start_time: string;
  end_time?: string | null;
  venue: string;
  organizer_id?: string | null;
  club_id?: string | null;
  capacity?: number | null;
  cover_image?: string | null;
  status: string;
  tags?: string[] | null;
  created_at: string;
  registrations?: { count: number }[];
}

function formatEventDate(dateStr: string): string {
  if (!dateStr) return 'TBA';
  if (dateStr.includes('-') && dateStr.length === 10) {
    const d = new Date(dateStr + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
  }
  return dateStr;
}

export function normalizeDbEvent(row: DbEventRow): EventItem {
  const category = (
    ['Hackathons', 'Cultural', 'Workshops', 'Sports', 'Tech', 'Competitions', 'Social'].includes(row.category)
      ? row.category
      : 'Tech'
  ) as EventItem['category'];

  const timeFormatted = row.end_time
    ? `${row.start_time} - ${row.end_time}`
    : `${row.start_time} IST`;

  const capacity = row.capacity || 500;
  const regCount = row.registrations && row.registrations.length > 0 ? row.registrations[0].count : 0;

  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || undefined,
    category,
    description: row.description,
    date: formatEventDate(row.date),
    time: timeFormatted,
    venue: row.venue,
    registrations: regCount,
    registrationCount: regCount,
    maxCapacity: capacity,
    badge: row.status === 'published' ? undefined : row.status.toUpperCase(),
    image: row.cover_image || '/images/events/hacksrm.jpg',
    featured: true,
    organizer: row.club_id || 'Campus Organization',
    eventType: (row.event_type === 'Paid' ? 'Paid' : 'Free'),
    tags: Array.isArray(row.tags) ? row.tags : [],
    dateCategory: 'this_month',
    createdAt: row.created_at,
  };
}

class EventService {
  private cache: EventItem[] | null = null;

  public getCachedEvents(): EventItem[] | null {
    return this.cache;
  }

  /**
   * Fetch all published events from Supabase public.events
   */
  async getPublishedEvents(): Promise<{ data: EventItem[]; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { data: [], error: 'Supabase is not configured.' };
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: true });

      if (error) {
        console.warn('[VYRA:EventService] Failed to fetch events from Supabase:', error.message);
        return { data: [], error: error.message };
      }

      if (!data) {
        return { data: [], error: null };
      }

      const normalized = (data as DbEventRow[]).map(normalizeDbEvent);
      this.cache = normalized;
      return { data: normalized, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error loading events.';
      return { data: [], error: message };
    }
  }

  /**
   * Fetch a single event by ID or slug
   */
  async getEventById(id: string): Promise<{ data: EventItem | null; error: string | null }> {
    if (!id || !isSupabaseConfigured) {
      return { data: null, error: 'Event ID missing or Supabase unconfigured.' };
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: null };
      }

      return { data: normalizeDbEvent(data as DbEventRow), error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching event.';
      return { data: null, error: message };
    }
  }

  /**
   * Fetch related events by category
   */
  async getRelatedEvents(currentId: string, category?: string, limit = 3): Promise<EventItem[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .neq('id', currentId)
        .limit(limit);

      if (category) {
        query = query.eq('category', category);
      }

      const { data } = await query;
      if (data && data.length > 0) {
        return (data as DbEventRow[]).map(normalizeDbEvent);
      }
      return [];
    } catch {
      return [];
    }
  }
}

export const eventService = new EventService();
