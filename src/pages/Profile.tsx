import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProfileHero } from '../components/profile/ProfileHero';
import { CampusIdentitySection } from '../components/profile/CampusIdentitySection';
import { InterestsAndSkillsSection } from '../components/profile/InterestsAndSkillsSection';
import { VyraActivitySnapshot } from '../components/profile/VyraActivitySnapshot';
import { ProfileCommunitiesSection } from '../components/profile/ProfileCommunitiesSection';
import { DiscoveryPreferencesSection } from '../components/profile/DiscoveryPreferencesSection';
import { AccountSettingsSection } from '../components/profile/AccountSettingsSection';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { useProfile } from '../hooks/useProfile';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const Profile: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    profile,
    completion,
    updateProfile,
    updatePreferences,
    isSaving,
    isLoading,
    error,
    refetchProfile,
  } = useProfile();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'STUDENT IDENTITY — Profile | VYRA Campus Ecosystem';
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (prefersReducedMotion || !pageRef.current || isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.profile-section-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isLoading]);

  // Loading State: While verifying session or fetching profile from Supabase
  if (isLoading) {
    return (
      <PageShell>
        <Navbar />
        <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 flex flex-col items-center justify-center min-h-[65vh]">
          <div className="flex flex-col items-center gap-5 text-center max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-electric-purple/15 border border-electric-purple/30 flex items-center justify-center text-electric-purple shadow-[0_0_25px_rgba(139,92,246,0.25)]">
              <Loader2 className="w-7 h-7 animate-spin text-acid-lime" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-text-muted">
                INITIALIZING CAMPUS IDENTITY
              </span>
              <h2 className="font-display font-black text-2xl text-white">
                Loading Student Profile...
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Retrieving your verified identity attributes and community affiliations from Supabase.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </PageShell>
    );
  }

  // Error State: If profile retrieval completely failed and no profile is available
  if (error && !profile) {
    return (
      <PageShell>
        <Navbar />
        <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 flex flex-col items-center justify-center min-h-[65vh]">
          <div className="p-8 rounded-3xl bg-[#0F111A] border border-white/15 max-w-md text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display font-bold text-xl text-white">
                Unable to Load Profile
              </h2>
              <p className="text-xs text-rose-300 leading-relaxed font-mono">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetchProfile()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        </main>
        <Footer />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* 1. Global Navigation */}
      <Navbar />

      <main
        ref={pageRef}
        className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10"
      >
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          {/* Optional inline error notification */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between gap-3 text-xs text-rose-300 font-mono">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => refetchProfile()}
                className="text-white hover:underline uppercase text-[10px] tracking-wider shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* 2. Opening Hero with Profile Identity & Completion */}
          <div className="profile-section-reveal">
            <ProfileHero
              profile={profile}
              completion={completion}
              onEditClick={() => setIsEditModalOpen(true)}
            />
          </div>

          {/* 3. Campus Academic Identity */}
          <div className="profile-section-reveal">
            <CampusIdentitySection profile={profile} />
          </div>

          {/* 4. Interests & Skills */}
          <div className="profile-section-reveal">
            <InterestsAndSkillsSection
              profile={profile}
              onEditClick={() => setIsEditModalOpen(true)}
            />
          </div>

          {/* 5. VYRA Activity Snapshot */}
          <div className="profile-section-reveal">
            <VyraActivitySnapshot profile={profile} />
          </div>

          {/* 6. Campus Communities */}
          <div className="profile-section-reveal">
            <ProfileCommunitiesSection communityIds={profile.communityIds} />
          </div>

          {/* 7. Discovery Preferences */}
          <div className="profile-section-reveal">
            <DiscoveryPreferencesSection
              preferences={profile.discoveryPreferences}
              onUpdatePreferences={updatePreferences}
            />
          </div>

          {/* 8. Account Settings & Security */}
          <div className="profile-section-reveal">
            <AccountSettingsSection profile={profile} />
          </div>
        </div>
      </main>

      {/* 9. Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onSave={updateProfile}
          isSaving={isSaving}
        />
      )}

      {/* 10. Global Footer */}
      <Footer />
    </PageShell>
  );
};

export default Profile;
