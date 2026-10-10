import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Check,
  Plus,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  AVAILABLE_INTERESTS,
  AVATAR_STYLES,
} from '../../services/profileService';
import { ProfileAvatar } from './ProfileAvatar';
import type {
  StudentProfile,
  ProfileFormData,
  ProfileFormErrors,
  AvatarStyle,
} from '../../types/profile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSave: (data: ProfileFormData) => Promise<boolean>;
  isSaving: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  isSaving,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Form states
  const [fullName, setFullName] = useState(profile.fullName);
  const [bio, setBio] = useState(profile.bio);
  const [department, setDepartment] = useState(profile.department);
  const [year, setYear] = useState(profile.year);
  const [section, setSection] = useState(profile.section);
  const [campus, setCampus] = useState(profile.campus);
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(profile.avatarStyle);
  const [interests, setInterests] = useState<string[]>([...profile.interests]);
  const [skills, setSkills] = useState<string[]>([...profile.skills]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  // Synchronize modal state with latest profile whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen && profile) {
      setFullName(profile.fullName || '');
      setBio(profile.bio || '');
      setDepartment(profile.department || '');
      setYear(profile.year || '');
      setSection(profile.section || '');
      setCampus(profile.campus || 'SRMIST Kattankulathur');
      setAvatarStyle(profile.avatarStyle || 'neon-violet');
      setInterests([...(profile.interests || [])]);
      setSkills([...(profile.skills || [])]);
      setErrors({});
    }
  }, [isOpen, profile]);

  // Control body scroll when modal is active
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

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  // GSAP Animation
  useEffect(() => {
    if (!isOpen || !panelRef.current || prefersReducedMotion) return;

    gsap.fromTo(
      panelRef.current,
      { y: 30, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }
    );
  }, [isOpen, prefersReducedMotion]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: ProfileFormErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'FULL NAME IS REQUIRED';
    }
    if (!department.trim()) {
      newErrors.department = 'DEPARTMENT IS REQUIRED';
    }
    if (!year.trim()) {
      newErrors.year = 'ACADEMIC YEAR IS REQUIRED';
    }
    if (!section.trim()) {
      newErrors.section = 'SECTION / COHORT IS REQUIRED';
    }
    if (!campus.trim()) {
      newErrors.campus = 'CAMPUS IS REQUIRED';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: ProfileFormData = {
      fullName,
      bio,
      department,
      year,
      section,
      campus,
      avatarStyle,
      interests,
      skills,
    };

    const success = await onSave(data);
    if (success) {
      onClose();
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        ref={panelRef}
        className="w-full max-w-3xl my-8 rounded-3xl bg-[#0B0D15] border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl relative space-y-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-electric-purple/15 text-electric-purple">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-secondary">
                STUDENT PROFILE
              </span>
            </div>
            <h2
              id="edit-profile-title"
              className="font-display font-black text-2xl sm:text-3xl text-white"
            >
              EDIT CAMPUS IDENTITY
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close edit profile modal"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: IDENTITY */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-acid-lime flex items-center gap-2">
              <span>01.</span>
              <span>IDENTITY & AVATAR</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="full-name-input"
                  className="text-xs font-mono text-text-secondary uppercase"
                >
                  FULL NAME *
                </label>
                <input
                  id="full-name-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) {
                      setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border ${
                    errors.fullName
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-white/10 focus:border-electric-purple'
                  } text-white font-medium focus:outline-none focus:ring-1 focus:ring-electric-purple transition-all`}
                />
                {errors.fullName && (
                  <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="bio-input"
                  className="text-xs font-mono text-text-secondary uppercase"
                >
                  SHORT BIO
                </label>
                <textarea
                  id="bio-input"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="What drives your campus journey? e.g. Hackathons, deep learning research, product design..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-electric-purple text-white text-sm focus:outline-none focus:ring-1 focus:ring-electric-purple transition-all resize-none"
                />
              </div>

              {/* Avatar Style Picker */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-mono text-text-secondary uppercase">
                  AVATAR GEOMETRY STYLE
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setAvatarStyle(style.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        avatarStyle === style.id
                          ? 'bg-white/10 border-electric-purple shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <ProfileAvatar
                        initials={fullName.slice(0, 2).toUpperCase() || 'VY'}
                        styleId={style.id}
                        size="sm"
                        showGlow={false}
                      />
                      <span className="text-xs font-mono text-white truncate">
                        {style.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CAMPUS & ACADEMICS */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-acid-lime flex items-center gap-2">
              <span>02.</span>
              <span>CAMPUS & ACADEMICS</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department */}
              <div className="space-y-1.5">
                <label
                  htmlFor="dept-input"
                  className="text-xs font-mono text-text-secondary uppercase"
                >
                  DEPARTMENT *
                </label>
                <input
                  id="dept-input"
                  type="text"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) {
                      setErrors((prev) => ({ ...prev, department: undefined }));
                    }
                  }}
                  placeholder="e.g. Computer Science & Engineering"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border ${
                    errors.department
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-white/10 focus:border-electric-purple'
                  } text-white text-sm focus:outline-none transition-all`}
                />
                {errors.department && (
                  <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>

              {/* Academic Year */}
              <div className="space-y-1.5">
                <label
                  htmlFor="year-input"
                  className="text-xs font-mono text-text-secondary uppercase"
                >
                  ACADEMIC YEAR *
                </label>
                <select
                  id="year-input"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    if (errors.year) {
                      setErrors((prev) => ({ ...prev, year: undefined }));
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#090B13] border border-white/10 focus:border-electric-purple text-white text-sm focus:outline-none transition-all"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate / Masters</option>
                </select>
                {errors.year && (
                  <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.year}</span>
                  </p>
                )}
              </div>

              {/* Section */}
              <div className="space-y-1.5">
                <label
                  htmlFor="section-input"
                  className="text-xs font-mono text-text-secondary uppercase"
                >
                  SECTION / COHORT *
                </label>
                <input
                  id="section-input"
                  type="text"
                  value={section}
                  onChange={(e) => {
                    setSection(e.target.value);
                    if (errors.section) {
                      setErrors((prev) => ({ ...prev, section: undefined }));
                    }
                  }}
                  placeholder="e.g. U2, A1, Alpha"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border ${
                    errors.section
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-white/10 focus:border-electric-purple'
                  } text-white text-sm focus:outline-none transition-all`}
                />
                {errors.section && (
                  <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.section}</span>
                  </p>
                )}
              </div>

              {/* Campus */}
              <div className="space-y-1.5">
                <label
                  htmlFor="campus-input"
                  className="text-xs font-mono text-text-secondary uppercase"
                >
                  CAMPUS *
                </label>
                <input
                  id="campus-input"
                  type="text"
                  value={campus}
                  onChange={(e) => {
                    setCampus(e.target.value);
                    if (errors.campus) {
                      setErrors((prev) => ({ ...prev, campus: undefined }));
                    }
                  }}
                  placeholder="e.g. SRMIST Kattankulathur"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border ${
                    errors.campus
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-white/10 focus:border-electric-purple'
                  } text-white text-sm focus:outline-none transition-all`}
                />
                {errors.campus && (
                  <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.campus}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: INTERESTS */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-acid-lime flex items-center gap-2">
                <span>03.</span>
                <span>INTERESTS ({interests.length} SELECTED)</span>
              </h3>
              <span className="text-[11px] font-mono text-text-muted">
                Click to toggle
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_INTERESTS.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-electric-purple/25 border-electric-purple text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'bg-white/[0.03] border-white/10 text-text-secondary hover:text-white hover:border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-acid-lime" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: SKILLS */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-acid-lime flex items-center gap-2">
              <span>04.</span>
              <span>SKILLS & EXPERTISE ({skills.length})</span>
            </h3>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g. WebGL, Flutter, Docker)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-electric-purple"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>ADD</span>
              </button>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-200 bg-white/[0.05] border border-white/10 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-acid-lime" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove skill ${skill}`}
                    className="text-text-muted hover:text-rose-400 transition-colors ml-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-bold text-white bg-electric-purple hover:bg-electric-purple/90 shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(139,92,246,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SAVING CHANGES...</span>
                </>
              ) : (
                <span>SAVE CHANGES →</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
