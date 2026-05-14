import axios from '@/lib/axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

const normalizeResponse = (response: any): any => {
  if (response == null) return response;
  if (typeof response === 'object' && 'data' in response) {
    return normalizeResponse(response.data);
  }
  return response;
};

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post('/auth/authenticate', data);
    const authData = normalizeResponse(response);
    const user = authData?.user;
    const accessToken = authData?.accessToken;
    const refreshToken = authData?.refreshToken;

    if (!user || !accessToken) {
      throw new Error('Invalid login response from server.');
    }

    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(user));
    return authData;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post('/auth/register', data);
    return normalizeResponse(response);
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
