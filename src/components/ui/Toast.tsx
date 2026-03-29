import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, Toast as ToastType, ToastType as TType } from '../../hooks/useToast';

const toastConfig: Record<TType, { icon: React.ReactNode; styles: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    styles: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    styles: 'bg-red-500/20 border-red-500/40 text-red-300',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    styles: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    styles: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  },
};

const ToastItem: React.FC<{ toast: ToastType; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  const config = toastConfig[toast.type];

  return (
    <div
      className={`
        flex items-start gap-3 min-w-[320px] max-w-md
        backdrop-blur-md border rounded-xl p-4
        shadow-2xl shadow-black/40
        animate-in slide-in-from-right-5 duration-300
        ${config.styles}
      `}
    >
      <span className="flex-shrink-0 mt-0.5">{config.icon}</span>
      <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};