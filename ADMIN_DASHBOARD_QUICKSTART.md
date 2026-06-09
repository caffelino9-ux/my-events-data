# Caffelino Admin Dashboard - Quick Start Guide

## 🚀 Getting Started

### 1. Installation

The admin dashboard is pre-built and ready to use. Ensure you have the required dependencies:

```bash
npm install react react-dom react-router-dom styled-components framer-motion typescript
```

### 2. Environment Setup

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Basic Integration

In your main app file:

```typescript
import AdminDashboard from './admin-dashboard/AdminDashboard';

function App() {
  return <AdminDashboard basePath="/admin" />;
}

export default App;
```

### 4. Start Using

Navigate to `http://localhost:3000/admin` to access the admin dashboard.

## 📊 What's Included

✅ **Complete Admin Dashboard** with 11 modules:
- Dashboard Home
- Events Management
- Organizer Management
- Bank Verification Center
- Registrations
- Tickets
- Revenue Dashboard
- Analytics
- Cafes
- Users
- Settings

✅ **Professional UI Components**:
- Stat cards with animations
- Data tables with pagination
- Responsive layout
- Premium coffee theme

✅ **API Ready**:
- 10 service files for all endpoints
- No hardcoded mock data
- Clean architecture

✅ **Custom Hooks**:
- `useFetch` - Data fetching
- `useMutation` - Mutations
- `usePagination` - Paginated data
- `useLocalStorage` - Local storage
- `useToggle` - Toggle state

✅ **Authentication**:
- Admin context & provider
- JWT token management
- Protected routes

## 📁 Project Structure

```
src/admin-dashboard/
├── pages/             # 11 page components
├── components/        # Layout, Cards, UI
├── services/          # 10 API service files
├── hooks/            # Custom React hooks
├── context/          # Authentication context
├── types/            # TypeScript definitions
├── utils/            # Utility functions
├── styles/           # Theme & globals
├── AdminDashboard.tsx # Main component
├── AdminRoutes.tsx   # Route config
└── index.ts          # Exports
```

## 🔌 API Integration

All data is fetched from APIs. Each module has corresponding API service:

```typescript
// Example: Fetch events
import { eventsApi } from './admin-dashboard/services/eventsApi';

const response = await eventsApi.getAllEvents(page, pageSize, filters);
```

## 🎨 Theme Customization

Edit the theme in `src/admin-dashboard/styles/theme.ts`:

```typescript
export const theme = {
  colors: {
    cream: '#F7F1E8',
    coffeeDark: '#2C1810',
    gold: '#D4AF37',
    // ... more colors
  },
  // ... spacing, typography, etc.
};
```

## 🔒 Authentication

Admin login is required:

1. Navigate to `/admin/login`
2. Enter credentials
3. JWT token is stored in localStorage
4. Redirects to dashboard on success

## 📊 Using Individual Components

```typescript
import { StatCard, useAdmin, theme } from './admin-dashboard';

function MyComponent() {
  const { admin, isAuthenticated } = useAdmin();

  return (
    <StatCard
      title="Events"
      value={100}
      icon="📅"
      trend={12.5}
    />
  );
}
```

## 🎯 Dashboard Highlights

### Stat Cards
Animated cards showing key metrics with trends:
- Total Events
- Total Organizers
- Tickets Sold
- Total Revenue
- Partner Cafes
- Active Events
- Pending Verifications
- Upcoming Events

### Events Management
- View all events in table format
- Actions: View, Edit, Approve, Suspend, Delete
- Filters by status and date range
- Search functionality

### Organizers
- Card-based layout showing organizer details
- Verification status badges
- Quick actions (View, Verify)

### Bank Verification
- Secure display of bank details
- Account number masking
- Approval/Rejection workflow

### Revenue Dashboard
- Break down by platform, event, cafe, organizer
- Revenue trends
- Multiple time period views

### Analytics
- Top events, organizers, cafes
- Peak booking times
- Revenue heatmaps
- Event growth charts

## 🚀 Advanced Usage

### Custom Hooks

```typescript
// Fetch data
const { data, loading, error } = useFetch(
  () => eventsApi.getAllEvents(),
  []
);

// Mutations
const { mutate, loading } = useMutation(
  (payload) => eventsApi.updateEvent(payload)
);

// Pagination
const { items, page, goToPage } = usePagination(
  (p, ps, f) => eventsApi.getAllEvents(p, ps, f)
);
```

### Admin Context

```typescript
import { useAdmin, AdminProvider } from './admin-dashboard';

function Component() {
  const { admin, isAuthenticated, login, logout } = useAdmin();

  return (
    <div>
      {isAuthenticated && <p>Welcome {admin?.name}</p>}
    </div>
  );
}
```

## 🔧 Configuration

See `CONFIG.md` for:
- Environment variables
- API endpoint configuration
- Response format
- Dependencies

## 📖 Documentation

- `README.md` - Full documentation
- `CONFIG.md` - Configuration guide
- `USAGE.md` - Usage examples

## 🤝 Integration with Backend

Ensure your backend API follows the expected format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

## 🎯 Next Steps

1. ✅ Integrate with your backend API
2. ✅ Set environment variables
3. ✅ Test authentication flow
4. ✅ Customize theme colors
5. ✅ Deploy to production

## ⚡ Performance Tips

- Use pagination for large datasets
- Implement caching for frequently accessed data
- Optimize images and assets
- Use React.memo for expensive components
- Implement lazy loading for routes

## 🐛 Troubleshooting

**Dashboard not loading?**
- Check API URL in `.env`
- Verify authentication token

**Styles not applying?**
- Clear node_modules and reinstall
- Check styled-components is installed

**Data not fetching?**
- Check browser console for errors
- Verify API endpoints
- Check network tab

## 📞 Support

For issues or questions, refer to the documentation or contact your development team.

## 📝 License

Proprietary - Caffelino Platform

---

Happy building! 🎉
