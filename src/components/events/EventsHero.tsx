import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const EventsHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.events-hero-element',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={heroRef}
      className="relative w-full pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-8 lg:px-12 overflow-hidden border-b border-white/5"
    >
      {/* Subtle atmospheric ambient glow behind heading */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[150px] pointer-events-none -z-10" 
        aria-hidden="true"
      />

      {/* Subtle Geometric background accents */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 -z-10"
        aria-hidden="true"
      >
        <div className="w-[700px] h-[700px] rounded-full border border-white/10" />
        <div className="absolute w-[950px] h-[950px] rounded-full border border-primary/20" />
      </div>

      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="events-hero-element inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary mb-5 shadow-glow-lime">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THE CAMPUS PULSE</span>
        </div>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="events-hero-element font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.04]"
        >
          FIND YOUR NEXT{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#C4B5FD] to-secondary text-glow-purple">
            MOMENT.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="events-hero-element mt-5 text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl font-normal leading-relaxed">
          Discover what's happening across campus — from hackathons and workshops to cultural nights and competitions.
        </p>

        {/* Campus Live Status Ticker */}
        <div className="events-hero-element mt-6 flex items-center gap-2 text-xs font-mono text-text-muted">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-text-secondary">SRM KTR Campus</span>
          <span>•</span>
          <span className="text-secondary font-semibold">12 Active Hubs Live</span>
        </div>
      </div>
    </div>
  );
};
