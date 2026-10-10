import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Eye,
  AlertCircle,
  Calendar,
  Users,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { OrganizerShell } from '../../components/organizer/OrganizerShell';
import { OrganizerEventPreviewModal } from '../../components/organizer/OrganizerEventPreviewModal';
import { organizerEventService } from '../../services/organizerEventService';
import { useAuth } from '../../hooks/useAuth';
import type { OrganizerEvent } from '../../types/organizer';

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

export const OrganizerCreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    shortDescription: '',
    description: '',
    category: 'Tech' as (typeof CATEGORIES)[number],
    eventType: 'Free' as 'Free' | 'Paid',
    date: 'OCT 28, 2026',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: '',
    organizer: 'Developer Student Club SRM',
    capacity: 250,
    tags: 'tech, campus, workshop',
    registrationDeadline: 'OCT 26, 2026',
    contactEmail: 'organizer@srm.campus',
    image: '/images/events/hacksrm.jpg',
    additionalNotes: '',
  });

  // Validation & async submission states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);

  // Time conversion helper for validation
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

  const validateForm = (isPublishing = true): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.title.trim()) {
      errs.title = 'Event title is required.';
    } else if (formData.title.length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }

    if (isPublishing) {
      if (!formData.shortDescription.trim()) {
        errs.shortDescription = 'Short description is required.';
      }
      if (!formData.description.trim()) {
        errs.description = 'Full description is required.';
      }
      if (!formData.venue.trim()) {
        errs.venue = 'Venue location is required.';
      }
      if (!formData.organizer.trim()) {
        errs.organizer = 'Organizer/Community name is required.';
      }
      if (!formData.date.trim()) {
        errs.date = 'Date is required.';
      }
    }

    // Capacity validation
    if (formData.capacity <= 0 || isNaN(formData.capacity)) {
      errs.capacity = 'Capacity must be a positive number.';
    }

    // Time validation (if both provided)
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

  const handleInputChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear inline error if any
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      setErrors({ title: 'Please provide at least a title for the draft.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const tagArray = formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await organizerEventService.saveDraft(
        {
          title: formData.title,
          subtitle: formData.subtitle,
          shortDescription: formData.shortDescription,
          description: formData.description || formData.shortDescription || 'Draft event',
          category: formData.category,
          eventType: formData.eventType,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          time: `${formData.startTime} - ${formData.endTime} IST`,
          venue: formData.venue || 'TBA',
          organizer: formData.organizer || 'Campus Organizer',
          capacity: Number(formData.capacity) || 100,
          tags: tagArray,
          registrationDeadline: formData.registrationDeadline,
          contactEmail: formData.contactEmail,
          image: formData.image,
          additionalNotes: formData.additionalNotes,
        },
        user?.id
      );

      navigate('/organizer/events');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save draft to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishSubmit = () => {
    if (!validateForm(true)) return;
    setPublishConfirmOpen(true);
  };

  const executePublish = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const tagArray = formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await organizerEventService.createEvent(
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
          status: 'PUBLISHED',
          badge: 'NEW',
          image: formData.image,
          tags: tagArray,
          registrationDeadline: formData.registrationDeadline,
          contactEmail: formData.contactEmail,
          additionalNotes: formData.additionalNotes,
        },
        user?.id
      );

      setPublishConfirmOpen(false);
      navigate('/organizer/events');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to publish event to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview object
  const previewPayload: Partial<OrganizerEvent> = {
    title: formData.title || 'Untitled Event',
    subtitle: formData.subtitle,
    shortDescription: formData.shortDescription,
    description: formData.description,
    category: formData.category,
    eventType: formData.eventType,
    date: formData.date,
    startTime: formData.startTime,
    endTime: formData.endTime,
    time: `${formData.startTime} - ${formData.endTime} IST`,
    venue: formData.venue || 'Venue TBA',
    organizer: formData.organizer || 'Campus Organizer',
    capacity: Number(formData.capacity) || 100,
    status: 'DRAFT',
    image: formData.image,
    tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    contactEmail: formData.contactEmail,
    additionalNotes: formData.additionalNotes,
  };

  return (
    <OrganizerShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
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
            <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-lime" />
            <span className="text-[11px] font-mono uppercase text-text-muted">
              CAMPUS STUDIO CREATOR
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            CREATE CAMPUS EVENT
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Fill in details to launch your event. You can save as draft anytime or review in the student attendee preview.
          </p>
        </div>

        {submitError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Form Sections */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePublishSubmit();
          }}
          className="space-y-8"
        >
          {/* SECTION 1: Basic Information */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <h2 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" /> 1. Basic Information
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
                  placeholder="e.g. SRM AI INNOVATION HACKATHON 2026"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.title && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="e.g. Build. Break. Repeat."
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
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
                    Event Pass Type <span className="text-rose-400">*</span>
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
                  Short Description (Summary) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="A concise 1-2 sentence hook displayed on event cards."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.shortDescription ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.shortDescription && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.shortDescription}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Full Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Comprehensive event details, guidelines, schedule breakdown, and prerequisites."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all`}
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
                  placeholder="e.g. OCT 28, 2026 or NOV 02 - 04, 2026"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.date ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.date && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Start Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  End Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  placeholder="04:00 PM"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.endTime ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all`}
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
                  Venue / Location <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  placeholder="e.g. Tech Park Auditorium 301"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.venue ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.venue && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.venue}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Host Community / Organizer <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  placeholder="e.g. Developer Student Club SRM"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border ${
                    errors.organizer ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  } text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all`}
                />
                {errors.organizer && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.organizer}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Capacity & Registration Settings */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <h2 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
              <Users className="w-4 h-4" /> 3. Capacity & Contacts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                  Max Capacity <span className="text-rose-400">*</span>
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
                  Registration Deadline
                </label>
                <input
                  type="text"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  placeholder="e.g. OCT 26, 2026"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
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
                  placeholder="organizer@campus.edu"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
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
                  placeholder="ai, robotics, srm, coding"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
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
                  placeholder="e.g. Laptops required, light refreshments provided."
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Cover Image */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 4. Cover Image
            </h2>

            <p className="text-xs text-text-muted">
              Choose from high-definition campus event visual presets or supply an image path.
            </p>

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

          {/* Sticky / Bottom Action Bar */}
          <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-[#08090D]/95 backdrop-blur-xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/organizer/events')}
              className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
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
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Event</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {publishConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#08090D] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">PUBLISH EVENT?</h3>
                <p className="text-xs text-text-muted">
                  This will register the event in the live database.
                </p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Your event will be saved in Supabase with status <span className="text-secondary font-bold">PUBLISHED</span> and become instantly visible to students across campus.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPublishConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={executePublish}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-secondary text-black hover:bg-secondary-hover shadow-glow-lime transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Confirm Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <OrganizerEventPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        event={previewPayload}
      />
    </OrganizerShell>
  );
};
