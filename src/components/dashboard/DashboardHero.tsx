import React, { useRef, useEffect } from 'react';
import { Sparkles, Terminal, Shield, Compass } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { StudentProfilePreview } from '../../types/dashboard';

interface DashboardHeroProps {
  profile: StudentProfilePreview;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ profile }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-hero-fade',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#121422] via-[#0E101A] to-[#08090D] border border-white/10 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl"
    >
      {/* Ambient Radial Lighting */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-[110px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-secondary/15 blur-[100px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Subtle Constellation Lines Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="85%" cy="30%" r="180" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="85%" cy="30%" r="260" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="85%" cy="30%" r="340" fill="none" stroke="rgba(196,255,61,0.15)" strokeWidth="1" strokeDasharray="6 8" />
      </svg>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
        {/* Left: Editorial Hero Content */}
        <div className="space-y-4 max-w-2xl">
          <div className="dashboard-hero-fade inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary shadow-glow-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YOUR VYRA</span>
          </div>

          <h1 className="dashboard-hero-fade font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
            MAKE YOUR CAMPUS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C4B5FD] to-secondary">
              MOMENTS COUNT.
            </span>
          </h1>

          <p className="dashboard-hero-fade text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed font-normal max-w-xl">
            Everything you're discovering, joining, and experiencing across campus — in one place.
          </p>

          <div className="dashboard-hero-fade pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
            <div className="flex items-center gap-1.5 text-secondary">
              <Shield className="w-3.5 h-3.5" />
              <span>Personal Student Command Center</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>{profile.campusNode}</span>
            </div>
          </div>
        </div>

        {/* Right: Compact Student Profile Identity Card */}
        <div className="dashboard-hero-fade shrink-0 w-full sm:w-auto">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#090B12]/85 border border-white/15 backdrop-blur-xl shadow-xl flex items-center gap-4 sm:gap-5 min-w-[280px] sm:min-w-[320px]">
            {/* Abstract Monogram Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-secondary via-primary to-[#08090D] p-[2px] shadow-glow-purple shrink-0">
              <div className="w-full h-full bg-[#08090D] rounded-[14px] flex items-center justify-center">
                <span className="font-display font-black text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                  {profile.initials}
                </span>
              </div>
            </div>

            {/* Profile Credentials */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 border border-secondary/30 text-[10px] font-mono font-bold uppercase tracking-wider text-secondary shadow-glow-lime">
                  {profile.roleBadge}
                </span>
                <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-lime animate-pulse" />
              </div>

              <p className="font-display font-bold text-base sm:text-lg text-white">
                {profile.department}
              </p>

              <p className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-primary" />
                <span>{profile.institution}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
