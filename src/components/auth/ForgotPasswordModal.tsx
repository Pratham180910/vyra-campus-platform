import React, { useState } from 'react';
import { X, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { authService } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await authService.requestPasswordReset(email);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#0F111A] border border-white/15 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.15)] space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-text-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary shadow-glow-lime">
                <KeyRound className="w-3.5 h-3.5" />
                <span>RECOVERY PROTOCOL</span>
              </div>
              <h2
                id="forgot-password-title"
                className="font-display font-black text-2xl text-white tracking-tight"
              >
                FORGOT PASSWORD?
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Enter the email address associated with your campus account to proceed with recovery.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="you@campus.edu"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all outline-none ${
                      error
                        ? 'border-rose-500/80 focus:border-rose-500'
                        : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40'
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-xs text-rose-400 pl-1">{error}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>PROCESSING...</span>
                  ) : (
                    <>
                      <span>CONTINUE</span>
                      <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-3.5 rounded-full font-medium text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Password Reset Informational Result State */
          <div className="space-y-6 text-center py-2 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto text-secondary shadow-glow-lime">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-text-muted">
                NOTICE
              </span>
              <h3 className="font-display font-black text-2xl text-white tracking-tight">
                PASSWORD RESET
              </h3>
              <p className="text-sm font-medium text-secondary">
                Password recovery will be available once authentication is connected.
              </p>
              <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                This request was validated for <span className="text-white font-mono">{email}</span>. Live email dispatch and password reset tokens will be operational upon backend integration.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all"
              >
                RETURN TO SIGN IN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
