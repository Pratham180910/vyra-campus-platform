import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { AuthVisual } from './AuthVisual';

interface AuthShellProps {
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.auth-header-elem',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.auth-content-col',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#08090D] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-secondary selection:text-[#08090D]"
    >
      {/* Background Ambience */}
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-32 right-10 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Top Navigation Bar */}
      <header className="auth-header-elem w-full px-4 sm:px-8 lg:px-12 py-5 sm:py-7">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="relative group/logo flex items-center">
            <Link
              to="/"
              aria-label="Return to Home"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            >
              {/* Brand Logo Symbol */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary via-primary to-primary-dark p-[1px] shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover/logo:shadow-[0_0_20px_rgba(196,255,61,0.5)] transition-shadow duration-300">
                <div className="w-full h-full bg-[#08090D] rounded-[7px] flex items-center justify-center">
                  <span className="font-display font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                    V
                  </span>
                </div>
              </div>
              <span className="font-display font-black tracking-widest text-xl text-white group-hover/logo:text-glow-purple transition-colors">
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
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-4 sm:py-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Atmosphere (Desktop/Tablet) */}
          <div className="auth-content-col hidden lg:block lg:col-span-6 xl:col-span-7 h-full">
            <AuthVisual />
          </div>

          {/* Right Column: Form Container */}
          <div className="auth-content-col w-full lg:col-span-6 xl:col-span-5 flex justify-center">
            {children}
          </div>
        </div>
      </main>

      {/* Subtle Footer Note */}
      <footer className="w-full px-4 sm:px-8 lg:px-12 py-5 text-center text-xs font-mono text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/5 pt-4">
          <span>YOUR CAMPUS. YOUR MOMENTS.</span>
          <span className="text-secondary">VYRA • SRM 2026</span>
        </div>
      </footer>
    </div>
  );
};
