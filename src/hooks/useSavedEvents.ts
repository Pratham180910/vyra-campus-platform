import { useContext } from 'react';
import { SavedEventsContext, type SavedEventsContextType } from '../context/savedEventsContextDefinition';

export const useSavedEvents = (): SavedEventsContextType => {
  const context = useContext(SavedEventsContext);
  if (!context) {
    throw new Error('useSavedEvents must be used within a SavedEventsProvider');
  }
  return context;
};
