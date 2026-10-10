import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Bookmark,
  CheckCircle2,
  Users,
  AlertCircle,
  Bell,
  X,
  ArrowRight,
} from 'lucide-react';
import type { NotificationItem as NotificationItemType } from '../../types/notification';

interface NotificationItemProps {
  notification: NotificationItemType;
  onRead: (id: string) => void;
  onDismiss?: (id: string) => void;
  onClosePopover?: () => void;
  compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDismiss,
  onClosePopover,
  compact = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onRead(notification.id);
    if (onClosePopover) {
      onClosePopover();
    }

    if (notification.route) {
      navigate(notification.route);
    } else if (notification.eventId) {
      navigate(`/events/${notification.eventId}`);
    } else if (notification.clubId) {
      navigate(`/clubs/${notification.clubId}`);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(notification.id);
    }
  };

  // Determine icon & color theme per notification type
  const getTypeMeta = () => {
    switch (notification.type) {
      case 'EVENT_UPCOMING':
        return {
          icon: <Calendar className="w-3.5 h-3.5 text-primary" />,
          label: 'UPCOMING',
          badgeClass: 'text-primary bg-primary/10 border-primary/25',
        };
      case 'EVENT_REGISTERED':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />,
          label: 'CONFIRMED PASS',
          badgeClass: 'text-secondary bg-secondary/10 border-secondary/25',
        };
      case 'EVENT_SAVED':
        return {
          icon: <Bookmark className="w-3.5 h-3.5 text-[#C4B5FD]" />,
          label: 'WISHLIST',
          badgeClass: 'text-[#C4B5FD] bg-[#C4B5FD]/10 border-[#C4B5FD]/25',
        };
      case 'COMMUNITY_ACTIVITY':
        return {
          icon: <Users className="w-3.5 h-3.5 text-[#38BDF8]" />,
          label: 'COMMUNITY',
          badgeClass: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/25',
        };
      case 'EVENT_UPDATE':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-[#FACC15]" />,
          label: 'EVENT UPDATE',
          badgeClass: 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/25',
        };
      case 'SYSTEM':
      default:
        return {
          icon: <Bell className="w-3.5 h-3.5 text-text-muted" />,
          label: 'SYSTEM',
          badgeClass: 'text-text-muted bg-white/5 border-white/10',
        };
    }
  };

  const meta = getTypeMeta();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group relative rounded-2xl transition-all duration-200 cursor-pointer text-left border select-none ${
        compact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-5'
      } ${
        !notification.read
          ? 'bg-[#121422] border-primary/30 shadow-[0_4px_20px_rgba(139,92,246,0.15)] hover:border-primary/50 hover:bg-[#16182c]'
          : 'bg-white/[0.02] border-white/5 opacity-85 hover:opacity-100 hover:bg-white/[0.04] hover:border-white/15'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Type Icon Badge */}
        <div
          className={`p-2 rounded-xl shrink-0 border flex items-center justify-center mt-0.5 ${meta.badgeClass}`}
        >
          {meta.icon}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pr-5">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${meta.badgeClass}`}
            >
              {meta.label}
            </span>

            <span className="text-[11px] font-mono text-text-muted truncate">
              {notification.timeAgo}
            </span>

            {/* Unread Indicator Pulse Dot */}
            {!notification.read && (
              <span
                className="w-2 h-2 rounded-full bg-secondary shadow-glow-lime animate-pulse ml-auto shrink-0"
                title="Unread"
              />
            )}
          </div>

          <h4
            className={`font-display text-sm tracking-tight leading-snug truncate ${
              !notification.read ? 'font-bold text-white' : 'font-medium text-text-secondary'
            }`}
          >
            {notification.title}
          </h4>

          <p
            className={`text-xs text-text-secondary leading-relaxed mt-1 ${
              compact ? 'line-clamp-2' : 'line-clamp-3'
            }`}
          >
            {notification.message}
          </p>

          {/* Destination Link Hint */}
          {(notification.route || notification.eventId || notification.clubId) && (
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View details</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={`Dismiss notification: ${notification.title}`}
            className="absolute top-3 right-3 p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
