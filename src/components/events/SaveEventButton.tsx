import React from 'react';
import { Bookmark } from 'lucide-react';
import { useSavedEvents } from '../../hooks/useSavedEvents';

interface SaveEventButtonProps {
  eventId: string;
  eventTitle?: string;
  variant?: 'icon-only' | 'button' | 'compact';
  className?: string;
}

export const SaveEventButton: React.FC<SaveEventButtonProps> = ({
  eventId,
  eventTitle,
  variant = 'icon-only',
  className = '',
}) => {
  const { isSaved, toggleSave } = useSavedEvents();
  const saved = isSaved(eventId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(eventId, eventTitle);
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          saved
            ? `Remove ${eventTitle || 'event'} from saved events`
            : `Save ${eventTitle || 'event'}`
        }
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 px-5 py-4 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 border cursor-pointer select-none ${
          saved
            ? 'bg-secondary/15 text-secondary border-secondary/35 shadow-glow-lime hover:bg-secondary/25 active:scale-95'
            : 'bg-[#10121A] text-text-secondary hover:text-white hover:bg-white/10 border-white/10 active:scale-95'
        } ${className}`}
      >
        <Bookmark
          className={`w-4 h-4 transition-transform duration-200 ${
            saved ? 'fill-secondary stroke-none scale-110' : 'stroke-current'
          }`}
        />
        <span className="font-mono uppercase font-bold tracking-wider">
          {saved ? 'SAVED' : 'SAVE EVENT'}
        </span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          saved
            ? `Remove ${eventTitle || 'event'} from saved events`
            : `Save ${eventTitle || 'event'}`
        }
        aria-pressed={saved}
        title={saved ? 'Remove from saved' : 'Save event'}
        className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer select-none active:scale-90 ${
          saved
            ? 'bg-secondary/15 border-secondary/40 text-secondary shadow-glow-lime'
            : 'bg-white/5 border-white/10 text-text-muted hover:text-white hover:bg-white/10'
        } ${className}`}
      >
        <Bookmark
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            saved ? 'fill-secondary stroke-none scale-110' : 'stroke-current'
          }`}
        />
      </button>
    );
  }

  // Default 'icon-only' variant (optimized for EventCard)
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        saved
          ? `Remove ${eventTitle || 'event'} from saved events`
          : `Save ${eventTitle || 'event'}`
      }
      aria-pressed={saved}
      title={saved ? 'Saved to your VYRA' : 'Save event'}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center cursor-pointer select-none group/save active:scale-90 shadow-md ${
        saved
          ? 'bg-[#0E101A]/90 border-secondary/50 text-secondary shadow-glow-lime scale-105'
          : 'bg-black/60 border-white/20 text-white/80 hover:text-white hover:bg-black/80 hover:border-white/40'
      } ${className}`}
    >
      <Bookmark
        className={`w-4 h-4 transition-transform duration-300 ${
          saved
            ? 'fill-secondary stroke-none scale-110'
            : 'stroke-current group-hover/save:scale-115'
        }`}
      />
    </button>
  );
};
