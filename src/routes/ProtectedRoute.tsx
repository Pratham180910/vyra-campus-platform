import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Lock, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'student' | 'organizer' | 'admin'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading: authLoading, signOut } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError, refetchProfile } = useProfile();
  const location = useLocation();

  // Always wait until both authentication and profile role have finished loading
  if (authLoading || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen w-full bg-[#08090D] flex flex-col items-center justify-center p-6 text-center text-white">
        <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
        <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">
          VERIFYING PERMISSIONS...
        </p>
      </div>
    );
  }

  // Unauthenticated visitors are challenged with sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#08090D] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
        {/* Ambient Glow */}
        <div 
          className="absolute w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none -z-10" 
          aria-hidden="true" 
        />

        <div className="max-w-md w-full p-8 rounded-3xl bg-[#10121A]/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto text-secondary shadow-glow-lime">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-text-muted">
              <ShieldAlert className="w-3.5 h-3.5 text-secondary" />
              <span>AUTHENTICATION REQUIRED</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              PROTECTED ROUTE
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              This area requires an active campus account with a valid Supabase session.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              state={{ from: location }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs font-mono uppercase tracking-wider bg-primary hover:bg-primary-hover text-white shadow-glow-purple transition-all"
            >
              <span>SIGN IN</span>
              <ArrowRight className="w-3.5 h-3.5 text-secondary" />
            </Link>

            <Link
              to="/events"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              EXPLORE EVENTS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Profile resolution error recovery
  if (profileError && (!profile || !profile.role)) {
    return (
      <div className="min-h-screen w-full bg-[#08090D] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none -z-10" 
          aria-hidden="true" 
        />
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#10121A]/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>PROFILE LOAD ERROR</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              VERIFICATION FAILED
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              We could not verify your account profile and permissions from the database. Please try again.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => refetchProfile()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs font-mono uppercase tracking-wider bg-secondary hover:bg-secondary-hover text-black shadow-glow-lime transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RETRY</span>
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userRole = (profile?.role || '').toLowerCase() as 'student' | 'organizer' | 'admin';

  // If an organizer navigates to student /dashboard, automatically redirect to /organizer
  if ((userRole === 'organizer' || userRole === 'admin') && location.pathname === '/dashboard') {
    return <Navigate to="/organizer" replace />;
  }

  // Restrict access if allowedRoles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      // If an organizer visits a student-only route, redirect them to organizer studio
      if (userRole === 'organizer' || userRole === 'admin') {
        return <Navigate to="/organizer" replace />;
      }

      // If a student visits an organizer/studio route, display the studio restricted guard
      return (
        <div className="min-h-screen w-full bg-[#08090D] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
          <div 
            className="absolute w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none -z-10" 
            aria-hidden="true" 
          />
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#10121A]/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-text-muted">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>ORGANIZER PRIVILEGES REQUIRED</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
                STUDIO RESTRICTED
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                The Organizer Studio is reserved for verified campus organizations and event coordinators.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs font-mono uppercase tracking-wider bg-primary hover:bg-primary-hover text-white shadow-glow-purple transition-all"
              >
                <span>STUDENT DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary" />
              </Link>

              <Link
                to="/events"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                EXPLORE EVENTS
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
