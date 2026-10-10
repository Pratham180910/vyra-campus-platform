import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Calendar, Clock, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { EventItem } from '../../types';

interface RegistrationSuccessProps {
  event: EventItem;
  onClose: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ event, onClose }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Confirmation visual pop and glow
      gsap.fromTo(
        '.success-visual',
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );

      // 2. Headings reveal
      gsap.fromTo(
        '.success-heading-block',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.15 }
      );

      // 3. Dynamic event info card
      gsap.fromTo(
        '.success-event-card',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.25 }
      );

      // 4. CTA buttons stagger
      gsap.fromTo(
        '.success-cta-btn',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.35 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  const handleViewEvent = () => {
    onClose();
    navigate(`/events/${event.id}`);
  };

  return (
    <div ref={containerRef} className="space-y-6 text-center py-2">
      {/* Prominent Geometric Confirmation Visual */}
      <div className="success-visual relative mx-auto w-20 h-20 flex items-center justify-center">
        {/* Ambient Ring Glow */}
        <div
          className="absolute inset-0 rounded-3xl bg-secondary/20 blur-xl pointer-events-none animate-pulse"
          aria-hidden="true"
        />

        {/* Outer Geometric Frame */}
        <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-secondary via-primary to-[#08090D] p-[2px] shadow-glow-lime">
          <div className="w-full h-full bg-[#08090D] rounded-[22px] flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
          </div>
        </div>
      </div>

      {/* Headings */}
      <div className="success-heading-block space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/25 text-[11px] font-mono font-bold uppercase tracking-widest text-secondary shadow-glow-lime">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SESSION SPOT CONFIRMED</span>
        </div>

        <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
          YOU'RE IN.
        </h3>

        <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
          Your place for this campus moment has been reserved.
        </p>
      </div>

      {/* Dynamic Event Summary Card */}
      <div className="success-event-card p-5 sm:p-6 rounded-3xl bg-[#090B12] border border-white/10 text-left space-y-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-secondary font-bold">
            CONFIRMED EVENT PASS
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-text-muted">
            <ShieldCheck className="w-3 h-3 text-secondary" />
            <span>Digital Node Access</span>
          </span>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
            {event.title}
          </h4>
          {event.subtitle && (
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mt-0.5">
              {event.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-text-secondary pt-1">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-white font-medium truncate">{event.date}</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="text-white font-medium truncate">{event.time}</span>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="text-white font-medium truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleViewEvent}
          className="success-cta-btn flex-1 py-3.5 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>VIEW EVENT</span>
          <ArrowRight className="w-3.5 h-3.5 text-secondary" />
        </button>

        <button
          type="button"
          onClick={handleGoToDashboard}
          className="success-cta-btn flex-1 py-3.5 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>GO TO MY VYRA</span>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </button>
      </div>
    </div>
  );
};
