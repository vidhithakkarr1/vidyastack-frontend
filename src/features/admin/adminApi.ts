import axiosInstance from '../../services/axiosInstance';
import { ApiResponse, Course } from '../../types';

export const adminApi = {
  getPendingCourses: async (): Promise<Course[]> => {
    const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/admin/courses/pending');
    return data.data;
  },

  getAllCourses: async (): Promise<Course[]> => {
    try {
      const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/admin/all');
      return data.data || [];
    } catch (error) {
      return [];
    }
  },

  approveCourse: async (id: string): Promise<Course> => {
    const { data } = await axiosInstance.patch<ApiResponse<Course>>(
      `/admin/courses/${id}/approve`
    );
    return data.data;
  },

  rejectCourse: async (id: string, reason?: string): Promise<Course> => {
    const { data } = await axiosInstance.patch<ApiResponse<Course>>(
      `/admin/courses/${id}/reject`,
      { reason }
    );
    return data.data;
  },
};