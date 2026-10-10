import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { EventsHero } from '../components/events/EventsHero';
import { FeaturedEventsSection } from '../components/events/FeaturedEventsSection';
import { EventSearch } from '../components/events/EventSearch';
import { EventFilters, type FilterState } from '../components/events/EventFilters';
import { ActiveFilterChips } from '../components/events/ActiveFilterChips';
import { MobileFiltersModal } from '../components/events/MobileFiltersModal';
import { EventGrid } from '../components/events/EventGrid';
import { EmptyState } from '../components/events/EmptyState';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { useProfile } from '../hooks/useProfile';
import { RecommendedEventsSection } from '../components/events/RecommendedEventsSection';
import {
  getRecommendedEvents,
  hasPersonalizationData,
  calculateEventRelevance,
} from '../services/eventRecommendationService';
import { eventService } from '../services/eventService';
import type { EventItem } from '../types';

const VALID_CATEGORIES = [
  'Tech',
  'Hackathons',
  'Cultural',
  'Workshops',
  'Sports',
  'Competitions',
  'Social',
  'Saved',
];

const matchCategory = (catStr: string | null): string => {
  if (!catStr) return 'All';
  const found = VALID_CATEGORIES.find((c) => c.toLowerCase() === catStr.toLowerCase());
  return found || 'All';
};

export const Events: React.FC = () => {
  const { savedEventIds } = useSavedEvents();
  const { profile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(() => ({
    category: matchCategory(categoryParam),
    date: 'all',
    eventType: 'all',
    sortBy: 'upcoming',
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Fetch real published events from Supabase
  useEffect(() => {
    eventService.getPublishedEvents().then(({ data }) => {
      if (data) {
        setEvents(data);
      }
    });
  }, []);

  // Synchronize when URL category query param changes externally
  const prevCategoryRef = useRef(categoryParam);
  useEffect(() => {
    if (categoryParam !== prevCategoryRef.current) {
      prevCategoryRef.current = categoryParam;
      const matched = matchCategory(categoryParam);
      setFilters((prev) => ({ ...prev, category: matched }));
    }
  }, [categoryParam]);

  // Compute number of active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'All') count++;
    if (filters.date !== 'all') count++;
    if (filters.eventType !== 'all') count++;
    if (filters.sortBy !== 'upcoming') count++;
    return count;
  }, [filters]);

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    if (updates.category !== undefined) {
      const nextParams = new URLSearchParams(searchParams);
      if (updates.category === 'All') {
        nextParams.delete('category');
      } else {
        nextParams.set('category', updates.category.toLowerCase());
      }
      prevCategoryRef.current = nextParams.get('category');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setFilters({
      category: 'All',
      date: 'all',
      eventType: 'all',
      sortBy: 'upcoming',
    });
    if (searchParams.has('category')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('category');
      prevCategoryRef.current = null;
      setSearchParams(nextParams, { replace: true });
    }
  };

  // Real-time client-side search & filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesSubtitle = (event.subtitle || '').toLowerCase().includes(q);
        const matchesCategory = event.category.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesOrganizer = (event.organizer || '').toLowerCase().includes(q);
        const matchesBadge = (event.badge || '').toLowerCase().includes(q);
        const matchesEventType = (event.eventType || '').toLowerCase().includes(q);
        const matchesTags = event.tags?.some((t) => t.toLowerCase().includes(q));

        if (
          !matchesTitle &&
          !matchesSubtitle &&
          !matchesCategory &&
          !matchesDesc &&
          !matchesVenue &&
          !matchesOrganizer &&
          !matchesBadge &&
          !matchesEventType &&
          !matchesTags
        ) {
          return false;
        }
      }

      // 2. Category / Saved Filter
      if (filters.category.toLowerCase() === 'saved') {
        if (!savedEventIds.includes(event.id)) {
          return false;
        }
      } else if (filters.category !== 'All') {
        if (event.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }
      }

      // 3. Date Filter
      if (filters.date !== 'all') {
        if (filters.date === 'today') {
          if (event.dateCategory !== 'today') return false;
        } else if (filters.date === 'this_week') {
          if (event.dateCategory !== 'today' && event.dateCategory !== 'this_week') {
            return false;
          }
        } else if (filters.date === 'this_month') {
          if (!event.dateCategory) return false;
        } else if (filters.date === 'upcoming') {
          // All future / upcoming campus moments
          if (!event.date) return false;
        }
      }

      // 4. Access / Event Type
      if (filters.eventType !== 'all') {
        if (event.eventType !== filters.eventType) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // 5. Sorting
      if (filters.sortBy === 'recommended') {
        const scoreA = profile ? calculateEventRelevance(a, profile).score : 0;
        const scoreB = profile ? calculateEventRelevance(b, profile).score : 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return (b.registrations || 0) - (a.registrations || 0);
      }
      if (filters.sortBy === 'popular') {
        return (b.registrations || 0) - (a.registrations || 0);
      }
      if (filters.sortBy === 'recent') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      // 'upcoming' (default order)
      return 0;
    });
  }, [events, searchQuery, filters, savedEventIds, profile]);

  // Determine if the student has personalization signals (interests/skills)
  const userHasPersonalization = useMemo(
    () => hasPersonalizationData(profile),
    [profile]
  );

  // Recommendations calculated deterministically from active filtered set
  const recommendedEvents = useMemo(() => {
    return getRecommendedEvents(filteredEvents, profile, { limit: 3 });
  }, [filteredEvents, profile]);

  const handleNavSearchClick = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isSavedFilterActive = filters.category.toLowerCase() === 'saved';

  return (
    <PageShell>
      {/* 1. Global Navigation with Events active */}
      <Navbar onSearchClick={handleNavSearchClick} />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          {/* 2. Compact Editorial Page Hero */}
          <EventsHero />

          {/* 3. Featured Spotlight (Top 3 Featured Events) */}
          {!searchQuery && filters.category === 'All' && filters.date === 'all' && (
            <FeaturedEventsSection events={events} />
          )}

          {/* 4. Search and Interactive Filter Controls */}
          <div ref={searchSectionRef} className="space-y-4 pt-2">
            <EventSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />

            <EventFilters
              filters={filters}
              onFilterChange={handleFilterUpdate}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* Active Filter Chips with Individual Dismiss & Clear All (Feature 13) */}
            <ActiveFilterChips
              searchQuery={searchQuery}
              filters={filters}
              onClearSearch={() => setSearchQuery('')}
              onUpdateFilter={handleFilterUpdate}
              onClearAll={handleClearAll}
            />
          </div>

          {/* 5. Recommended For You Section (Feature 12) */}
          <RecommendedEventsSection
            recommendations={recommendedEvents}
            profile={profile}
            hasPersonalizationData={userHasPersonalization}
          />

          {/* 6. Results Count & Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-2">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                {isSavedFilterActive ? 'SAVED EVENTS' : 'ALL EVENTS'}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-secondary">
                {filteredEvents.length === 0
                  ? 'NO MOMENTS FOUND'
                  : `${filteredEvents.length} MOMENTS FOUND`}
              </span>
            </div>

            {(searchQuery || activeFilterCount > 0) && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-mono text-text-muted hover:text-secondary transition-colors underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* 6. Event Cards Grid or Empty State */}
          {filteredEvents.length > 0 ? (
            <EventGrid events={filteredEvents} />
          ) : (
            <EmptyState
              onClearFilters={handleClearAll}
              isSavedFilter={isSavedFilterActive}
            />
          )}
        </div>
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Mobile Filters Bottom Sheet */}
      <MobileFiltersModal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onApply={(updated) => setFilters(updated)}
        onReset={handleClearAll}
      />
    </PageShell>
  );
};
