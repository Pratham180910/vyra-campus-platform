import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  MapPin,
  Users,
  Copy,
  Edit3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { OrganizerShell } from '../../components/organizer/OrganizerShell';
import { OrganizerEventPreviewModal } from '../../components/organizer/OrganizerEventPreviewModal';
import { organizerEventService } from '../../services/organizerEventService';
import { useAuth } from '../../hooks/useAuth';
import type { OrganizerEvent, OrganizerEventStatus } from '../../types/organizer';

export const OrganizerEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>(() => organizerEventService.getAllEvents());
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | OrganizerEventStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewEvent, setPreviewEvent] = useState<OrganizerEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmation modal state for publish / unpublish
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    event: OrganizerEvent | null;
    action: 'PUBLISH' | 'UNPUBLISH';
  }>({
    isOpen: false,
    event: null,
    action: 'PUBLISH',
  });

  useEffect(() => {
    if (user?.id) {
      organizerEventService.syncOrganizerEvents(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const unsubscribe = organizerEventService.subscribe(() => {
      setEvents(organizerEventService.getAllEvents());
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter & search events
  const filteredEvents = useMemo(() => {
    let result = events;

    if (selectedStatus !== 'ALL') {
      result = result.filter((e) => e.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
      );
    }

    return result;
  }, [events, selectedStatus, searchQuery]);

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await organizerEventService.duplicateEvent(id, user?.id);
      if (duplicated) {
        showToast(`Duplicated "${duplicated.title}" as draft!`);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate event.');
    }
  };

  const openConfirmModal = (event: OrganizerEvent, action: 'PUBLISH' | 'UNPUBLISH') => {
    setConfirmModal({
      isOpen: true,
      event,
      action,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.event) return;
    const { id, title } = confirmModal.event;

    try {
      if (confirmModal.action === 'PUBLISH') {
        await organizerEventService.setStatus(id, 'PUBLISHED', user?.id);
        showToast(`Published "${title}"!`);
      } else {
        await organizerEventService.setStatus(id, 'DRAFT', user?.id);
        showToast(`Unpublished "${title}" to draft.`);
      }
    } catch (err: unknown) {
      showToast(`Action failed: ${err instanceof Error ? err.message : 'Database error'}`);
    }

    setConfirmModal({ isOpen: false, event: null, action: 'PUBLISH' });
  };

  const statusCounts = {
    ALL: events.length,
    PUBLISHED: events.filter((e) => e.status === 'PUBLISHED').length,
    DRAFT: events.filter((e) => e.status === 'DRAFT').length,
    CLOSED: events.filter((e) => e.status === 'CLOSED').length,
  };

  return (
    <OrganizerShell>
      <div className="space-y-6">
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#08090D] border border-secondary/40 text-secondary shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-xs font-mono font-semibold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-primary/20 text-electric-purple border border-primary/30">
                MOMENTS PORTFOLIO
              </span>
              <span className="text-xs font-mono text-text-muted">
                {events.length} total
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              MY EVENTS
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Manage your campus moments, review draft pipelines, and preview attendee displays.
            </p>
          </div>

          <Link
            to="/organizer/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all duration-200 self-start sm:self-auto hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['ALL', 'PUBLISHED', 'DRAFT', 'CLOSED'] as const).map((status) => {
              const active = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                    active
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-white/[0.03] text-text-muted hover:text-white border-white/5 hover:border-white/15'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-text-muted'
                    }`}
                  >
                    {statusCounts[status]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, venue..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white/[0.03] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Events List / Grid */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <AlertCircle className="w-8 h-8 text-text-muted mx-auto" />
            <h3 className="text-base font-semibold text-white">NO EVENTS FOUND</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              No campus events match the selected criteria. Try adjusting your search query or status filter.
            </p>
            <div className="pt-2">
              <Link
                to="/organizer/events/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New Event</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((ev) => {
              const statusColor =
                ev.status === 'PUBLISHED'
                  ? 'bg-secondary/15 text-secondary border-secondary/30'
                  : ev.status === 'DRAFT'
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                  : 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30';

              const capacityPercentage = Math.min(
                100,
                Math.round(((ev.registrations || 0) / (ev.capacity || 100)) * 100)
              );

              return (
                <div
                  key={ev.id}
                  className="rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col group shadow-lg"
                >
                  {/* Card Cover & Status */}
                  <div className="relative h-44 bg-zinc-900 overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-black/30" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border backdrop-blur-md ${statusColor}`}
                      >
                        {ev.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-black/60 text-white/80 border border-white/10 backdrop-blur-md">
                        {ev.category}
                      </span>
                    </div>

                    {/* Preview Button Overlay */}
                    <button
                      onClick={() => setPreviewEvent(ev)}
                      title="Preview Student View"
                      className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10 backdrop-blur-md transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Date badge */}
                    <div className="absolute bottom-3 left-3 text-xs font-mono font-semibold text-white/90">
                      {ev.date}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-glow-purple transition-colors line-clamp-1">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-text-muted flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                        <span className="truncate">{ev.venue}</span>
                      </p>
                    </div>

                    {/* Registration Capacity Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-text-muted flex items-center gap-1">
                          <Users className="w-3 h-3" /> Registrations
                        </span>
                        <span className="text-white font-semibold">
                          {ev.registrations} / {ev.capacity}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                          style={{ width: `${capacityPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/organizer/events/${ev.id}/edit`}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/5 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDuplicate(ev.id)}
                          title="Duplicate as new draft"
                          className="p-1.5 rounded-xl text-text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewEvent(ev)}
                          title="Preview student view"
                          className="p-1.5 rounded-xl text-text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Publish / Unpublish Toggle */}
                      {ev.status === 'PUBLISHED' ? (
                        <button
                          onClick={() => openConfirmModal(ev, 'UNPUBLISH')}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-mono uppercase text-amber-300/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => openConfirmModal(ev, 'PUBLISH')}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-mono uppercase text-secondary hover:text-white bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 transition-colors font-bold"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.event && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#08090D] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  confirmModal.action === 'PUBLISH'
                    ? 'bg-secondary/20 text-secondary'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {confirmModal.action === 'PUBLISH' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {confirmModal.action === 'PUBLISH' ? 'PUBLISH EVENT?' : 'UNPUBLISH EVENT?'}
                </h3>
                <p className="text-xs text-text-muted">
                  {confirmModal.event.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {confirmModal.action === 'PUBLISH'
                ? 'This will make the event live on the public discovery calendar and allow campus students to register.'
                : 'This will revert the event to DRAFT status and remove it from public campus discovery.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setConfirmModal({ isOpen: false, event: null, action: 'PUBLISH' })}
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors ${
                  confirmModal.action === 'PUBLISH'
                    ? 'bg-secondary text-black hover:bg-secondary-hover shadow-glow-lime'
                    : 'bg-amber-500 text-black hover:bg-amber-400'
                }`}
              >
                Confirm {confirmModal.action === 'PUBLISH' ? 'Publish' : 'Unpublish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <OrganizerEventPreviewModal
        isOpen={!!previewEvent}
        onClose={() => setPreviewEvent(null)}
        event={previewEvent}
      />
    </OrganizerShell>
  );
};
