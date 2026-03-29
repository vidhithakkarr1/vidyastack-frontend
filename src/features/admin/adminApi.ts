import axiosInstance from '../../services/axiosInstance';
import { ApiResponse, Course } from '../../types';

export const adminApi = {
  getPendingCourses: async (): Promise<Course[]> => {
    const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/admin/courses/pending');
    console.log('data', data);
    return data.data;
  },

  getAllCourses: async (): Promise<Course[]> => {
    try {
      const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/course/admin/all');
      console.log('data', data);
      return data.data || [];
    } catch (error) {
      return [];
    }
  },

  approveCourse: async (id: string): Promise<Course> => {
    const { data } = await axiosInstance.patch<ApiResponse<Course>>(
      `/course/admin/${id}/status`,
      { status: "approved" }
    );
    return data.data;
  },

  rejectCourse: async (id: string, reason?: string): Promise<Course> => {
    const { data } = await axiosInstance.patch<ApiResponse<Course>>(
      `/course/admin/${id}/status`,
      { 
        status: "rejected",
        rejectionReason: reason
      }
    );
    return data.data;
  },
};