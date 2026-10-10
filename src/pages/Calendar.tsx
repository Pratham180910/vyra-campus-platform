import React, { useState, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CalendarHero } from '../components/calendar/CalendarHero';
import {
  CalendarToolbar,
  type CalendarViewMode,
  type CalendarFilterType,
} from '../components/calendar/CalendarToolbar';
import { CalendarMonthView } from '../components/calendar/CalendarMonthView';
import { CalendarListView } from '../components/calendar/CalendarListView';
import { CalendarAgendaView } from '../components/calendar/CalendarAgendaView';
import { UpNextSection } from '../components/calendar/UpNextSection';
import { formatMonthYear, getEventStartDate } from '../utils/calendarUtils';
import { eventService } from '../services/eventService';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { registrationService } from '../services/registrationService';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { EventItem } from '../types';

export const Calendar: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { savedEventIds } = useSavedEvents();

  // Active mock date timeline: Autumn 2026 (Month 9 = October, 0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [selectedDate, setSelectedDate] = useState('2026-10-08');
  const [viewMode, setViewMode] = useState<CalendarViewMode>('MONTH');
  const [filterType, setFilterType] = useState<CalendarFilterType>('ALL');
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    eventService.getPublishedEvents().then(({ data }) => {
      if (data) {
        setEvents(data);
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'CAMPUS CALENDAR — Timeline & Schedule | VYRA';
  }, []);

  // GSAP entrance reveal
  useEffect(() => {
    if (prefersReducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.calendar-section-reveal',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Check event states
  const isEventSaved = React.useCallback(
    (id: string) => savedEventIds.includes(id),
    [savedEventIds]
  );

  const isEventRegistered = React.useCallback(
    (id: string) => registrationService.isEventRegistered(id),
    []
  );

  // Filter events based on filterType
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filterType === 'SAVED') {
        return isEventSaved(ev.id);
      }
      if (filterType === 'REGISTERED') {
        return isEventRegistered(ev.id);
      }
      return true;
    });
  }, [events, filterType, isEventSaved, isEventRegistered]);

  // Counts for filter tabs
  const savedCount = useMemo(() => {
    return events.filter((e) => isEventSaved(e.id)).length;
  }, [events, isEventSaved]);

  const registeredCount = useMemo(() => {
    return events.filter((e) => isEventRegistered(e.id)).length;
  }, [events, isEventRegistered]);

  // Upcoming focus events for UpNextSection
  const upcomingEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      return getEventStartDate(a).getTime() - getEventStartDate(b).getTime();
    });
  }, [events]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate('2026-10-08');
  };

  return (
    <PageShell>
      {/* 1. Global Navigation with Calendar active */}
      <Navbar />

      <main ref={pageRef} className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          {/* 2. Calendar Hero */}
          <div className="calendar-section-reveal">
            <CalendarHero />
          </div>

          {/* 3. Calendar Controls Toolbar */}
          <div className="calendar-section-reveal">
            <CalendarToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filterType={filterType}
              onFilterChange={setFilterType}
              currentMonthLabel={formatMonthYear(currentYear, currentMonth)}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              savedCount={savedCount}
              registeredCount={registeredCount}
            />
          </div>

          {/* 4. Active Calendar View */}
          <div className="calendar-section-reveal">
            {viewMode === 'MONTH' && (
              <CalendarMonthView
                currentYear={currentYear}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                events={filteredEvents}
                isEventSaved={isEventSaved}
                isEventRegistered={isEventRegistered}
              />
            )}

            {viewMode === 'LIST' && (
              <CalendarListView
                events={filteredEvents}
                isEventSaved={isEventSaved}
                isEventRegistered={isEventRegistered}
              />
            )}

            {viewMode === 'AGENDA' && (
              <CalendarAgendaView
                events={filteredEvents}
                isEventSaved={isEventSaved}
                isEventRegistered={isEventRegistered}
              />
            )}
          </div>

          {/* 5. Up Next Imminent Campus Moments */}
          <div className="calendar-section-reveal">
            <UpNextSection events={upcomingEvents} />
          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <Footer />
    </PageShell>
  );
};
