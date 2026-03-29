import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, BookOpen } from 'lucide-react';
import { useRegister } from '../../features/auth/useAuth';
import { Button } from '../../components/ui/Button';
import { toastService } from '../../hooks/useToast';

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'tutor',
  });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form, {
      onSuccess: () => {
        toastService.success('Registration successful!');
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || 'Registration failed';
        toastService.error(errorMsg);
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 mb-4">
              <User className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Join Learning Hub</h1>
            <p className="text-slate-400 text-sm mt-1">Start your learning journey</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['student', 'tutor'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                  ${form.role === role
                    ? 'border-indigo-500/60 bg-indigo-500/15 text-white'
                    : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                {role === 'student' ? (
                  <GraduationCap className="w-6 h-6" />
                ) : (
                  <BookOpen className="w-6 h-6" />
                )}
                <span className="text-sm font-semibold capitalize">{role}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-slate-800 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth isLoading={isPending} size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}