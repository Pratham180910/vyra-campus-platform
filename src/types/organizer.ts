export type OrganizerEventStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface OrganizerEvent {
  id: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  description: string;
  category: 'Hackathons' | 'Cultural' | 'Workshops' | 'Sports' | 'Tech' | 'Competitions' | 'Social';
  eventType: 'Free' | 'Paid';
  date: string;
  startTime: string;
  endTime?: string;
  time: string;
  venue: string;
  organizer: string;
  capacity: number;
  maxCapacity?: number;
  registrations: number;
  registrationCount?: number;
  status: OrganizerEventStatus;
  image: string;
  badge?: string;
  tags: string[];
  registrationDeadline?: string;
  contactEmail?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendeeStatus = 'REGISTERED' | 'CHECKED IN' | 'NO SHOW';

export interface AttendeeRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  department: string;
  year: string;
  registrationDate: string;
  status: AttendeeStatus;
  ticketCode: string;
  notes?: string;
}

export interface RegistrationTrendPoint {
  date: string;
  label: string;
  registrations: number;
  cumulative: number;
}

export interface EventAnalyticsData {
  eventId: string;
  eventTitle: string;
  totalRegistrations: number;
  totalAttendees: number;
  averageAttendance: number; // percentage (0-100)
  registrationRate: number;  // percentage (0-100)
  capacity: number;
  remainingSpots: number;
  trend: RegistrationTrendPoint[];
  breakdown: {
    registered: number;
    checkedIn: number;
    noShow: number;
  };
}
