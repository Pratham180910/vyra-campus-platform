import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Sparkle,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Club } from '../../types/club';

interface CommunityOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
}

export const CommunityOverviewModal: React.FC<CommunityOverviewModalProps> = ({
  isOpen,
  onClose,
  club,
}) => {
  const [showJoinNotice, setShowJoinNotice] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowJoinNotice(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // GSAP entrance animation
  useEffect(() => {
    if (!isOpen || prefersReducedMotion || !modalRef.current) return;

    const ctx = gsap.context(() => {
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
      gsap.fromTo(
        modalRef.current,
        { scale: 0.96, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, [isOpen, prefersReducedMotion]);

  if (!isOpen) return null;

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

  // Extract display tags/interests
  const displayInterests = club.interests && club.interests.length > 0
    ? club.interests
    : club.tags && club.tags.length > 0
    ? club.tags
    : ['Campus Life', 'Student Council', 'Events'];

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-overview-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] rounded-3xl sm:rounded-[2.2rem] bg-[#0E101A] border border-white/15 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.2)] overflow-y-auto space-y-6 text-white my-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close community overview"
          className="absolute top-5 right-5 p-2 rounded-xl text-text-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {!showJoinNotice ? (
          <>
            {/* 1. Header & Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-secondary/15 text-secondary border border-secondary/25">
                  <Sparkle className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-secondary font-bold">
                  COMMUNITY
                </span>
              </div>

              <div className="flex items-start gap-4">
                {/* Monogram Badge */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#08090D] border border-white/20 p-1 shadow-glow-purple shrink-0 mt-1">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary via-primary-dark to-[#08090D] flex items-center justify-center text-white font-display font-black text-sm sm:text-base">
                    {club.shortName.slice(0, 3)}
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 pr-6">
                  <h2
                    id="community-overview-title"
                    className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-tight"
                  >
                    {club.name}
                  </h2>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryColor(
                        club.category
                      )}`}
                    >
                      {club.category}
                    </span>

                    {club.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/30 shadow-glow-lime">
                        <ShieldCheck className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1">
                {club.description}
              </p>
            </div>

            {/* 2. Compact Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-primary" /> MEMBERS
                </span>
                <p className="font-display font-black text-base sm:text-lg text-white">
                  {formatMembers(club.memberCount)}
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3 text-secondary" /> UPCOMING EVENTS
                </span>
                <p className="font-display font-black text-base sm:text-lg text-white">
                  {club.upcomingEventCount}
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#38BDF8]" /> CATEGORY
                </span>
                <p className="font-display font-bold text-xs sm:text-sm text-white truncate px-1">
                  {club.category.toUpperCase()}
                </p>
              </div>
            </div>

            {/* 3. Interests Section */}
            {displayInterests.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted font-bold block">
                  INTERESTS
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {displayInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#121422] text-[#C4B5FD] border border-white/10 hover:border-secondary/30 transition-colors"
                    >
                      {interest.startsWith('#') ? interest : `#${interest}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. About the Community */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted font-bold block">
                ABOUT THE COMMUNITY
              </span>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                <p>{club.description}</p>
                {club.department && (
                  <p className="text-[11px] font-mono text-text-muted pt-1 flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-secondary" />
                    <span>Affiliated with: <strong className="text-white">{club.department}</strong></span>
                  </p>
                )}
              </div>
            </div>

            {/* 5. Primary CTA Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowJoinNotice(true)}
                className="w-full py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>JOIN COMMUNITY</span>
                <ArrowRight className="w-4 h-4 text-secondary" />
              </button>
            </div>
          </>
        ) : (
          /* Informational Join Status State */
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto text-secondary shadow-glow-lime">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2.5">
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-secondary font-bold">
                COMMUNITY ACCESS
              </span>
              <h3 className="font-display font-black text-2xl text-white tracking-tight">
                {club.name}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                Community joining and recruitment applications will be available soon.
              </p>

              {club.upcomingEventCount > 0 && (
                <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/25 text-xs text-secondary font-mono space-y-1 mt-3">
                  <p className="font-bold tracking-wider uppercase">
                    EVENT REGISTRATION IS CURRENTLY OPEN
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {club.upcomingEventCount} scheduled gatherings and workshops are accepting registrations.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowJoinNotice(false)}
                className="w-full py-3.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all cursor-pointer"
              >
                UNDERSTOOD
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
