// Cafes API Service
import { ApiResponse, PaginatedResponse, Cafe } from '../types';

import { API_BASE_URL } from '../../config/api';

export const cafesApi = {
  /**
   * Get all cafes
   */
  getAllCafes: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      status?: string;
      searchQuery?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Cafe>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.searchQuery && { search: filters.searchQuery }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/cafes?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch cafes');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get cafe details
   */
  getCafeById: async (cafeId: string): Promise<ApiResponse<Cafe>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cafes/${cafeId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch cafe');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get cafe events
   */
  getCafeEvents: async (
    cafeId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(`${API_BASE_URL}/admin/cafes/${cafeId}/events?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch cafe events');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get cafe analytics
   */
  getCafeAnalytics: async (cafeId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cafes/${cafeId}/analytics`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch cafe analytics');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Update cafe status
   */
  updateCafeStatus: async (
    cafeId: string,
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ): Promise<ApiResponse<Cafe>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cafes/${cafeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update cafe status');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
