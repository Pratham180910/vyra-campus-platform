import type { EventItem } from './index';
import type { Club } from './club';

export interface StudentProfilePreview {
  roleBadge: string;
  department: string;
  institution: string;
  initials: string;
  campusNode: string;
}

export interface DashboardStatsData {
  registeredCount: number;
  savedCount: number;
  communitiesCount: number;
  attendedCount: number;
}

export type ActivityType =
  | 'EVENT REGISTERED'
  | 'EVENT SAVED'
  | 'COMMUNITY VIEWED'
  | 'EVENT ATTENDED';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  relativeTime: 'RECENT' | 'THIS WEEK' | 'EARLIER';
  link?: string;
}

export interface DashboardData {
  profile: StudentProfilePreview;
  stats: DashboardStatsData;
  upcomingEvents: EventItem[];
  savedEvents: EventItem[];
  communities: Club[];
  recentActivity: ActivityItem[];
}
