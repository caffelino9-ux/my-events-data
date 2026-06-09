# Caffelino Admin Dashboard

A professional enterprise-grade Admin Dashboard for the Caffelino events platform. This is a completely separate dashboard designed exclusively for platform owners and administrators.

## 🎯 Purpose

This Admin Dashboard is **NOT** for:
- Regular users
- Event organizers
- Cafe owners

This dashboard is **ONLY** for:
- Platform Owner/Admin
- Platform Administrators

## 📁 Project Structure

```
src/admin-dashboard/
├── pages/                    # Page components
│   ├── Dashboard.tsx         # Home dashboard with stats
│   ├── Events.tsx           # Event management
│   ├── Organizers.tsx       # Organizer management
│   ├── BankVerification.tsx # Bank verification center
│   ├── Registrations.tsx    # Registration tracking
│   ├── Tickets.tsx          # Ticket management
│   ├── Revenue.tsx          # Revenue dashboard
│   ├── Analytics.tsx        # Analytics & insights
│   ├── Cafes.tsx            # Cafe management
│   ├── Users.tsx            # User management
│   ├── Settings.tsx         # Platform settings
│   ├── AdminLogin.tsx       # Login page
│   └── index.ts             # Page exports
│
├── components/              # Reusable components
│   ├── Layout/
│   │   ├── AdminLayout.tsx  # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   └── Header.tsx       # Top header
│   ├── Cards/
│   │   └── StatCard.tsx     # Stat card component
│   └── UI/
│       └── index.ts         # Reusable UI components
│
├── services/                # API integration
│   ├── eventsApi.ts         # Events API calls
│   ├── organizersApi.ts     # Organizers API calls
│   ├── ticketsApi.ts        # Tickets API calls
│   ├── registrationsApi.ts  # Registrations API calls
│   ├── analyticsApi.ts      # Analytics API calls
│   ├── revenueApi.ts        # Revenue API calls
│   ├── verificationApi.ts   # Verification API calls
│   ├── usersApi.ts          # Users API calls
│   ├── cafesApi.ts          # Cafes API calls
│   └── dashboardApi.ts      # Dashboard API calls
│
├── hooks/                   # Custom React hooks
│   └── index.ts             # useFetch, useMutation, usePagination, etc.
│
├── context/                 # Context & state management
│   └── AdminContext.tsx     # Admin authentication context
│
├── types/                   # TypeScript type definitions
│   └── index.ts             # All type definitions
│
├── utils/                   # Utility functions
│   └── formatters.ts        # Formatting utilities
│
├── styles/                  # Styling
│   ├── theme.ts             # Design system & theme
│   └── global.ts            # Global styles
│
├── AdminRoutes.tsx          # Route configuration
├── AdminDashboard.tsx       # Main entry component
└── README.md                # This file
```

## 🎨 Design System

### Color Palette

- **Cream Background**: `#F7F1E8`
- **Coffee Brown**: `#6F4E37` (Primary)
- **Coffee Dark**: `#2C1810`
- **Gold Accent**: `#D4AF37`
- **Status Colors**: Green (Success), Red (Error), Orange (Warning), Blue (Info)

### Features

- Premium coffee-themed design
- Rounded cards with soft shadows
- Smooth Framer Motion animations
- Desktop-first, mobile responsive
- Inspired by Stripe, Airbnb, BookMyShow, Notion

## 📊 Dashboard Sections

### 1. **Dashboard Home** 📊
- Total Events
- Total Organizers
- Tickets Sold
- Total Revenue
- Partner Cafes
- Active Events
- Pending Verifications
- Upcoming Events

Each stat card includes:
- Counter animation
- Trend percentage
- Mini graphs (if applicable)

### 2. **Events Management** 📅
- View all events in a table
- Columns: Banner, Name, Organizer, Cafe, Date, Price, Seats, Tickets Sold, Revenue, Status
- Actions: View, Edit, Approve, Suspend, Delete
- Filters: Today, This Week, This Month, All
- Search functionality

### 3. **Organizer Management** 👥
- View all organizers
- Display: Profile, Name, Email, Phone, Total Events, Revenue, Verification Status
- Actions: View Profile, Approve, Suspend, Reject
- Verification badge

### 4. **Bank Verification Center** 🏦
- Organizer payout details
- Fields: Account Holder, Bank Name, Account Number (masked), IFSC, UPI, PAN, GST
- Status: Approve, Reject, Mark Verified
- Search and filters

### 5. **Registrations** 📝
- User Name, Email, Phone
- Event, Ticket ID, Amount Paid
- Registration Time, Attendance Status
- Payment Status

### 6. **Tickets** 🎟️
- Ticket ID, Event, User
- Amount, QR Status, Check-In Status
- Generated Date

### 7. **Revenue Dashboard** 💰
- Platform Revenue
- Event Revenue
- Cafe Revenue
- Organizer Revenue
- Charts: Daily, Weekly, Monthly, Yearly
- Graphs: Growth, Ticket Sales, Performance

### 8. **Analytics** 📈
- Top Events
- Top Organizers
- Top Cafes
- Most Sold Tickets
- Peak Booking Times
- Average Ticket Price
- Revenue Heatmaps
- Event Growth Charts

### 9. **Cafes Module** 🏪
- Cafe Name, Location
- Events Hosted
- Revenue Generated
- Average Attendance
- Status

### 10. **Users Module** 👤
- Profile, Name, Email, Phone
- Events Joined
- Tickets Purchased
- Total Spend

### 11. **Settings** ⚙️
- Platform Settings
- Commission Percentage
- Event Approval Rules
- Verification Rules
- Email Settings
- Notification Settings

## 🔌 API Integration

All data is fetched through APIs. No mock data is hardcoded.

### API Service Files

- `eventsApi.ts` - Events endpoint
- `organizersApi.ts` - Organizers endpoint
- `ticketsApi.ts` - Tickets endpoint
- `analyticsApi.ts` - Analytics endpoint
- `revenueApi.ts` - Revenue endpoint
- `verificationApi.ts` - Verification endpoint
- `usersApi.ts` - Users endpoint
- `cafesApi.ts` - Cafes endpoint
- `dashboardApi.ts` - Dashboard endpoint

### Configuration

Set your API base URL in the `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Each service file exports functions for:
- GET requests (fetch data)
- POST requests (create data)
- PUT requests (update data)
- DELETE requests (delete data)
- PATCH requests (partial updates)

## 🪝 Custom Hooks

### `useFetch<T>`
Generic hook for fetching data
```typescript
const { data, loading, error, refetch } = useFetch<DataType>(
  () => apiFunction(),
  []
);
```

### `useMutation<T>`
Hook for mutations (POST, PUT, DELETE)
```typescript
const { data, loading, error, mutate, reset } = useMutation<DataType>(
  (payload) => apiFunction(payload)
);
```

### `usePagination<T>`
Hook for paginated data
```typescript
const { items, page, total, goToPage, applyFilters } = usePagination<DataType>(
  (page, pageSize, filters) => apiFunction(page, pageSize, filters),
  10
);
```

### `useLocalStorage<T>` & `useSessionStorage<T>`
Hooks for browser storage

### `useToggle`
Hook for toggle state

## 🔒 Authentication

Uses context-based authentication with JWT tokens.

```typescript
const { admin, isAuthenticated, login, logout } = useAdmin();
```

## 📦 Dependencies

- **React** - UI library
- **React Router** - Routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety

## 🚀 Usage

### Integration with Main App

```typescript
import AdminDashboard from './admin-dashboard/AdminDashboard';

function App() {
  return (
    <>
      <MainApp /> 
      <AdminDashboard basePath="/admin" />
    </>
  );
}
```

### Protected Route

```typescript
function ProtectedRoute() {
  const { isAuthenticated } = useAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return <Dashboard />;
}
```

## 🎯 Key Features

✅ **Professional UI/UX**
- Premium coffee theme
- Smooth animations
- Responsive design
- Accessible components

✅ **API Ready**
- Clean architecture
- No hardcoded data
- Easy backend integration
- Service-based design

✅ **Scalable**
- Modular structure
- Reusable components
- Custom hooks
- Type-safe

✅ **Enterprise Grade**
- Comprehensive features
- Role-based access
- Audit trails ready
- Performance optimized

## 📝 Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🔄 Data Flow

```
Component → Hook (useFetch/useMutation) → Service (API calls) → Backend API
```

## 🧪 Testing

Ready for integration with testing libraries:
- Jest
- React Testing Library
- Cypress (E2E)

## 📚 Best Practices

- All API calls through service files
- Type-safe with TypeScript
- Responsive design patterns
- Accessibility standards
- Performance optimized
- Clean code architecture

## 🚀 Future Enhancements

- Real-time updates with WebSockets
- Advanced charting with Recharts
- Export to PDF/Excel
- Bulk operations
- Custom reports
- Email campaign management
- Two-factor authentication
- Audit logging

## 📄 License

Proprietary - Caffelino Platform

## 👨‍💻 Support

For support and questions, contact the development team.
