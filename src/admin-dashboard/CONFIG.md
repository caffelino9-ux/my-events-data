# Admin Dashboard Configuration

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000

# Admin Dashboard Configuration
REACT_APP_ADMIN_PATH=/admin
REACT_APP_ADMIN_TITLE=Caffelino Admin Dashboard

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_EXPORTS=true
REACT_APP_ENABLE_BULK_OPERATIONS=false

# UI Configuration
REACT_APP_THEME=light
REACT_APP_ITEMS_PER_PAGE=10
REACT_APP_PAGINATION_BUTTONS=5

# Development
REACT_APP_ENV=development
REACT_APP_DEBUG=false
```

## API Endpoints

The admin dashboard expects the following API endpoints:

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin info
- `POST /api/admin/logout` - Admin logout

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/activities` - Recent activities
- `GET /api/admin/notifications` - Notifications

### Events
- `GET /api/admin/events` - List events
- `GET /api/admin/events/:id` - Get event details
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `PATCH /api/admin/events/:id/approve` - Approve event
- `PATCH /api/admin/events/:id/suspend` - Suspend event
- `GET /api/admin/events/:id/analytics` - Event analytics
- `GET /api/admin/events/:id/attendees` - Event attendees

### Organizers
- `GET /api/admin/organizers` - List organizers
- `GET /api/admin/organizers/:id` - Get organizer details
- `PATCH /api/admin/organizers/:id/verify` - Verify organizer
- `PATCH /api/admin/organizers/:id/reject` - Reject organizer
- `PATCH /api/admin/organizers/:id/suspend` - Suspend organizer
- `GET /api/admin/organizers/:id/events` - Organizer events
- `GET /api/admin/organizers/:id/analytics` - Organizer analytics

### Registrations
- `GET /api/admin/registrations` - List registrations
- `GET /api/admin/registrations/:id` - Get registration details
- `PATCH /api/admin/registrations/:id/attendance` - Mark attendance
- `GET /api/admin/events/:id/registrations` - Event registrations

### Tickets
- `GET /api/admin/tickets` - List tickets
- `GET /api/admin/tickets/:id` - Get ticket details
- `PATCH /api/admin/tickets/:id/verify-qr` - Verify QR
- `PATCH /api/admin/tickets/:id/check-in` - Check in ticket
- `GET /api/admin/events/:id/tickets` - Event tickets

### Revenue
- `GET /api/admin/revenue/summary` - Revenue summary
- `GET /api/admin/revenue/breakdown` - Revenue breakdown
- `GET /api/admin/revenue/daily` - Daily revenue
- `GET /api/admin/revenue/payouts` - Organizer payouts
- `GET /api/admin/revenue/trends` - Revenue trends

### Analytics
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/analytics/top-events` - Top events
- `GET /api/admin/analytics/top-organizers` - Top organizers
- `GET /api/admin/analytics/top-cafes` - Top cafes
- `GET /api/admin/analytics/revenue-heatmap` - Revenue heatmap
- `GET /api/admin/analytics/event-growth` - Event growth
- `GET /api/admin/analytics/peak-bookings` - Peak booking times

### Verification
- `GET /api/admin/verifications` - List verifications
- `GET /api/admin/verifications/organizers/:id/bank` - Bank details
- `PATCH /api/admin/verifications/:id/approve` - Approve verification
- `PATCH /api/admin/verifications/:id/reject` - Reject verification

### Cafes
- `GET /api/admin/cafes` - List cafes
- `GET /api/admin/cafes/:id` - Get cafe details
- `PATCH /api/admin/cafes/:id` - Update cafe
- `GET /api/admin/cafes/:id/events` - Cafe events
- `GET /api/admin/cafes/:id/analytics` - Cafe analytics

### Users
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/users/:id/events` - User event history
- `GET /api/admin/users/:id/spending` - User spending

### Settings
- `GET /api/admin/settings` - Get platform settings
- `PUT /api/admin/settings` - Update platform settings

## Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example"
  },
  "message": "Success"
}
```

For errors:

```json
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

For paginated responses:

```json
{
  "success": true,
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

## Dependencies

The Admin Dashboard requires the following packages:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "styled-components": "^5.3.0",
  "framer-motion": "^10.0.0",
  "typescript": "^4.9.0"
}
```

Optional (for enhanced features):

```json
{
  "recharts": "^2.0.0",
  "axios": "^1.0.0"
}
```

## Development

To run the admin dashboard in development mode:

```bash
npm start
```

The dashboard will be available at `http://localhost:3000/admin`

## Production Build

```bash
npm run build
```

All files will be optimized and minified in the `build/` directory.
