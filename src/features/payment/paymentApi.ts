import axiosInstance from '../../services/axiosInstance';
import { ApiResponse } from '../../types';

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const paymentApi = {
  createCheckoutSession: async (courseIds: string[]): Promise<CheckoutSessionResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<CheckoutSessionResponse>>(
      '/payment/create-intent',
      { courseIds }
    );
    return data.data;
  },

  verifyPayment: async (sessionId: string): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
      '/payment/verify',
      { sessionId }
    );
    return data.data;
  },
};