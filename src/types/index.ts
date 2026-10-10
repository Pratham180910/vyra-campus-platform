export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Hackathons' | 'Cultural' | 'Workshops' | 'Sports' | 'Tech' | 'Competitions' | 'Social';
  categoryColor?: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  registrations: number;
  registrationCount?: number;
  maxCapacity?: number;
  badge?: string;
  image: string;
  featured?: boolean;
  organizer?: string;
  eventType?: 'Free' | 'Paid';
  tags?: string[];
  dateCategory?: 'today' | 'this_week' | 'this_month';
  createdAt?: string;
}

export interface StatItem {
  value: string;
  number?: number;
  suffix?: string;
  label: string;
  sublabel?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  iconName: string;
  description: string;
  color: string;
}

export interface CampusVisual {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tagline?: string;
  metadata?: string;
}
