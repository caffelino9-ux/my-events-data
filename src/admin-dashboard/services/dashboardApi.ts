// Dashboard API Service
import { ApiResponse, DashboardStats, PlatformSettings } from '../types';

import { API_BASE_URL } from '../../config/api';

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get platform settings
   */
  getPlatformSettings: async (): Promise<ApiResponse<PlatformSettings>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch settings');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Update platform settings
   */
  updatePlatformSettings: async (
    settings: Partial<PlatformSettings>
  ): Promise<ApiResponse<PlatformSettings>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/activities?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch activities');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get notifications
   */
  getNotifications: async (limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (notificationId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to mark notification');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
