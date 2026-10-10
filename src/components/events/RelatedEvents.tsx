import React from 'react';
import { EventCard } from './EventCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { EventItem } from '../../types';

interface RelatedEventsProps {
  relatedEvents: EventItem[];
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ relatedEvents }) => {
  if (relatedEvents.length === 0) return null;

  return (
    <section className="w-full pt-10 sm:pt-14 border-t border-white/10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-secondary/15 text-secondary">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
              CURATED RECOMMENDATIONS
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            YOU MIGHT ALSO LIKE
          </h2>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-mono text-secondary hover:text-white transition-colors group"
        >
          <span>EXPLORE ALL EVENTS</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {relatedEvents.map((item, index) => (
          <EventCard key={item.id} event={item} index={index} />
        ))}
      </div>
    </section>
  );
};
