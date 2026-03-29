export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const QUERY_KEYS = {
  COURSES: 'courses',
  COURSE_DETAIL: 'course-detail',
  MY_COURSES: 'my-courses',
  TUTOR_COURSES: 'tutor-courses',
  CART: 'cart',
  ORDERS: 'orders',
  ADMIN_COURSES: 'admin-courses',
  USER_PROFILE: 'user-profile',
} as const;

export const ROUTES = {
  // Public
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  LOGIN: '/login',
  REGISTER: '/register',

  // Student
  DASHBOARD: '/dashboard',
  CART: '/cart',
  ORDERS: '/orders',
  MY_COURSES: '/my-courses',
  CHECKOUT_SUCCESS: '/checkout/success',
  CHECKOUT_CANCEL: '/checkout/cancel',

  // Tutor
  TUTOR_DASHBOARD: '/tutor/dashboard',
  TUTOR_ADD_COURSE: '/tutor/courses/add',
  TUTOR_EDIT_COURSE: '/tutor/courses/edit/:id',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
} as const;

export const COURSE_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cybersecurity',
  'UI/UX Design',
  'Business',
  'Marketing',
  'Photography',
] as const;

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const TOAST_DURATION = 4000;