import React, { useEffect } from 'react';
import {
  X,
  Mail,
  GraduationCap,
  Calendar,
  Ticket,
  FileText,
} from 'lucide-react';
import type { AttendeeRecord } from '../../types/organizer';

interface AttendeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendee: AttendeeRecord | null;
}

export const AttendeeDetailModal: React.FC<AttendeeDetailModalProps> = ({
  isOpen,
  onClose,
  attendee,
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

  if (!isOpen || !attendee) return null;

  const statusColor =
    attendee.status === 'CHECKED IN'
      ? 'bg-secondary/15 text-secondary border-secondary/30'
      : attendee.status === 'REGISTERED'
      ? 'bg-electric-purple/15 text-electric-purple border-electric-purple/30'
      : 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendee-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-[#08090D] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/10 flex items-center justify-center text-white font-display font-black text-lg shadow-inner">
              {attendee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="attendee-modal-title"
                  className="text-lg font-display font-bold text-white"
                >
                  {attendee.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${statusColor}`}
                >
                  {attendee.status}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {attendee.eventTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-text-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="space-y-3.5">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase text-text-muted">Email Address</p>
              <p className="text-xs font-semibold text-white truncate">{attendee.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-secondary shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase text-text-muted">Academic Program & Year</p>
              <p className="text-xs font-semibold text-white truncate">
                {attendee.department} • {attendee.year}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-pink-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase text-text-muted">Registration Timestamp</p>
              <p className="text-xs font-semibold text-white truncate">{attendee.registrationDate}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <Ticket className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase text-text-muted">Digital Pass Code</p>
              <p className="text-xs font-mono font-bold text-amber-300 truncate tracking-wider">
                {attendee.ticketCode}
              </p>
            </div>
          </div>

          {attendee.notes && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
              <FileText className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-text-muted">Organizer Notes</p>
                <p className="text-xs text-text-secondary leading-relaxed">{attendee.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">
            STUDENT ID VERIFIED • SRM 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
