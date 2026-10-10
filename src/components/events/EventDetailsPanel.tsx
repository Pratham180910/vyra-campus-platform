import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag, Award, Building, Ticket } from 'lucide-react';
import type { EventItem } from '../../types';

interface EventDetailsPanelProps {
  event: EventItem;
}

export const EventDetailsPanel: React.FC<EventDetailsPanelProps> = ({ event }) => {
  return (
    <div className="w-full bg-[#10121A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="font-display font-bold text-lg text-white tracking-wide flex items-center gap-2">
          <Award className="w-4 h-4 text-secondary" />
          <span>EVENT SPECIFICATIONS</span>
        </h3>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">
          OFFICIAL NODE
        </span>
      </div>

      {/* Grid of Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-mono text-[11px] text-text-muted uppercase flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Date
          </span>
          <p className="font-semibold text-white text-sm">{event.date}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-mono text-[11px] text-text-muted uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-secondary" /> Time
          </span>
          <p className="font-semibold text-white text-sm">{event.time}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-mono text-[11px] text-text-muted uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-text-muted" /> Venue
          </span>
          <p className="font-semibold text-white text-sm">{event.venue}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-mono text-[11px] text-text-muted uppercase flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-text-muted" /> Organizer
          </span>
          <p className="font-semibold text-white text-sm">{event.organizer || 'Campus Guild'}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-mono text-[11px] text-text-muted uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#38BDF8]" /> Registrations
          </span>
          <p className="font-semibold text-white text-sm">
            {event.registrations.toLocaleString()} / {event.maxCapacity?.toLocaleString() || 'Unlimited'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-mono text-[11px] text-text-muted uppercase flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-secondary" /> Access Pass
          </span>
          <p className="font-semibold text-white text-sm">
            {event.eventType === 'Paid' ? 'Pass Required (₹250)' : 'Open Free Pass'}
          </p>
        </div>
      </div>

      {/* Tags Section */}
      {event.tags && event.tags.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-text-muted uppercase">
            <Tag className="w-3.5 h-3.5 text-secondary" />
            <span>Discover Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
