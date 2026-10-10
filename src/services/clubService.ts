import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Club, ClubCategory } from '../types/club';

interface DbClubRow {
  id: string;
  name: string;
  acronym?: string | null;
  description: string;
  category: string;
  department?: string | null;
  cover_image?: string | null;
  logo?: string | null;
  verified: boolean;
  created_at: string;
}

export function normalizeDbClub(row: DbClubRow, memberCount = 120, upcomingEvents = 0): Club {
  return {
    id: row.id,
    name: row.name,
    shortName: row.acronym || row.name,
    description: row.description || '',
    logo: row.logo || undefined,
    coverImage: row.cover_image || '/images/clubs/ai-society.jpg',
    category: (row.category as Exclude<ClubCategory, 'All'>) || 'Technology',
    tags: [row.category, 'SRMIST', 'Community'],
    memberCount,
    foundedYear: 2021,
    department: row.department || undefined,
    featured: true,
    verified: Boolean(row.verified),
    upcomingEventCount: upcomingEvents,
    interests: [row.category, 'Campus Networking'],
  };
}

class ClubService {
  /**
   * Fetch all clubs from Supabase public.clubs
   */
  async getClubs(): Promise<{ data: Club[]; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { data: [], error: 'Supabase is not configured.' };
    }

    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) {
        console.warn('[VYRA:ClubService] Failed to load clubs:', error.message);
        return { data: [], error: error.message };
      }

      if (!data) {
        return { data: [], error: null };
      }

      const normalized = (data as DbClubRow[]).map((row) => normalizeDbClub(row));
      return { data: normalized, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching clubs.';
      return { data: [], error: message };
    }
  }

  /**
   * Fetch single club by ID
   */
  async getClubById(id: string): Promise<{ data: Club | null; error: string | null }> {
    if (!id || !isSupabaseConfigured) {
      return { data: null, error: 'Club ID missing.' };
    }

    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: null };
      }

      return { data: normalizeDbClub(data as DbClubRow), error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching club.';
      return { data: null, error: message };
    }
  }

  /**
   * Join club as authenticated user
   */
  async joinClub(clubId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase unconfigured.' };
    }

    try {
      const { error } = await supabase.from('club_members').upsert(
        {
          club_id: clubId,
          user_id: userId,
          role: 'member',
        },
        { onConflict: 'club_id,user_id' }
      );

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to join club.',
      };
    }
  }

  /**
   * Leave club
   */
  async leaveClub(clubId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase unconfigured.' };
    }

    try {
      const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', clubId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to leave club.',
      };
    }
  }

  /**
   * Check if user is a member of a club
   */
  async isClubMember(clubId: string, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !userId) return false;

    try {
      const { data } = await supabase
        .from('club_members')
        .select('id')
        .eq('club_id', clubId)
        .eq('user_id', userId)
        .maybeSingle();

      return Boolean(data);
    } catch {
      return false;
    }
  }

  /**
   * Fetch clubs joined by the authenticated user from Supabase
   */
  async getUserClubs(userId: string): Promise<Club[]> {
    if (!userId || !isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('club_members')
        .select(`
          club_id,
          role,
          joined_at,
          clubs (*)
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error || !data) {
        if (error) console.warn('[VYRA:ClubService] Failed to load user clubs:', error.message);
        return [];
      }

      return data
        .map((row: any) => row.clubs ? normalizeDbClub(row.clubs as DbClubRow) : null)
        .filter((c): c is Club => Boolean(c));
    } catch (err) {
      console.warn('[VYRA:ClubService] Unexpected error loading user clubs:', err);
      return [];
    }
  }
}

export const clubService = new ClubService();
