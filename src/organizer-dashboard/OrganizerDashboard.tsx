import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OrganizerProvider, useOrganizer } from './context/OrganizerContext';
import OrganizerLayout from './components/Layout/OrganizerLayout';

import MyEvents from './pages/MyEvents';
import EventDetails from './pages/EventDetails';
import Registrations from './pages/Registrations';
import Revenue from './pages/Revenue';

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated } = useOrganizer();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <OrganizerLayout>
      <Routes>
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-events/:id" element={<EventDetails />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="*" element={<Navigate to="/organizer/my-events" replace />} />
      </Routes>
    </OrganizerLayout>
  );
};

const OrganizerDashboard: React.FC = () => {
  return (
    <OrganizerProvider>
      <ProtectedRoutes />
    </OrganizerProvider>
  );
};

export default OrganizerDashboard;
