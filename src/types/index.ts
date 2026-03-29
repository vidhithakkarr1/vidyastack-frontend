export type Role = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Course {
  _id?: string;
  id: string;
  name?: string;
  title: string;
  description: string;
  thumbnail?: string;
  videoUrl?: string;
  price: number;
  rating: number;
  ratingCount?: number;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  studentsEnrolled: number;
  purchasedCount?: number;
  tutor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  instructor?: string;
  tags?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  isPublished?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  courseId: string;
  course: Course;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  courses: Course[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  paymentIntentId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  tags: string[];
  thumbnail?: File;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'tutor';
}

export interface RatingPayload {
  courseId: string;
  rating: number;
  review?: string;
}