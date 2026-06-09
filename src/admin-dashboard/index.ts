// Admin Dashboard - Main Export Index
export { default as AdminDashboard } from './AdminDashboard';
export { default as AdminRoutes } from './AdminRoutes';

// Pages
export * from './pages';

// Components
export { default as AdminLayout } from './components/Layout/AdminLayout';
export { default as Sidebar } from './components/Layout/Sidebar';
export { default as Header } from './components/Layout/Header';
export { default as StatCard } from './components/Cards/StatCard';

// Styles & Theme
export { theme } from './styles/theme';
export { GlobalStyles } from './styles/global';

// Types
export type {
  Admin,
  Event as EventType,
  Organizer,
  BankDetails,
  Registration,
  Ticket,
  Revenue as RevenueType,
  Cafe,
  User,
  Notification as NotificationType,
  DashboardStats,
  EventTrend,
  Analytics as AnalyticsType,
  PlatformSettings,
  ApiResponse,
  PaginatedResponse
} from './types';

// Utilities
export * from './utils/formatters';

// Hooks
export * from './hooks';

// Context
export { AdminProvider, useAdmin } from './context/AdminContext';

// UI Components
export * from './components/UI';

// Services
export { eventsApi } from './services/eventsApi';
export { organizersApi } from './services/organizersApi';
export { ticketsApi } from './services/ticketsApi';
export { registrationsApi } from './services/registrationsApi';
export { analyticsApi } from './services/analyticsApi';
export { revenueApi } from './services/revenueApi';
export { verificationApi } from './services/verificationApi';
export { usersApi } from './services/usersApi';
export { cafesApi } from './services/cafesApi';
export { dashboardApi } from './services/dashboardApi';
