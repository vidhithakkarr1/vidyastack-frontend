import axiosInstance from '../../services/axiosInstance';
import { ApiResponse, Cart } from '../../types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const { data } = await axiosInstance.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  addToCart: async (courseId: string): Promise<Cart> => {
    const { data } = await axiosInstance.post<ApiResponse<Cart>>('/cart', { courseId });
    return data.data;
  },

  removeFromCart: async (courseId: string): Promise<Cart> => {
    const { data } = await axiosInstance.delete<ApiResponse<Cart>>(`/cart/${courseId}`);
    return data.data;
  },

  clearCart: async (): Promise<void> => {
    await axiosInstance.delete('/cart/clear');
  },
};