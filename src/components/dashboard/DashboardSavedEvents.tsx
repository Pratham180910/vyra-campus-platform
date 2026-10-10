import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, Calendar, MapPin, Sparkles, Compass } from 'lucide-react';
import { SaveEventButton } from '../events/SaveEventButton';
import type { EventItem } from '../../types';

interface DashboardSavedEventsProps {
  events: EventItem[];
}

export const DashboardSavedEvents: React.FC<DashboardSavedEventsProps> = ({ events }) => {
  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-primary/20 text-[#C4B5FD] border border-primary/30">
            <Bookmark className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
              <span>SAVED FOR LATER</span>
              {events.length > 0 && (
                <span className="text-xs font-mono font-bold text-[#C4B5FD] px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {events.length} SAVED
                </span>
              )}
            </h2>
          </div>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-secondary hover:text-white transition-colors group"
        >
          <span>EXPLORE EVENTS</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid or Empty State */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <SavedEventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0E101A] border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-glow-purple">
            <Bookmark className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">
              NOTHING SAVED YET
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm leading-relaxed">
              Keep the moments that catch your eye.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all hover:scale-105"
            >
              <Compass className="w-3.5 h-3.5 text-secondary" />
              <span>BROWSE EVENTS</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

interface SavedEventCardProps {
  event: EventItem;
}

const SavedEventCard: React.FC<SavedEventCardProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group h-full flex flex-col rounded-3xl bg-[#0E101A] border border-white/10 hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg">
      <div className="relative w-full h-40 overflow-hidden bg-[#121422]">
        {!imageError ? (
          <img
            src={event.image}
            alt={event.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#181A2A] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-secondary/60 animate-pulse" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0E101A] via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
            {event.category}
          </span>
          <SaveEventButton eventId={event.id} eventTitle={event.title} variant="compact" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-glow-purple transition-colors truncate">
            {event.title}
          </h3>

          <div className="space-y-1 text-xs font-mono text-text-muted">
            <p className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{event.date}</span>
            </p>
            <p className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <span>{event.venue}</span>
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-secondary uppercase">
            Saved In Session
          </span>

          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-secondary group-hover:text-white transition-colors"
          >
            <span>VIEW EVENT</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
