import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Sparkles, Compass, Users, Calendar, ArrowRight, Zap } from 'lucide-react';

export const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'About — VYRA | Your Campus. Your Moments.';
  }, []);

  return (
    <PageShell>
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-20 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary shadow-glow-lime">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE VYRA VISION</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
              YOUR CAMPUS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-electric-purple text-glow-purple">
                ONE UNIFIED PULSE.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
              VYRA is the next-generation campus life portal designed to replace scattered chat channels, missed deadlines, and lost posters with one cinematic discovery experience.
            </p>
          </section>

          {/* Pillars Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 sm:p-8 rounded-3xl bg-[#10121A]/80 border border-white/10 hover:border-primary/40 transition-all duration-300 space-y-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-electric-purple flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white group-hover:text-glow-purple transition-colors">
                Intelligent Discovery
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                From 36-hour national collegiate hackathons to midnight amphitheatre concerts, our personalized matching engine surfaces the moments that match your skills, interests, and academic year.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-[#10121A]/80 border border-white/10 hover:border-secondary/40 transition-all duration-300 space-y-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white group-hover:text-glow-lime transition-colors">
                Community Gravity
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Clubs and student societies are the lifeblood of campus. VYRA gives technical chapters, cultural guilds, and sports teams a dedicated stage to recruit, showcase projects, and host flagships.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-[#10121A]/80 border border-white/10 hover:border-pink-500/40 transition-all duration-300 space-y-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">
                Unified Timeline
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                With a built-in interactive Campus Calendar, month-by-month views, and personalized digital pass management, you always know what is happening across every corner of your campus.
              </p>
            </div>
          </section>

          {/* Editorial Mission Feature */}
          <section className="p-8 sm:p-12 lg:p-16 rounded-[2.5rem] bg-gradient-to-br from-[#121422] via-[#0E1018] to-[#08090D] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                <Zap className="w-4 h-4" />
                <span>DESIGN PRINCIPLES</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
                BUILT WITH OBSIDIAN, ELECTRIC VIOLET & ACID LIME.
              </h2>
              <p className="text-base text-text-secondary leading-relaxed">
                We believe collegiate software should feel as sharp, fast, and inspiring as the best products in the world. No clutter. No archaic bulletin boards. Only clean typography, responsive motion, and instant pass verification.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all duration-200"
                >
                  <span>Explore Discover</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/clubs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                >
                  <span>View Student Clubs</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Campus Ecosystem Stats */}
          <section className="border-t border-white/10 pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-display text-3xl sm:text-4xl font-black text-white">100+</p>
              <p className="text-xs font-mono text-text-muted uppercase mt-1">Campus Moments</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-black text-secondary">45+</p>
              <p className="text-xs font-mono text-text-muted uppercase mt-1">Verified Clubs</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-black text-electric-purple">12,000+</p>
              <p className="text-xs font-mono text-text-muted uppercase mt-1">Active Students</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-black text-white">4</p>
              <p className="text-xs font-mono text-text-muted uppercase mt-1">Campus Arenas</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </PageShell>
  );
};

export default About;
