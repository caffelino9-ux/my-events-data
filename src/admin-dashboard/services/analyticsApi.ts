// Analytics API Service
import { ApiResponse, Analytics } from '../types';

import { API_BASE_URL } from '../../config/api';

export const analyticsApi = {
  /**
   * Get platform analytics
   */
  getPlatformAnalytics: async (
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY'
  ): Promise<ApiResponse<Analytics>> => {
    try {
      const params = new URLSearchParams({ period });

      const response = await fetch(`${API_BASE_URL}/admin/analytics?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get top events
   */
  getTopEvents: async (limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics/top-events?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch top events');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get top organizers
   */
  getTopOrganizers: async (limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics/top-organizers?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch top organizers');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get top cafes
   */
  getTopCafes: async (limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics/top-cafes?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch top cafes');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get revenue heatmap data
   */
  getRevenueHeatmap: async (
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY'
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics/revenue-heatmap?period=${period}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch revenue heatmap');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get event growth data
   */
  getEventGrowth: async (
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY'
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics/event-growth?period=${period}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch event growth');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get peak booking times
   */
  getPeakBookingTimes: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics/peak-bookings`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch peak bookings');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
