import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { Role } from '../types';
import { ROUTES } from '../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const location = useLocation();

  // Wait for auth state to hydrate from localStorage
  if (!hasHydrated) {
    return null; // Or show a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard
    if (user.role === 'student') return <Navigate to={ROUTES.DASHBOARD} replace />;
    if (user.role === 'tutor') return <Navigate to={ROUTES.TUTOR_DASHBOARD} replace />;
    if (user.role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <>{children}</>;
};