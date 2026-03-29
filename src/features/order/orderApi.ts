import axiosInstance from '../../services/axiosInstance';
import { ApiResponse, Order } from '../../types';

export const orderApi = {
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await axiosInstance.get<ApiResponse<Order[]>>('/order/myCourses');
    return data.data;
  },

  createOrder: async (courseIds: string[], amount: number): Promise<Order> => {
    const { data } = await axiosInstance.post<ApiResponse<Order>>('/order', {
      courseIds,
      amount,
    });
    return data.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },
};