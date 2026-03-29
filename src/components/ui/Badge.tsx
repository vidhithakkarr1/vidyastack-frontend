import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-300 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-semibold
        rounded-full border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'rejected' }> = ({
  status,
}) => {
  const map = {
    pending: { variant: 'warning' as BadgeVariant, label: 'Pending Review' },
    approved: { variant: 'success' as BadgeVariant, label: 'Approved' },
    rejected: { variant: 'danger' as BadgeVariant, label: 'Rejected' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
};