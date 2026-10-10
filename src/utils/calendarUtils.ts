import type { EventItem } from '../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBR_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

/**
 * Parses event date string into list of ISO 'YYYY-MM-DD' dates.
 * Handles both single days (e.g. 'OCT 18, 2026') and ranges (e.g. 'OCT 24 - 26, 2026', 'NOV 02 - 05, 2026').
 */
export function parseEventDates(dateStr: string): string[] {
  if (!dateStr) return [];

  // Match range: e.g. "OCT 24 - 26, 2026" or "NOV 02 - 05, 2026"
  const rangeMatch = dateStr.match(/([A-Za-z]+)\s+(\d{1,2})\s*-\s*(\d{1,2}),\s*(\d{4})/i);
  if (rangeMatch) {
    const monthStr = rangeMatch[1].toLowerCase().slice(0, 3);
    const startDay = parseInt(rangeMatch[2], 10);
    const endDay = parseInt(rangeMatch[3], 10);
    const year = parseInt(rangeMatch[4], 10);
    const month = MONTH_ABBR_MAP[monthStr] ?? 9;

    const dates: string[] = [];
    for (let d = startDay; d <= endDay; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      dates.push(`${year}-${mm}-${dd}`);
    }
    return dates;
  }

  // Match single day: e.g. "OCT 08, 2026"
  const singleMatch = dateStr.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/i);
  if (singleMatch) {
    const monthStr = singleMatch[1].toLowerCase().slice(0, 3);
    const day = parseInt(singleMatch[2], 10);
    const year = parseInt(singleMatch[3], 10);
    const month = MONTH_ABBR_MAP[monthStr] ?? 9;

    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return [`${year}-${mm}-${dd}`];
  }

  return [];
}

/**
 * Extracts a primary start Date object for chronological sorting.
 */
export function getEventStartDate(event: EventItem): Date {
  const dates = parseEventDates(event.date);
  if (dates.length > 0) {
    return new Date(`${dates[0]}T00:00:00`);
  }
  return new Date('2026-10-01T00:00:00');
}

export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month].toUpperCase()} ${year}`;
}

export function formatDateString(isoDate: string): string {
  const [year, mm, dd] = isoDate.split('-').map(Number);
  const monthName = MONTH_NAMES[mm - 1];
  return `${monthName} ${dd}, ${year}`;
}

export interface CalendarDayInfo {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventItem[];
}

/**
 * Generates standard 7-column calendar grid for a given year and month (0-11).
 * Pads with days from previous and next month for full rows.
 */
export function generateMonthGrid(
  year: number,
  month: number,
  events: EventItem[] = [],
  todayStr: string = '2026-10-08'
): CalendarDayInfo[] {
  // First day of month
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 for Sunday, 1 for Monday...

  // Days in current month
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  // Days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const grid: CalendarDayInfo[] = [];

  // Index events by ISO date
  const eventDateMap = new Map<string, EventItem[]>();
  events.forEach((ev) => {
    const dates = parseEventDates(ev.date);
    dates.forEach((d) => {
      const list = eventDateMap.get(d) || [];
      if (!list.some((existing) => existing.id === ev.id)) {
        list.push(ev);
      }
      eventDateMap.set(d, list);
    });
  });

  // Previous month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthNum = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const iso = `${prevYear}-${String(prevMonthNum + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    grid.push({
      date: iso,
      dayOfMonth: dayNum,
      isCurrentMonth: false,
      isToday: iso === todayStr,
      events: eventDateMap.get(iso) || [],
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    grid.push({
      date: iso,
      dayOfMonth: dayNum,
      isCurrentMonth: true,
      isToday: iso === todayStr,
      events: eventDateMap.get(iso) || [],
    });
  }

  // Next month padding to complete 7-day grid rows (35 or 42 cells)
  const remainingCells = (7 - (grid.length % 7)) % 7;
  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const nextMonthNum = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const iso = `${nextYear}-${String(nextMonthNum + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    grid.push({
      date: iso,
      dayOfMonth: dayNum,
      isCurrentMonth: false,
      isToday: iso === todayStr,
      events: eventDateMap.get(iso) || [],
    });
  }

  return grid;
}
