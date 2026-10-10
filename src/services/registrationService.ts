import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { RegistrationFormData, RegistrationRecord } from '../types/registration';
import type { EventItem } from '../types';
import { normalizeDbEvent, type DbEventRow } from './eventService';

/**
 * Connected Registration Service
 *
 * Integrates directly with Supabase public.registrations for authenticated users.
 * Enforces server-side constraints (unique registration per user/event),
 * triggers confirmation activity, and persists across sessions.
 */

type RegistrationListener = () => void;

class RegistrationService {
  private registrations: Map<string, RegistrationRecord> = new Map();
  private listeners: Set<RegistrationListener> = new Set();
  private currentUserId: string | null = null;
  private isInitialized = false;

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

  public subscribe(listener: RegistrationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch {
        // ignore listener failure
      }
    });
  }

  /**
   * Synchronize registrations with Supabase for the current authenticated user.
   */
  async syncUserRegistrations(userId: string | null): Promise<RegistrationRecord[]> {
    this.currentUserId = userId;

    if (!userId || !isSupabaseConfigured) {
      this.isInitialized = true;
      return Array.from(this.registrations.values());
    }

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', userId)
        .order('registered_at', { ascending: false });

      if (error) {
        console.warn('[VYRA:Registrations] Error fetching registrations:', error.message);
        return Array.from(this.registrations.values());
      }

      if (data) {
        this.registrations.clear();
        for (const row of data) {
          const record: RegistrationRecord = {
            eventId: row.event_id,
            formData: {
              fullName: row.full_name || '',
              email: row.email || '',
              phone: row.phone || '',
              department: row.department || '',
              yearOfStudy: row.academic_year || '',
              note: row.note || '',
            },
            registeredAt: row.registered_at || new Date().toISOString(),
          };
          this.registrations.set(row.event_id, record);
        }
        this.notify();
      }
    } catch (err) {
      console.warn('[VYRA:Registrations] Unexpected sync failure:', err);
    } finally {
      this.isInitialized = true;
    }

    return Array.from(this.registrations.values());
  }

  /**
   * Check whether an event has been registered by the user.
   */
  isEventRegistered(eventId: string): boolean {
    return this.registrations.has(eventId);
  }

  /**
   * Get registration details for an event if available.
   */
  getRegistration(eventId: string): RegistrationRecord | undefined {
    return this.registrations.get(eventId);
  }

  /**
   * Get all registered event records.
   */
  getAllRegistrations(): RegistrationRecord[] {
    return Array.from(this.registrations.values());
  }

  /**
   * Fetch full EventItem records for user's registrations from Supabase
   */
  async getRegisteredEventsDetailed(userId?: string | null): Promise<EventItem[]> {
    const targetUserId = userId || this.currentUserId;
    if (!targetUserId || !isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          event_id,
          status,
          registered_at,
          events (*)
        `)
        .eq('user_id', targetUserId)
        .order('registered_at', { ascending: false });

      if (error || !data) {
        if (error) console.warn('[VYRA:Registrations] Error fetching detailed registrations:', error.message);
        return [];
      }

      return data
        .map((row: any) => row.events ? normalizeDbEvent(row.events as DbEventRow) : null)
        .filter((e): e is EventItem => Boolean(e));
    } catch (err) {
      console.warn('[VYRA:Registrations] Failed to load registrations detailed:', err);
      return [];
    }
  }

  /**
   * Register for an event in Supabase.
   */
  async registerForEvent(
    eventId: string,
    formData: RegistrationFormData,
    userId?: string | null
  ): Promise<{ success: boolean; record?: RegistrationRecord; error?: string }> {
    let targetUserId = userId || this.currentUserId;

    // If targetUserId is not cached, attempt to resolve from active Supabase session
    if (!targetUserId && isSupabaseConfigured) {
      try {
        const { data } = await supabase.auth.getUser();
        targetUserId = data.user?.id ?? null;
      } catch {
        targetUserId = null;
      }
    }

    if (!targetUserId) {
      return {
        success: false,
        error: 'Authentication required. Please sign in to register for campus events.',
      };
    }

    // Check duplicate locally first
    if (this.registrations.has(eventId)) {
      return {
        success: false,
        error: 'You have already registered for this event.',
        record: this.registrations.get(eventId),
      };
    }

    const registeredAt = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        // Check for existing registration in Supabase
        const { data: existing } = await supabase
          .from('registrations')
          .select('id, status')
          .eq('event_id', eventId)
          .eq('user_id', targetUserId)
          .maybeSingle();

        if (existing) {
          const rec: RegistrationRecord = {
            eventId,
            formData,
            registeredAt,
          };
          this.registrations.set(eventId, rec);
          this.notify();
          return {
            success: false,
            error: 'You are already registered for this event.',
            record: rec,
          };
        }

        // Insert new registration
        const { data: inserted, error: insertError } = await supabase
          .from('registrations')
          .insert({
            event_id: eventId,
            user_id: targetUserId,
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            department: formData.department,
            academic_year: formData.yearOfStudy,
            note: formData.note?.trim() || null,
            status: 'confirmed',
            registered_at: registeredAt,
          })
          .select()
          .single();

        if (insertError) {
          // If unique constraint violation
          if (insertError.code === '23505') {
            return {
              success: false,
              error: 'You are already registered for this event.',
            };
          }
          return {
            success: false,
            error: insertError.message || 'Unable to complete registration. Please try again.',
          };
        }

        // Registration confirmation notification is provisioned automatically by the database trigger

        const record: RegistrationRecord = {
          eventId,
          formData,
          registeredAt: inserted?.registered_at || registeredAt,
        };

        this.registrations.set(eventId, record);
        this.notify();

        return {
          success: true,
          record,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed. Network error.';
        return {
          success: false,
          error: message,
        };
      }
    }

    // Local fallback if Supabase not configured
    const record: RegistrationRecord = {
      eventId,
      formData,
      registeredAt,
    };
    this.registrations.set(eventId, record);
    this.notify();

    return {
      success: true,
      record,
    };
  }

  /**
   * Reset registration for an event.
   */
  async clearRegistration(eventId: string, userId?: string | null): Promise<void> {
    this.registrations.delete(eventId);
    this.notify();

    const targetUserId = userId || this.currentUserId;
    if (targetUserId && isSupabaseConfigured) {
      try {
        await supabase
          .from('registrations')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', targetUserId);
      } catch {
        // ignore delete failure
      }
    }
  }
}

export const registrationService = new RegistrationService();
