import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Layers,
  CheckCircle2,
  FileEdit,
  Users,
  ArrowRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import gsap from 'gsap';
import { OrganizerShell } from '../../components/organizer/OrganizerShell';
import { OrganizerEventPreviewModal } from '../../components/organizer/OrganizerEventPreviewModal';
import { organizerEventService } from '../../services/organizerEventService';
import { organizerAnalyticsService } from '../../services/organizerAnalyticsService';
import { useAuth } from '../../hooks/useAuth';
import type { OrganizerEvent } from '../../types/organizer';

export const OrganizerOverview: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>(() => organizerEventService.getAllEvents());
  const [previewEvent, setPreviewEvent] = useState<OrganizerEvent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      organizerEventService.syncOrganizerEvents(user.id);
      organizerAnalyticsService.syncRemoteAttendees(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const unsubscribe = organizerEventService.subscribe(() => {
      setEvents(organizerEventService.getAllEvents());
    });
    return unsubscribe;
  }, []);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.overview-metric-card', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
      gsap.from('.overview-section', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED').length;
  const draftEvents = events.filter((e) => e.status === 'DRAFT').length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registrations || 0), 0);

  const recentEvents = events.slice(0, 4);

  return (
    <OrganizerShell>
      <div ref={containerRef} className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 p-6 sm:p-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-[90px] pointer-events-none -z-10" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-secondary/15 text-secondary border border-secondary/30 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> ORGANIZER STUDIO
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-white/5 text-text-muted border border-white/10">
                  CAMPUS MANAGEMENT
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
                MAKE MOMENTS HAPPEN.
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Welcome to your campus command studio. Draft, publish, and monitor your club and university events with real-time attendee intelligence.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <Link
                to="/organizer/events/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover transition-all duration-200 shadow-glow-lime hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
              <Link
                to="/organizer/events"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <span>My Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="overview-metric-card p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Total Events</span>
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white">
              {totalEvents}
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-2">
              Across all stages
            </p>
          </div>

          <div className="overview-metric-card p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-secondary/40 transition-all duration-300">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Published</span>
              <CheckCircle2 className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-secondary">
              {publishedEvents}
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-2">
              Live on campus
            </p>
          </div>

          <div className="overview-metric-card p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-amber-400/40 transition-all duration-300">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Drafts</span>
              <FileEdit className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-amber-300">
              {draftEvents}
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-2">
              In preparation
            </p>
          </div>

          <div className="overview-metric-card p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-electric-purple/40 transition-all duration-300">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Registrations</span>
              <Users className="w-4 h-4 text-electric-purple" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white">
              {totalRegistrations}
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-2">
              Total passes reserved
            </p>
          </div>
        </div>

        {/* 2-Column Split: Recent Events Table + Studio Quickstart */}
        <div className="overview-section grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Events (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-white">
                Recent Events
              </h2>
              <Link
                to="/organizer/events"
                className="text-xs font-mono text-secondary hover:text-white transition-colors inline-flex items-center gap-1 group"
              >
                <span>View all ({totalEvents})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {recentEvents.length > 0 ? (
              <div className="space-y-3">
                {recentEvents.map((ev) => {
                  const statusColor =
                    ev.status === 'PUBLISHED'
                      ? 'bg-secondary/15 text-secondary border-secondary/30'
                      : ev.status === 'DRAFT'
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                      : 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30';

                  return (
                    <div
                      key={ev.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                          <img
                            src={ev.image}
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${statusColor}`}
                            >
                              {ev.status}
                            </span>
                            <span className="text-[11px] font-mono text-text-muted">
                              {ev.date}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-white truncate group-hover:text-glow-purple transition-colors">
                            {ev.title}
                          </h3>
                          <p className="text-xs text-text-muted truncate">
                            {ev.venue} • {ev.registrations} registered
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => setPreviewEvent(ev)}
                          title="Preview attendee layout"
                          className="p-2 rounded-xl text-text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/organizer/events/${ev.id}/edit`}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                <p className="text-xs font-mono uppercase tracking-widest text-text-muted">
                  NO EVENTS CREATED YET
                </p>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Create and publish your first campus event to begin managing registrations and check-ins.
                </p>
                <div className="pt-1">
                  <Link
                    to="/organizer/events/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase bg-secondary text-black hover:bg-secondary-hover shadow-glow-lime transition-all"
                  >
                    <span>Create First Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Studio Guide (1 col) */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white">
              Studio Quick Start
            </h2>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Draft Your Moment</h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Fill in event dates, times, venues, and descriptions. Save progress anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Preview Layout</h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Click Preview on any event to see the exact student attendee card layout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Publish to Campus</h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Make your event live on the central discovery calendar for university students.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <Link
                  to="/organizer/analytics"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                >
                  <span>Open Intelligence Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <OrganizerEventPreviewModal
        isOpen={!!previewEvent}
        onClose={() => setPreviewEvent(null)}
        event={previewEvent}
      />
    </OrganizerShell>
  );
};

export default OrganizerOverview;
