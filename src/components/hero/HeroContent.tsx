import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroContentProps {
  onExploreClick?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onExploreClick,
}) => {
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  // Subtle magnetic hover effect for Primary CTA
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ctaBtnRef.current) return;
    const rect = ctaBtnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.22;
    setBtnOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setBtnOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col justify-center max-w-2xl z-20 pointer-events-auto">
      {/* 1. Eyebrow */}
      <div className="hero-eyebrow flex items-center gap-2.5 mb-4 sm:mb-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-secondary bg-secondary/10 border border-secondary/20 shadow-glow-lime">
          <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
          DISCOVER • PARTICIPATE • BELONG
        </span>
      </div>

      {/* 2. Hero Editorial Display Typography */}
      <div className="hero-heading font-display select-none">
        <div className="overflow-hidden">
          <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight leading-[0.92] text-white">
            YOUR
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight leading-[0.92] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-text-secondary">
            CAMPUS.
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight leading-[0.92] text-white mt-1">
            YOUR
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight leading-[0.92] text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#A78BFA] to-white text-glow-purple">
            MOMENTS.
          </h1>
        </div>
      </div>

      {/* 3. Supporting Copy */}
      <p className="hero-copy mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-text-secondary max-w-xl font-normal leading-relaxed">
        Explore events, join communities, and create unforgettable moments on campus.
      </p>

      {/* 4. Action Button */}
      <div className="hero-actions mt-8 sm:mt-10 flex items-center">
        {/* Primary CTA with magnetic response */}
        <Link
          ref={ctaBtnRef}
          to="/events"
          onClick={onExploreClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `translate3d(${btnOffset.x}px, ${btnOffset.y}px, 0)`,
            transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
          }}
          className="group relative inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-white bg-primary hover:bg-primary-hover shadow-glow-purple hover:shadow-glow-purple-lg border border-white/25 active:scale-[0.98]"
        >
          <span>EXPLORE EVENTS</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-secondary" />
        </Link>
      </div>
    </div>
  );
};
