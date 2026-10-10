import { createContext } from 'react';
import type {
  StudentProfile,
  ProfileFormData,
  ProfileCompletionInfo,
} from '../types/profile';

export interface ProfileContextType {
  profile: StudentProfile;
  completion: ProfileCompletionInfo;
  updateProfile: (data: ProfileFormData) => Promise<boolean>;
  updatePreferences: (
    preferences: Partial<StudentProfile['discoveryPreferences']>
  ) => Promise<void>;
  resetToDefaults: () => void;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  refetchProfile: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);
