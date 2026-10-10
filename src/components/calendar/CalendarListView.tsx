import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowUpRight, Bookmark, CheckCircle2 } from 'lucide-react';
import { parseEventDates, formatDateString } from '../../utils/calendarUtils';
import type { EventItem } from '../../types';

interface CalendarListViewProps {
  events: EventItem[];
  isEventSaved: (id: string) => boolean;
  isEventRegistered: (id: string) => boolean;
}

export const CalendarListView: React.FC<CalendarListViewProps> = ({
  events,
  isEventSaved,
  isEventRegistered,
}) => {
  // Group events by primary date
  const dateGroups = React.useMemo(() => {
    const map = new Map<string, EventItem[]>();
    events.forEach((ev) => {
      const dates = parseEventDates(ev.date);
      const primaryDate = dates[0] || '2026-10-01';
      const list = map.get(primaryDate) || [];
      if (!list.some((existing) => existing.id === ev.id)) {
        list.push(ev);
      }
      map.set(primaryDate, list);
    });

    const sortedDates = Array.from(map.keys()).sort();
    return sortedDates.map((dateStr) => ({
      dateStr,
      events: map.get(dateStr) || [],
    }));
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#0C0E17]/80 border border-white/10 space-y-3">
        <p className="font-display font-bold text-xl text-white">
          NO MOMENTS FOUND
        </p>
        <p className="text-sm text-text-muted">
          Try switching your filter or explore all campus moments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dateGroups.map((group) => (
        <section key={group.dateStr} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Calendar className="w-4 h-4 text-electric-purple" />
            <h3 className="font-display font-bold text-lg text-white">
              {formatDateString(group.dateStr)}
            </h3>
            <span className="text-xs font-mono text-text-muted ml-2">
              ({group.events.length} {group.events.length === 1 ? 'event' : 'events'})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.events.map((ev) => {
              const saved = isEventSaved(ev.id);
              const registered = isEventRegistered(ev.id);

              return (
                <Link
                  key={ev.id}
                  to={`/events/${ev.id}`}
                  className="group p-5 rounded-3xl bg-[#0C0E17]/80 hover:bg-[#121422] border border-white/10 hover:border-electric-purple/40 backdrop-blur-md transition-all duration-300 shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-electric-purple/15 text-electric-purple border border-electric-purple/30">
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

                      <h4 className="font-display font-bold text-lg text-white group-hover:text-glow-purple transition-colors pt-1">
                        {ev.title}
                      </h4>

                      <p className="text-xs text-text-muted font-mono">
                        {ev.subtitle}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary group-hover:text-white group-hover:bg-electric-purple transition-all shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-text-muted">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{ev.time}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <MapPin className="w-3.5 h-3.5 text-text-muted" />
                      <span className="truncate max-w-[200px]">{ev.venue}</span>
                    </div>

                    {ev.organizer && (
                      <span className="text-[11px] text-text-muted">
                        by {ev.organizer}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
