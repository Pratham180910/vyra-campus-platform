import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sparkles, User } from 'lucide-react';
import gsap from 'gsap';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

interface NavbarProps {
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLUListElement>(null);
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();

  const isEventsPage = location.pathname.startsWith('/events');
  const isCalendarPage = location.pathname.startsWith('/calendar');
  const isClubsPage = location.pathname.startsWith('/clubs');
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isProfilePage = location.pathname.startsWith('/profile');
  const isAboutPage = location.pathname.startsWith('/about');
  const isContactPage = location.pathname.startsWith('/contact');

  // Monitor scroll for subtle glass elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP initial load entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.2 }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Mobile menu GSAP open/close animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      tl.to(mobileMenuRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.4,
        ease: 'power3.out',
      });
      if (mobileLinksRef.current) {
        tl.fromTo(
          mobileLinksRef.current.children,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          '-=0.2'
        );
      }
    } else {
      document.body.style.overflow = '';
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (mobileMenuRef.current) {
            mobileMenuRef.current.style.visibility = 'hidden';
          }
        },
      });
    }
  }, [mobileMenuOpen]);

  const { profile } = useProfile();
  const isOrganizer = (profile?.role || '').toLowerCase() === 'organizer' || (profile?.role || '').toLowerCase() === 'admin';
  const isOrganizerPage = location.pathname.startsWith('/organizer');
  const dashboardPath = isOrganizer ? '/organizer' : '/dashboard';
  const isDashboardActive = isOrganizer ? (isOrganizerPage || isDashboardPage) : isDashboardPage;

  const navLinks = [
    { label: 'Events', path: '/events', isActive: isEventsPage },
    { label: 'Calendar', path: '/calendar', isActive: isCalendarPage },
    { label: 'Clubs', path: '/clubs', isActive: isClubsPage },
    { label: 'My VYRA', path: dashboardPath, isActive: isDashboardActive },
    { label: 'About', path: '/about', isActive: isAboutPage },
    { label: 'Contact', path: '/contact', isActive: isContactPage },
  ];

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-8 lg:px-12 py-4 ${
          isScrolled
            ? 'bg-[#08090D]/85 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand mark with Home hover tooltip & menu toggle indicator */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 text-text-secondary hover:text-white transition-colors rounded-xl glass-subtle"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative group/logo flex items-center">
              <Link
                to="/"
                aria-label="VYRA Home"
                className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              >
                {/* Brand Geometric Symbol */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary via-primary to-primary-dark p-[1px] shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover/logo:shadow-[0_0_20px_rgba(196,255,61,0.5)] transition-shadow duration-300">
                  <div className="w-full h-full bg-[#08090D] rounded-[7px] flex items-center justify-center">
                    <span className="font-display font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                      V
                    </span>
                  </div>
                </div>
                <span className="font-display font-black tracking-widest text-xl text-white group-hover/logo:text-glow-purple transition-all duration-300">
                  VYRA
                </span>
              </Link>

              {/* Home Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/logo:opacity-100 group-focus-within/logo:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/logo:translate-y-0 px-2 py-0.5 rounded-md bg-[#08090D]/95 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase font-bold tracking-widest text-secondary shadow-[0_4px_12px_rgba(0,0,0,0.8)] z-50 whitespace-nowrap"
              >
                HOME
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md px-6 py-2 rounded-full shadow-inner">
            {navLinks.map((link) => {
              const activeClass = link.isActive
                ? 'text-white bg-white/[0.08] shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-primary/30'
                : 'text-text-secondary hover:text-white hover:bg-white/[0.06] border border-transparent';

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full relative group ${activeClass}`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.label}
                    {link.isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-glow-lime animate-pulse" />
                    )}
                  </span>
                  {!link.isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-secondary group-hover:w-3/5 transition-all duration-300 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Profile Avatar Button */}
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              aria-label={isAuthenticated ? 'Student Profile' : 'Sign In'}
              title={isAuthenticated ? 'Student Profile' : 'Sign In'}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-white transition-all duration-200 hover:scale-105 border ${
                isProfilePage
                  ? 'bg-electric-purple/20 border-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
              }`}
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  signOut().catch((err) => console.error('[VYRA] Sign-out error:', err));
                }}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-rose-400 hover:text-white transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(139,92,246,0.65)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 border border-white/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <div
        ref={mobileMenuRef}
        aria-hidden={!mobileMenuOpen}
        className="fixed inset-0 z-50 bg-[#08090D]/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 invisible opacity-0 transition-opacity"
      >
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary p-[1px]">
              <div className="w-full h-full bg-[#08090D] rounded-[7px] flex items-center justify-center">
                <span className="font-display font-black text-sm text-secondary">V</span>
              </div>
            </div>
            <span className="font-display font-black tracking-widest text-xl text-white">VYRA</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="my-auto py-8">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Navigation
          </p>
          <ul ref={mobileLinksRef} className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-2xl sm:text-3xl font-display font-bold transition-all py-2 border-b border-white/5 ${
                    link.isActive
                      ? 'text-white text-glow-purple'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {link.isActive && (
                      <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                    )}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3.5 rounded-full font-semibold bg-primary text-white shadow-glow-purple"
          >
            Discover All Events
          </Link>
          <div className="grid grid-cols-2 gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut().catch((err) => console.error('[VYRA] Mobile sign-out error:', err));
                }}
                className="col-span-2 w-full text-center py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-rose-400 hover:text-white bg-rose-500/10 border border-rose-500/25"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 border border-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/25"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-text-muted pt-2">
            <span>YOUR CAMPUS. YOUR MOMENTS.</span>
            <span className="text-secondary font-mono">SRM 2026</span>
          </div>
        </div>
      </div>
    </>
  );
};
