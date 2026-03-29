import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Home,
  ShoppingCart,
  Package,
  GraduationCap,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../features/auth/authStore';
import { useLogout } from '../features/auth/useAuth';
import { useCartStore } from '../features/cart/cartStore';
import { getInitials } from '../utils/formatters';

const navItems = [
  { path: '/courses', icon: Home, label: 'Explore' },
  { path: '/dashboard', icon: BookOpen, label: 'Dashboard' },
  { path: '/my-courses', icon: GraduationCap, label: 'My Learning' },
  { path: '/orders', icon: Package, label: 'Orders' },
];

export const StudentLayout: React.FC = () => {
  const { user, hasHydrated } = useAuthStore();
  const { logout } = useLogout();
  const { itemCount } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Wait for auth state to hydrate from localStorage
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-[150px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-lg font-bold text-white tracking-tight">
                Learning Hub
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${location.pathname === path
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-slate-800 transition-all"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user ? getInitials(user.name) : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-700/50">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800/60 bg-slate-950/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${location.pathname === path
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};