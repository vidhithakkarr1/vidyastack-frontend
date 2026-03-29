import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, PlusCircle, Library, LogOut, Menu, X, ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../features/auth/authStore';
import { useLogout } from '../features/auth/useAuth';
import { getInitials } from '../utils/formatters';

const sidebarItems = [
  { path: '/tutor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tutor/courses/add', icon: PlusCircle, label: 'Add Course' },
];

export const TutorLayout: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useLogout();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50 bg-slate-900/95 backdrop-blur-xl
          border-r border-slate-800/60 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800/60">
          <Link to="/tutor/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Learning Hub</span>
              <p className="text-xs text-slate-500">Tutor Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${location.pathname === path
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${location.pathname === path ? 'text-indigo-400' : ''}`} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user ? getInitials(user.name) : 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 h-16 flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-slate-200 font-semibold capitalize">
            {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
          </h1>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};