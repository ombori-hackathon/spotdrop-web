import axios from 'axios';
import type { Spot, SpotsResponse, TokenResponse, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post<TokenResponse>(`${API_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (email: string, password: string, username: string): Promise<User> => {
    const response = await api.post<User>('/auth/register', { email, password, username });
    return response.data;
  },
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', { email, password });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};

export const spotsApi = {
  list: async (params?: {
    page?: number;
    size?: number;
    category?: string;
    min_rating?: number;
  }): Promise<SpotsResponse> => {
    const response = await api.get<SpotsResponse>('/spots', { params });
    return response.data;
  },
  get: async (id: number): Promise<Spot> => {
    const response = await api.get<Spot>(`/spots/${id}`);
    return response.data;
  },
  create: async (data: Partial<Spot>): Promise<Spot> => {
    const response = await api.post<Spot>('/spots', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Spot>): Promise<Spot> => {
    const response = await api.patch<Spot>(`/spots/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/spots/${id}`);
  },
  uploadImage: async (spotId: number, file: File, isPrimary = false): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/spots/${spotId}/images?is_primary=${isPrimary}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
