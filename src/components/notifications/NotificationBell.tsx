import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationPopover } from './NotificationPopover';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const badgeText = unreadCount > 9 ? '9+' : unreadCount.toString();

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border transition-all duration-200 hover:scale-105 cursor-pointer select-none ${
          isOpen
            ? 'border-secondary/50 text-white bg-white/[0.1] shadow-glow-purple'
            : 'border-white/[0.08]'
        }`}
      >
        <Bell
          className={`w-4 h-4 transition-transform duration-200 ${
            unreadCount > 0 ? 'text-secondary' : 'text-text-secondary'
          }`}
        />

        {/* Dynamic Unread Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-[#08090D] font-mono text-[10px] font-black flex items-center justify-center shadow-glow-lime animate-pulse pointer-events-none"
            aria-hidden="true"
          >
            {badgeText}
          </span>
        )}
      </button>

      {/* Popover Preview */}
      <NotificationPopover isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
