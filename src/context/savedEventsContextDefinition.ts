import { createContext } from 'react';

export interface ToastState {
  title: string;
  message: string;
  type: 'saved' | 'removed';
  id: number;
}

export interface SavedEventsContextType {
  savedEventIds: string[];
  isSaved: (eventId: string) => boolean;
  toggleSave: (eventId: string, eventTitle?: string) => boolean;
  saveEvent: (eventId: string, eventTitle?: string) => void;
  unsaveEvent: (eventId: string, eventTitle?: string) => void;
  clearSaved: () => void;
}

export const SavedEventsContext = createContext<SavedEventsContextType | undefined>(undefined);
