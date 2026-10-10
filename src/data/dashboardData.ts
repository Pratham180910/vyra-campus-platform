import { getEventById } from './events';
import { getClubById } from './clubs';
import type { DashboardData, StudentProfilePreview, DashboardStatsData, ActivityItem } from '../types/dashboard';
import type { EventItem } from '../types';
import type { Club } from '../types/club';

export const STUDENT_PROFILE_PREVIEW: StudentProfilePreview = {
  roleBadge: 'STUDENT',
  department: 'Computer Science',
  institution: 'SRMIST',
  initials: 'VY',
  campusNode: 'NODE #SRM-KTR',
};

export const DASHBOARD_STATS_PREVIEW: DashboardStatsData = {
  registeredCount: 4,
  savedCount: 3,
  communitiesCount: 4,
  attendedCount: 12,
};

// IDs of upcoming events the student has registered for
const REGISTERED_EVENT_IDS = ['hacksrm-2026', 'pro-showdown', 'ai-and-beyond'];

// IDs of events saved for later
const SAVED_EVENT_IDS = ['rhythms-2026', 'designverse', 'codeclash'];

// IDs of communities the student is associated with
const COMMUNITY_IDS = ['ai-society', 'codechef-srm', 'gdsc-srm', 'design-collective'];

export const RECENT_ACTIVITY_PREVIEW: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'EVENT REGISTERED',
    title: 'HACKSRM 2026',
    description: 'Confirmed spot for 36-hour national collegiate hackathon.',
    relativeTime: 'RECENT',
    link: '/events/hacksrm-2026',
  },
  {
    id: 'act-2',
    type: 'COMMUNITY VIEWED',
    title: 'AI Society',
    description: 'Explored research tracks and upcoming deep learning workshops.',
    relativeTime: 'RECENT',
    link: '/clubs/ai-society',
  },
  {
    id: 'act-3',
    type: 'EVENT SAVED',
    title: 'RHYTHMS 2026',
    description: 'Saved multi-stage collegiate cultural festival to your list.',
    relativeTime: 'THIS WEEK',
    link: '/events/rhythms-2026',
  },
  {
    id: 'act-4',
    type: 'EVENT REGISTERED',
    title: 'PRO SHOWDOWN',
    description: 'Registered pass for basketball championship night.',
    relativeTime: 'THIS WEEK',
    link: '/events/pro-showdown',
  },
  {
    id: 'act-5',
    type: 'EVENT ATTENDED',
    title: 'Tech Talks: Autonomous Hardware',
    description: 'Checked into Tech Park lab session and completed workshop.',
    relativeTime: 'EARLIER',
    link: '/events/tech-talks',
  },
];

export const getDashboardProfile = (): StudentProfilePreview => STUDENT_PROFILE_PREVIEW;

export const getDashboardStats = (): DashboardStatsData => DASHBOARD_STATS_PREVIEW;

export const getUpcomingRegisteredEvents = (): EventItem[] => {
  return REGISTERED_EVENT_IDS
    .map((id) => getEventById(id))
    .filter((e): e is EventItem => e !== undefined);
};

export const getSavedEvents = (): EventItem[] => {
  return SAVED_EVENT_IDS
    .map((id) => getEventById(id))
    .filter((e): e is EventItem => e !== undefined);
};

export const getMyCommunities = (): Club[] => {
  return COMMUNITY_IDS
    .map((id) => getClubById(id))
    .filter((c): c is Club => c !== undefined);
};

export const getRecentActivity = (): ActivityItem[] => RECENT_ACTIVITY_PREVIEW;

export const getDashboardData = (): DashboardData => {
  return {
    profile: getDashboardProfile(),
    stats: getDashboardStats(),
    upcomingEvents: getUpcomingRegisteredEvents(),
    savedEvents: getSavedEvents(),
    communities: getMyCommunities(),
    recentActivity: getRecentActivity(),
  };
};
