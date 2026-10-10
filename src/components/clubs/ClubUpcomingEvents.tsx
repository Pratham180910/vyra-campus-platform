import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, CalendarX2 } from 'lucide-react';
import { EventCard } from '../events/EventCard';
import { eventService } from '../../services/eventService';
import type { Club } from '../../types/club';
import type { EventItem } from '../../types';

interface ClubUpcomingEventsProps {
  club: Club;
}

export const ClubUpcomingEvents: React.FC<ClubUpcomingEventsProps> = ({ club }) => {
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    eventService.getPublishedEvents().then(({ data }) => {
      if (data) setAllEvents(data);
    });
  }, []);

  // Find up to 3 events related to this specific club from real published events
  const matchingEvents = useMemo<EventItem[]>(() => {
    const clubNameLower = club.name.toLowerCase();
    const shortNameLower = club.shortName.toLowerCase();
    const categoryLower = club.category.toLowerCase();

    // 1. First priority: Direct organizer name or strong keyword match
    const directMatches = allEvents.filter((evt) => {
      const organizerLower = (evt.organizer || '').toLowerCase();
      if (
        organizerLower.includes(shortNameLower) ||
        organizerLower.includes(clubNameLower) ||
        evt.organizer === club.id
      ) {
        return true;
      }
      return false;
    });

    if (directMatches.length > 0) {
      return directMatches.slice(0, 3);
    }

    // 2. Second priority: Category or tag alignment
    const categoryMatches = allEvents.filter((evt) => {
      const evtCatLower = evt.category.toLowerCase();
      if (evtCatLower === categoryLower) return true;
      if (evt.tags?.some((t) => club.tags.includes(t))) return true;
      return false;
    });

    return categoryMatches.slice(0, 3);
  }, [club, allEvents]);

  return (
    <section className="w-full space-y-6 pt-6 sm:pt-8 border-t border-white/10">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded-md bg-secondary/15 text-secondary border border-secondary/25">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <h2 className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
          UPCOMING FROM THIS COMMUNITY
        </h2>
      </div>

      {matchingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {matchingEvents.map((evt, idx) => (
            <EventCard key={evt.id} event={evt} index={idx} />
          ))}
        </div>
      ) : (
        /* Empty State for Upcoming Events */
        <div className="p-10 sm:p-14 rounded-3xl bg-[#0E101A] border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted">
            <CalendarX2 className="w-6 h-6 text-text-secondary" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            NO UPCOMING EVENTS
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-sm leading-relaxed">
            Check back soon for what's happening next from {club.name}.
          </p>
        </div>
      )}
    </section>
  );
};
