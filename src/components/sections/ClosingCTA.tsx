import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ClosingCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.25;
    const deltaY = (e.clientY - centerY) * 0.25;
    setBtnOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setBtnOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 relative z-20"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={cardRef}
          className="relative rounded-3xl sm:rounded-[2.75rem] bg-gradient-to-br from-[#121422] via-[#0E1018] to-[#0A0B10] border border-white/15 p-8 sm:p-14 lg:p-20 overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_60px_-15px_rgba(139,92,246,0.3)] text-center flex flex-col items-center"
        >
          {/* Futuristic geometric grid & glowing rings in background */}
          <div 
            className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" 
            aria-hidden="true"
          />
          <div 
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/15 rounded-full blur-[140px] pointer-events-none" 
            aria-hidden="true"
          />
          
          {/* Subtle concentric rings */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
            aria-hidden="true"
          >
            <div className="w-[500px] h-[500px] rounded-full border border-primary/30" />
            <div className="absolute w-[800px] h-[800px] rounded-full border border-secondary/20" />
            <div className="absolute w-[1100px] h-[1100px] rounded-full border border-white/10" />
          </div>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary mb-6 z-10 shadow-glow-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BE PART OF THE MOVEMENT</span>
          </div>

          {/* Large closing heading */}
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.02] z-10">
            YOUR NEXT MEMORY <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#C4B5FD] to-secondary text-glow-purple">
              IS WAITING.
            </span>
          </h2>

          {/* Supporting text */}
          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-xl z-10 leading-relaxed font-normal">
            Find something worth showing up for. From hackathon code-sprints to amphitheatre rhythm fests.
          </p>

          {/* Primary CTA */}
          <div className="mt-10 sm:mt-12 z-10">
            <Link
              to="/events"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `translate3d(${btnOffset.x}px, ${btnOffset.y}px, 0)`,
                transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
              }}
              className="group inline-flex items-center gap-3.5 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg text-white bg-primary hover:bg-primary-hover shadow-glow-purple hover:shadow-glow-purple-lg border border-white/20 active:scale-[0.98]"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowRight className="w-5 h-5 text-secondary transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* Community trust ticker */}
          <div className="mt-12 pt-8 border-t border-white/10 w-full max-w-2xl flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-text-muted z-10">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              15,000+ Active Campusers
            </span>
            <span>•</span>
            <span>50+ Verified Student Orgs</span>
            <span>•</span>
            <span>Instant Digital Passes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
