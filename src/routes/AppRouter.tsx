import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { StudentLayout } from '../layouts/StudentLayout';
import { TutorLayout } from '../layouts/TutorLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Skeleton } from '../components/ui/SkeletonLoader';

// Auth pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

// Public pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const CourseBrowsePage = lazy(() => import('../pages/student/HomePage'));

// Student pages
const HomePage = lazy(() => import('../pages/student/HomePage'));
const CourseDetailPage = lazy(() => import('../pages/student/CourseDetailPage'));
const CartPage = lazy(() => import('../pages/student/CartPage'));
const OrdersPage = lazy(() => import('../pages/student/OrdersPage'));
const MyCoursesPage = lazy(() => import('../pages/student/MyCoursesPage'));
const CheckoutSuccessPage = lazy(() => import('../pages/student/CheckoutSuccessPage'));
const CheckoutCancelPage = lazy(() => import('../pages/student/CheckoutCancelPage'));

// Tutor pages
const TutorDashboard = lazy(() => import('../pages/tutor/TutorDashboard'));
const AddCoursePage = lazy(() => import('../pages/tutor/AddCoursePage'));
const EditCoursePage = lazy(() => import('../pages/tutor/EditCoursePage'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
      <p className="text-slate-400 text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Student routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/courses" element={<CourseBrowsePage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
        </Route>

        {/* Tutor routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/courses/add" element={<AddCoursePage />} />
          <Route path="/tutor/courses/edit/:id" element={<EditCoursePage />} />
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};