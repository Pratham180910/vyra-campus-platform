import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Users,
  Calendar,
  Sparkles,
  Compass,
} from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CommunityOverviewModal } from './CommunityOverviewModal';
import type { Club } from '../../types/club';

interface ClubHeroProps {
  club: Club;
}

export const ClubHero: React.FC<ClubHeroProps> = ({ club }) => {
  const [imageError, setImageError] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.club-hero-elem',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [club.id, prefersReducedMotion]);

  const formatMembers = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI & Robotics':
      case 'Technology':
        return 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30';
      case 'Coding':
        return 'text-[#C4FF3D] bg-[#C4FF3D]/10 border-[#C4FF3D]/30';
      case 'Design':
        return 'text-[#F472B6] bg-[#F472B6]/10 border-[#F472B6]/30';
      case 'Cultural':
      case 'Music':
        return 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30';
      case 'Sports':
        return 'text-[#FB923C] bg-[#FB923C]/10 border-[#FB923C]/30';
      case 'Entrepreneurship':
        return 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/30';
      default:
        return 'text-white bg-white/10 border-white/20';
    }
  };

  return (
    <>
      <div ref={heroRef} className="w-full space-y-5">
        {/* Breadcrumb & Context Navigation */}
        <div className="club-hero-elem flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-text-muted">
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors group font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-secondary transition-transform group-hover:-translate-x-1" />
            <span>← ALL COMMUNITIES</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">VYRA</Link>
            <span>/</span>
            <Link to="/clubs" className="hover:text-white transition-colors">COMMUNITIES</Link>
            <span>/</span>
            <span className="text-secondary font-bold truncate max-w-[200px]">{club.name}</span>
          </div>
        </div>

        {/* Hero Card Container with Immersive Cover and Scrim */}
        <div className="club-hero-elem relative w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-[#0D0F18] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_-10px_rgba(139,92,246,0.2)]">
          {/* Background Cover Image with Scrim */}
          <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px]">
            {!imageError ? (
              <img
                src={club.coverImage}
                alt={`${club.name} wide hero cover`}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center filter brightness-[0.75] transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1A1333] via-[#0F111E] to-[#08090D] flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-secondary/40 animate-pulse" />
              </div>
            )}

            {/* Cinematic Multi-stop Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/80 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090D]/90 via-[#08090D]/60 to-transparent pointer-events-none" />

            {/* Floating Top Right Badges */}
            <div className="absolute top-5 sm:top-7 right-5 sm:right-7 flex items-center gap-2.5">
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryColor(
                  club.category
                )}`}
              >
                {club.category}
              </span>

              {club.verified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-secondary border border-secondary/30 shadow-glow-lime">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED</span>
                </span>
              )}
            </div>

            {/* Inner Content Stack Positioned at Bottom Left */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-end space-y-4 sm:space-y-6">
              {/* Monogram Logo & Department */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#08090D] border border-white/20 p-1 shadow-glow-purple shrink-0">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary via-primary-dark to-[#08090D] flex items-center justify-center text-white font-display font-black text-sm sm:text-base">
                    {club.shortName.slice(0, 3)}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-xs font-mono text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    {club.department || 'Official Campus Council'}
                  </span>
                  <p className="text-xs font-mono text-text-muted">
                    Est. {club.foundedYear}
                  </p>
                </div>
              </div>

              {/* Title & Short Description */}
              <div className="space-y-2 max-w-3xl">
                <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
                  {club.name}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal max-w-2xl">
                  {club.description}
                </p>
              </div>

              {/* Stats & Explore Community CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
                  <div className="px-4 py-2 rounded-2xl bg-[#10121A]/80 border border-white/10 backdrop-blur-md flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span className="text-white font-bold">{formatMembers(club.memberCount)}</span>
                    <span className="text-text-muted">MEMBERS</span>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-[#10121A]/80 border border-white/10 backdrop-blur-md flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-white font-bold">{club.upcomingEventCount}</span>
                    <span className="text-text-muted">UPCOMING EVENTS</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => setIsOverviewModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-102 active:scale-98 transition-all shrink-0 cursor-pointer"
                >
                  <span>EXPLORE COMMUNITY</span>
                  <ArrowRight className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Overview Modal */}
      <CommunityOverviewModal
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        club={club}
      />
    </>
  );
};

