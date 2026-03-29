import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Check, X, Clock, BookOpen, Users, TrendingUp, Eye } from 'lucide-react';
import { adminApi } from '../../features/admin/adminApi';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';
import { DashboardStatSkeleton, Skeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { toastService } from '../../hooks/useToast';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { QUERY_KEYS } from '../../constants';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: courses, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_COURSES],
    queryFn: adminApi.getAllCourses,
  });

  const { mutate: approve, isPending: approving } = useMutation({
    mutationFn: (id: string) => adminApi.approveCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_COURSES] });
      toastService.success('Course approved!');
    },
    onError: () => toastService.error('Failed to approve course'),
  });

  const { mutate: reject, isPending: rejecting } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.rejectCourse(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_COURSES] });
      toastService.success('Course rejected');
      setRejectId(null);
      setRejectReason('');
    },
    onError: () => toastService.error('Failed to reject course'),
  });

  const filtered = courses?.filter((c) => filter === 'all' || c.status === filter) || [];

  const stats = [
    { label: 'Total Courses', value: courses?.length || 0, icon: BookOpen, color: 'from-indigo-500 to-purple-600' },
    { label: 'Pending Review', value: courses?.filter((c) => c.status === 'pending').length || 0, icon: Clock, color: 'from-amber-500 to-orange-600' },
    { label: 'Approved', value: courses?.filter((c) => c.status === 'approved').length || 0, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
    { label: 'Rejected', value: courses?.filter((c) => c.status === 'rejected').length || 0, icon: X, color: 'from-rose-500 to-red-600' },
  ];

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All Courses' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Course Approvals</h1>
          <p className="text-sm text-slate-400">Review and manage course submissions</p>
        </div>
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

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${filter === key
                ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-white border border-rose-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }
            `}
          >
            {label}
            {key !== 'all' && courses && (
              <span className="ml-1.5 text-xs opacity-70">
                ({courses.filter((c) => c.status === key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Courses list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      ) : !filtered.length ? (
        <EmptyState
          icon={<BookOpen className="w-10 h-10" />}
          title={`No ${filter === 'all' ? '' : filter} courses`}
          description="No courses match this filter at the moment."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 hover:border-slate-600/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={course.thumbnail || `https://picsum.photos/seed/${course.id}/100/60`}
                  alt=""
                  className="w-full sm:w-20 h-28 sm:h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{course.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        By {course.tutor?.name || 'Unknown'} · {course.category || 'General'} · {course.level || 'Beginner'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span>{formatCurrency(course.price)}</span>
                        <span>·</span>
                        <span>Submitted {formatDate(course.createdAt)}</span>
                      </div>
                    </div>
                    <StatusBadge status={course.status || 'pending'} />
                  </div>
                </div>

                {/* Actions */}
                {course.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                      isLoading={approving}
                      onClick={() => approve(course.id || course._id || '')}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={<X className="w-3.5 h-3.5" />}
                      onClick={() => setRejectId(course.id || course._id || null)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      <ConfirmModal
        isOpen={!!rejectId}
        onClose={() => { setRejectId(null); setRejectReason(''); }}
        onConfirm={() => rejectId && reject({ id: rejectId, reason: rejectReason })}
        title="Reject Course"
        description="Please provide a reason for rejection (optional). This will be sent to the tutor."
        confirmLabel="Reject Course"
        isLoading={rejecting}
      />
    </div>
  );
}