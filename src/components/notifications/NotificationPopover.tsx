import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowRight, CheckCheck, Sparkles, X } from 'lucide-react';
import gsap from 'gsap';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } =
    useNotifications();
  const prefersReducedMotion = useReducedMotion();

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Entrance GSAP animation
  useEffect(() => {
    if (!isOpen || prefersReducedMotion || !popoverRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        popoverRef.current,
        { opacity: 0, y: -10, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [isOpen, prefersReducedMotion]);

  if (!isOpen) return null;

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  // Preview up to 5 most recent notifications
  const previewItems = notifications.slice(0, 5);

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="false"
      aria-label="Notification Preview"
      className="absolute right-0 top-full mt-3 w-[92vw] sm:w-[390px] md:w-[420px] max-w-[420px] rounded-3xl bg-[#090B12]/95 backdrop-blur-2xl border border-white/15 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.25)] z-50 text-white animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-primary/20 text-secondary border border-primary/30">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
              NOTIFICATIONS
            </h3>
            {unreadCount > 0 ? (
              <span className="text-[11px] font-mono text-secondary font-bold">
                {unreadCount} unread
              </span>
            ) : (
              <span className="text-[11px] font-mono text-text-muted">
                All caught up
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3 h-3 text-secondary" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification preview"
            className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification Rows List */}
      <div className="py-3 space-y-2.5 max-h-[360px] overflow-y-auto no-scrollbar">
        {previewItems.length > 0 ? (
          previewItems.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onRead={markAsRead}
              onDismiss={clearNotification}
              onClosePopover={onClose}
              compact
            />
          ))
        ) : (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-secondary shadow-glow-lime">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">
                YOU'RE ALL CAUGHT UP.
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                No new activity right now.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="text-[10px] text-text-muted uppercase">
          ACTIVITY FEED
        </span>

        <button
          type="button"
          onClick={handleViewAll}
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-secondary hover:text-white transition-colors cursor-pointer group"
        >
          <span>VIEW ALL ACTIVITY</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
