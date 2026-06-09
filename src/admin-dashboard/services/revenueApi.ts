// Revenue API Service
import { ApiResponse, Revenue, PaginatedResponse } from '../types';

import { API_BASE_URL } from '../../config/api';

export const revenueApi = {
  /**
   * Get revenue summary
   */
  getRevenueSummary: async (
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY'
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/revenue/summary?period=${period}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch revenue summary');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get revenue breakdown
   */
  getRevenueBreakdown: async (
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY'
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/revenue/breakdown?period=${period}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch revenue breakdown');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get daily revenue chart data
   */
  getDailyRevenue: async (days: number = 30): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/revenue/daily?days=${days}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch daily revenue');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get organizer payouts
   */
  getOrganizerPayouts: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(`${API_BASE_URL}/admin/revenue/payouts?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch payouts');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get revenue trends
   */
  getRevenueTrends: async (
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY'
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/revenue/trends?period=${period}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch trends');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
