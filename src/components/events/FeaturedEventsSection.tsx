import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight, Flame, Sparkles } from 'lucide-react';
import type { EventItem } from '../../types';

interface FeaturedEventsSectionProps {
  events: EventItem[];
}

export const FeaturedEventsSection: React.FC<FeaturedEventsSectionProps> = ({ events }) => {
  const featuredList = events.filter((e) => e.featured).slice(0, 3);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (featuredList.length === 0) return null;

  return (
    <section className="w-full mb-12 sm:mb-16">
      <div className="flex items-center gap-2 mb-6">
        <span className="p-1 rounded-md bg-secondary/15 text-secondary border border-secondary/25">
          <Flame className="w-3.5 h-3.5 fill-current" />
        </span>
        <h2 className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
          FEATURED SPOTLIGHT
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredList.map((event) => {
          const hasError = imageErrors[event.id];

          return (
            <div
              key={event.id}
              className="group relative bg-[#10121A] rounded-3xl border border-white/10 hover:border-primary/50 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)] transition-all duration-300"
            >
              {/* Top Banner Image with Glass Badge */}
              <Link
                to={`/events/${event.id}`}
                className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0A0C14] block"
              >
                {!hasError ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [event.id]: true }))
                    }
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 filter brightness-90 group-hover:brightness-100"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#20153D] via-[#10121E] to-[#0A101D] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#10121A] via-transparent to-black/40 pointer-events-none" />

                {/* Top Badge Overlay */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-primary/20 text-[#C4B5FD] border border-primary/40 backdrop-blur-md">
                    {event.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-secondary text-[#08090D] shadow-glow-lime">
                    FEATURED
                  </span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-xs font-mono text-secondary font-medium uppercase tracking-wider mb-1">
                    {event.organizer || 'Campus Org'}
                  </p>
                  <Link to={`/events/${event.id}`} className="block">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-glow-purple transition-colors">
                      {event.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex flex-col gap-1 text-text-secondary">
                    <div className="flex items-center gap-1.5 font-medium text-text-primary">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[170px]">{event.venue}</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    aria-label={`Explore ${event.title}`}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-text-secondary group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-105"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
