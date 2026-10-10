import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowUpRight, Bookmark, CheckCircle2 } from 'lucide-react';
import { getEventStartDate } from '../../utils/calendarUtils';
import type { EventItem } from '../../types';

interface CalendarAgendaViewProps {
  events: EventItem[];
  isEventSaved: (id: string) => boolean;
  isEventRegistered: (id: string) => boolean;
}

export const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  events,
  isEventSaved,
  isEventRegistered,
}) => {
  // Sort events chronologically
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = getEventStartDate(a).getTime();
      const dateB = getEventStartDate(b).getTime();
      return dateA - dateB;
    });
  }, [events]);

  if (sortedEvents.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#0C0E17]/80 border border-white/10 space-y-3">
        <p className="font-display font-bold text-xl text-white">
          NO UPCOMING AGENDA
        </p>
        <p className="text-sm text-text-muted">
          No campus moments match your current filter.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-8 my-4">
      {sortedEvents.map((ev) => {
        const saved = isEventSaved(ev.id);
        const registered = isEventRegistered(ev.id);

        return (
          <div key={ev.id} className="relative group">
            {/* Timeline Node Marker */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-[#08090D] border-2 border-electric-purple group-hover:border-acid-lime group-hover:scale-125 transition-all shadow-glow-purple" />

            <Link
              to={`/events/${ev.id}`}
              className="p-5 sm:p-6 rounded-3xl bg-[#0C0E17]/80 hover:bg-[#121422] border border-white/10 hover:border-electric-purple/40 backdrop-blur-md transition-all duration-300 shadow-xl block space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/5 text-white border border-white/10">
                      {ev.date}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-electric-purple/15 text-electric-purple border border-electric-purple/30">
                      {ev.category}
                    </span>
                    {registered && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>REGISTERED</span>
                      </span>
                    )}
                    {saved && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-acid-lime/15 text-acid-lime border border-acid-lime/30">
                        <Bookmark className="w-3 h-3" />
                        <span>SAVED</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-display font-black text-xl text-white group-hover:text-glow-purple transition-colors">
                    {ev.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
                    {ev.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-text-secondary group-hover:text-white group-hover:bg-electric-purple transition-all shrink-0 self-start">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-text-muted">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{ev.time}</span>
                </div>

                <div className="flex items-center gap-1.5 text-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-text-muted" />
                  <span className="truncate max-w-[240px]">{ev.venue}</span>
                </div>

                {ev.organizer && (
                  <span className="text-[11px] text-text-muted">
                    Organized by {ev.organizer}
                  </span>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
