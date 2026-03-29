import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
    style={{
      animation: 'shimmer 2s infinite',
      background:
        'linear-gradient(90deg, rgb(51,65,85) 25%, rgb(71,85,105) 50%, rgb(51,65,85) 75%)',
      backgroundSize: '200% 100%',
    }}
  />
);

export const CourseCardSkeleton: React.FC = () => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 4 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const DashboardStatSkeleton: React.FC = () => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
    <Skeleton className="h-10 w-10 rounded-xl mb-4" />
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-4 w-32" />
  </div>
);