import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bookmark, Sparkles, Check } from 'lucide-react';
import { savedEventsService } from '../services/savedEventsService';
import { useAuth } from '../hooks/useAuth';
import {
  SavedEventsContext,
  type ToastState,
} from './savedEventsContextDefinition';

export const SavedEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() =>
    savedEventsService.getSavedEventIds()
  );
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync with authenticated user in Supabase
  useEffect(() => {
    savedEventsService.syncUserSavedEvents(user?.id ?? null);
  }, [user?.id]);

  // Subscribe to service state changes across all tabs/components
  useEffect(() => {
    const unsubscribe = savedEventsService.subscribe((ids) => {
      setSavedEventIds(ids);
    });
    return unsubscribe;
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((title: string, message: string, type: 'saved' | 'removed') => {
    setToast({
      title,
      message,
      type,
      id: Date.now(),
    });
  }, []);

  const isSaved = useCallback(
    (eventId: string) => {
      return savedEventsService.isEventSaved(eventId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savedEventIds]
  );

  const toggleSave = useCallback(
    (eventId: string, eventTitle?: string) => {
      const wasSaved = savedEventsService.isEventSaved(eventId);
      savedEventsService.toggleSavedEvent(eventId, user?.id);
      const isNowSaved = !wasSaved;

      if (isNowSaved) {
        showToast(
          'EVENT SAVED',
          eventTitle ? `"${eventTitle}" added to your VYRA.` : 'Added to your VYRA.',
          'saved'
        );
      } else {
        showToast(
          'EVENT REMOVED',
          eventTitle ? `"${eventTitle}" removed from saved events.` : 'Removed from saved events.',
          'removed'
        );
      }

      return isNowSaved;
    },
    [showToast, user?.id]
  );

  const saveEvent = useCallback(
    (eventId: string, eventTitle?: string) => {
      savedEventsService.saveEvent(eventId, user?.id);
      showToast(
        'EVENT SAVED',
        eventTitle ? `"${eventTitle}" added to your VYRA.` : 'Added to your VYRA.',
        'saved'
      );
    },
    [showToast, user?.id]
  );

  const unsaveEvent = useCallback(
    (eventId: string, eventTitle?: string) => {
      savedEventsService.unsaveEvent(eventId, user?.id);
      showToast(
        'EVENT REMOVED',
        eventTitle ? `"${eventTitle}" removed from saved events.` : 'Removed from saved events.',
        'removed'
      );
    },
    [showToast, user?.id]
  );

  const clearSaved = useCallback(() => {
    savedEventsService.clearSavedEvents(user?.id);
    showToast('ALL EVENTS CLEARED', 'Your saved events list has been reset.', 'removed');
  }, [showToast, user?.id]);

  const value = useMemo(
    () => ({
      savedEventIds,
      isSaved,
      toggleSave,
      saveEvent,
      unsaveEvent,
      clearSaved,
    }),
    [savedEventIds, isSaved, toggleSave, saveEvent, unsaveEvent, clearSaved]
  );

  return (
    <SavedEventsContext.Provider value={value}>
      {children}

      {/* VYRA-Styled Feedback Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          key={toast.id}
          className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-[92vw] sm:max-w-md animate-fade-in"
        >
          <div
            className={`px-4 sm:px-5 py-3 rounded-2xl sm:rounded-full bg-[#0E101A]/95 backdrop-blur-xl border flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${
              toast.type === 'saved'
                ? 'border-secondary/40 shadow-glow-lime'
                : 'border-white/15'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === 'saved'
                  ? 'bg-secondary/20 text-secondary'
                  : 'bg-white/10 text-text-muted'
              }`}
            >
              {toast.type === 'saved' ? (
                <Bookmark className="w-4 h-4 fill-secondary stroke-none" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </div>

            <div className="truncate text-left pr-2">
              <p
                className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  toast.type === 'saved' ? 'text-secondary' : 'text-white'
                }`}
              >
                {toast.title}
              </p>
              <p className="text-xs text-text-secondary truncate max-w-[260px] sm:max-w-xs">
                {toast.message}
              </p>
            </div>

            {toast.type === 'saved' ? (
              <Check className="w-4 h-4 text-secondary shrink-0 ml-auto" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-text-muted shrink-0 ml-auto" />
            )}
          </div>
        </div>
      )}
    </SavedEventsContext.Provider>
  );
};
