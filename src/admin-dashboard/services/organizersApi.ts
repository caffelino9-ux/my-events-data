// Organizers API Service
import { ApiResponse, PaginatedResponse, Organizer } from '../types';

import { API_BASE_URL } from '../../config/api';

export const organizersApi = {
  /**
   * Fetch all organizers
   */
  getAllOrganizers: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      verificationStatus?: string;
      searchQuery?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Organizer>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.verificationStatus && { verificationStatus: filters.verificationStatus }),
        ...(filters?.searchQuery && { search: filters.searchQuery }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/organizers?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch organizers');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get single organizer details
   */
  getOrganizerById: async (organizerId: string): Promise<ApiResponse<Organizer>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/organizers/${organizerId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch organizer');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Verify organizer
   */
  verifyOrganizer: async (organizerId: string): Promise<ApiResponse<Organizer>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/organizers/${organizerId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: 'VERIFIED' }),
      });

      if (!response.ok) throw new Error('Failed to verify organizer');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Reject organizer
   */
  rejectOrganizer: async (
    organizerId: string,
    reason?: string
  ): Promise<ApiResponse<Organizer>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/organizers/${organizerId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: 'REJECTED', reason }),
      });

      if (!response.ok) throw new Error('Failed to reject organizer');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Suspend organizer
   */
  suspendOrganizer: async (
    organizerId: string,
    reason?: string
  ): Promise<ApiResponse<Organizer>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/organizers/${organizerId}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: 'SUSPENDED', reason }),
      });

      if (!response.ok) throw new Error('Failed to suspend organizer');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get organizer events
   */
  getOrganizerEvents: async (
    organizerId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(
        `${API_BASE_URL}/admin/organizers/${organizerId}/events?${params}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch organizer events');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get organizer analytics
   */
  getOrganizerAnalytics: async (organizerId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/organizers/${organizerId}/analytics`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
