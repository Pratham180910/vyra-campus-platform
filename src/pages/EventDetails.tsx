import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { EventHero } from '../components/events/EventHero';
import { EventDetailsPanel } from '../components/events/EventDetailsPanel';
import { EventHighlights } from '../components/events/EventHighlights';
import { RelatedEvents } from '../components/events/RelatedEvents';
import { EventNotFound } from '../components/events/EventNotFound';
import { EventRegistrationModal } from '../components/registration/EventRegistrationModal';
import { registrationService } from '../services/registrationService';
import { eventService } from '../services/eventService';
import type { EventItem } from '../types';
import { Check, ArrowRight, ShieldCheck, Info, Loader2 } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [, setRegistrationRevision] = useState(0);
  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Scroll to top whenever event ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const isRegistered = Boolean(id && registrationService.isEventRegistered(id));

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    eventService.getEventById(id).then(({ data }) => {
      setEvent(data || undefined);
      setIsLoading(false);
      if (data) {
        eventService.getRelatedEvents(data.id, data.category, 3).then((rel) => {
          if (rel && rel.length > 0) setRelatedEvents(rel);
        });
      }
    });
  }, [id]);

  const handleRegistrationComplete = () => {
    setRegistrationRevision((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <PageShell>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-white">
          <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
          <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">
            LOADING EVENT DETAILS...
          </p>
        </div>
        <Footer />
      </PageShell>
    );
  }

  if (!event) {
    return (
      <PageShell>
        <Navbar />
        <EventNotFound />
        <Footer />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          {/* 2. Immersive Event Hero */}
          <EventHero
            event={event}
            isRegistered={isRegistered}
            onRegisterClick={() => setIsRegistrationOpen(true)}
          />

          {/* 3. Main Content Split: Left (Description & Highlights) + Right (Specs Panel) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Main Column: About & What to Expect */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-10 sm:space-y-12">
              {/* About This Event */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-primary/20 text-[#C4B5FD]">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-[#C4B5FD] font-bold">
                    ABOUT THIS EVENT
                  </h2>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-[#10121A]/70 border border-white/10 space-y-4 text-text-secondary leading-relaxed text-sm sm:text-base">
                  <p className="text-white font-medium text-base sm:text-lg">
                    {event.description}
                  </p>
                  <p>
                    Hosted live at <span className="text-white font-semibold">{event.venue}</span> by{' '}
                    <span className="text-secondary font-semibold">{event.organizer || 'Official Campus Council'}</span>. 
                    This event gathers campus builders, performers, and enthusiasts for an immersive collegiate experience.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                      Verified Campus Organization
                    </span>
                    <span>•</span>
                    <span>Digital Verification Code Provided</span>
                  </div>
                </div>
              </section>

              {/* What to Expect (Highlights) */}
              <EventHighlights event={event} />
            </div>

            {/* Right Sticky Sidebar Column: Event Specifications Panel */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
              <EventDetailsPanel event={event} />

              {/* Sidebar Quick Register Trigger */}
              <div className="p-5 rounded-3xl bg-[#121422] border border-primary/20 flex flex-col gap-3 shadow-glow-purple">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-text-muted uppercase">Status</span>
                  <span className="text-secondary font-bold font-mono">
                    {event.maxCapacity ? `${event.maxCapacity - event.registrations} Spots Left` : 'Open Pass'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRegistrationOpen(true)}
                  className={`w-full py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                    isRegistered
                      ? 'bg-secondary text-[#08090D] border-secondary shadow-glow-lime'
                      : 'bg-primary hover:bg-primary-hover text-white border-white/20 shadow-glow-purple hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>REGISTERED ✓</span>
                    </>
                  ) : (
                    <>
                      <span>REGISTER NOW</span>
                      <ArrowRight className="w-4 h-4 text-secondary" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 4. Related Recommendations Section */}
          <RelatedEvents relatedEvents={relatedEvents} />
        </div>
      </main>

      {/* 5. Mobile Sticky Bottom Registration Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08090D]/95 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 flex items-center justify-between shadow-2xl">
        <div className="truncate pr-3">
          <p className="font-display font-bold text-xs text-white truncate">{event.title}</p>
          <p className="text-[10px] font-mono text-secondary">{event.date}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsRegistrationOpen(true)}
          className={`shrink-0 px-5 py-2.5 rounded-full font-bold text-xs transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
            isRegistered
              ? 'bg-secondary text-[#08090D] border-secondary shadow-glow-lime'
              : 'bg-primary text-white border-white/20 shadow-glow-purple'
          }`}
        >
          {isRegistered ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>REGISTERED ✓</span>
            </>
          ) : (
            <>
              <span>REGISTER NOW</span>
              <ArrowRight className="w-3.5 h-3.5 text-secondary" />
            </>
          )}
        </button>
      </div>

      {/* 6. Event Registration Modal */}
      <EventRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        event={event}
        onRegistered={handleRegistrationComplete}
      />

      {/* 7. Footer */}
      <Footer />
    </PageShell>
  );
};
