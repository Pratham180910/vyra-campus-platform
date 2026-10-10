import React, { useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ArrowLeft,
  Mail,
  FileText,
} from 'lucide-react';
import type { OrganizerEvent } from '../../types/organizer';

interface OrganizerEventPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Partial<OrganizerEvent> | null;
}

export const OrganizerEventPreviewModal: React.FC<OrganizerEventPreviewModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
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

  if (!isOpen || !event) return null;

  const title = event.title || 'Untitled Event';
  const subtitle = event.subtitle || '';
  const category = event.category || 'Tech';
  const date = event.date || 'Date TBA';
  const time = event.time || `${event.startTime || '09:00 AM'} - ${event.endTime || '05:00 PM'} IST`;
  const venue = event.venue || 'Venue TBA';
  const organizer = event.organizer || 'Campus Organizer';
  const capacity = event.capacity || event.maxCapacity || 100;
  const description = event.description || event.shortDescription || 'No description provided.';
  const image = event.image || '/images/events/hacksrm.jpg';
  const tags = event.tags || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl bg-[#08090D] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/20 border-b border-primary/30 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-lime animate-pulse" />
            <span className="text-secondary font-bold">ORGANIZER PREVIEW</span>
            <span className="text-white/60 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">Viewing how this moment appears to students</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Editor</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Cover Header */}
          <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden border border-white/10 group">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/50 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-primary/30 border border-primary/50 text-white backdrop-blur-md">
                  {category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-white/10 border border-white/15 text-secondary backdrop-blur-md">
                  {event.eventType || 'Free'} Pass
                </span>
                {event.status && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    STATUS: {event.status}
                  </span>
                )}
              </div>
              <h1 id="preview-title" className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-text-secondary mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 text-electric-purple flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-text-muted uppercase">DATE</p>
                <p className="text-xs font-semibold text-white truncate">{date}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-text-muted uppercase">TIME</p>
                <p className="text-xs font-semibold text-white truncate">{time}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-text-muted uppercase">VENUE</p>
                <p className="text-xs font-semibold text-white truncate">{venue}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-text-muted uppercase">CAPACITY</p>
                <p className="text-xs font-semibold text-white truncate">{capacity} Spots</p>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-secondary flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Event Overview
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {event.additionalNotes && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs font-mono uppercase text-text-muted mb-1">Additional Notes</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{event.additionalNotes}</p>
                </div>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Tags:
                  </span>
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 text-text-secondary border border-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                  Host Community
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-white">
                    {organizer.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{organizer}</p>
                    <p className="text-xs text-text-muted">Verified Organizer</p>
                  </div>
                </div>

                {event.contactEmail && (
                  <div className="pt-3 border-t border-white/5 text-xs text-text-secondary flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">{event.contactEmail}</span>
                  </div>
                )}

                {/* Disabled registration button representing preview state */}
                <div className="pt-2">
                  <button
                    disabled
                    className="w-full py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/10 text-white/50 border border-white/10 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>Register (Disabled in Preview)</span>
                  </button>
                  <p className="text-[10px] font-mono text-center text-text-muted mt-2">
                    Students will see active registration controls here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
