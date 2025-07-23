'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, SignInCredentials, SignUpCredentials } from '@/types/auth';
import { authApi } from '@/services/api';

interface AuthStore extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (credentials: SignInCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login(credentials);
          
          // Store token in localStorage
          localStorage.setItem('auth-token', response.token);
          
          // Since login doesn't return user data, create minimal user from email
          const user: User = {
            id: 'temp',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = (error && typeof error === 'object' && 'response' in error) 
            ? ((error as Record<string, any>).response?.data?.message || (error as Record<string, any>).message) 
            : 'Sign in failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Register with email.fullName and password only (backend use fullName/confirmPassword)
          const registrationResponse = await authApi.register({
            fullName: credentials.fullName,
            email: credentials.email,
            password: credentials.password,
          });
          
          console.log('Registration response:', registrationResponse); // Debug log
          
          // Backend doesn't return token with registration, so login after registration
          const loginResponse = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          });
          
          console.log('Login response:', loginResponse); // Debug log
          
          // Store token in localStorage
          localStorage.setItem('auth-token', loginResponse.token);
          
          // Use registration response as user data (login only returns token)
          const user: User = {
            id: registrationResponse.id,
            email: registrationResponse.email,
            name: registrationResponse.fullName,
            createdAt: new Date(registrationResponse.createdAt),
            updatedAt: new Date(registrationResponse.updatedAt),
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          console.error('Signup error:', error); // Debug log
          const errorMessage = (error && typeof error === 'object' && 'response' in error) 
            ? ((error as Record<string, any>).response?.data?.message || (error as Record<string, any>).message) 
            : 'Sign up failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      signOut: () => {
        localStorage.removeItem('auth-token');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Token exists, check if there's a stored user
          const { user } = get();
          if (user) {
            set({ isAuthenticated: true });
          } else {
            // Token exists but no user data, sign out
            localStorage.removeItem('auth-token');
            set({ isAuthenticated: false });
          }
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 