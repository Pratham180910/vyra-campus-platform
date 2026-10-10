export type ClubCategory =
  | 'All'
  | 'Technology'
  | 'AI & Robotics'
  | 'Coding'
  | 'Design'
  | 'Cultural'
  | 'Music'
  | 'Sports'
  | 'Entrepreneurship'
  | 'Social Impact'
  | 'Media';

export type ClubSortOption = 'Recommended' | 'Most Members' | 'Most Active' | 'Newest';

export interface Club {
  id: string;
  name: string;
  shortName: string;
  description: string;
  logo?: string;
  coverImage: string;
  category: Exclude<ClubCategory, 'All'>;
  tags: string[];
  memberCount: number;
  foundedYear: number;
  department?: string;
  featured?: boolean;
  verified: boolean;
  upcomingEventCount: number;
  interests?: string[];
}
