// Registrations API Service
import { ApiResponse, PaginatedResponse, Registration } from '../types';

import { API_BASE_URL } from '../../config/api';

export const registrationsApi = {
  /**
   * Fetch all registrations
   */
  getAllRegistrations: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      eventId?: string;
      status?: string;
      searchQuery?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Registration>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.eventId && { eventId: filters.eventId }),
        ...(filters?.status && { paymentStatus: filters.status }),
        ...(filters?.searchQuery && { search: filters.searchQuery }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/registrations?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch registrations');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get registration details
   */
  getRegistrationById: async (registrationId: string): Promise<ApiResponse<Registration>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations/${registrationId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch registration');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Mark attendance
   */
  markAttendance: async (
    registrationId: string,
    status: 'ATTENDED' | 'NOT_ATTENDED' | 'CHECKED_IN'
  ): Promise<ApiResponse<Registration>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/registrations/${registrationId}/attendance`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attendanceStatus: status }),
        }
      );

      if (!response.ok) throw new Error('Failed to mark attendance');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get event registrations
   */
  getEventRegistrations: async (
    eventId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Registration>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(
        `${API_BASE_URL}/admin/events/${eventId}/registrations?${params}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch registrations');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
