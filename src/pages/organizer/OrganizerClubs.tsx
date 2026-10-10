import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  Search,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Trash2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { OrganizerShell } from '../../components/organizer/OrganizerShell';
import { organizerClubService, type OrganizerClubRecord } from '../../services/organizerClubService';
import type { ClubCategory } from '../../types/club';

const CATEGORIES: ClubCategory[] = [
  'All',
  'Technology',
  'AI & Robotics',
  'Coding',
  'Design',
  'Cultural',
  'Music',
  'Sports',
  'Entrepreneurship',
  'Social Impact',
  'Media',
];

export const OrganizerClubs: React.FC = () => {
  const [clubs, setClubs] = useState<OrganizerClubRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    club: OrganizerClubRecord | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    club: null,
    isDeleting: false,
  });

  const loadClubs = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const { data, error } = await organizerClubService.fetchClubs();
    if (error) {
      setErrorMessage(error);
    } else {
      setClubs(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    const unsubscribe = organizerClubService.subscribe(() => {
      setClubs(organizerClubService.getCachedClubs());
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter & search
  const filteredClubs = useMemo(() => {
    let result = clubs;

    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.acronym && c.acronym.toLowerCase().includes(q)) ||
          (c.department && c.department.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [clubs, selectedCategory, searchQuery]);

  const handleDeleteClub = async () => {
    if (!deleteModal.club) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const { success, error } = await organizerClubService.deleteClub(deleteModal.club.id);

    if (success) {
      showToast(`Deleted club "${deleteModal.club.name}".`);
      setDeleteModal({ isOpen: false, club: null, isDeleting: false });
    } else {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      showToast(error || 'Failed to delete club.');
    }
  };

  return (
    <OrganizerShell>
      <div className="space-y-8">
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#121420] border border-secondary/40 shadow-glow-lime text-white text-xs font-mono flex items-center gap-3 animate-fade-in">
            <Sparkles className="w-4 h-4 text-secondary shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.isOpen && deleteModal.club && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0D0F18] border border-white/10 shadow-2xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-display font-bold text-xl text-white">Delete Club?</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Are you sure you want to delete <span className="text-white font-semibold">"{deleteModal.club.name}"</span>? This will permanently remove the club and its associations from Supabase.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, club: null, isDeleting: false })}
                  disabled={deleteModal.isDeleting}
                  className="flex-1 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-text-secondary bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClub}
                  disabled={deleteModal.isDeleting}
                  className="flex-1 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                >
                  {deleteModal.isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Block */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-secondary/15 text-secondary border border-secondary/30">
                  STUDIO MANAGEMENT
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-white/5 text-text-muted border border-white/10">
                  {clubs.length} TOTAL COMMUNITIES
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                CAMPUS CLUBS & GUILDS
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary">
                Create, verify, and curate university student clubs and academic organizations with live Supabase synchronization.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadClubs}
                disabled={isLoading}
                title="Refresh from Supabase"
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/organizer/clubs/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover transition-all duration-200 shadow-glow-lime hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Club</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clubs by name, acronym, department, or keyword..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-electric-purple/20 border-primary text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.25)] border'
                    : 'bg-white/[0.02] border-white/5 text-text-secondary hover:text-white hover:bg-white/5 border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between text-rose-400 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={loadClubs}
              className="underline hover:text-white font-bold ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && clubs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">
              SYNCHRONIZING CLUBS FROM SUPABASE...
            </p>
          </div>
        ) : filteredClubs.length === 0 ? (
          /* Empty State */
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-text-muted">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-white">No clubs found</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                {searchQuery || selectedCategory !== 'All'
                  ? 'No campus clubs match your current search and category filters.'
                  : 'No campus clubs have been created in the database yet. Launch your first student community now.'}
              </p>
            </div>
            <div>
              <Link
                to="/organizer/clubs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New Club</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Clubs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="rounded-3xl bg-[#0B0D16]/90 border border-white/10 overflow-hidden flex flex-col group hover:border-primary/40 transition-all duration-300 shadow-xl"
              >
                {/* Cover Banner */}
                <div className="relative h-40 w-full overflow-hidden bg-[#10121D]">
                  <img
                    src={club.cover_image || '/images/clubs/ai-society.jpg'}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/clubs/ai-society.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D16] via-[#0B0D16]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {club.category}
                    </span>

                    {club.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-secondary/20 backdrop-blur-md text-secondary border border-secondary/30 shadow-glow-lime">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-white/10 backdrop-blur-md text-text-muted border border-white/10">
                        Unverified
                      </span>
                    )}
                  </div>

                  {/* Acronym Stamp */}
                  {club.acronym && (
                    <div className="absolute bottom-3 left-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/30 backdrop-blur-md text-electric-purple border border-primary/40">
                        {club.acronym}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-glow-purple transition-all line-clamp-1">
                      {club.name}
                    </h3>
                    {club.department && (
                      <p className="text-[11px] font-mono text-text-muted line-clamp-1">
                        {club.department}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {club.description}
                    </p>
                  </div>

                  {/* Meta Footer & Actions */}
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-white font-bold">{club.member_count ?? 0}</span> Members
                      </span>
                      <span className="text-[10px] text-text-muted truncate max-w-[120px]">
                        ID: {club.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to={`/organizer/clubs/${club.id}/edit`}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-secondary" />
                        <span>Edit</span>
                      </Link>

                      <Link
                        to={`/clubs/${club.id}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View Public Club Discovery Page"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteModal({ isOpen: true, club, isDeleting: false })}
                        title="Delete Club"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OrganizerShell>
  );
};
