import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type {
  StudentProfile,
  ProfileFormData,
  ProfileCompletionInfo,
  AvatarStyle,
} from '../types/profile';

export const AVAILABLE_INTERESTS: string[] = [
  'AI',
  'WEB DEVELOPMENT',
  'DESIGN',
  'PHOTOGRAPHY',
  'ENTREPRENEURSHIP',
  'ROBOTICS',
  'MUSIC',
  'PUBLIC SPEAKING',
  'COMPETITIVE CODING',
  'GAMING & ESPORTS',
  'BLOCKCHAIN & WEB3',
  'CREATIVE WRITING',
];

export const AVAILABLE_SKILLS: string[] = [
  'React',
  'TypeScript',
  'Python',
  'C++',
  'Java',
  'UI/UX',
  'Git',
  'Three.js',
  'Next.js',
  'TailwindCSS',
  'Figma',
  'GraphQL',
  'Node.js',
  'TensorFlow',
];

export const AVATAR_STYLES: { id: AvatarStyle; label: string; gradient: string }[] = [
  {
    id: 'neon-violet',
    label: 'Electric Violet',
    gradient: 'from-[#8B5CF6] via-[#6366F1] to-[#08090D]',
  },
  {
    id: 'acid-lime',
    label: 'Acid Lime',
    gradient: 'from-[#C4FF3D] via-[#8B5CF6] to-[#08090D]',
  },
  {
    id: 'cyber-cyan',
    label: 'Cyber Cyan',
    gradient: 'from-[#06B6D4] via-[#3B82F6] to-[#08090D]',
  },
  {
    id: 'obsidian-gold',
    label: 'Solar Gold',
    gradient: 'from-[#F59E0B] via-[#EF4444] to-[#08090D]',
  },
];

/**
 * Fallback template strictly for unauthenticated guest previews
 */
export const GUEST_PREVIEW_PROFILE: StudentProfile = {
  fullName: 'Guest Student',
  initials: 'GS',
  role: 'student',
  roleBadge: 'STUDENT',
  department: 'General Studies',
  year: '1st Year',
  section: 'A1',
  campus: 'SRMIST Kattankulathur',
  campusNode: 'NODE #SRM-KTR',
  bio: 'Sign in to configure your personalized campus identity and connect with student organizations.',
  avatarStyle: 'neon-violet',
  interests: ['AI', 'WEB DEVELOPMENT', 'DESIGN'],
  skills: ['React', 'TypeScript', 'UI/UX'],
  communityIds: [],
  email: '',
  status: 'ACTIVE',
  visibility: 'CAMPUS ONLY',
  discoveryPreferences: {
    eventTypes: ['WORKSHOPS', 'HACKATHONS', 'TECH TALKS', 'COMPETITIONS', 'DESIGN'],
    discoveryMode: 'ALL',
  },
};

export const DEFAULT_STUDENT_PROFILE = GUEST_PREVIEW_PROFILE;

export function deriveInitials(name: string): string {
  if (!name || !name.trim()) return 'VY';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function calculateProfileCompletion(profile: StudentProfile): ProfileCompletionInfo {
  let score = 0;
  const missing: string[] = [];

  // Required academic credentials
  if (profile.fullName && profile.fullName.trim().length > 0) {
    score += 15;
  } else {
    missing.push('Full Name');
  }

  if (profile.department && profile.department.trim().length > 0) {
    score += 15;
  } else {
    missing.push('Department');
  }

  if (profile.year && profile.year.trim().length > 0) {
    score += 10;
  } else {
    missing.push('Academic Year');
  }

  if (profile.section && profile.section.trim().length > 0) {
    score += 10;
  } else {
    missing.push('Section');
  }

  if (profile.campus && profile.campus.trim().length > 0) {
    score += 10;
  } else {
    missing.push('Campus');
  }

  // Identity richness
  if (profile.bio && profile.bio.trim().length >= 10) {
    score += 15;
  } else {
    missing.push('Bio');
  }

  if (profile.interests && profile.interests.length >= 3) {
    score += 15;
  } else {
    missing.push('3+ Interests');
  }

  if (profile.skills && profile.skills.length >= 3) {
    score += 10;
  } else {
    missing.push('3+ Skills');
  }

  const percentage = Math.min(100, Math.max(0, score));

  let message = 'Complete your profile to make your VYRA experience more personal.';
  if (percentage === 100) {
    message = 'Your VYRA campus identity is fully established and optimized.';
  } else if (percentage >= 80) {
    message = 'Almost there! Add remaining details to achieve a verified campus identity.';
  } else if (percentage >= 50) {
    message = 'Complete your profile to make your VYRA experience more personal.';
  } else {
    message = 'Add your basic academic credentials to start personalizing campus discovery.';
  }

  return {
    percentage,
    message,
    missingFields: missing,
  };
}

export interface DatabaseProfileRow {
  id: string;
  full_name: string;
  email: string;
  avatar?: string | null;
  avatar_style?: string | null;
  department?: string | null;
  academic_year?: string | null;
  section?: string | null;
  campus?: string | null;
  bio?: string | null;
  interests?: string[] | null;
  skills?: string[] | null;
  discovery_preferences?: {
    eventTypes?: string[];
    discoveryMode?: 'ALL' | 'PERSONALIZED';
  } | null;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Creates an authentic StudentProfile derived strictly from authenticated Supabase user metadata.
 * NEVER returns hardcoded demo identity.
 */
export function createAuthenticatedProfile(user: User): StudentProfile {
  const meta = user.user_metadata || {};
  const fullName =
    (meta.full_name as string) ||
    (meta.fullName as string) ||
    (meta.name as string) ||
    (user.email ? user.email.split('@')[0] : 'Campus Student');

  const email = user.email || '';
  const rawRole = ((meta.role as string) || 'student').toLowerCase();

  return {
    fullName,
    initials: deriveInitials(fullName),
    role: rawRole,
    roleBadge: rawRole.toUpperCase(),
    department: (meta.department as string) || '',
    year: (meta.academic_year as string) || (meta.year as string) || '',
    section: (meta.section as string) || '',
    campus: (meta.campus as string) || 'SRMIST Kattankulathur',
    campusNode: 'NODE #SRM-KTR',
    bio: (meta.bio as string) || '',
    avatarStyle: (meta.avatar_style as AvatarStyle) || 'neon-violet',
    interests: Array.isArray(meta.interests) ? meta.interests : [],
    skills: Array.isArray(meta.skills) ? meta.skills : [],
    communityIds: [],
    email,
    status: 'ACTIVE',
    visibility: 'CAMPUS ONLY',
    discoveryPreferences: {
      eventTypes: ['WORKSHOPS', 'HACKATHONS', 'TECH TALKS', 'COMPETITIONS', 'DESIGN'],
      discoveryMode: 'ALL',
    },
  };
}

export function mapDbToStudentProfile(
  row: DatabaseProfileRow,
  fallbackEmail?: string
): StudentProfile {
  const fullName = row.full_name || 'Campus Student';
  const rawRole = (row.role || 'student').toLowerCase();
  return {
    fullName,
    initials: deriveInitials(fullName),
    role: rawRole,
    roleBadge: rawRole.toUpperCase(),
    department: row.department || '',
    year: row.academic_year || '',
    section: row.section || '',
    campus: row.campus || 'SRMIST Kattankulathur',
    campusNode: 'NODE #SRM-KTR',
    bio: row.bio || '',
    avatarStyle: (row.avatar_style as AvatarStyle) || 'neon-violet',
    interests: Array.isArray(row.interests) ? row.interests : [],
    skills: Array.isArray(row.skills) ? row.skills : [],
    communityIds: [],
    email: row.email || fallbackEmail || '',
    status: 'ACTIVE',
    visibility: 'CAMPUS ONLY',
    discoveryPreferences: {
      eventTypes: row.discovery_preferences?.eventTypes || [
        'WORKSHOPS',
        'HACKATHONS',
        'TECH TALKS',
        'COMPETITIONS',
        'DESIGN',
      ],
      discoveryMode: row.discovery_preferences?.discoveryMode || 'ALL',
    },
  };
}

type ProfileListener = (profile: StudentProfile) => void;

class ProfileService {
  private currentProfile: StudentProfile = { ...GUEST_PREVIEW_PROFILE };
  private listeners: Set<ProfileListener> = new Set();

  private notifyListeners(): void {
    const copy = { ...this.currentProfile };
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch {
        // Prevent listener error from stopping execution
      }
    });
  }

  subscribe(listener: ProfileListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getProfile(): StudentProfile {
    return { ...this.currentProfile };
  }

  getProfileCompletion(): ProfileCompletionInfo {
    return calculateProfileCompletion(this.currentProfile);
  }

  setProfileLocally(newProfile: StudentProfile): void {
    this.currentProfile = { ...newProfile };
    this.notifyListeners();
  }

  /**
   * Fetch authenticated user's profile from Supabase using their verified auth UUID
   */
  async fetchProfile(userId: string, authUser?: User | null): Promise<StudentProfile> {
    if (!userId) {
      throw new Error('fetchProfile requires a valid user UUID.');
    }

    if (!isSupabaseConfigured) {
      if (authUser) {
        const local = createAuthenticatedProfile(authUser);
        this.currentProfile = local;
        this.notifyListeners();
        return local;
      }
      return { ...this.currentProfile };
    }

    try {
      // Direct query on public.profiles using authenticated user's actual UUID
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[VYRA:Profile] Database error reading public.profiles:', error);
        // Fall back to authenticated profile built from user metadata, NEVER demo data
        if (authUser) {
          const authFallback = createAuthenticatedProfile(authUser);
          this.currentProfile = authFallback;
          this.notifyListeners();
          return authFallback;
        }
        throw error;
      }

      if (!data) {
        // No row in public.profiles found for this UUID yet; auto-provision from auth user metadata
        console.warn('[VYRA:Profile] Profile record missing for ID:', userId, '- provisioning initial row...');
        if (authUser) {
          const initial = createAuthenticatedProfile(authUser);
          try {
            const { data: upsertedData, error: upsertError } = await supabase
              .from('profiles')
              .upsert({
                id: userId,
                full_name: initial.fullName,
                email: initial.email,
                avatar_style: initial.avatarStyle,
                role: 'student',
                updated_at: new Date().toISOString(),
              })
              .select('*')
              .single();

            if (!upsertError && upsertedData) {
              const mapped = mapDbToStudentProfile(upsertedData as DatabaseProfileRow, authUser.email);
              this.currentProfile = mapped;
              this.notifyListeners();
              return mapped;
            }
          } catch (provisionErr) {
            console.error('[VYRA:Profile] Automatic profile provisioning failed:', provisionErr);
          }

          this.currentProfile = initial;
          this.notifyListeners();
          return initial;
        }

        throw new Error(`Profile not found for ID: ${userId}`);
      }

      // Valid profile row returned from Supabase
      const mapped = mapDbToStudentProfile(data as DatabaseProfileRow, authUser?.email);

      // Populate real club memberships from public.club_members
      try {
        const { data: memberRows } = await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', userId);
        if (memberRows && memberRows.length > 0) {
          mapped.communityIds = memberRows.map((r: { club_id: string }) => r.club_id);
        }
      } catch {
        // Fall back gracefully with empty memberships
      }

      this.currentProfile = mapped;
      this.notifyListeners();
      return mapped;
    } catch (err) {
      console.error('[VYRA:Profile] fetchProfile failed:', err);
      if (authUser) {
        const authFallback = createAuthenticatedProfile(authUser);
        this.currentProfile = authFallback;
        this.notifyListeners();
        return authFallback;
      }
      throw err;
    }
  }

  /**
   * Update profile directly in Supabase profiles table for the authenticated user's UUID
   */
  async updateProfile(formData: ProfileFormData, userId?: string): Promise<StudentProfile> {
    if (!userId) {
      throw new Error('Cannot update profile: Authenticated user ID is required.');
    }

    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      throw new Error('Full name cannot be empty.');
    }

    const updatedLocal: StudentProfile = {
      ...this.currentProfile,
      fullName: trimmedName,
      initials: deriveInitials(trimmedName),
      bio: formData.bio.trim(),
      department: formData.department.trim(),
      year: formData.year.trim(),
      section: formData.section.trim(),
      campus: formData.campus.trim(),
      avatarStyle: formData.avatarStyle || 'neon-violet',
      interests: [...formData.interests],
      skills: [...formData.skills],
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: trimmedName,
          bio: formData.bio.trim(),
          department: formData.department.trim(),
          academic_year: formData.year.trim(),
          section: formData.section.trim(),
          campus: formData.campus.trim(),
          avatar_style: formData.avatarStyle || 'neon-violet',
          interests: formData.interests,
          skills: formData.skills,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        console.error('[VYRA:Profile] Failed to persist profile update to Supabase:', error);
        throw new Error(error.message || 'Database rejected profile update.');
      }

      if (data) {
        const mapped = mapDbToStudentProfile(data as DatabaseProfileRow, this.currentProfile.email);
        this.currentProfile = mapped;
        this.notifyListeners();
        return mapped;
      }
    }

    this.currentProfile = updatedLocal;
    this.notifyListeners();
    return updatedLocal;
  }

  /**
   * Update user discovery preferences in Supabase for the authenticated user
   */
  async updatePreferences(
    preferences: Partial<StudentProfile['discoveryPreferences']>,
    userId?: string
  ): Promise<StudentProfile> {
    if (!userId) {
      throw new Error('Cannot update preferences: User ID is required.');
    }

    const newPreferences = {
      ...this.currentProfile.discoveryPreferences,
      ...preferences,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          discovery_preferences: newPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        console.error('[VYRA:Profile] Failed to update preferences in Supabase:', error);
        throw new Error(error.message || 'Failed to update preferences.');
      }

      if (data) {
        const mapped = mapDbToStudentProfile(data as DatabaseProfileRow, this.currentProfile.email);
        this.currentProfile = mapped;
        this.notifyListeners();
        return mapped;
      }
    }

    this.currentProfile = {
      ...this.currentProfile,
      discoveryPreferences: newPreferences,
    };
    this.notifyListeners();
    return this.currentProfile;
  }

  resetToDefaults(): StudentProfile {
    this.currentProfile = { ...GUEST_PREVIEW_PROFILE };
    this.notifyListeners();
    return { ...this.currentProfile };
  }
}

export const profileService = new ProfileService();
