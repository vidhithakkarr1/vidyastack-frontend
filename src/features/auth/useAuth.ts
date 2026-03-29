import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from './authApi';
import { useAuthStore } from './authStore';
import { LoginCredentials, RegisterCredentials } from '../../types';
import { ROUTES } from '../../constants';
import { toastService } from '../../hooks/useToast';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      if (user.role === 'student') navigate(ROUTES.DASHBOARD);
      else if (user.role === 'tutor') navigate(ROUTES.TUTOR_DASHBOARD);
      else if (user.role === 'admin') navigate(ROUTES.ADMIN_DASHBOARD);
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      if (user.role === 'student') navigate(ROUTES.DASHBOARD);
      else navigate(ROUTES.TUTOR_DASHBOARD);
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate(ROUTES.LOGIN);
    }
  };

  return { logout };
};