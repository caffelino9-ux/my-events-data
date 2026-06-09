// Admin Dashboard Type Definitions

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'PLATFORM_OWNER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  banner?: string;
  description: string;
  organizerId: string;
  cafeId: string;
  eventDate: string;
  ticketPrice: number;
  totalSeats: number;
  ticketsSold: number;
  revenue: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  totalEvents: number;
  totalRevenue: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  bankVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  id: string;
  organizerId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  accountNumberMasked?: string;
  ifscCode: string;
  upiId?: string;
  panNumber: string;
  gstNumber?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  ticketId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventName: string;
  amountPaid: number;
  registrationTime: string;
  attendanceStatus: 'NOT_ATTENDED' | 'ATTENDED' | 'CHECKED_IN';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  ticketCode: string;
  qrCode: string;
  amount: number;
  qrStatus: 'GENERATED' | 'SCANNED' | 'VERIFIED';
  checkInStatus: 'NOT_CHECKED' | 'CHECKED_IN' | 'CHECKED_OUT';
  generatedDate: string;
  scannedAt?: string;
  checkedInAt?: string;
}

export interface Revenue {
  platformRevenue: number;
  eventRevenue: number;
  cafeRevenue: number;
  organizerRevenue: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  date: string;
}

export interface Cafe {
  id: string;
  name: string;
  location: string;
  eventsHosted: number;
  revenueGenerated: number;
  averageAttendance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  eventsJoined: number;
  ticketsPurchased: number;
  totalSpend: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'EVENT_CREATED' | 'ORGANIZER_REGISTERED' | 'BANK_VERIFICATION' | 'REVENUE_ALERT' | 'UPCOMING_EVENT';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalOrganizers: number;
  ticketsSold: number;
  totalRevenue: number;
  partnerCafes: number;
  activeEvents: number;
  pendingVerifications: number;
  upcomingEvents: number;
}

export interface EventTrend {
  period: string;
  value: number;
}

export interface Analytics {
  topEvents: Array<{ name: string; tickets: number; revenue: number }>;
  topOrganizers: Array<{ name: string; events: number; revenue: number }>;
  topCafes: Array<{ name: string; events: number; revenue: number }>;
  mostSoldTickets: Array<{ event: string; quantity: number }>;
  peakBookingTimes: Array<{ hour: number; bookings: number }>;
  averageTicketPrice: number;
}

export interface PlatformSettings {
  commissionPercentage: number;
  eventApprovalRequired: boolean;
  bankVerificationRequired: boolean;
  autoApproveEvents: boolean;
  emailNotificationsEnabled: boolean;
  maxEventsPerOrganizer?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
