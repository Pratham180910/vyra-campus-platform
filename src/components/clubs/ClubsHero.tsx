import React, { useRef, useEffect } from 'react';
import { Users2, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const ClubsHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.clubs-hero-fade',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative w-full pt-8 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 overflow-hidden"
    >
      {/* Subtle Background Lighting & Geometric Constellation Canvas */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full bg-primary/15 blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-10 right-10 w-72 h-72 rounded-full bg-secondary/10 blur-[100px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Abstract Animated Constellation Nodes & Connecting Lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="club-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C4FF3D" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Floating connected dots */}
        <line x1="15%" y1="30%" x2="35%" y2="40%" stroke="url(#club-line-grad)" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="35%" y1="40%" x2="48%" y2="25%" stroke="url(#club-line-grad)" strokeWidth="1" />
        <line x1="48%" y1="25%" x2="72%" y2="35%" stroke="url(#club-line-grad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="72%" y1="35%" x2="88%" y2="55%" stroke="url(#club-line-grad)" strokeWidth="1" />

        <circle cx="15%" cy="30%" r="3" fill="#8B5CF6" />
        <circle cx="35%" cy="40%" r="4" fill="#C4FF3D" />
        <circle cx="48%" cy="25%" r="3.5" fill="#C4B5FD" />
        <circle cx="72%" cy="35%" r="4" fill="#8B5CF6" />
        <circle cx="88%" cy="55%" r="3" fill="#C4FF3D" />
      </svg>

      <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-5">
        {/* Eyebrow */}
        <div className="clubs-hero-fade inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary shadow-glow-lime">
          <Users2 className="w-3.5 h-3.5" />
          <span>THE CAMPUS NETWORK</span>
        </div>

        {/* Heading */}
        <h1 className="clubs-hero-fade font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.02]">
          FIND YOUR PEOPLE.
        </h1>

        {/* Supporting text */}
        <p className="clubs-hero-fade text-sm sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal">
          Discover the clubs, communities, and student collectives shaping campus life.
        </p>

        {/* Community stats teaser */}
        <div className="clubs-hero-fade pt-2 flex items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-text-muted">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-secondary" />
            <span>12+ Active Guilds</span>
          </div>
          <span>•</span>
          <div>
            <span>20,000+ Total Members</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="hidden sm:inline">
            <span>Verified SRM Councils</span>
          </div>
        </div>
      </div>
    </section>
  );
};
