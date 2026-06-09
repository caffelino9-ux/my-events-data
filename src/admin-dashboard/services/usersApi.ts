// Users API Service
import { ApiResponse, PaginatedResponse, User } from '../types';

import { API_BASE_URL } from '../../config/api';

export const usersApi = {
  /**
   * Get all users
   */
  getAllUsers: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      searchQuery?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.searchQuery && { search: filters.searchQuery }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get user details
   */
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get user event history
   */
  getUserEventHistory: async (
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/events?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch user event history');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get user spending analytics
   */
  getUserSpending: async (userId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/spending`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch user spending');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
