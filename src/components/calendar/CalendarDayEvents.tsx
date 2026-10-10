import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowUpRight, Bookmark, CheckCircle2 } from 'lucide-react';
import { formatDateString } from '../../utils/calendarUtils';
import type { EventItem } from '../../types';

interface CalendarDayEventsProps {
  selectedDate: string; // YYYY-MM-DD
  events: EventItem[];
  isEventSaved: (id: string) => boolean;
  isEventRegistered: (id: string) => boolean;
}

export const CalendarDayEvents: React.FC<CalendarDayEventsProps> = ({
  selectedDate,
  events,
  isEventSaved,
  isEventRegistered,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-electric-purple" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
              SELECTED DAY
            </span>
          </div>
          <h3 className="font-display font-black text-xl text-white">
            {formatDateString(selectedDate)}
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-secondary">
          {events.length} {events.length === 1 ? 'MOMENT' : 'MOMENTS'}
        </span>
      </div>

      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((ev) => {
            const saved = isEventSaved(ev.id);
            const registered = isEventRegistered(ev.id);

            return (
              <Link
                key={ev.id}
                to={`/events/${ev.id}`}
                className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-electric-purple/40 transition-all duration-200 block shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-electric-purple/15 text-electric-purple border border-electric-purple/30">
                        {ev.category}
                      </span>
                      {registered && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>REGISTERED</span>
                        </span>
                      )}
                      {saved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-acid-lime/15 text-acid-lime border border-acid-lime/30">
                          <Bookmark className="w-3 h-3" />
                          <span>SAVED</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-bold text-base text-white group-hover:text-glow-purple transition-colors">
                      {ev.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted font-mono pt-1">
                      <span className="flex items-center gap-1 text-text-secondary">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>{ev.time}</span>
                      </span>
                      <span className="flex items-center gap-1 text-text-secondary">
                        <MapPin className="w-3 h-3 text-text-muted" />
                        <span className="truncate max-w-[200px]">{ev.venue}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary group-hover:text-white group-hover:bg-electric-purple group-hover:border-electric-purple transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center space-y-2">
          <p className="font-display font-bold text-base text-white">
            NOTHING SCHEDULED
          </p>
          <p className="text-xs text-text-muted max-w-xs mx-auto">
            No campus moments are scheduled for this date.
          </p>
        </div>
      )}
    </div>
  );
};
