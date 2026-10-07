'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', token);
        }
        set({ user, accessToken: token, isAuthenticated: true });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { user, accessToken } = res.data.data;
          get().setAuth(user, accessToken);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', data);
          const { user, accessToken } = res.data.data;
          get().setAuth(user, accessToken);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // silently fail
        } finally {
          get().clearAuth();
        }
      },

      refreshUser: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.data });
        } catch {
          get().clearAuth();
        }
      },
    }),
    {
      name: 'carebridge-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
