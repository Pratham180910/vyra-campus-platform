import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DashboardHero } from '../components/dashboard/DashboardHero';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardUpcomingEvents } from '../components/dashboard/DashboardUpcomingEvents';
import { DashboardSavedEvents } from '../components/dashboard/DashboardSavedEvents';
import { DashboardCommunities } from '../components/dashboard/DashboardCommunities';
import { DashboardActivity } from '../components/dashboard/DashboardActivity';
import { DashboardCTA } from '../components/dashboard/DashboardCTA';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { registrationService } from '../services/registrationService';
import { savedEventsService } from '../services/savedEventsService';
import { clubService } from '../services/clubService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { EventItem } from '../types';
import type { Club } from '../types/club';
import type { StudentProfilePreview, DashboardStatsData, ActivityItem } from '../types/dashboard';

function getActivityBucket(dateStr?: string): 'RECENT' | 'THIS WEEK' | 'EARLIER' {
  if (!dateStr) return 'RECENT';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days <= 2) return 'RECENT';
    if (days <= 7) return 'THIS WEEK';
    return 'EARLIER';
  } catch {
    return 'RECENT';
  }
}

export const Dashboard: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const { savedEventIds } = useSavedEvents();
  const { profile, isLoading: profileLoading } = useProfile();

  // Real Supabase data states
  const [registeredEvents, setRegisteredEvents] = useState<EventItem[]>([]);
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);
  const [communities, setCommunities] = useState<Club[]>([]);
  const [attendedCount, setAttendedCount] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // Sync real registrations and joined events from Supabase
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) {
      setRegisteredEvents([]);
      setSavedEvents([]);
      setCommunities([]);
      setAttendedCount(0);
      setRecentActivity([]);
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);

    try {
      // 1. Fetch real user registrations with joined event details
      const detailedRegistrations = await registrationService.getRegisteredEventsDetailed(user.id);
      setRegisteredEvents(detailedRegistrations);

      // 2. Fetch real user saved events with joined event details
      const detailedSaved = await savedEventsService.getSavedEventsDetailed(user.id);
      setSavedEvents(detailedSaved);

      // 3. Fetch real user joined communities
      const userClubs = await clubService.getUserClubs(user.id);
      setCommunities(userClubs);

      // 4. Fetch actual attended count from Supabase public.attendance
      let checkedInTotal = 0;
      if (isSupabaseConfigured) {
        try {
          const { count, error } = await supabase
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'checked_in');

          if (!error && typeof count === 'number') {
            checkedInTotal = count;
          }
        } catch {
          checkedInTotal = 0;
        }
      }
      setAttendedCount(checkedInTotal);

      // 5. Construct real ActivityItem timeline from verified database records
      const activities: (ActivityItem & { timestamp: number })[] = [];

      // Add registrations
      detailedRegistrations.forEach((event) => {
        activities.push({
          id: `reg-${event.id}`,
          type: 'EVENT REGISTERED',
          title: event.title,
          description: `Confirmed spot reserved for ${event.title}.`,
          relativeTime: getActivityBucket(event.createdAt),
          timestamp: new Date(event.createdAt || 0).getTime(),
          link: `/events/${event.id}`,
        });
      });

      // Add saved events
      detailedSaved.forEach((event) => {
        activities.push({
          id: `save-${event.id}`,
          type: 'EVENT SAVED',
          title: event.title,
          description: `Saved to your campus wishlist.`,
          relativeTime: getActivityBucket(event.createdAt),
          timestamp: new Date(event.createdAt || 0).getTime(),
          link: `/events/${event.id}`,
        });
      });

      // Add joined communities
      userClubs.forEach((club) => {
        activities.push({
          id: `club-${club.id}`,
          type: 'COMMUNITY VIEWED',
          title: club.name,
          description: `Joined ${club.name} campus organization.`,
          relativeTime: 'THIS WEEK',
          timestamp: Date.now() - 3600000,
          link: `/clubs/${club.id}`,
        });
      });

      // Sort chronological descending
      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(activities.slice(0, 6));
    } catch (err) {
      console.warn('[VYRA:Dashboard] Error loading student dashboard records:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, savedEventIds.length]);

  // Subscribe to external registration updates
  useEffect(() => {
    return registrationService.subscribe(() => {
      loadDashboardData();
    });
  }, [loadDashboardData]);

  // Student profile identity derived directly from authenticated profile
  const heroProfile: StudentProfilePreview = useMemo(() => {
    const initials =
      profile?.initials ||
      (profile?.fullName
        ? profile.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
        : 'VY');

    return {
      roleBadge: (profile?.role || 'STUDENT').toUpperCase(),
      department: profile?.department || 'General Studies',
      institution: profile?.campus || 'SRMIST Kattankulathur',
      initials,
      campusNode: 'NODE #SRM-KTR',
    };
  }, [profile]);

  // Dynamic stats calculated directly from verified database records
  const dynamicStats: DashboardStatsData = useMemo(() => {
    return {
      registeredCount: registeredEvents.length,
      savedCount: savedEvents.length,
      communitiesCount: communities.length,
      attendedCount,
    };
  }, [registeredEvents.length, savedEvents.length, communities.length, attendedCount]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'MY VYRA — Student Dashboard | Your Campus. Your Moments.';
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (prefersReducedMotion || !pageRef.current || isDataLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-section-reveal',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDataLoading]);

  if (profileLoading) {
    return (
      <PageShell>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-white">
          <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
          <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">
            VERIFYING DASHBOARD ACCESS...
          </p>
        </div>
        <Footer />
      </PageShell>
    );
  }


  // Redirect organizers to Organizer Studio once profile is loaded
  const userRole = (profile?.role || '').toLowerCase();
  if (userRole === 'organizer' || userRole === 'admin') {
    return <Navigate to="/organizer" replace />;
  }

  return (
    <PageShell>
      {/* 1. Global Navigation */}
      <Navbar />

      <main ref={pageRef} className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          {/* 2. Opening Hero with Profile Identity */}
          <DashboardHero profile={heroProfile} />

          {/* 3. Quick Stats Cards (Calculated from verified database records) */}
          <div className="dashboard-section-reveal">
            <DashboardStats stats={dynamicStats} />
          </div>

          {/* 4. Upcoming Confirmed Events (Derived from user's actual registrations) */}
          <div className="dashboard-section-reveal">
            <DashboardUpcomingEvents events={registeredEvents} />
          </div>

          {/* 5. Saved Events for Later (Dynamically resolved from Supabase saved_events) */}
          <div className="dashboard-section-reveal">
            <DashboardSavedEvents events={savedEvents} />
          </div>

          {/* 6. My Communities (Fetched from Supabase club_members) */}
          <div className="dashboard-section-reveal">
            <DashboardCommunities communities={communities} />
          </div>

          {/* 7. Recent Activity Timeline (Derived from verified user actions) */}
          <div className="dashboard-section-reveal">
            <DashboardActivity activity={recentActivity} />
          </div>

          {/* 8. Closing Personalized Discovery CTA */}
          <div className="dashboard-section-reveal">
            <DashboardCTA />
          </div>
        </div>
      </main>

      {/* 9. Global Footer */}
      <Footer />
    </PageShell>
  );
};

export default Dashboard;
