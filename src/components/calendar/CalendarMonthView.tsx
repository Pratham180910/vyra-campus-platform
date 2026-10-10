import React from 'react';
import { generateMonthGrid } from '../../utils/calendarUtils';
import { CalendarDayEvents } from './CalendarDayEvents';
import type { EventItem } from '../../types';

interface CalendarMonthViewProps {
  currentYear: number;
  currentMonth: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  events: EventItem[];
  isEventSaved: (id: string) => boolean;
  isEventRegistered: (id: string) => boolean;
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  onSelectDate,
  events,
  isEventSaved,
  isEventRegistered,
}) => {
  const monthGrid = generateMonthGrid(currentYear, currentMonth, events, '2026-10-08');

  // Filter events for currently selected date
  const selectedDayInfo = monthGrid.find((cell) => cell.date === selectedDate);
  const selectedDayEvents = selectedDayInfo ? selectedDayInfo.events : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left (8 Cols): Month Grid */}
      <div className="lg:col-span-8 p-5 sm:p-7 rounded-3xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
        {/* Weekday Labels Header */}
        <div className="grid grid-cols-7 gap-2 text-center pb-2 border-b border-white/5">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted"
            >
              {day}
            </span>
          ))}
        </div>

        {/* 7-column Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {monthGrid.map((cell) => {
            const isSelected = cell.date === selectedDate;
            const hasEvents = cell.events.length > 0;

            return (
              <button
                key={cell.date}
                type="button"
                onClick={() => onSelectDate(cell.date)}
                className={`relative min-h-[56px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-2xl border flex flex-col justify-between text-left transition-all duration-200 group ${
                  isSelected
                    ? 'bg-electric-purple/20 border-electric-purple shadow-[0_0_15px_rgba(139,92,246,0.35)] scale-[1.02] z-10'
                    : cell.isToday
                    ? 'bg-acid-lime/10 border-acid-lime/40 text-white'
                    : cell.isCurrentMonth
                    ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/15 text-white'
                    : 'bg-transparent text-text-muted/40 border-transparent hover:border-white/5'
                }`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected
                        ? 'text-white'
                        : cell.isToday
                        ? 'text-acid-lime'
                        : cell.isCurrentMonth
                        ? 'text-text-secondary group-hover:text-white'
                        : 'text-text-muted/40'
                    }`}
                  >
                    {cell.dayOfMonth}
                  </span>

                  {cell.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-pulse hidden sm:inline-block" />
                  )}
                </div>

                {/* Event Indicators */}
                {hasEvents && (
                  <div className="w-full space-y-1 mt-auto">
                    {/* Desktop pills / count */}
                    <div className="hidden sm:flex flex-col gap-1">
                      {cell.events.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-white truncate border border-white/10"
                        >
                          {ev.title}
                        </div>
                      ))}
                      {cell.events.length > 2 && (
                        <span className="text-[9px] font-mono text-electric-purple font-bold pl-0.5">
                          +{cell.events.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Mobile dots */}
                    <div className="flex sm:hidden items-center justify-center gap-1 pt-1">
                      {cell.events.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className="w-1.5 h-1.5 rounded-full bg-electric-purple"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right (4 Cols): Selected Day Events Detail Panel */}
      <div className="lg:col-span-4">
        <CalendarDayEvents
          selectedDate={selectedDate}
          events={selectedDayEvents}
          isEventSaved={isEventSaved}
          isEventRegistered={isEventRegistered}
        />
      </div>
    </div>
  );
};
