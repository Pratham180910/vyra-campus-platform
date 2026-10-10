import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  EventAnalyticsData,
  AttendeeRecord,
  RegistrationTrendPoint,
} from '../types/organizer';
import { organizerEventService } from './organizerEventService';

class OrganizerAnalyticsService {
  private remoteAttendees: AttendeeRecord[] = [];
  private currentOrganizerId: string | null = null;
  private isLoading = false;

  public getCurrentOrganizerId(): string | null {
    return this.currentOrganizerId;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Fetch real attendees from Supabase for events owned by the organizer
   */
  public async syncRemoteAttendees(organizerId?: string | null): Promise<void> {
    this.currentOrganizerId = organizerId ?? null;
    if (!isSupabaseConfigured || !organizerId) {
      this.remoteAttendees = [];
      return;
    }

    this.isLoading = true;

    try {
      // 1. Fetch real registrations for organizer's events
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .select(`
          id,
          event_id,
          full_name,
          email,
          phone,
          department,
          academic_year,
          note,
          status,
          registered_at,
          events (
            id,
            title,
            organizer_id
          )
        `);

      if (regError || !regData) {
        if (regError) console.warn('[VYRA:Analytics] Error fetching registrations:', regError.message);
        this.remoteAttendees = [];
        return;
      }

      // Filter strictly to events owned by this organizer
      const scopedRegs = regData.filter(
        (row: any) => row.events?.organizer_id === organizerId
      );

      // 2. Fetch real attendance records for these events
      const eventIds = Array.from(new Set(scopedRegs.map((r: any) => r.event_id)));
      const attendanceMap = new Map<string, string>(); // registration_id -> status

      if (eventIds.length > 0) {
        try {
          const { data: attData } = await supabase
            .from('attendance')
            .select('registration_id, status')
            .in('event_id', eventIds);

          if (attData) {
            attData.forEach((att: any) => {
              if (att.registration_id) {
                attendanceMap.set(att.registration_id, att.status);
              }
            });
          }
        } catch {
          // Attendance table optional or empty
        }
      }

      this.remoteAttendees = scopedRegs
        .filter((row: any) => row.status !== 'cancelled')
        .map((row: any) => {
          const attStatus = attendanceMap.get(row.id);
          let finalStatus: AttendeeRecord['status'] = 'REGISTERED';

          if (attStatus === 'checked_in') {
            finalStatus = 'CHECKED IN';
          } else if (attStatus === 'no_show') {
            finalStatus = 'NO SHOW';
          }

        return {
          id: row.id,
          eventId: row.event_id,
          eventTitle: row.events?.title || row.event_id,
          name: row.full_name,
          email: row.email,
          department: row.department || 'General',
          year: row.academic_year || '1st Year',
          registrationDate: row.registered_at
            ? new Date(row.registered_at).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })
            : 'Recent',
          status: finalStatus,
          ticketCode: `VYRA-${row.id.substring(0, 8).toUpperCase()}`,
          notes: row.note || '',
        };
      });
    } catch (err) {
      console.warn('[VYRA:Analytics] Remote attendees sync error:', err);
      this.remoteAttendees = [];
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Synchronous getter for attendees (scoped to selected event)
   */
  public getAttendeesForEvent(eventId?: string): AttendeeRecord[] {
    const pool = this.remoteAttendees;
    if (!eventId || eventId === 'ALL') {
      return pool;
    }
    return pool.filter((a) => a.eventId === eventId);
  }

  /**
   * Real analytics derived strictly from verified registration and attendance rows
   */
  public getAnalytics(eventId?: string): EventAnalyticsData {
    const events = organizerEventService.getAllEvents();
    const isAll = !eventId || eventId === 'ALL';

    const scopedAttendees = isAll
      ? this.remoteAttendees
      : this.remoteAttendees.filter((a) => a.eventId === eventId);

    const totalRegs = scopedAttendees.length;
    const checkedIn = scopedAttendees.filter((a) => a.status === 'CHECKED IN').length;
    const noShow = scopedAttendees.filter((a) => a.status === 'NO SHOW').length;
    const registeredOnly = scopedAttendees.filter((a) => a.status === 'REGISTERED').length;

    const capacity = isAll
      ? events.reduce((sum, e) => sum + (e.capacity || 0), 0)
      : events.find((e) => e.id === eventId)?.capacity || 0;

    const checkInRate = totalRegs > 0 ? Math.round((checkedIn / totalRegs) * 100) : 0;
    const registrationRate = capacity > 0 ? Math.min(100, Math.round((totalRegs / capacity) * 100)) : 0;

    // Build real chronological trend from actual registration dates
    const trendMap = new Map<string, number>();
    scopedAttendees.forEach((a) => {
      const dateKey = a.registrationDate !== 'Recent' ? a.registrationDate : 'Today';
      trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1);
    });

    let runningTotal = 0;
    const trend: RegistrationTrendPoint[] = Array.from(trendMap.entries()).map(
      ([dateLabel, count]) => {
        runningTotal += count;
        return {
          date: dateLabel.toUpperCase(),
          label: dateLabel,
          registrations: count,
          cumulative: runningTotal,
        };
      }
    );

    // If no registrations exist yet, supply honest baseline zero point
    if (trend.length === 0) {
      trend.push({
        date: 'CURRENT',
        label: 'Current',
        registrations: 0,
        cumulative: 0,
      });
    }

    const title = isAll
      ? 'All Campus Moments (Aggregate)'
      : events.find((e) => e.id === eventId)?.title || 'Selected Event';

    return {
      eventId: isAll ? 'ALL' : eventId || 'ALL',
      eventTitle: title,
      totalRegistrations: totalRegs,
      totalAttendees: checkedIn,
      averageAttendance: checkInRate,
      registrationRate,
      capacity,
      remainingSpots: Math.max(0, capacity - totalRegs),
      trend,
      breakdown: {
        registered: registeredOnly,
        checkedIn,
        noShow,
      },
    };
  }
}

export const organizerAnalyticsService = new OrganizerAnalyticsService();
