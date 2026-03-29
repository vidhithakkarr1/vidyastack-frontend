import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Simple module-level store
let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const notify = () => listeners.forEach((l) => l([...toasts]));

export const toastService = {
  show: (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2);
    const toast: Toast = { id, message, type, duration };
    toasts = [...toasts, toast];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, duration);
  },
  success: (message: string) => toastService.show(message, 'success'),
  error: (message: string) => toastService.show(message, 'error'),
  warning: (message: string) => toastService.show(message, 'warning'),
  info: (message: string) => toastService.show(message, 'info'),
};

export const useToastStore = (): ToastStore => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  const subscribe = useCallback(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    toasts: currentToasts,
    addToast: (message, type, duration) => toastService.show(message, type, duration),
    removeToast: (id) => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    },
  };
};