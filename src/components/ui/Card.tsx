import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-slate-800/50 backdrop-blur-sm
        border border-slate-700/50
        rounded-2xl
        shadow-xl shadow-black/20
        ${paddingClasses[padding]}
        ${hover ? 'hover:bg-slate-800/70 hover:border-slate-600/50 hover:shadow-purple-500/10 cursor-pointer transition-all duration-200 hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const GlassCard: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-md
        border border-white/10
        rounded-2xl
        shadow-2xl
        ${paddingClasses[padding]}
        ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};