import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Users,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { OrganizerShell } from '../../components/organizer/OrganizerShell';
import { organizerClubService, type ClubFormData } from '../../services/organizerClubService';
import type { ClubCategory } from '../../types/club';

const CATEGORIES: ClubCategory[] = [
  'Technology',
  'AI & Robotics',
  'Coding',
  'Design',
  'Cultural',
  'Music',
  'Sports',
  'Entrepreneurship',
  'Social Impact',
  'Media',
];

const PRESET_COVERS = [
  { label: 'AI & Robotics', url: '/images/clubs/ai-society.jpg' },
  { label: 'Coding / Dev', url: '/images/clubs/codechef.jpg' },
  { label: 'Tech & Google', url: '/images/clubs/gdsc.jpg' },
  { label: 'Robotics Guild', url: '/images/clubs/robotics.jpg' },
  { label: 'Campus Fest', url: '/images/events/rhythms.jpg' },
  { label: 'Hardware Tech', url: '/images/events/hacksrm.jpg' },
];

export const OrganizerEditClub: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoadingClub, setIsLoadingClub] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ClubFormData>({
    name: '',
    acronym: '',
    category: 'Technology',
    department: '',
    description: '',
    cover_image: '/images/clubs/ai-society.jpg',
    logo: '',
    verified: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoadingClub(true);
    organizerClubService.getClubById(id).then(({ data, error }) => {
      if (error || !data) {
        setLoadError(error || 'Club not found in database.');
      } else {
        setFormData({
          name: data.name,
          acronym: data.acronym || '',
          category: data.category,
          department: data.department || '',
          description: data.description || '',
          cover_image: data.cover_image || '/images/clubs/ai-society.jpg',
          logo: data.logo || '',
          verified: Boolean(data.verified),
        });
      }
      setIsLoadingClub(false);
    });
  }, [id]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Club name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.category) {
      errs.category = 'Category is required.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Club description is required.';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Description should provide at least 15 characters of detail.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const { data, error } = await organizerClubService.updateClub(id, formData);

    if (error) {
      setSubmitError(error);
      setIsSubmitting(false);
      return;
    }

    if (data) {
      navigate('/organizer/clubs');
    }
  };

  if (isLoadingClub) {
    return (
      <OrganizerShell>
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">
            FETCHING CLUB DETAILS FROM SUPABASE...
          </p>
        </div>
      </OrganizerShell>
    );
  }

  if (loadError) {
    return (
      <OrganizerShell>
        <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-white text-lg">Unable to load club</h3>
            <p className="text-xs text-rose-300 font-mono">{loadError}</p>
          </div>
          <Link
            to="/organizer/clubs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Clubs</span>
          </Link>
        </div>
      </OrganizerShell>
    );
  }

  return (
    <OrganizerShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link
            to="/organizer/clubs"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Clubs</span>
          </Link>

          <div className="flex items-center gap-3">
            {id && (
              <Link
                to={`/clubs/${id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-secondary hover:underline"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-electric-purple/20 text-electric-purple border border-primary/30">
              EDIT MODE
            </span>
          </div>
        </div>

        {/* Header Block */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-secondary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUS ORGANIZATION STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
            EDIT CLUB: {formData.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
            Update community identity, department credentials, verified badge, and public branding in Supabase.
          </p>
        </div>

        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Primary Identity Card */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-5">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  General Information
                </h2>

                {/* Club ID (Immutable identifier) */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-text-muted">
                    Database Identifier (Permanent Slug)
                  </label>
                  <input
                    type="text"
                    value={id}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.01] border border-white/5 font-mono text-xs text-text-muted cursor-not-allowed"
                  />
                  <p className="text-[10px] font-mono text-text-muted">
                    Primary key in public.clubs; cannot be changed after creation.
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="edit-club-name" className="text-xs font-mono uppercase text-text-muted">
                    Club / Community Name *
                  </label>
                  <input
                    id="edit-club-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. AI Society SRM"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary/50"
                  />
                  {errors.name && <p className="text-[11px] text-rose-400 font-mono">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Acronym */}
                  <div className="space-y-1.5">
                    <label htmlFor="edit-club-acronym" className="text-xs font-mono uppercase text-text-muted">
                      Acronym / Abbreviation
                    </label>
                    <input
                      id="edit-club-acronym"
                      type="text"
                      value={formData.acronym || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, acronym: e.target.value.toUpperCase() }))}
                      placeholder="e.g. AIS"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label htmlFor="edit-club-category" className="text-xs font-mono uppercase text-text-muted">
                      Category *
                    </label>
                    <select
                      id="edit-club-category"
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as ClubCategory }))}
                      className="w-full px-4 py-3 rounded-xl bg-[#0F111A] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label htmlFor="edit-club-dept" className="text-xs font-mono uppercase text-text-muted">
                    Faculty / Department / School
                  </label>
                  <input
                    id="edit-club-dept"
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. School of Computing & Data Science"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="edit-club-desc" className="text-xs font-mono uppercase text-text-muted">
                    Mission & Description *
                  </label>
                  <textarea
                    id="edit-club-desc"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, description: e.target.value }));
                      if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                    }}
                    placeholder="Describe the club's focus, activities, weekly meets, and leadership goals..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 leading-relaxed"
                  />
                  {errors.description && (
                    <p className="text-[11px] text-rose-400 font-mono">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Media & Verification Card */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-5">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Media & Status
                </h2>

                {/* Cover Image */}
                <div className="space-y-2">
                  <label htmlFor="edit-club-cover" className="text-xs font-mono uppercase text-text-muted">
                    Cover Banner Image URL
                  </label>
                  <input
                    id="edit-club-cover"
                    type="text"
                    value={formData.cover_image || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cover_image: e.target.value }))}
                    placeholder="/images/clubs/ai-society.jpg"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary/50"
                  />

                  {/* Preset Buttons */}
                  <div className="pt-2">
                    <p className="text-[10px] font-mono uppercase text-text-muted mb-2">Or choose a campus preset:</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COVERS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, cover_image: preset.url }))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                            formData.cover_image === preset.url
                              ? 'bg-secondary/20 border-secondary text-secondary font-bold'
                              : 'bg-white/5 border-white/5 text-text-muted hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logo URL */}
                <div className="space-y-1.5">
                  <label htmlFor="edit-club-logo" className="text-xs font-mono uppercase text-text-muted">
                    Club Emblem / Logo URL (Optional)
                  </label>
                  <input
                    id="edit-club-logo"
                    type="text"
                    value={formData.logo || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://... or /images/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Verification Toggle */}
                <div className="pt-2 flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                      <span className="text-xs font-mono uppercase font-bold text-white">
                        Campus Verified Status
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      Mark as an officially recognized SRMIST student organization.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData((prev) => ({ ...prev, verified: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 text-secondary focus:ring-0 focus:ring-offset-0 bg-[#08090D] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right 1 Col: Live Card Preview */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-4">
                <p className="text-xs font-mono uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" /> Live Card Preview
                </p>

                {/* Card Preview */}
                <div className="rounded-3xl bg-[#0B0D16] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="relative h-36 w-full bg-[#10121D]">
                    <img
                      src={formData.cover_image || '/images/clubs/ai-society.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/clubs/ai-society.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D16] via-[#0B0D16]/40 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-black/60 text-white border border-white/10">
                        {formData.category}
                      </span>
                      {formData.verified ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-secondary/20 text-secondary border border-secondary/30">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-white/10 text-text-muted border border-white/10">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-display font-bold text-base text-white truncate">
                      {formData.name || 'Your Club Name'}
                    </h3>
                    <p className="text-[11px] font-mono text-text-muted truncate">
                      {formData.department || 'Campus Department'}
                    </p>
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {formData.description || 'Club description will appear here as you type...'}
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Club Changes</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/organizer/clubs"
                    className="w-full py-3 rounded-full font-mono text-xs font-medium uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 text-center block transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </OrganizerShell>
  );
};
