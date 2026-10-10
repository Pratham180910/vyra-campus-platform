import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  BarChart3,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Loader2,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface OrganizerShellProps {
  children: React.ReactNode;
}

export const OrganizerShell: React.FC<OrganizerShellProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      setSignOutError(null);
      await signOut();
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign out. Please try again.';
      setSignOutError(msg);
    } finally {
      setIsSigningOut(false);
    }
  };

  const navItems = [
    {
      label: 'Overview',
      path: '/organizer',
      exact: true,
      icon: LayoutDashboard,
      description: 'Studio pulse & quick metrics',
    },
    {
      label: 'My Events',
      path: '/organizer/events',
      exact: false,
      icon: Calendar,
      description: 'Manage & publish moments',
    },
    {
      label: 'Create Event',
      path: '/organizer/events/new',
      exact: true,
      icon: PlusCircle,
      description: 'Launch a new campus moment',
    },
    {
      label: 'Clubs',
      path: '/organizer/clubs',
      exact: false,
      icon: Users,
      description: 'Manage campus communities',
    },
    {
      label: 'Analytics',
      path: '/organizer/analytics',
      exact: false,
      icon: BarChart3,
      description: 'Attendees & registration data',
    },
  ];

  const isItemActive = (path: string, exact: boolean) => {
    if (exact) {
      if (path === '/organizer') {
        return location.pathname === '/organizer' || location.pathname === '/organizer/dashboard';
      }
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen w-full bg-[#050608] text-white flex flex-col lg:flex-row relative selection:bg-primary/30 selection:text-secondary">
      {/* Background ambient lighting */}
      <div
        className="fixed top-0 left-64 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Desktop Sidebar (Left) */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-white/10 bg-[#08090D]/95 backdrop-blur-2xl p-6 sticky top-0 h-screen z-40 shrink-0">
        <div>
          {/* Brand & Studio Title */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="relative group/logo flex items-center">
              <Link
                to="/organizer"
                className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                title="VYRA Studio"
                aria-label="VYRA Studio"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary via-primary to-primary-dark p-[1px] shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover/logo:shadow-[0_0_20px_rgba(196,255,61,0.5)] transition-shadow duration-300">
                  <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                    <span className="font-display font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                      V
                    </span>
                  </div>
                </div>
              </Link>
              {/* Studio Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/logo:opacity-100 group-focus-within/logo:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/logo:translate-y-0 px-2 py-0.5 rounded-md bg-[#08090D]/95 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase font-bold tracking-widest text-secondary shadow-[0_4px_12px_rgba(0,0,0,0.8)] z-50 whitespace-nowrap"
              >
                STUDIO
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black tracking-widest text-lg text-white">
                  VYRA
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-primary/20 text-electric-purple border border-primary/30">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] font-mono text-text-muted flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-glow-lime" />
                LIVE WORKSPACE
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="py-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-3 px-3">
              WORKSPACE
            </p>
            <nav className="space-y-1.5" aria-label="Organizer navigation">
              {navItems.map((item) => {
                const active = isItemActive(item.path, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      active
                        ? 'bg-electric-purple/15 text-white border border-primary/40 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                        : 'text-text-secondary hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active ? 'text-secondary' : 'text-text-muted group-hover:text-white'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-glow-lime" />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-wider text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]"
            title="Sign out of Organizer Studio"
          >
            <div className="flex items-center gap-2.5">
              {isSigningOut ? (
                <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
              )}
              <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
            </div>
            <span className="text-[10px] font-mono text-rose-400/60 group-hover:text-white/80">
              EXIT
            </span>
          </button>

          {signOutError && (
            <p className="text-[11px] font-mono text-rose-400 px-1 leading-snug">
              {signOutError}
            </p>
          )}

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
            <div className="flex items-center gap-1.5 text-secondary font-mono font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              CAMPUS STUDIO
            </div>
            <p className="text-text-muted leading-relaxed">
              Authorized organizer workspace with live database sync.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#08090D]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open organizer menu"
            className="p-2 text-text-secondary hover:text-white bg-white/5 border border-white/10 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Link to="/organizer" className="font-display font-black tracking-widest text-lg text-white">
              VYRA
            </Link>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider bg-primary/20 text-electric-purple border border-primary/30">
              STUDIO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label="Sign out"
            title="Sign Out"
            className="p-2 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 text-xs font-mono uppercase"
          >
            {isSigningOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Sign Out</span>
          </button>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-secondary/10 text-secondary border border-secondary/20">
            STUDIO
          </span>
        </div>
      </header>

      {/* Mobile Fullscreen Drawer */}
      <div
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-50 bg-[#08090D]/95 backdrop-blur-2xl flex flex-col justify-between p-6 transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-display font-black tracking-widest text-xl text-white">
              VYRA
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-primary/20 text-electric-purple border border-primary/30">
              STUDIO
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-auto py-6">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Studio Navigation
          </p>
          <ul className="space-y-3">
            {navItems.map((item) => {
              const active = isItemActive(item.path, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      active
                        ? 'bg-electric-purple/20 border-primary text-white font-semibold'
                        : 'bg-white/[0.02] border-white/5 text-text-secondary hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-secondary' : 'text-text-muted'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all disabled:opacity-50"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SIGNING OUT...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>SIGN OUT</span>
              </>
            )}
          </button>
          {signOutError && (
            <p className="text-[11px] font-mono text-rose-400 text-center">
              {signOutError}
            </p>
          )}
          <div className="text-center text-[10px] font-mono text-text-muted">
            AUTHORIZED ORGANIZER WORKSPACE
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/10 border border-secondary/25 flex items-center gap-2.5 text-xs font-mono text-secondary">
            <ShieldCheck className="w-4 h-4" />
            <span>
              AUTHENTICATED ORGANIZER STUDIO • LIVE MANAGEMENT ACTIVE
            </span>
          </div>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <nav
        aria-label="Mobile quick navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08090D]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around"
      >
        {navItems.map((item) => {
          const active = isItemActive(item.path, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono uppercase transition-colors ${
                active ? 'text-secondary font-bold' : 'text-text-muted hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
