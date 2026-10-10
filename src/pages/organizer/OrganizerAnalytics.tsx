import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  CheckCircle2,
  Search,
  Download,
  AlertCircle,
  Sparkles,
  TrendingUp,
  UserCheck,
  Clock,
  ChevronDown,
  Info,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { OrganizerShell } from '../../components/organizer/OrganizerShell';
import { AttendeeDetailModal } from '../../components/organizer/AttendeeDetailModal';
import { organizerEventService } from '../../services/organizerEventService';
import { organizerAnalyticsService } from '../../services/organizerAnalyticsService';
import { useAuth } from '../../hooks/useAuth';
import type {
  OrganizerEvent,
  AttendeeRecord,
  AttendeeStatus,
  EventAnalyticsData,
} from '../../types/organizer';

export const OrganizerAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>(() => organizerEventService.getAllEvents());
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeFilter, setAttendeeFilter] = useState<'ALL' | AttendeeStatus>('ALL');
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeRecord | null>(null);
  const [exportNoticeOpen, setExportNoticeOpen] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (user?.id) {
        await Promise.all([
          organizerEventService.syncOrganizerEvents(user.id),
          organizerAnalyticsService.syncRemoteAttendees(user.id),
        ]);
        if (isMounted) {
          setEvents(organizerEventService.getAllEvents());
          setDataVersion((v) => v + 1);
        }
      }
    }
    loadData();

    const unsubscribe = organizerEventService.subscribe(() => {
      if (isMounted) {
        setEvents(organizerEventService.getAllEvents());
        setDataVersion((v) => v + 1);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user?.id]);

  // Fetch analytics data for current selection
  const analytics: EventAnalyticsData = useMemo(() => {
    return organizerAnalyticsService.getAnalytics(selectedEventId);
  }, [selectedEventId, dataVersion]);

  // Fetch attendees for current selection
  const attendees: AttendeeRecord[] = useMemo(() => {
    return organizerAnalyticsService.getAttendeesForEvent(selectedEventId);
  }, [selectedEventId, dataVersion]);

  // Filter attendees by search and status
  const filteredAttendees = useMemo(() => {
    let result = attendees;

    if (attendeeFilter !== 'ALL') {
      result = result.filter((a) => a.status === attendeeFilter);
    }

    if (attendeeSearch.trim()) {
      const q = attendeeSearch.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.ticketCode.toLowerCase().includes(q)
      );
    }

    return result;
  }, [attendees, attendeeFilter, attendeeSearch]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.analytics-metric-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
      gsap.from('.analytics-chart-panel', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [selectedEventId]);

  // SVG Trend Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = analytics.trend;
  const maxRegs = Math.max(...points.map((p) => p.cumulative), 10);

  const getCoordinates = (index: number, val: number) => {
    const x =
      paddingX +
      (index / (Math.max(1, points.length - 1))) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      (val / maxRegs) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const polylinePoints = points
    .map((p, idx) => {
      const { x, y } = getCoordinates(idx, p.cumulative);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${paddingX},${chartHeight - paddingY} ${polylinePoints} ${
    chartWidth - paddingX
  },${chartHeight - paddingY}`;

  // Breakdown percentages
  const totalBreakdown =
    analytics.breakdown.registered +
    analytics.breakdown.checkedIn +
    analytics.breakdown.noShow;
  const pctCheckedIn = totalBreakdown > 0 ? Math.round((analytics.breakdown.checkedIn / totalBreakdown) * 100) : 0;
  const pctRegistered = totalBreakdown > 0 ? Math.round((analytics.breakdown.registered / totalBreakdown) * 100) : 0;
  const pctNoShow = totalBreakdown > 0 ? 100 - pctCheckedIn - pctRegistered : 0;

  return (
    <OrganizerShell>
      <div ref={containerRef} className="space-y-8 pb-12">
        {/* Header with Event Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-primary/20 text-electric-purple border border-primary/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> EVENT INTELLIGENCE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-text-muted border border-white/10">
                PREVIEW DATA
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white">
              SEE HOW YOUR MOMENTS PERFORM.
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Real-time turnout tracking, registration velocity, and attendee verification overview.
            </p>
          </div>

          {/* Event Picker Dropdown */}
          <div className="relative min-w-[260px] self-start md:self-auto">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-text-muted mb-1">
              SELECT EVENT SCOPE
            </label>
            <div className="relative">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl text-xs font-mono font-semibold bg-[#08090D] border border-white/20 text-white focus:outline-none focus:border-secondary transition-all"
              >
                <option value="ALL">All Campus Moments (Aggregate)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.status})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="analytics-metric-card p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase">Total Registrations</span>
              <Users className="w-4 h-4 text-electric-purple" />
            </div>
            <div className="text-3xl font-display font-black text-white">
              {analytics.totalRegistrations.toLocaleString()}
            </div>
            <p className="text-[11px] font-mono text-secondary mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {analytics.registrationRate}% Capacity Filled
            </p>
          </div>

          <div className="analytics-metric-card p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase">Total Attendees</span>
              <CheckCircle2 className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-3xl font-display font-black text-secondary">
              {analytics.totalAttendees.toLocaleString()}
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-1">
              Turnout verified at gates
            </p>
          </div>

          <div className="analytics-metric-card p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase">Attendance Rate</span>
              <UserCheck className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-3xl font-display font-black text-white">
              {analytics.averageAttendance}%
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-1">
              Industry benchmark: 65%
            </p>
          </div>

          <div className="analytics-metric-card p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-mono uppercase">Remaining Spots</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-display font-black text-amber-300">
              {analytics.remainingSpots.toLocaleString()}
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-1">
              Max limit: {analytics.capacity.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Two-Column Analytics: Chart & Attendance Breakdown */}
        <div className="analytics-chart-panel grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Trend (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Registrations Over Time
                </h3>
                <p className="text-xs text-text-muted">
                  Cumulative registration trajectory leading up to moment execution
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-text-muted self-start sm:self-auto">
                7-DAY WINDOW
              </span>
            </div>

            {/* SVG Interactive Area Chart */}
            <div className="relative pt-4">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-48 sm:h-60 overflow-visible"
              >
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#C4FF3D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide lines */}
                {[0.25, 0.5, 0.75, 1].map((pct) => {
                  const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
                  return (
                    <line
                      key={pct}
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Gradient Area */}
                <polygon points={areaPoints} fill="url(#trendGradient)" />

                {/* Main Curve Line */}
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points */}
                {points.map((p, idx) => {
                  const { x, y } = getCoordinates(idx, p.cumulative);
                  const isHovered = hoveredPointIndex === idx;

                  return (
                    <g key={p.date}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill={isHovered ? '#C4FF3D' : '#8B5CF6'}
                        stroke="#08090D"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />
                      {/* X Axis Labels */}
                      <text
                        x={x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {p.date}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip on Hover */}
              {hoveredPointIndex !== null && (
                <div
                  className="absolute px-3 py-1.5 rounded-lg bg-[#08090D] border border-secondary/40 shadow-xl pointer-events-none text-xs font-mono z-20 -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${((getCoordinates(hoveredPointIndex, points[hoveredPointIndex].cumulative).x) / chartWidth) * 100}%`,
                    top: '25%',
                  }}
                >
                  <p className="text-secondary font-bold">
                    {points[hoveredPointIndex].cumulative} total
                  </p>
                  <p className="text-[10px] text-text-muted">
                    +{points[hoveredPointIndex].registrations} on {points[hoveredPointIndex].date}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Overview Breakdown (1 col) */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-2 mb-1">
                <Users className="w-4 h-4" /> Attendance Overview
              </h3>
              <p className="text-xs text-text-muted">
                Gate check-in conversion vs no-show ratio
              </p>
            </div>

            {/* Segmented Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden flex">
                <div
                  style={{ width: `${pctCheckedIn}%` }}
                  title={`Checked In: ${pctCheckedIn}%`}
                  className="h-full bg-secondary transition-all duration-500"
                />
                <div
                  style={{ width: `${pctRegistered}%` }}
                  title={`Pre-registered: ${pctRegistered}%`}
                  className="h-full bg-electric-purple transition-all duration-500"
                />
                <div
                  style={{ width: `${pctNoShow}%` }}
                  title={`No Show: ${pctNoShow}%`}
                  className="h-full bg-zinc-600 transition-all duration-500"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-1">
                <span>Total Tracked</span>
                <span className="text-white font-bold">{totalBreakdown} records</span>
              </div>
            </div>

            {/* Breakdown Legend Cards */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-glow-lime" />
                  <span className="text-xs font-semibold text-white">Checked In</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-secondary">
                    {analytics.breakdown.checkedIn}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted ml-1.5">
                    ({pctCheckedIn}%)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-electric-purple" />
                  <span className="text-xs font-semibold text-white">Pre-Registered</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">
                    {analytics.breakdown.registered}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted ml-1.5">
                    ({pctRegistered}%)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                  <span className="text-xs font-semibold text-white">No Show</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-text-muted">
                    {analytics.breakdown.noShow}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted ml-1.5">
                    ({pctNoShow}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-text-muted flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Checked in through verified attendee gate records.</span>
            </div>
          </div>
        </div>

        {/* SECTION: Attendee Management */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-display font-bold text-white">
                  ATTENDEE ROSTER
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-secondary border border-secondary/20">
                  {filteredAttendees.length} records
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Search verified students, view program credentials, and inspect check-in tokens.
              </p>
            </div>

            {/* Export Action Button */}
            <button
              onClick={() => {
                if (filteredAttendees.length === 0) {
                  setExportNoticeOpen(true);
                  return;
                }
                const headers = ['Name', 'Email', 'Department', 'Year', 'Event', 'Status', 'Ticket Code', 'Registration Date'];
                const rows = filteredAttendees.map((a) => [
                  `"${a.name.replace(/"/g, '""')}"`,
                  `"${a.email.replace(/"/g, '""')}"`,
                  `"${a.department.replace(/"/g, '""')}"`,
                  `"${a.year.replace(/"/g, '""')}"`,
                  `"${a.eventTitle.replace(/"/g, '""')}"`,
                  `"${a.status}"`,
                  `"${a.ticketCode}"`,
                  `"${a.registrationDate}"`,
                ]);
                const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `vyra-attendees-${selectedEventId.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-secondary" />
              <span>Export Attendees (CSV)</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                placeholder="Search name, email, department..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white/[0.03] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
              />
              {attendeeSearch && (
                <button
                  onClick={() => setAttendeeSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(['ALL', 'REGISTERED', 'CHECKED IN', 'NO SHOW'] as const).map((st) => {
                const active = attendeeFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setAttendeeFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap border ${
                      active
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-white/[0.03] text-text-muted hover:text-white border-white/5'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attendee Roster Table (Desktop) / Cards (Mobile) */}
          {filteredAttendees.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
              <AlertCircle className="w-8 h-8 text-text-muted mx-auto" />
              <h4 className="text-sm font-semibold text-white">NO ATTENDEES FOUND</h4>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                No registered students match your search query or filter selection.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-text-muted">
                    <th className="py-3 px-4">Attendee Name</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Pass Code</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredAttendees.map((att) => {
                    const statusColor =
                      att.status === 'CHECKED IN'
                        ? 'bg-secondary/15 text-secondary border-secondary/30'
                        : att.status === 'REGISTERED'
                        ? 'bg-electric-purple/15 text-electric-purple border-electric-purple/30'
                        : 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30';

                    return (
                      <tr
                        key={att.id}
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => setSelectedAttendee(att)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                              {att.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-glow-purple transition-colors">
                                {att.name}
                              </p>
                              <p className="text-[11px] text-text-muted">{att.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-text-secondary">
                          <p className="truncate max-w-xs">{att.department}</p>
                          <p className="text-[10px] text-text-muted">{att.year}</p>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-amber-300">
                          {att.ticketCode}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-text-muted text-[11px]">
                          {att.registrationDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${statusColor}`}
                          >
                            {att.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAttendee(att);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono uppercase bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/5 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Attendee Details Modal */}
      <AttendeeDetailModal
        isOpen={!!selectedAttendee}
        onClose={() => setSelectedAttendee(null)}
        attendee={selectedAttendee}
      />

      {/* Export Info Modal */}
      {exportNoticeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#08090D] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase">
                <Info className="w-4 h-4" /> EXPORT STATUS
              </div>
              <button
                onClick={() => setExportNoticeOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">
                NO ATTENDEES TO EXPORT
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                There are currently no registered attendees matching the selected event or active filters.
              </p>
              <p className="text-[11px] font-mono text-text-muted leading-relaxed">
                Once students complete verified registrations in Supabase, their credentials and ticket codes will be included in the CSV download.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setExportNoticeOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase bg-secondary text-black font-bold hover:bg-secondary-hover transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </OrganizerShell>
  );
};
