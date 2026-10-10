import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ClubHero } from '../components/clubs/ClubHero';
import { ClubStats } from '../components/clubs/ClubStats';
import { ClubAbout } from '../components/clubs/ClubAbout';
import { ClubActivity } from '../components/clubs/ClubActivity';
import { ClubUpcomingEvents } from '../components/clubs/ClubUpcomingEvents';
import { ClubNotFound } from '../components/clubs/ClubNotFound';
import { clubService } from '../services/clubService';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Loader2 } from 'lucide-react';
import type { Club } from '../types/club';

export const ClubDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [club, setClub] = useState<Club | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    clubService.getClubById(id).then(({ data }) => {
      setClub(data || undefined);
      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (club) {
      document.title = `${club.name} — VYRA | Your Campus. Your Moments.`;
    } else {
      document.title = 'Community Not Found — VYRA';
    }
  }, [id, club]);

  // Entrance animations for sections
  useEffect(() => {
    if (prefersReducedMotion || !pageRef.current || !club || isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.club-section-reveal',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [club, prefersReducedMotion, isLoading]);

  if (isLoading) {
    return (
      <PageShell>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-white">
          <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
          <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">
            LOADING COMMUNITY DETAILS...
          </p>
        </div>
        <Footer />
      </PageShell>
    );
  }

  if (!club) {
    return (
      <PageShell>
        <Navbar />
        <ClubNotFound />
        <Footer />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* 1. Global Navigation */}
      <Navbar />

      <main ref={pageRef} className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          {/* 2. Hero Component */}
          <ClubHero club={club} />

          {/* 3. Dynamic Statistics Row */}
          <div className="club-section-reveal">
            <ClubStats club={club} />
          </div>

          {/* 4. Split Layout: About Section (Left) + Recent Activity Timeline (Right) */}
          <div className="club-section-reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <ClubAbout club={club} />
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <ClubActivity club={club} />
            </div>
          </div>

          {/* 5. Upcoming Events from this Community */}
          <div className="club-section-reveal">
            <ClubUpcomingEvents club={club} />
          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <Footer />
    </PageShell>
  );
};

export default ClubDetails;
