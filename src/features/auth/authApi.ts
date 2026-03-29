import axiosInstance from '../../services/axiosInstance';
import { ApiResponse, LoginCredentials, RegisterCredentials, User } from '../../types';

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<any>(
      '/auth/login',
      credentials
    );
    return { user: data.user, token: data.token };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<any>(
      '/auth/register',
      credentials
    );
    return { user: data.user, token: data.token };
  },

  getProfile: async (): Promise<User> => {
    const { data } = await axiosInstance.get<ApiResponse<User>>('/auth/profile');
    return data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
};