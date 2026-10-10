import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  CalendarPlus,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import gsap from 'gsap';
import { SaveEventButton } from './SaveEventButton';
import type { EventItem } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface EventHeroProps {
  event: EventItem;
  isRegistered: boolean;
  onRegisterClick?: () => void;
  onRegisterToggle?: () => void;
}

export const EventHero: React.FC<EventHeroProps> = ({
  event,
  isRegistered,
  onRegisterClick,
  onRegisterToggle,
}) => {
  const handleRegister = onRegisterClick || onRegisterToggle;
  const [imageError, setImageError] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Entrance GSAP animation
  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.event-hero-elem',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out' }
      );
      if (imageContainerRef.current) {
        gsap.fromTo(
          imageContainerRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.0, ease: 'power2.out', delay: 0.15 }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [event.id, prefersReducedMotion]);

  // Subtle scroll parallax on hero image
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (imageContainerRef.current) {
        const scrollY = window.scrollY;
        // Subtle restrained parallax (moves slightly slower than content)
        imageContainerRef.current.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Handle Share functionality
  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `${event.title} - ${event.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or fallback
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch {
        // clipboard access unavailable
      }
    }
  };

  // Handle Add to Calendar
  const handleAddToCalendar = () => {
    // Generate Google Calendar Link
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nOrganizer: ${event.organizer || 'VYRA Campus'}`);
    const location = encodeURIComponent(event.venue);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const getCategoryBadgeClass = (category: string) => {
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
    <div ref={heroRef} className="w-full relative pb-10 sm:pb-14">
      {/* Back to Events Link */}
      <div className="event-hero-elem mb-6 sm:mb-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-mono text-text-secondary hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-secondary transition-transform group-hover:-translate-x-1" />
          <span>← BACK TO EVENTS</span>
        </Link>
      </div>

      {/* Two-Column Hero Grid: Left Content + Right Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category & Status Badge */}
          <div className="event-hero-elem flex flex-wrap items-center gap-3">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryBadgeClass(
                event.category
              )}`}
            >
              {event.category}
            </span>

            {event.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-white/10 text-white border border-white/20">
                {event.badge}
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-secondary/15 text-secondary border border-secondary/25">
              {event.eventType || 'Free Pass'}
            </span>
          </div>

          {/* Title and Subtitle */}
          <div className="event-hero-elem space-y-2">
            {event.subtitle && (
              <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-secondary font-semibold">
                {event.subtitle}
              </p>
            )}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
              {event.title}
            </h1>
          </div>

          {/* Short Description */}
          <p className="event-hero-elem text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
            {event.description}
          </p>

          {/* Quick Metadata Chips */}
          <div className="event-hero-elem grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#10121A] border border-white/10 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase text-text-muted">Date</p>
                <p className="font-semibold text-white truncate">{event.date}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#10121A] border border-white/10 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase text-text-muted">Time</p>
                <p className="font-semibold text-white truncate">{event.time}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#10121A] border border-white/10 flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-text-muted shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase text-text-muted">Venue</p>
                <p className="font-semibold text-white truncate">{event.venue}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#10121A] border border-white/10 flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase text-text-muted">Attendance</p>
                <p className="font-semibold text-white truncate">
                  {event.registrations.toLocaleString()} registered
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="event-hero-elem pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Primary Action: Register Button */}
            <button
              type="button"
              onClick={handleRegister}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 border ${
                isRegistered
                  ? 'bg-secondary text-[#08090D] border-secondary shadow-glow-lime'
                  : 'bg-primary hover:bg-primary-hover text-white border-white/20 shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isRegistered ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>REGISTERED ✓</span>
                </>
              ) : (
                <>
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4 text-secondary" />
                </>
              )}
            </button>

            {/* Secondary Action: Save Event / Wishlist */}
            <SaveEventButton
              eventId={event.id}
              eventTitle={event.title}
              variant="button"
            />

            {/* Secondary Action: Add to Calendar */}
            <button
              type="button"
              onClick={handleAddToCalendar}
              title="Add to Google Calendar"
              className="inline-flex items-center gap-2 px-5 py-4 rounded-full font-medium text-xs sm:text-sm text-text-secondary hover:text-white bg-[#10121A] hover:bg-white/10 border border-white/10 transition-colors"
            >
              <CalendarPlus className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Add to Calendar</span>
            </button>

            {/* Secondary Action: Share */}
            <button
              type="button"
              onClick={handleShare}
              title="Share event link"
              className="relative inline-flex items-center gap-2 px-5 py-4 rounded-full font-medium text-xs sm:text-sm text-text-secondary hover:text-white bg-[#10121A] hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4 text-secondary" />
              <span className="hidden sm:inline">Share</span>

              {/* Copied toast indicator */}
              {copiedToast && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-secondary text-[#08090D] font-mono text-[11px] font-bold shadow-glow-lime animate-fade-in whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>

          {/* Registration Success Confirmation Badge */}
          {isRegistered && (
            <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/25 text-xs text-secondary flex items-center gap-2.5 shadow-glow-lime">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                You are registered for this event! A pass confirmation has been saved to your session.
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Large Focal Event Image */}
        <div className="lg:col-span-6">
          <div
            ref={imageContainerRef}
            className="group relative w-full h-80 sm:h-96 lg:h-[460px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-[#10121A] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_-10px_rgba(139,92,246,0.25)] transition-transform duration-300"
          >
            {!imageError ? (
              <img
                src={event.image}
                alt={event.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center filter brightness-[0.92] group-hover:brightness-100 group-hover:scale-104 transition-all duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1F1538] via-[#10121E] to-[#0A101D] flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center mb-3 shadow-glow-purple">
                  <Sparkles className="w-7 h-7 text-secondary animate-pulse" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">{event.title}</h3>
                <p className="text-xs text-text-muted mt-1 font-mono uppercase">VYRA CAMPUS PASS</p>
              </div>
            )}

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D]/80 via-transparent to-black/20 pointer-events-none" />

            {/* Floating Top Right Badge */}
            <div className="absolute top-5 right-5 pointer-events-none">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-white/20">
                {event.organizer || 'Official Campus Event'}
              </span>
            </div>

            {/* Floating Bottom Left Badge */}
            <div className="absolute bottom-5 left-5 pointer-events-none">
              <p className="text-[11px] font-mono text-secondary tracking-widest uppercase">
                {event.date} • {event.venue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
