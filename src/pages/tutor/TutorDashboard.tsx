import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Plus, TrendingUp, Users, DollarSign, Edit, Trash2, Eye,
} from 'lucide-react';
import { useTutorCourses, useDeleteCourse } from '../../features/course/useCourse';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';
import { DashboardStatSkeleton, Skeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { toastService } from '../../hooks/useToast';
import { formatCurrency, buildTutorEditRoute } from '../../utils/formatters';

export default function TutorDashboard() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useTutorCourses();
  const { mutate: deleteCourse, isPending: deleting } = useDeleteCourse();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCourse(deleteId, {
      onSuccess: () => { toastService.success('Course deleted'); setDeleteId(null); },
      onError: () => toastService.error('Failed to delete course'),
    });
  };

  const stats = [
    {
      label: 'Total Courses',
      value: courses?.length || 0,
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      label: 'Approved',
      value: courses?.filter((c) => c.status === 'approved').length || 0,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Pending',
      value: courses?.filter((c) => c.status === 'pending').length || 0,
      icon: Eye,
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Total Students',
      value: courses?.reduce((sum, c) => sum + c.studentsEnrolled, 0) || 0,
      icon: Users,
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tutor Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your courses and track performance</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/tutor/courses/add')}
        >
          Add Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <DashboardStatSkeleton key={i} />)
        ) : (
          stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-400 mt-0.5">{label}</p>
            </div>
          ))
        )}
      </div>

      {/* Courses table */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Your Courses</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        ) : !courses?.length ? (
          <EmptyState
            icon={<BookOpen className="w-10 h-10" />}
            title="No courses yet"
            description="Create your first course and start teaching!"
            action={
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/tutor/courses/add')}>
                Create Course
              </Button>
            }
          />
        ) : (
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/40">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Students</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail || `https://picsum.photos/seed/${course.id}/60/40`}
                            alt=""
                            className="w-12 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-medium text-white max-w-xs truncate">{course.title}</p>
                            <p className="text-xs text-slate-400">{course.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-semibold">{formatCurrency(course.price)}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{course.studentsEnrolled}</td>
                      <td className="px-6 py-4"><StatusBadge status={course.status || 'pending'} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(buildTutorEditRoute(course.id || course._id || ''))}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(course.id || course._id || null)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}