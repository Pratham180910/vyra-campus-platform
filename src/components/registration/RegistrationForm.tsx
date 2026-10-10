import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  FileText,
  ArrowRight,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { registrationService } from '../../services/registrationService';
import { useProfile } from '../../hooks/useProfile';
import type { EventItem } from '../../types';
import type { RegistrationFormData, RegistrationErrors } from '../../types/registration';

interface RegistrationFormProps {
  event: EventItem;
  onSuccess: () => void;
}

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Other',
];

const YEARS_OF_STUDY = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, onSuccess }) => {
  const { profile } = useProfile();
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    phone: '',
    department: profile?.department || '',
    yearOfStudy: profile?.year || '',
    note: '',
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile.fullName || '',
        email: prev.email || profile.email || '',
        department: prev.department || profile.department || '',
        yearOfStudy: prev.yearOfStudy || profile.year || '',
      }));
    }
  }, [profile]);

  const validate = (): boolean => {
    const newErrors: RegistrationErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'FULL NAME REQUIRED: Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'INVALID NAME: Name must be at least 2 characters.';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'EMAIL REQUIRED: Please enter your email address.';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'INVALID EMAIL: Enter a valid campus or contact email.';
      }
    }

    // Phone validation (10+ digits, reject obvious placeholders)
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    const isRepetitive = /^(\d)\1{9,}$/.test(phoneDigits);
    if (!formData.phone.trim()) {
      newErrors.phone = 'PHONE REQUIRED: Please enter your contact number.';
    } else if (phoneDigits.length < 10 || isRepetitive) {
      newErrors.phone = 'INVALID PHONE: Enter a valid phone number (at least 10 digits).';
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = 'DEPARTMENT REQUIRED: Please select your department.';
    }

    // Year validation
    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = 'YEAR REQUIRED: Please select your year of study.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Dynamically clear error when user updates the field
    if (errors[name as keyof RegistrationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Validate on blur for instant feedback
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched to display errors immediately
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      department: true,
      yearOfStudy: true,
    });

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await registrationService.registerForEvent(event.id, formData);
      if (res.success) {
        onSuccess();
      } else {
        setSubmitError(res.error || 'Registration could not be completed. Please try again.');
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Registration failed. Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Error Feedback Banner */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
          <div className="space-y-0.5">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
              REGISTRATION NOTICE
            </p>
            <p className="text-xs leading-relaxed text-red-200">
              {submitError}
            </p>
          </div>
        </div>
      )}

      {/* Event Context Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#08090D] border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-secondary font-bold uppercase tracking-wider">
            REGISTER FOR
          </span>
          <span className="text-text-muted px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            {event.category}
          </span>
        </div>

        <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-snug">
          {event.title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-text-secondary">
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

      {/* Form Fields Stack */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="reg-fullname"
            className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
          >
            Full Name <span className="text-secondary">*</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <User className="w-4 h-4" />
            </div>
            <input
              id="reg-fullname"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Aarav Sharma"
              autoComplete="name"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all outline-none ${
                errors.fullName && touched.fullName
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40'
              }`}
            />
          </div>
          {errors.fullName && touched.fullName && (
            <p className="text-xs text-rose-400 font-mono flex items-center gap-1 pl-1 animate-fade-in">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-email"
              className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
            >
              Email <span className="text-secondary">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@campus.edu"
                autoComplete="email"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all outline-none ${
                  errors.email && touched.email
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40'
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1 pl-1 animate-fade-in">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-phone"
              className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
            >
              Phone Number <span className="text-secondary">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all outline-none ${
                  errors.phone && touched.phone
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40'
                }`}
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1 pl-1 animate-fade-in">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Department & Year of Study Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-dept"
              className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
            >
              Department <span className="text-secondary">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <select
                id="reg-dept"
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-8 py-3 bg-[#08090D] border rounded-2xl text-sm text-white transition-all outline-none appearance-none cursor-pointer ${
                  errors.department && touched.department
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40'
                }`}
              >
                <option value="" disabled className="bg-[#08090D] text-text-muted">
                  Select Department
                </option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#08090D] text-white">
                    {dept}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[10px]">
                ▼
              </div>
            </div>
            {errors.department && touched.department && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1 pl-1 animate-fade-in">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.department}</span>
              </p>
            )}
          </div>

          {/* Year of Study */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-year"
              className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
            >
              Year of Study <span className="text-secondary">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                id="reg-year"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-8 py-3 bg-[#08090D] border rounded-2xl text-sm text-white transition-all outline-none appearance-none cursor-pointer ${
                  errors.yearOfStudy && touched.yearOfStudy
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40'
                }`}
              >
                <option value="" disabled className="bg-[#08090D] text-text-muted">
                  Select Year
                </option>
                {YEARS_OF_STUDY.map((year) => (
                  <option key={year} value={year} className="bg-[#08090D] text-white">
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[10px]">
                ▼
              </div>
            </div>
            {errors.yearOfStudy && touched.yearOfStudy && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1 pl-1 animate-fade-in">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.yearOfStudy}</span>
              </p>
            )}
          </div>
        </div>

        {/* Special Interest / Note (Optional) */}
        <div className="space-y-1.5">
          <label
            htmlFor="reg-note"
            className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
          >
            Special Interest / Note <span className="text-text-muted text-[10px]">(Optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute top-3.5 left-3.5 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              id="reg-note"
              name="note"
              rows={2}
              value={formData.note}
              onChange={handleChange}
              placeholder="e.g. Interested in team track or hardware bounties..."
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-2xl text-sm text-white placeholder-text-muted transition-all outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              <span>CONFIRMING REGISTRATION...</span>
            </>
          ) : (
            <>
              <span>CONFIRM REGISTRATION</span>
              <ArrowRight className="w-4 h-4 text-secondary" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
