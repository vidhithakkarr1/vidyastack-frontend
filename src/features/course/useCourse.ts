import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from './courseApi';
import { QUERY_KEYS } from '../../constants';
import { CourseFormData, RatingPayload } from '../../types';

interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export const useCourses = (filters: CourseFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSES, filters],
    queryFn: () => courseApi.getAllCourses(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE_DETAIL, id],
    queryFn: () => courseApi.getCourseById(id),
    enabled: !!id,
  });
};

export const useTutorCourses = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TUTOR_COURSES],
    queryFn: courseApi.getTutorCourses,
  });
};

export const useMyPurchasedCourses = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_COURSES],
    queryFn: courseApi.getMyPurchasedCourses,
  });
};

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => courseApi.createCourse(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.TUTOR_COURSES] });
    },
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      courseApi.updateCourse(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.TUTOR_COURSES] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COURSES] });
    },
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.TUTOR_COURSES] });
    },
  });
};

export const useRateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RatingPayload) => courseApi.rateCourse(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COURSE_DETAIL, variables.courseId] });
    },
  });
};