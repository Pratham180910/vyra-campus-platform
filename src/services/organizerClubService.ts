import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ClubCategory } from '../types/club';

export interface OrganizerClubRecord {
  id: string;
  name: string;
  acronym: string | null;
  description: string;
  category: ClubCategory;
  department: string | null;
  cover_image: string | null;
  logo: string | null;
  verified: boolean;
  member_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClubFormData {
  id?: string;
  name: string;
  acronym?: string;
  description: string;
  category: ClubCategory;
  department?: string;
  cover_image?: string;
  logo?: string;
  verified?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

class OrganizerClubService {
  private clubs: OrganizerClubRecord[] = [];
  private listeners: Set<() => void> = new Set();
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

  public getCachedClubs(): OrganizerClubRecord[] {
    return this.clubs;
  }

  /**
   * Fetch all clubs from Supabase public.clubs with real-time member counts
   */
  public async fetchClubs(): Promise<{ data: OrganizerClubRecord[]; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { data: [], error: 'Supabase configuration missing.' };
    }

    this.isLoading = true;

    try {
      // 1. Fetch real clubs from public.clubs
      const { data: dbClubs, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('[VYRA:OrganizerClubService] Error loading clubs:', error.message);
        this.isLoading = false;
        return { data: this.clubs, error: error.message };
      }

      if (!dbClubs) {
        this.clubs = [];
        this.isLoading = false;
        this.notify();
        return { data: [], error: null };
      }

      // 2. Fetch member counts for each club
      const memberCounts: Record<string, number> = {};
      try {
        const { data: memberRows } = await supabase
          .from('club_members')
          .select('club_id');

        if (memberRows) {
          memberRows.forEach((r: { club_id: string }) => {
            memberCounts[r.club_id] = (memberCounts[r.club_id] || 0) + 1;
          });
        }
      } catch {
        // Fallback if club_members RLS restricts enumeration
      }

      const formatted: OrganizerClubRecord[] = dbClubs.map((row) => ({
        id: row.id,
        name: row.name,
        acronym: row.acronym || null,
        description: row.description || '',
        category: row.category as ClubCategory,
        department: row.department || null,
        cover_image: row.cover_image || null,
        logo: row.logo || null,
        verified: Boolean(row.verified),
        member_count: memberCounts[row.id] || 0,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      this.clubs = formatted;
      this.isLoading = false;
      this.notify();
      return { data: formatted, error: null };
    } catch (err: unknown) {
      this.isLoading = false;
      const msg = err instanceof Error ? err.message : 'Failed to fetch clubs.';
      return { data: this.clubs, error: msg };
    }
  }

  /**
   * Fetch single club by ID from Supabase
   */
  public async getClubById(
    id: string
  ): Promise<{ data: OrganizerClubRecord | null; error: string | null }> {
    if (!id || !isSupabaseConfigured) {
      return { data: null, error: 'Club ID missing or Supabase not configured.' };
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

      // Fetch member count
      let memberCount = 0;
      try {
        const { count } = await supabase
          .from('club_members')
          .select('*', { count: 'exact', head: true })
          .eq('club_id', id);

        if (typeof count === 'number') {
          memberCount = count;
        }
      } catch {
        // Safe fallback
      }

      const clubRecord: OrganizerClubRecord = {
        id: data.id,
        name: data.name,
        acronym: data.acronym || null,
        description: data.description || '',
        category: data.category as ClubCategory,
        department: data.department || null,
        cover_image: data.cover_image || null,
        logo: data.logo || null,
        verified: Boolean(data.verified),
        member_count: memberCount,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return { data: clubRecord, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch club.';
      return { data: null, error: msg };
    }
  }

  /**
   * Create new club in public.clubs
   */
  public async createClub(
    formData: ClubFormData,
    creatorUserId?: string | null
  ): Promise<{ data: OrganizerClubRecord | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { data: null, error: 'Supabase configuration missing.' };
    }

    // Verify authenticated session is active
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return { data: null, error: 'Active organizer session required. Please sign in again.' };
    }

    const cleanId = (formData.id?.trim() || slugify(formData.name)) || `club-${Date.now()}`;

    const payload = {
      id: cleanId,
      name: formData.name.trim(),
      acronym: formData.acronym?.trim() || null,
      description: formData.description.trim(),
      category: formData.category,
      department: formData.department?.trim() || null,
      cover_image: formData.cover_image?.trim() || null,
      logo: formData.logo?.trim() || null,
      verified: Boolean(formData.verified),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('clubs')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        console.error('[VYRA:OrganizerClubService] Insert error:', error.message);
        if (error.code === '23505') {
          return { data: null, error: `A club with identifier "${cleanId}" already exists. Please customize the slug.` };
        }
        if (error.code === '42501' || error.message.includes('row-level security')) {
          return {
            data: null,
            error: 'Permission denied: Please apply migration 20261010000000_organizers_manage_clubs.sql in your Supabase SQL Editor to allow organizers to create clubs.',
          };
        }
        return { data: null, error: error.message };
      }

      // Automatically register the creator as club lead in club_members if authenticated
      if (creatorUserId) {
        const { error: memberError } = await supabase.from('club_members').insert({
          club_id: cleanId,
          user_id: creatorUserId,
          role: 'lead',
        });
        if (memberError) {
          console.warn('[VYRA:OrganizerClubService] Non-critical club_members enrollment note:', memberError.message);
        }
      }

      const createdRecord: OrganizerClubRecord = {
        id: data.id,
        name: data.name,
        acronym: data.acronym || null,
        description: data.description || '',
        category: data.category as ClubCategory,
        department: data.department || null,
        cover_image: data.cover_image || null,
        logo: data.logo || null,
        verified: Boolean(data.verified),
        member_count: 1,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      this.clubs = [createdRecord, ...this.clubs];
      this.notify();

      return { data: createdRecord, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating club.';
      return { data: null, error: msg };
    }
  }

  /**
   * Update existing club in public.clubs
   */
  public async updateClub(
    id: string,
    formData: Partial<ClubFormData>
  ): Promise<{ data: OrganizerClubRecord | null; error: string | null }> {
    if (!id || !isSupabaseConfigured) {
      return { data: null, error: 'Club ID or Supabase config missing.' };
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (formData.name !== undefined) updatePayload.name = formData.name.trim();
    if (formData.acronym !== undefined) updatePayload.acronym = formData.acronym?.trim() || null;
    if (formData.description !== undefined) updatePayload.description = formData.description.trim();
    if (formData.category !== undefined) updatePayload.category = formData.category;
    if (formData.department !== undefined) updatePayload.department = formData.department?.trim() || null;
    if (formData.cover_image !== undefined) updatePayload.cover_image = formData.cover_image?.trim() || null;
    if (formData.logo !== undefined) updatePayload.logo = formData.logo?.trim() || null;
    if (formData.verified !== undefined) updatePayload.verified = Boolean(formData.verified);

    try {
      const { data, error } = await supabase
        .from('clubs')
        .update(updatePayload)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('[VYRA:OrganizerClubService] Update error:', error.message);
        return { data: null, error: error.message };
      }

      const updatedRecord: OrganizerClubRecord = {
        id: data.id,
        name: data.name,
        acronym: data.acronym || null,
        description: data.description || '',
        category: data.category as ClubCategory,
        department: data.department || null,
        cover_image: data.cover_image || null,
        logo: data.logo || null,
        verified: Boolean(data.verified),
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      this.clubs = this.clubs.map((c) => (c.id === id ? { ...c, ...updatedRecord } : c));
      this.notify();

      return { data: updatedRecord, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating club.';
      return { data: null, error: msg };
    }
  }

  /**
   * Delete club from public.clubs
   */
  public async deleteClub(id: string): Promise<{ success: boolean; error?: string }> {
    if (!id || !isSupabaseConfigured) {
      return { success: false, error: 'Missing ID or configuration.' };
    }

    try {
      const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      this.clubs = this.clubs.filter((c) => c.id !== id);
      this.notify();
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting club.';
      return { success: false, error: msg };
    }
  }
}

export const organizerClubService = new OrganizerClubService();
