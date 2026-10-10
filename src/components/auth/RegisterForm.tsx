import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { PasswordStrength } from './PasswordStrength';
import { AuthMessage } from './AuthMessage';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterFormData, FormErrors } from '../../types/auth';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const response = await signUp(formData);
      if (response.success) {
        setStatus('success');
        setRequiresVerification(Boolean(response.requiresEmailVerification));
        if (!response.requiresEmailVerification) {
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 600);
        }
      } else {
        setStatus('error');
        setErrorMessage(response.message || 'Unable to create account. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Unable to complete registration. Please check your network and try again.');
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setStatus('idle');
    setErrorMessage(null);
    setRequiresVerification(false);
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-9 rounded-3xl sm:rounded-[2.5rem] bg-[#0F111A]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.1)] space-y-6 transition-all">
      {/* Header */}
      <div className="space-y-1.5">
        <p className="text-xs font-mono uppercase tracking-widest text-[#C4B5FD] font-bold">
          JOIN THE NETWORK
        </p>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
          CREATE YOUR VYRA
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Your next campus moment starts here.
        </p>
      </div>

      {/* Success State Transition */}
      {status === 'success' ? (
        <div className="space-y-6 text-center py-4 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto text-secondary shadow-glow-lime">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-mono uppercase tracking-widest border border-secondary/25">
              {requiresVerification ? 'VERIFICATION SENT' : 'ACCOUNT READY'}
            </span>
            <h2 className="font-display font-bold text-xl text-white">
              {requiresVerification ? 'CHECK YOUR INBOX' : 'REGISTRATION SUCCESSFUL'}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {requiresVerification
                ? `A confirmation email has been sent to ${formData.email}. Please verify your email before signing in.`
                : 'Supabase account provisioned and profile created. Redirecting to your dashboard...'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs font-mono text-text-muted space-y-1">
            <div className="flex items-center gap-1.5 text-secondary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Campus Credential</span>
            </div>
            <p className="truncate text-white">Name: {formData.fullName}</p>
            <p className="truncate text-white">Email: {formData.email}</p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/login"
              className="w-full py-3.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SIGN IN</span>
              <ArrowRight className="w-3.5 h-3.5 text-secondary" />
            </Link>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full py-2.5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
            >
              Register Another Account
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Global Error Banner */}
          {status === 'error' && errorMessage && (
            <AuthMessage
              type="error"
              title="Registration Error"
              message={errorMessage}
            />
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-fullname"
              className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
            >
              Full Name <span className="text-secondary">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-fullname"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                disabled={status === 'submitting'}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'register-fullname-error' : undefined}
                className={`w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all duration-200 outline-none ${
                  errors.fullName
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                    : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:bg-[#0D0F17]'
                } ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.fullName && (
              <p id="register-fullname-error" className="text-xs text-rose-400 pl-1 animate-fade-in">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
            >
              Email <span className="text-secondary">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="register-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@campus.edu"
                autoComplete="email"
                disabled={status === 'submitting'}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
                className={`w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all duration-200 outline-none ${
                  errors.email
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                    : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:bg-[#0D0F17]'
                } ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.email && (
              <p id="register-email-error" className="text-xs text-rose-400 pl-1 animate-fade-in">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password with Strength Indicator */}
          <div className="space-y-1.5">
            <PasswordField
              id="register-password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={status === 'submitting'}
              required
              error={errors.password}
            />
            {formData.password && (
              <PasswordStrength password={formData.password} />
            )}
          </div>

          {/* Confirm Password */}
          <PasswordField
            id="register-confirmpassword"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={status === 'submitting'}
            required
            error={errors.confirmPassword}
          />

          {/* Consent / Terms */}
          <p className="text-[11px] text-text-muted leading-relaxed pt-1">
            By creating an account, you agree to VYRA's{' '}
            <span className="text-secondary hover:underline cursor-pointer">Terms</span>
            {' '}and{' '}
            <span className="text-secondary hover:underline cursor-pointer">Privacy Policy</span>.
          </p>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] border border-white/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : (
                <>
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4 text-secondary" />
                </>
              )}
            </button>
          </div>

          {/* Alternate Link */}
          <div className="pt-4 border-t border-white/10 text-center text-xs">
            <span className="text-text-secondary">Already have an account? </span>
            <Link
              to="/login"
              className="font-mono font-bold text-secondary hover:text-white transition-colors ml-1 uppercase tracking-wider inline-flex items-center gap-1 group"
            >
              <span>SIGN IN</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
