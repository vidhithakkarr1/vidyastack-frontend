import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, LogOut } from 'lucide-react';
import { useAuthStore } from '../features/auth/authStore';
import { useLogout } from '../features/auth/useAuth';
import { getInitials } from '../utils/formatters';

export const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useLogout();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900/95 border-r border-slate-800/60 flex flex-col">
        <div className="p-6 border-b border-slate-800/60">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Learning Hub</span>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-white border border-rose-500/30"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            Course Approvals
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
              {user ? getInitials(user.name) : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-rose-400 truncate">Administrator</p>
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

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center px-8">
          <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
          <span className="ml-3 px-2.5 py-0.5 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
            Admin Access
          </span>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};