// Admin Dashboard Routes Configuration
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/Layout/AdminLayout';
import {
  Dashboard,
  Events,
  Organizers,
  BankVerification,
  Registrations,
  Tickets,
  Revenue,
  Analytics,
  Cafes,
  Users,
  Settings,
} from './pages';

interface AdminRoutesProps {
  isAuthenticated: boolean;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/organizers" element={<Organizers />} />
        <Route path="/verification" element={<BankVerification />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/cafes" element={<Cafes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
