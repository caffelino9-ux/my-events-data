// Tickets API Service
import { ApiResponse, PaginatedResponse, Ticket } from '../types';

import { API_BASE_URL } from '../../config/api';

export const ticketsApi = {
  /**
   * Fetch all tickets
   */
  getAllTickets: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      eventId?: string;
      status?: string;
      searchQuery?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Ticket>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.eventId && { eventId: filters.eventId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.searchQuery && { search: filters.searchQuery }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/tickets?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch tickets');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get ticket details
   */
  getTicketById: async (ticketId: string): Promise<ApiResponse<Ticket>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/tickets/${ticketId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch ticket');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Verify ticket QR code
   */
  verifyTicketQR: async (ticketId: string): Promise<ApiResponse<Ticket>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/tickets/${ticketId}/verify-qr`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to verify ticket');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Check in ticket
   */
  checkInTicket: async (ticketId: string): Promise<ApiResponse<Ticket>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/tickets/${ticketId}/check-in`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to check in ticket');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get event tickets
   */
  getEventTickets: async (
    eventId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Ticket>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/tickets?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch event tickets');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
