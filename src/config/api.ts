// API Configuration
// Centralized configuration for all API requests

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to handle API responses uniformly
 */
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Failed to fetch');
  }
  return response.json();
};
