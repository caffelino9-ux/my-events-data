import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';
import { GlobalStyles } from './styles/global';
import styled from 'styled-components';

import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Organizers from './pages/Organizers';
import Registrations from './pages/Registrations';
import Revenue from './pages/Revenue';
import Settlements from './pages/Settlements';
import Verification from './pages/Verification';

const GlobalStylesWrapper = styled.div`
  ${GlobalStyles}
`;

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/organizers" element={<Organizers />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/settlements" element={<Settlements />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <AdminProvider>
      <GlobalStylesWrapper />
      <ProtectedRoutes />
    </AdminProvider>
  );
};

export default AdminDashboard;
