import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowUpRight, Sparkles } from 'lucide-react';
import { SaveEventButton } from './SaveEventButton';
import type { EventItem } from '../../types';

export interface EventCardProps {
  event: EventItem;
  index?: number;
  recommendationBadge?: string;
  recommendationReason?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  recommendationBadge,
  recommendationReason,
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  // Micro 3D tilt and image parallax on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click originated from an interactive child (e.g. Save button or Link), do not trigger card navigation
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    navigate(`/events/${event.id}`);
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Hackathons':
        return 'text-[#C4FF3D] bg-[#C4FF3D]/10 border-[#C4FF3D]/30';
      case 'Cultural':
        return 'text-[#F472B6] bg-[#F472B6]/10 border-[#F472B6]/30';
      case 'Workshops':
        return 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30';
      case 'Sports':
        return 'text-[#FB923C] bg-[#FB923C]/10 border-[#FB923C]/30';
      default:
        return 'text-primary bg-primary/10 border-primary/30';
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
      }}
      className="event-card-item group relative bg-[#10121A] rounded-3xl border border-white/10 hover:border-primary/50 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_20px_50px_rgba(139,92,246,0.22)] transition-shadow duration-300 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#0A0C14]">
        {!hasImageError ? (
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            onError={() => setHasImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.88] group-hover:brightness-100"
            style={{
              transform: isHovered ? `scale(1.06) translate(${tilt.x * 1.5}px, ${-tilt.y * 1.5}px)` : 'scale(1)',
            }}
          />
        ) : (
          /* Graceful VYRA Fallback Background */
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#1C1335] via-[#10121E] to-[#0A101D] flex items-center justify-center">
            <div className="absolute w-44 h-44 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-secondary/15 blur-xl" />

            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="w-full h-full border border-white/20 rounded-2xl m-4" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center mb-2 shadow-glow-purple">
                <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              </div>
              <span className="font-display font-bold text-sm tracking-wide text-white/90">
                {event.title}
              </span>
              <span className="text-[11px] font-mono text-text-muted mt-0.5">
                VYRA CAMPUS EVENT
              </span>
            </div>
          </div>
        )}

        {/* Gradient scrim over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10121A] via-transparent to-black/30 pointer-events-none" />

        {/* Category Badge & Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border backdrop-blur-md ${getCategoryTheme(
              event.category
            )} transition-transform duration-300 group-hover:scale-105`}
          >
            {event.category}
          </span>

          <div className="flex items-center gap-2">
            {recommendationBadge ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-electric-purple/50 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-acid-lime" />
                <span>{recommendationBadge}</span>
              </span>
            ) : event.badge ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-white/10 text-white backdrop-blur-md border border-white/20">
                {event.badge}
              </span>
            ) : null}
            {/* Integrated Save / Wishlist Button */}
            <SaveEventButton eventId={event.id} eventTitle={event.title} variant="icon-only" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtitle / Catchphrase */}
          <p className="text-xs font-mono uppercase tracking-widest text-secondary font-medium mb-1.5">
            {event.subtitle}
          </p>

          {/* Title */}
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-glow-purple transition-colors duration-200">
            {event.title}
          </h3>

          {/* Description */}
          <p className="mt-2.5 text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Personalization Reason if Recommended */}
          {recommendationReason && (
            <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-electric-purple/[0.1] border border-electric-purple/25 flex items-center gap-2 text-xs font-mono text-[#D8B4FE]">
              <Sparkles className="w-3 h-3 text-acid-lime shrink-0" />
              <span className="truncate">{recommendationReason}</span>
            </div>
          )}
        </div>

        {/* Event Meta Details */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className="font-medium text-text-primary">{event.date}</span>
            <span className="text-text-muted">• {event.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-text-muted shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          {/* Registrations count & Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-muted font-mono">
              <Users className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-white font-semibold">
                {event.registrations.toLocaleString()}
              </span>
              <span>registered</span>
            </div>

            {/* Circular Arrow Button */}
            <Link
              to={`/events/${event.id}`}
              aria-label={`View details for ${event.title}`}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
