import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import gsap from 'gsap';
import { EventCard } from './EventCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { EventRecommendation } from '../../services/eventRecommendationService';
import type { StudentProfile } from '../../types/profile';

interface RecommendedEventsSectionProps {
  recommendations: EventRecommendation[];
  profile: StudentProfile | null;
  hasPersonalizationData: boolean;
  activeFilterSummary?: string;
}

export const RecommendedEventsSection: React.FC<RecommendedEventsSectionProps> = ({
  recommendations,
  profile,
  hasPersonalizationData,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rec-section-fade',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, recommendations.length, hasPersonalizationData]);

  // 1. Incomplete / Low Profile Personalization State
  if (!hasPersonalizationData) {
    return (
      <section
        ref={sectionRef}
        aria-labelledby="rec-heading"
        className="relative w-full rounded-3xl bg-gradient-to-r from-[#141226] via-[#0E101A] to-[#0A0C14] border border-electric-purple/30 p-6 sm:p-8 overflow-hidden shadow-2xl"
      >
        {/* Ambient backlight glow */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-electric-purple/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="rec-section-fade inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-purple/15 border border-electric-purple/30 text-xs font-mono uppercase tracking-widest text-electric-purple">
              <Sparkles className="w-3.5 h-3.5 text-acid-lime" />
              <span>DISCOVER YOUR MATCHES</span>
            </div>

            <h3
              id="rec-heading"
              className="rec-section-fade font-display font-black text-2xl sm:text-3xl text-white tracking-tight"
            >
              TAILORED CAMPUS EXPERIENCES
            </h3>

            <p className="rec-section-fade text-sm text-text-secondary leading-relaxed font-normal">
              Complete your VYRA profile to get intelligent, personalized event
              recommendations matched to your technical interests, craft, and collegiate goals.
            </p>
          </div>

          <div className="rec-section-fade shrink-0">
            <Link
              to="/profile"
              id="complete-profile-rec-cta"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-semibold font-mono text-white bg-electric-purple hover:bg-electric-purple/90 shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-white/20"
            >
              <span>COMPLETE PROFILE →</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // If no recommendations meet the threshold in current search/filter view
  if (recommendations.length === 0) {
    return null;
  }

  // Active interest tags for context display
  const activeInterestTags = (profile?.interests || []).slice(0, 3);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="rec-heading"
      className="space-y-6 pt-2 pb-4"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-electric-purple/15 text-electric-purple border border-electric-purple/30">
              <Sparkles className="w-3.5 h-3.5 text-acid-lime" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-electric-purple">
              RECOMMENDED FOR YOU
            </span>
          </div>

          <h2
            id="rec-heading"
            className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight"
          >
            CURATED FOR YOUR JOURNEY
          </h2>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Events selected based on your VYRA profile focus tracks and skills.
          </p>
        </div>

        {/* Signals pill */}
        <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-text-muted">
          <UserCheck className="w-3.5 h-3.5 text-acid-lime" />
          <span>MATCHED SIGNALS:</span>
          <div className="flex flex-wrap gap-1.5">
            {activeInterestTags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Recommended Events using existing EventCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {recommendations.map((rec, idx) => (
          <div key={rec.event.id} className="rec-section-fade">
            <EventCard
              event={rec.event}
              index={idx}
              recommendationBadge="FOR YOU"
              recommendationReason={rec.primaryReason}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
