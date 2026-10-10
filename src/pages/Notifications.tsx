import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import gsap from 'gsap';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { NotificationFilter, NotificationItem as NotificationItemType } from '../types/notification';

export const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<NotificationFilter>('ALL');
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } =
    useNotifications();
  const pageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [currentTime] = useState(() => Date.now());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Activity Center — VYRA Notifications';
  }, []);

  // Entrance GSAP animation
  useEffect(() => {
    if (prefersReducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.notif-elem',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [filter, prefersReducedMotion]);

  // Filter notifications based on active pill
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'UNREAD') return !n.read;
      if (filter === 'EVENTS') {
        return (
          n.type === 'EVENT_REGISTERED' ||
          n.type === 'EVENT_SAVED' ||
          n.type === 'EVENT_UPCOMING' ||
          n.type === 'EVENT_UPDATE'
        );
      }
      if (filter === 'COMMUNITIES') {
        return n.type === 'COMMUNITY_ACTIVITY';
      }
      return true; // 'ALL'
    });
  }, [notifications, filter]);

  // Dynamic Date Grouping (TODAY, THIS WEEK, EARLIER)
  const groupedNotifications = useMemo(() => {
    const today: NotificationItemType[] = [];
    const thisWeek: NotificationItemType[] = [];
    const earlier: NotificationItemType[] = [];

    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    filteredNotifications.forEach((n) => {
      const time = new Date(n.timestamp).getTime();
      const diff = currentTime - time;

      if (diff <= oneDay) {
        today.push(n);
      } else if (diff <= sevenDays) {
        thisWeek.push(n);
      } else {
        earlier.push(n);
      }
    });

    return [
      { id: 'today', title: 'TODAY', items: today },
      { id: 'this-week', title: 'THIS WEEK', items: thisWeek },
      { id: 'earlier', title: 'EARLIER', items: earlier },
    ].filter((g) => g.items.length > 0);
  }, [filteredNotifications, currentTime]);

  const filterTabs: { label: string; value: NotificationFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: `Unread (${unreadCount})`, value: 'UNREAD' },
    { label: 'Events', value: 'EVENTS' },
    { label: 'Communities', value: 'COMMUNITIES' },
  ];

  return (
    <PageShell>
      {/* 1. Global Navigation */}
      <Navbar />

      <main ref={pageRef} className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* 2. Page Header */}
          <div className="notif-elem flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-white/10 pb-6 sm:pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/25 text-[11px] font-mono font-bold uppercase tracking-widest text-secondary shadow-glow-lime">
                <Bell className="w-3.5 h-3.5" />
                <span>ACTIVITY FEED</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                ACTIVITY CENTER
              </h1>

              <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
                Stay in sync with the moments, communities, and events that matter to you.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-4 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-secondary/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <CheckCheck className="w-4 h-4 text-secondary" />
                  <span>Mark All As Read</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Filter Navigation Tabs */}
          <div className="notif-elem flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-muted hidden sm:flex items-center justify-center">
                <Filter className="w-3.5 h-3.5" />
              </span>

              {filterTabs.map((tab) => {
                const isSelected = filter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setFilter(tab.value)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-secondary text-[#08090D] border-secondary shadow-glow-lime scale-[1.02]'
                        : 'bg-[#10121A] text-text-secondary hover:text-white hover:bg-white/10 border-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono text-text-muted shrink-0 hidden sm:inline">
              {filteredNotifications.length}{' '}
              {filteredNotifications.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* 4. Grouped Notification List or Empty State */}
          {groupedNotifications.length > 0 ? (
            <div className="space-y-8 sm:space-y-10">
              {groupedNotifications.map((group) => (
                <section key={group.id} className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-secondary font-bold">
                      {group.title}
                    </span>
                    <div className="flex-1 h-[1px] bg-white/10" />
                    <span className="text-[10px] font-mono text-text-muted">
                      {group.items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.items.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={markAsRead}
                        onDismiss={clearNotification}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* Premium Empty State */
            <div className="notif-elem py-16 sm:py-24 px-4 flex flex-col items-center justify-center text-center rounded-3xl bg-[#0E101A] border border-white/10 my-4 space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary shadow-glow-lime">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
                  {filter === 'UNREAD' ? 'NOTHING UNREAD' : "YOU'RE ALL CAUGHT UP."}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                  {filter === 'UNREAD'
                    ? "You've reviewed all recent alerts and invitations."
                    : 'No new activity right now. Check back as campus events unfold.'}
                </p>
              </div>

              <div className="pt-2">
                {filter === 'UNREAD' ? (
                  <button
                    type="button"
                    onClick={() => setFilter('ALL')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>VIEW ALL NOTIFICATIONS</span>
                    <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                  </button>
                ) : (
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all hover:scale-105"
                  >
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    <span>DISCOVER EVENTS</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 5. Footer */}
      <Footer />
    </PageShell>
  );
};

export default Notifications;
