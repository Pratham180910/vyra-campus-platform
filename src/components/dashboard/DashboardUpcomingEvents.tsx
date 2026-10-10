import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Sparkles, Compass } from 'lucide-react';
import { EventCard } from '../events/EventCard';
import type { EventItem } from '../../types';

interface DashboardUpcomingEventsProps {
  events: EventItem[];
}

export const DashboardUpcomingEvents: React.FC<DashboardUpcomingEventsProps> = ({ events }) => {
  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-secondary/15 text-secondary border border-secondary/25">
            <CalendarDays className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
              <span>UP NEXT</span>
              {events.length > 0 && (
                <span className="text-xs font-mono font-bold text-secondary px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                  {events.length} CONFIRMED
                </span>
              )}
            </h2>
          </div>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-secondary hover:text-white transition-colors group"
        >
          <span>VIEW ALL EVENTS</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Events Grid or Empty State */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {events.map((evt, idx) => (
            <EventCard key={evt.id} event={evt} index={idx} />
          ))}
        </div>
      ) : (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0E101A] border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary shadow-glow-lime">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">
              NO UPCOMING MOMENTS
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm leading-relaxed">
              Your next campus experience is waiting to be discovered.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all hover:scale-105"
            >
              <Compass className="w-3.5 h-3.5 text-secondary" />
              <span>DISCOVER EVENTS</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
