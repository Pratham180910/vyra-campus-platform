import React from 'react';
import { Sparkles } from 'lucide-react';
import { EventCard } from '../events/EventCard';
import type { EventItem } from '../../types';

interface UpNextSectionProps {
  events: EventItem[];
}

export const UpNextSection: React.FC<UpNextSectionProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <section className="space-y-6 pt-6 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-acid-lime/15 text-acid-lime border border-acid-lime/30">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-acid-lime">
              UP NEXT
            </span>
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            CAMPUS HIGHLIGHTS THIS MONTH
          </h3>
        </div>

        <span className="text-xs font-mono text-text-muted hidden sm:inline-block">
          Curated timeline priority
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {events.slice(0, 3).map((event, idx) => (
          <EventCard key={event.id} event={event} index={idx} />
        ))}
      </div>
    </section>
  );
};
