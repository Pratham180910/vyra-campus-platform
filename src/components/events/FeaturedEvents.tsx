import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventService } from '../../services/eventService';
import { EventCard } from './EventCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';
import type { EventItem } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedEvents: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    eventService.getPublishedEvents().then(({ data }) => {
      if (data) setEvents(data.slice(0, 4));
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !gridRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Staggered cards entrance
      const cards = gridRef.current?.querySelectorAll('.event-card-item');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="campus-pulse"
      ref={sectionRef}
      className="w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 relative z-20"
    >
      {/* Background illumination */}
      <div 
        className="absolute top-1/2 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-secondary/15 text-secondary border border-secondary/20">
                <Flame className="w-4 h-4 fill-current" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                THE CAMPUS PULSE
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              WHAT'S HAPPENING?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-text-secondary max-w-xl">
              The events everyone is talking about. Handpicked highlights across tech, cultural, and sports.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-white transition-colors group self-start md:self-end"
          >
            <span>View All Campus Events</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Event Cards Grid */}
        {events.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
          >
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-[#0E101A] border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">NO PUBLISHED MOMENTS YET</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              Campus organizations are curating upcoming experiences. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
