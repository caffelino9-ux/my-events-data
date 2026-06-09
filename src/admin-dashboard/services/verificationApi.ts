// Verification API Service
import { ApiResponse, BankDetails, PaginatedResponse } from '../types';

import { API_BASE_URL } from '../../config/api';

export const verificationApi = {
  /**
   * Get pending verifications
   */
  getPendingVerifications: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<BankDetails>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status: 'PENDING',
      });

      const response = await fetch(`${API_BASE_URL}/admin/verifications?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch pending verifications');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get bank verification details
   */
  getBankDetails: async (organizerId: string): Promise<ApiResponse<BankDetails>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/verifications/organizers/${organizerId}/bank`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch bank details');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Approve bank verification
   */
  approveBankVerification: async (bankDetailsId: string): Promise<ApiResponse<BankDetails>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/verifications/${bankDetailsId}/approve`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to approve verification');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Reject bank verification
   */
  rejectBankVerification: async (
    bankDetailsId: string,
    reason?: string
  ): Promise<ApiResponse<BankDetails>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/verifications/${bankDetailsId}/reject`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) throw new Error('Failed to reject verification');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Get all verifications with filters
   */
  getAllVerifications: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      status?: string;
      searchQuery?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<BankDetails>>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.searchQuery && { search: filters.searchQuery }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/verifications?${params}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch verifications');
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};
