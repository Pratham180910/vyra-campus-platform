import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SavedEventsProvider } from './context/SavedEventsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { ProfileProvider } from './context/ProfileContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Clubs } from './pages/Clubs';
import { ClubDetails } from './pages/ClubDetails';
import { Dashboard } from './pages/Dashboard';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Calendar } from './pages/Calendar';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { OrganizerOverview } from './pages/organizer/OrganizerOverview';
import { OrganizerEvents } from './pages/organizer/OrganizerEvents';
import { OrganizerCreateEvent } from './pages/organizer/OrganizerCreateEvent';
import { OrganizerEditEvent } from './pages/organizer/OrganizerEditEvent';
import { OrganizerAnalytics } from './pages/organizer/OrganizerAnalytics';
import { OrganizerClubs } from './pages/organizer/OrganizerClubs';
import { OrganizerCreateClub } from './pages/organizer/OrganizerCreateClub';
import { OrganizerEditClub } from './pages/organizer/OrganizerEditClub';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SavedEventsProvider>
        <NotificationsProvider>
          <ProfileProvider>
            <Router>
              <Routes>
                {/* Public Discovery & Brand Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/clubs" element={<Clubs />} />
                <Route path="/clubs/:id" element={<ClubDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Student Command Center & Personal Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Organizer Studio Routes */}
                <Route
                  path="/organizer"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerOverview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerOverview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/new"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerCreateEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerEditEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/clubs"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerClubs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/clubs/new"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerCreateClub />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/clubs/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerEditClub />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Home />} />
              </Routes>
            </Router>
          </ProfileProvider>
        </NotificationsProvider>
      </SavedEventsProvider>
    </AuthProvider>
  );
};

export default App;
