import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ProfileContext,
  type ProfileContextType,
} from './profileContextDefinition';
import {
  profileService,
  calculateProfileCompletion,
  createAuthenticatedProfile,
  GUEST_PREVIEW_PROFILE,
} from '../services/profileService';
import { useAuth } from '../hooks/useAuth';
import type {
  StudentProfile,
  ProfileFormData,
} from '../types/profile';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return GUEST_PREVIEW_PROFILE;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Track the current user ID to prevent race conditions during auth switches
  const currentUserIdRef = useRef<string | null>(null);

  const loadProfile = useCallback(async () => {
    // Wait until authentication initialization has settled
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    if (!user || !isAuthenticated) {
      // Unauthenticated visitor
      currentUserIdRef.current = null;
      setProfile(GUEST_PREVIEW_PROFILE);
      setIsLoading(false);
      setError(null);
      return;
    }

    currentUserIdRef.current = user.id;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch authenticated profile from Supabase using user's actual UUID
      const fetched = await profileService.fetchProfile(user.id, user);
      if (currentUserIdRef.current === user.id) {
        setProfile(fetched);
        setError(null);
      }
    } catch (err: unknown) {
      console.error('[VYRA:ProfileProvider] Error fetching profile:', err);
      if (currentUserIdRef.current === user.id) {
        const msg = err instanceof Error ? err.message : 'Unable to load profile.';
        setError(msg);
        // Only set profile fallback if user metadata has an explicit verified role;
        // never silently assume 'student' when the database query fails.
        const metaRole = (user.user_metadata?.role as string)?.toLowerCase();
        if (metaRole) {
          const fallback = createAuthenticatedProfile(user);
          setProfile(fallback);
        }
      }
    } finally {
      if (currentUserIdRef.current === user.id) {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, isAuthenticated]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Subscribe to service updates (e.g. from local profile mutation)
  useEffect(() => {
    const unsubscribe = profileService.subscribe((updated) => {
      setProfile(updated);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const completion = useMemo(() => {
    return calculateProfileCompletion(profile);
  }, [profile]);

  const updateProfile = useCallback(
    async (formData: ProfileFormData): Promise<boolean> => {
      if (!user?.id) {
        setError('Cannot update profile: No active user session.');
        return false;
      }

      setIsSaving(true);
      setError(null);

      try {
        const updated = await profileService.updateProfile(formData, user.id);
        setProfile(updated);
        setIsSaving(false);
        return true;
      } catch (err: unknown) {
        console.error('[VYRA:ProfileProvider] Error saving profile:', err);
        const msg = err instanceof Error ? err.message : 'Failed to save profile changes.';
        setError(msg);
        setIsSaving(false);
        return false;
      }
    },
    [user]
  );

  const updatePreferences = useCallback(
    async (preferences: Partial<StudentProfile['discoveryPreferences']>) => {
      if (!user?.id) return;
      try {
        const updated = await profileService.updatePreferences(preferences, user.id);
        setProfile(updated);
      } catch (err) {
        console.error('[VYRA:ProfileProvider] Error saving preferences:', err);
      }
    },
    [user]
  );

  const resetToDefaults = useCallback(() => {
    if (user) {
      const authReset = createAuthenticatedProfile(user);
      profileService.setProfileLocally(authReset);
      setProfile(authReset);
    } else {
      const defaults = profileService.resetToDefaults();
      setProfile(defaults);
    }
  }, [user]);

  const value = useMemo<ProfileContextType>(() => {
    return {
      profile,
      completion,
      updateProfile,
      updatePreferences,
      resetToDefaults,
      isSaving,
      isLoading,
      error,
      refetchProfile: loadProfile,
    };
  }, [
    profile,
    completion,
    updateProfile,
    updatePreferences,
    resetToDefaults,
    isSaving,
    isLoading,
    error,
    loadProfile,
  ]);

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
