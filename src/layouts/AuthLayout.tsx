import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { BookOpen } from 'lucide-react';
import { ROUTES } from '../constants';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    if (user.role === 'student') return <Navigate to={ROUTES.HOME} replace />;
    if (user.role === 'tutor') return <Navigate to={ROUTES.TUTOR_DASHBOARD} replace />;
    if (user.role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Learning Hub
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-slate-600">
        © 2026 Learning Hub. Built for learners worldwide.
      </footer>
    </div>
  );
};