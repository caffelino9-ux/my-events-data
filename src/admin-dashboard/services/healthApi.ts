import { API_BASE_URL } from '../../config/api';
import { ApiResponse } from '../types';

export const healthApi = {
  /**
   * Check if backend is running
   */
  checkHealth: async (): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
