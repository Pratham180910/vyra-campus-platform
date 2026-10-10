export type AvatarStyle = 'neon-violet' | 'acid-lime' | 'cyber-cyan' | 'obsidian-gold';

export interface StudentProfile {
  fullName: string;
  initials: string;
  roleBadge: string;
  role?: string;
  department: string;
  year: string;
  section: string;
  campus: string;
  campusNode: string;
  bio: string;
  avatarStyle: AvatarStyle;
  interests: string[];
  skills: string[];
  communityIds: string[];
  email: string;
  status: 'ACTIVE' | 'AWAY' | 'VERIFIED';
  visibility: 'CAMPUS ONLY' | 'COMMUNITY ONLY' | 'PRIVATE';
  discoveryPreferences: {
    eventTypes: string[];
    discoveryMode: 'ALL' | 'PERSONALIZED';
  };
}

export interface ProfileFormData {
  fullName: string;
  bio: string;
  department: string;
  year: string;
  section: string;
  campus: string;
  avatarStyle: AvatarStyle;
  interests: string[];
  skills: string[];
}

export interface ProfileFormErrors {
  fullName?: string;
  department?: string;
  year?: string;
  section?: string;
  campus?: string;
}

export interface ProfileCompletionInfo {
  percentage: number;
  message: string;
  missingFields: string[];
}
