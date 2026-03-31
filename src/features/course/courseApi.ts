import axiosInstance from '../../services/axiosInstance';
import {
  ApiResponse,
  Course,
  CourseFormData,
  PaginatedResponse,
  RatingPayload,
} from '../../types';

interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export const courseApi = {
  getAllCourses: async (filters: CourseFilters = {}): Promise<PaginatedResponse<Course>> => {
    try {
      const { data } = await axiosInstance.get<ApiResponse<PaginatedResponse<Course>>>(
        '/course/list',
        { params: filters }
      );
      return data.data || { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    } catch (error) {
      return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    const { data } = await axiosInstance.get<ApiResponse<Course>>(`/course/detail/${id}`);
    return data.data;
  },

  getTutorCourses: async (): Promise<Course[]> => {
    try {
      const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/course/my-courses');
      return data.data || [];
    } catch (error) {
      return [];
    }
  },

  createCourse: async (formData: FormData): Promise<Course> => {
    const { data } = await axiosInstance.post<ApiResponse<Course>>('/course/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updateCourse: async (id: string, formData: FormData): Promise<Course> => {
    const { data } = await axiosInstance.put<ApiResponse<Course>>(
      `/course/update/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/course/delete/${id}`);
  },

  rateCourse: async (payload: RatingPayload): Promise<void> => {
    await axiosInstance.post(`/course/${payload.courseId}/rate`, {
      rating: payload.rating,
      review: payload.review,
    });
  },

  getMyPurchasedCourses: async (): Promise<Course[]> => {
    const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/course/my-courses');
    return data.data;
  },

  getCourseContent: async (courseId: string): Promise<any> => {
    const { data } = await axiosInstance.get<ApiResponse<any>>(`/course/${courseId}/content`);
    return data.data;
  },

  searchCourses: async (query: string): Promise<Course[]> => {
    const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/course/search', {
      params: { q: query },
    });
    return data.data;
  },
};