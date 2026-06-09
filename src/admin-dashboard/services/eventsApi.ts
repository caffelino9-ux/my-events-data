// Events API Service
import { ApiResponse, PaginatedResponse, Event } from '../types';

import { API_BASE_URL } from '../../config/api';

export const eventsApi = {
  /**
   * Fetch all events with pagination and filters
   */
  getAllEvents: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      status?: string;
      cafeId?: string;
      organizerId?: string;
      dateRange?: { start: string; end: string };
      searchQuery?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Event>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.cafeId && { cafeId: filters.cafeId }),
        ...(filters?.organizerId && { organizerId: filters.organizerId }),
        ...(filters?.searchQuery && { search: filters.searchQuery }),
        ...(filters?.dateRange && {
          startDate: filters.dateRange.start,
          endDate: filters.dateRange.end,
        }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/events?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get single event details
   */
  getEventById: async (eventId: string): Promise<ApiResponse<Event>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch event');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Approve an event
   */
  approveEvent: async (eventId: string): Promise<ApiResponse<Event>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (!response.ok) throw new Error('Failed to approve event');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Suspend an event
   */
  suspendEvent: async (eventId: string, reason?: string): Promise<ApiResponse<Event>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SUSPENDED', reason }),
      });

      if (!response.ok) throw new Error('Failed to suspend event');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Update event details
   */
  updateEvent: async (
    eventId: string,
    updateData: Partial<Event>
  ): Promise<ApiResponse<Event>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update event');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Delete an event
   */
  deleteEvent: async (eventId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete event');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get event analytics
   */
  getEventAnalytics: async (eventId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/analytics`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get event attendees
   */
  getEventAttendees: async (
    eventId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/attendees?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch attendees');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
