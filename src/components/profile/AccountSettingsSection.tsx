import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Shield, Eye, LogOut, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { StudentProfile } from '../../types/profile';

interface AccountSettingsSectionProps {
  profile: StudentProfile;
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  profile,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-electric-purple" />
        <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-secondary">
          ACCOUNT & SECURITY
        </h3>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-text-muted text-xs font-mono">
              <span className="uppercase">Institutional Email</span>
              <Mail className="w-3.5 h-3.5 text-electric-purple" />
            </div>
            <p className="font-mono text-sm text-white truncate font-medium">
              {profile.email || 'campus.student@srmist.edu.in'}
            </p>
            <p className="text-[10px] font-mono text-emerald-400">
              Verified SRMIST Domain
            </p>
          </div>

          {/* Account Status */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-text-muted text-xs font-mono">
              <span className="uppercase">Account Status</span>
              <Shield className="w-3.5 h-3.5 text-acid-lime" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-acid-lime animate-pulse" />
              <p className="font-display font-bold text-sm text-white">
                {isAuthenticated ? 'AUTHENTICATED' : profile.status}
              </p>
            </div>
            <p className="text-[10px] font-mono text-text-muted">
              {isAuthenticated ? 'Active Supabase Session' : 'Guest / Node KTR'}
            </p>
          </div>

          {/* Profile Visibility */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-text-muted text-xs font-mono">
              <span className="uppercase">Profile Visibility</span>
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="font-display font-bold text-sm text-white">
              {profile.visibility}
            </p>
            <p className="text-[10px] font-mono text-text-muted">
              Restricted to authenticated peers
            </p>
          </div>
        </div>

        {/* Real Session / Sign Out Action */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-text-muted leading-relaxed">
            <div className="flex items-center gap-1.5 text-white font-medium">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span>Supabase Authentication Engine</span>
            </div>
            <p>
              Your campus session is managed securely via Supabase Auth and verified PostgreSQL Row-Level Security policies.
            </p>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>SIGNING OUT...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>SIGN OUT</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
