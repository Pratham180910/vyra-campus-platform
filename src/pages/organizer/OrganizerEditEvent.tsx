import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  AlertCircle,
  Calendar,
  Users,
  Image as ImageIcon,
  FileText,
  Check,
} from 'lucide-react';
import { OrganizerShell } from '../../components/organizer/OrganizerShell';
import { OrganizerEventPreviewModal } from '../../components/organizer/OrganizerEventPreviewModal';
import { organizerEventService } from '../../services/organizerEventService';
import { useAuth } from '../../hooks/useAuth';
import type { OrganizerEvent, OrganizerEventStatus } from '../../types/organizer';

const CATEGORIES = [
  'Hackathons',
  'Cultural',
  'Workshops',
  'Sports',
  'Tech',
  'Competitions',
  'Social',
] as const;

const PRESET_IMAGES = [
  { label: 'Hackathon / Tech', url: '/images/events/hacksrm.jpg' },
  { label: 'Cultural / Fest', url: '/images/events/rhythms.jpg' },
  { label: 'AI Workshop', url: '/images/events/ai-beyond.jpg' },
  { label: 'Robotics / Hardware', url: '/images/events/robotics.jpg' },
];

export const OrganizerEditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<OrganizerEvent | null>(() => {
    return id ? organizerEventService.getEventById(id) || null : null;
  });

  // Form State
  const [formData, setFormData] = useState(() => {
    const existing = id ? organizerEventService.getEventById(id) : null;
    return {
      title: existing?.title || '',
      subtitle: existing?.subtitle || '',
      shortDescription: existing?.shortDescription || (existing?.description ? existing.description.slice(0, 100) : ''),
      description: existing?.description || '',
      category: (existing?.category as (typeof CATEGORIES)[number]) || 'Tech',
      eventType: existing?.eventType || 'Free',
      date: existing?.date || '',
      startTime: existing?.startTime || '09:00 AM',
      endTime: existing?.endTime || '05:00 PM',
      venue: existing?.venue || '',
      organizer: existing?.organizer || '',
      capacity: existing?.capacity || existing?.maxCapacity || 100,
      status: (existing?.status as OrganizerEventStatus) || 'DRAFT',
      tags: existing?.tags?.join(', ') || '',
      registrationDeadline: existing?.registrationDeadline || '',
      contactEmail: existing?.contactEmail || '',
      image: existing?.image || '/images/events/hacksrm.jpg',
      additionalNotes: existing?.additionalNotes || '',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!event && id && user?.id) {
      organizerEventService.syncOrganizerEvents(user.id).then(() => {
        const found = organizerEventService.getEventById(id);
        if (found) {
          setEvent(found);
          setFormData({
            title: found.title || '',
            subtitle: found.subtitle || '',
            shortDescription: found.shortDescription || (found.description ? found.description.slice(0, 100) : ''),
            description: found.description || '',
            category: (found.category as (typeof CATEGORIES)[number]) || 'Tech',
            eventType: found.eventType || 'Free',
            date: found.date || '',
            startTime: found.startTime || '09:00 AM',
            endTime: found.endTime || '05:00 PM',
            venue: found.venue || '',
            organizer: found.organizer || '',
            capacity: found.capacity || found.maxCapacity || 100,
            status: (found.status as OrganizerEventStatus) || 'DRAFT',
            tags: found.tags?.join(', ') || '',
            registrationDeadline: found.registrationDeadline || '',
            contactEmail: found.contactEmail || '',
            image: found.image || '/images/events/hacksrm.jpg',
            additionalNotes: found.additionalNotes || '',
          });
        }
      });
    }
  }, [event, id, user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const parseTimeToMinutes = (timeStr: string): number | null => {
    try {
      const parts = timeStr.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
      if (!parts) return null;
      let hours = parseInt(parts[1], 10);
      const minutes = parseInt(parts[2], 10);
      const ampm = parts[3];

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    } catch {
      return null;
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.title.trim()) {
      errs.title = 'Event title is required.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Description is required.';
    }
    if (!formData.venue.trim()) {
      errs.venue = 'Venue is required.';
    }
    if (!formData.date.trim()) {
      errs.date = 'Date is required.';
    }
    if (formData.capacity <= 0 || isNaN(formData.capacity)) {
      errs.capacity = 'Capacity must be positive.';
    }

    if (formData.startTime && formData.endTime) {
      const startMinutes = parseTimeToMinutes(formData.startTime);
      const endMinutes = parseTimeToMinutes(formData.endTime);
      if (startMinutes !== null && endMinutes !== null && endMinutes <= startMinutes) {
        errs.endTime = 'End time must be after start time.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm() || !id) return;

    setIsSaving(true);
    try {
      const tagArray = formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await organizerEventService.updateEvent(
        id,
        {
          title: formData.title,
          subtitle: formData.subtitle,
          shortDescription: formData.shortDescription,
          description: formData.description,
          category: formData.category,
          eventType: formData.eventType,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          time: `${formData.startTime} - ${formData.endTime} IST`,
          venue: formData.venue,
          organizer: formData.organizer,
          capacity: Number(formData.capacity),
          maxCapacity: Number(formData.capacity),
          status: formData.status,
          image: formData.image,
          tags: tagArray,
          registrationDeadline: formData.registrationDeadline,
          contactEmail: formData.contactEmail,
          additionalNotes: formData.additionalNotes,
        },
        user?.id
      );

      showToast('Changes saved successfully to database!');
      setTimeout(() => {
        navigate('/organizer/events');
      }, 800);
    } catch (err: any) {
      showToast(err.message || 'Failed to update event in database.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!event) {
    return (
      <OrganizerShell>
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">EVENT NOT FOUND</h2>
          <p className="text-xs text-text-muted">
            The requested event ID could not be found in your campus organizer workspace.
          </p>
          <Link
            to="/organizer/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to My Events</span>
          </Link>
        </div>
      </OrganizerShell>
    );
  }

  const previewPayload: Partial<OrganizerEvent> = {
    ...event,
    ...formData,
    tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
  };

  return (
    <OrganizerShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#08090D] border border-secondary/40 text-secondary shadow-2xl text-xs font-mono font-semibold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link
            to="/organizer/events"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Events</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-text-muted">
              EVENT ID: <span className="text-secondary">{id}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              EDIT EVENT
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Update information, schedule, status, and registration rules for this moment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted uppercase">Status:</span>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as OrganizerEventStatus)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase bg-[#08090D] border border-white/20 text-white focus:outline-none focus:border-secondary"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-8">
          {/* SECTION 1: Basic Information */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <h2 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" /> 1. Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Event Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.title && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#08090D] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                    Pass Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#08090D] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                  >
                    <option value="Free">Free Pass</option>
                    <option value="Paid">Paid Pass</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Full Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.description && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Schedule & Venue */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <h2 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 2. Schedule & Venue
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Date / Date Range <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.date ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.date && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Start Time
                </label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  End Time
                </label>
                <input
                  type="text"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.endTime ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.endTime && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Venue <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.venue ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.venue && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.venue}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Organizer Community
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Capacity & Tags */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <h2 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
              <Users className="w-4 h-4" /> 3. Registration & Meta
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Capacity <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value, 10) || 0)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.capacity ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.capacity && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.capacity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Deadline
                </label>
                <input
                  type="text"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Additional Notes
                </label>
                <input
                  type="text"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Cover Image */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 4. Cover Image
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  onClick={() => handleInputChange('image', preset.url)}
                  className={`relative rounded-xl overflow-hidden border text-left p-2 transition-all ${
                    formData.image === preset.url
                      ? 'border-secondary ring-2 ring-secondary/50 bg-secondary/5'
                      : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                  }`}
                >
                  <div className="h-16 rounded-lg bg-zinc-900 overflow-hidden mb-1.5">
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] font-mono font-semibold text-white truncate">
                    {preset.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-[#08090D]/95 backdrop-blur-xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/organizer/events')}
              className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-4 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveChanges}
                className="px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <OrganizerEventPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        event={previewPayload}
      />
    </OrganizerShell>
  );
};
