import React, { useState, useMemo, useEffect } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ClubsHero } from '../components/clubs/ClubsHero';
import { ClubSearch } from '../components/clubs/ClubSearch';
import { ClubFilters } from '../components/clubs/ClubFilters';
import { MobileClubFilters } from '../components/clubs/MobileClubFilters';
import { FeaturedClubs } from '../components/clubs/FeaturedClubs';
import { ClubGrid } from '../components/clubs/ClubGrid';
import { ClubEmptyState } from '../components/clubs/ClubEmptyState';
import { filterAndSortClubs } from '../data/clubs';
import { clubService } from '../services/clubService';
import type { Club, ClubCategory, ClubSortOption } from '../types/club';

export const Clubs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory>('All');
  const [selectedSort, setSelectedSort] = useState<ClubSortOption>('Recommended');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [allClubs, setAllClubs] = useState<Club[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Clubs & Communities — VYRA | Your Campus. Your Moments.';
  }, []);

  // Fetch real clubs from Supabase
  useEffect(() => {
    clubService.getClubs().then(({ data }) => {
      if (data) {
        setAllClubs(data);
      }
    });
  }, []);

  // Filter and sort clubs
  const filteredClubs = useMemo(() => {
    return filterAndSortClubs(allClubs, searchQuery, selectedCategory, selectedSort);
  }, [allClubs, searchQuery, selectedCategory, selectedSort]);

  // Featured clubs: displayed when no query or filtered to matching category
  const featuredClubs = useMemo(() => {
    return allClubs.filter((c) => {
      if (!c.featured) return false;
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      return true;
    });
  }, [allClubs, selectedCategory]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count += 1;
    if (selectedSort !== 'Recommended') count += 1;
    return count;
  }, [selectedCategory, selectedSort]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSort('Recommended');
  };

  return (
    <PageShell>
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          {/* 2. Hero Section */}
          <ClubsHero />

          {/* 3. Search & Interactive Category / Sort Controls */}
          <section className="space-y-5">
            <ClubSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultCount={filteredClubs.length}
            />

            <ClubFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
            />
          </section>

          {/* 4. Featured Communities (Shown when discover mode or matching category has featured clubs) */}
          {!searchQuery && featuredClubs.length > 0 && (
            <FeaturedClubs featuredClubs={featuredClubs} />
          )}

          {/* 5. Main Club Results Grid / Empty State */}
          {filteredClubs.length > 0 ? (
            <ClubGrid clubs={filteredClubs} totalClubs={allClubs.length} />
          ) : (
            <ClubEmptyState onClearFilters={handleClearFilters} />
          )}
        </div>
      </main>

      {/* 6. Mobile Filters Modal */}
      <MobileClubFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        onApply={(cat, sort) => {
          setSelectedCategory(cat);
          setSelectedSort(sort);
        }}
        onReset={() => {
          setSelectedCategory('All');
          setSelectedSort('Recommended');
        }}
      />

      {/* 7. Footer */}
      <Footer />
    </PageShell>
  );
};

export default Clubs;
