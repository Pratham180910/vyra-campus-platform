import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { AuthMessage } from './AuthMessage';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import type { LoginFormData, FormErrors } from '../../types/auth';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

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
      const response = await signIn(formData);
      if (response.success) {
        setStatus('success');
        let targetDestination = '/';

        // Check user profile role from Supabase to route appropriately
        if (response.user) {
          try {
            const userProfile = await profileService.fetchProfile(response.user.id);
            const userRole = (userProfile.role || response.user.role || '').toLowerCase();
            const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;

            if (userRole === 'organizer' || userRole === 'admin') {
              // Organizers must open Organizer Studio directly
              if (fromPath && fromPath.startsWith('/organizer')) {
                targetDestination = fromPath;
              } else {
                targetDestination = '/organizer';
              }
            } else {
              // Students are routed to the VYRA homepage ("/") by default.
              // Preserve intentional deep links (such as /events, /events/:id, /clubs, /calendar),
              // but never allow an accidental /profile, /dashboard, /login, or /register to override the homepage.
              const isAccidentalDestination =
                !fromPath ||
                fromPath === '/' ||
                fromPath === '/login' ||
                fromPath === '/register' ||
                fromPath.startsWith('/profile') ||
                fromPath.startsWith('/dashboard') ||
                fromPath.startsWith('/organizer');

              if (!isAccidentalDestination) {
                targetDestination = fromPath;
              } else {
                targetDestination = '/';
              }
            }
          } catch (profileErr) {
            console.error('[VYRA:Login] Error verifying user profile role:', profileErr);
            setStatus('error');
            setErrorMessage(
              'Unable to verify your account permissions from the campus database. Please try again.'
            );
            return;
          }
        }

        // Smooth transition to destination
        setTimeout(() => {
          navigate(targetDestination, { replace: true });
        }, 500);
      } else {
        setStatus('error');
        setErrorMessage(
          response.message || 'Unable to sign in. Please verify your credentials and try again.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage('Unable to sign in. Please check your connection and try again.');
    }
  };

  return (
    <>
      <div className="w-full max-w-md p-6 sm:p-9 rounded-3xl sm:rounded-[2.5rem] bg-[#0F111A]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.1)] space-y-7 transition-all">
        {/* Header Block */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#C4B5FD] font-bold">
            WELCOME BACK
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            READY FOR YOUR NEXT MOMENT?
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Sign in to discover events, manage your registrations, and stay connected with campus.
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
                AUTHENTICATED
              </span>
              <h2 className="font-display font-bold text-xl text-white">
                SIGN IN SUCCESSFUL
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Supabase session established. Redirecting to your campus command center...
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs font-mono text-text-muted space-y-1">
              <div className="flex items-center gap-1.5 text-secondary">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Supabase Session</span>
              </div>
              <p className="truncate text-white">Account: {formData.email}</p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => navigate(destination, { replace: true })}
                className="w-full py-3.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>CONTINUE TO DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary" />
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Form */
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Global Error Banner */}
            {status === 'error' && errorMessage && (
              <AuthMessage
                type="error"
                title="Unable to sign in"
                message={errorMessage}
              />
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@campus.edu"
                  autoComplete="email"
                  disabled={status === 'submitting'}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  className={`w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all duration-200 outline-none ${
                    errors.email
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                      : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:bg-[#0D0F17]'
                  } ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {errors.email && (
                <p id="login-email-error" className="text-xs text-rose-400 pl-1 animate-fade-in">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <PasswordField
              id="login-password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={status === 'submitting'}
              error={errors.password}
              rightAction={
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-mono text-secondary hover:text-white transition-colors focus:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              }
            />

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
                    <span>SIGNING IN...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </>
                )}
              </button>
            </div>

            {/* Alternate Navigation Link */}
            <div className="pt-4 border-t border-white/10 text-center text-xs">
              <span className="text-text-secondary">Don't have an account? </span>
              <Link
                to="/register"
                className="font-mono font-bold text-secondary hover:text-white transition-colors ml-1 uppercase tracking-wider inline-flex items-center gap-1 group"
              >
                <span>CREATE ACCOUNT</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={formData.email}
      />
    </>
  );
};
