import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Calendar, Clock, MapPin, Check, ArrowRight, BookmarkCheck } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { registrationService } from '../../services/registrationService';
import { RegistrationForm } from './RegistrationForm';
import { RegistrationSuccess } from './RegistrationSuccess';
import type { EventItem } from '../../types';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
  onRegistered?: () => void;
}

type ModalView = 'form' | 'already-registered' | 'success';

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
  onRegistered,
}) => {
  const isAlreadyRegistered = registrationService.isEventRegistered(event.id);
  const [activeViewOverride, setActiveViewOverride] = useState<ModalView | null>(null);

  const view: ModalView = activeViewOverride ?? (isAlreadyRegistered ? 'already-registered' : 'form');

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setActiveViewOverride(null);
    onClose();
  }, [onClose]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Entrance GSAP animation
  useEffect(() => {
    if (!isOpen || prefersReducedMotion || !modalRef.current) return;

    const ctx = gsap.context(() => {
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
      }
      gsap.fromTo(
        modalRef.current,
        { scale: 0.96, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, [isOpen, prefersReducedMotion]);

  if (!isOpen) return null;

  const handleFormSuccess = () => {
    setActiveViewOverride('success');
    if (onRegistered) {
      onRegistered();
    }
  };

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] rounded-3xl sm:rounded-[2.2rem] bg-[#0C0E17] border border-white/15 p-5 sm:p-8 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(139,92,246,0.25)] overflow-y-auto text-white my-auto"
      >
        {/* Accessible Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close registration dialog"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-text-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal View State Machine */}
        {view === 'form' && (
          <div className="space-y-6">
            <div className="space-y-1 pr-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-secondary font-bold">
                VYRA PASS PASSING
              </span>
              <h2
                id="registration-modal-title"
                className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight"
              >
                EVENT REGISTRATION
              </h2>
              <p className="text-xs text-text-secondary">
                Complete your details below to reserve your campus session spot.
              </p>
            </div>

            <RegistrationForm event={event} onSuccess={handleFormSuccess} />
          </div>
        )}

        {view === 'already-registered' && (
          <div className="space-y-6 text-center py-3 animate-fade-in">
            {/* Visual indicator */}
            <div className="w-16 h-16 rounded-3xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto text-secondary shadow-glow-lime">
              <BookmarkCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 border border-secondary/25 text-[10px] font-mono uppercase tracking-widest text-secondary font-bold">
                SESSION STATUS
              </span>
              <h2
                id="registration-modal-title"
                className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight"
              >
                ALREADY REGISTERED
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                You have already reserved your spot for this campus moment in your current session.
              </p>
            </div>

            {/* Event Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#08090D] border border-white/10 text-left space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-secondary font-bold">{event.category}</span>
                <span className="text-text-muted text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3 text-secondary" /> Pass Active
                </span>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                {event.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-text-secondary pt-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="truncate">{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                CLOSE
              </button>

              <button
                type="button"
                onClick={() => setActiveViewOverride('success')}
                className="flex-1 py-3.5 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VIEW MY REGISTRATION</span>
                <ArrowRight className="w-4 h-4 text-secondary" />
              </button>
            </div>
          </div>
        )}

        {view === 'success' && (
          <RegistrationSuccess event={event} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};
