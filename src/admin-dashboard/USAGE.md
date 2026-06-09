// Usage Example - How to integrate Admin Dashboard into main app

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminDashboard from './admin-dashboard/AdminDashboard';

/**
 * OPTION 1: Standalone Admin Dashboard
 * Use this if you want the admin dashboard to be completely separate
 */
export function AdminDashboardApp() {
  return <AdminDashboard basePath="/admin" />;
}

/**
 * OPTION 2: Integrated with Main App
 * Use this if you want to integrate admin dashboard with your main application
 */
export function MainApp() {
  return (
    <Router>
      <div>
        {/* Your main app routes here */}
        <AdminDashboard basePath="/admin" />
      </div>
    </Router>
  );
}

/**
 * OPTION 3: Protected Admin Routes
 * Use this if you want additional protection layer
 */
import { useAdmin } from './admin-dashboard';

export function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, admin } = useAdmin();

  if (!isAuthenticated) {
    return <div>Access Denied - Admin Authentication Required</div>;
  }

  // Optional: Check specific admin role
  if (admin?.role !== 'PLATFORM_OWNER' && admin?.role !== 'ADMIN') {
    return <div>Access Denied - Insufficient Permissions</div>;
  }

  return <>{children}</>;
}

/**
 * OPTION 4: Using Individual Components
 * Use this if you want to use admin dashboard components in your app
 */
import { StatCard, theme, useAdmin } from './admin-dashboard';

export function CustomDashboard() {
  const { admin } = useAdmin();

  return (
    <div style={{ background: theme.colors.cream, padding: theme.spacing.6 }}>
      <h1>Welcome {admin?.name}</h1>
      <StatCard
        title="Total Events"
        value={150}
        icon="📅"
        trend={12.5}
      />
    </div>
  );
}

/**
 * Usage in your main application file
 */
export default function App() {
  return <AdminDashboardApp />;
}
