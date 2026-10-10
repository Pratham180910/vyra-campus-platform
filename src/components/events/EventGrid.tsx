import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EventCard } from './EventCard';
import type { EventItem } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface EventGridProps {
  events: EventItem[];
}

export const EventGrid: React.FC<EventGridProps> = ({ events }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Subtle GSAP entrance when the filtered events list changes
  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.event-card-item');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 25, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
        }
      );
    }
  }, [events, prefersReducedMotion]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7"
    >
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
};
