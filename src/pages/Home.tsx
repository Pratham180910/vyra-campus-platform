import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/hero/Hero';
import { FeaturedEvents } from '../components/events/FeaturedEvents';
import { Categories } from '../components/sections/Categories';
import { ClosingCTA } from '../components/sections/ClosingCTA';
import { Footer } from '../components/layout/Footer';

export const Home: React.FC = () => {

  return (
    <PageShell>
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Hero / Interactive 3D Experience (with ScrollTrigger pinning & Campus Stats) */}
      <main className="flex-1 w-full">
        <Hero />

        {/* 3. Campus Pulse / Featured Events */}
        <FeaturedEvents />

        {/* 4. Explore Categories */}
        <Categories />

        {/* 5. Discover CTA / Closing Section */}
        <ClosingCTA />
      </main>

      {/* 6. Footer */}
      <Footer />
    </PageShell>
  );
};
