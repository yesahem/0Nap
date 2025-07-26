'use client';

import { create } from 'zustand';
import { AuthState, SignInCredentials, SignUpCredentials } from '@/types/auth';
import { authApi } from '@/services/api';

interface AuthStore extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  currentToken: string | null;
}

// Helper functions for sessionStorage token management
const getTokenFromSession = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('auth-token');
};

const setTokenInSession = (token: string): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('auth-token', token);
};

const removeTokenFromSession = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('auth-token');
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  currentToken: getTokenFromSession(), // Initialize from sessionStorage

  signIn: async (credentials: SignInCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authApi.login(credentials);
      
      // Store token in sessionStorage and memory
      setTokenInSession(response.token);
      set({
        currentToken: response.token,
        user: {
          id: 'temp',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
            } catch (error: unknown) {
          let errorMessage = 'Sign in failed';
          if (error && typeof error === 'object') {
            const err = error as { response?: { data?: { error?: string } }; message?: string };
            errorMessage = err.response?.data?.error || err.message || 'Sign in failed';
          }
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
      const registrationResponse = await authApi.register({
        fullName: credentials.fullName,
        email: credentials.email,
        password: credentials.password,
      });
      
      const loginResponse = await authApi.login({
        email: credentials.email,
        password: credentials.password,
      });
      
      // Store token in sessionStorage and memory
      setTokenInSession(loginResponse.token);
      set({
        currentToken: loginResponse.token,
        user: {
          id: registrationResponse.id,
          email: registrationResponse.email,
          name: registrationResponse.fullName,
          createdAt: new Date(registrationResponse.createdAt),
          updatedAt: new Date(registrationResponse.updatedAt),
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
          } catch (error: unknown) {
        let errorMessage = 'Sign up failed';
        if (error && typeof error === 'object') {
          const err = error as { response?: { data?: { error?: string } }; message?: string };
          errorMessage = err.response?.data?.error || err.message || 'Sign up failed';
        }
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  signOut: () => {
    // Clear token from sessionStorage and memory
    removeTokenFromSession();
    set({
      currentToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuth: async () => {
    // Get token from sessionStorage (in case of page reload)
    const sessionToken = getTokenFromSession();
    const { currentToken } = get();
    
    // Use sessionStorage token if memory token is missing
    const tokenToCheck = currentToken || sessionToken;
    
    if (!tokenToCheck) {
      set({ isAuthenticated: false, user: null, currentToken: null });
      return;
    }

    // Update memory with sessionStorage token if needed
    if (!currentToken && sessionToken) {
      set({ currentToken: sessionToken });
    }

    // Verify token with backend by trying to fetch URLs using our API service
    try {
      set({ isLoading: true });
      
      // Import urlsApi dynamically to avoid circular dependency
      const { urlsApi } = await import('@/services/api');
      
      // This will automatically use the token from auth store via interceptor
      await urlsApi.getUrls();
      
      // Token is valid, keep authenticated state
      set({ isAuthenticated: true, isLoading: false });
    } catch {
      // Token is invalid, clear auth state and sessionStorage
      removeTokenFromSession();
      set({
        currentToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Initialize auth state from sessionStorage on app start
  initializeAuth: async () => {
    const sessionToken = getTokenFromSession();
    if (sessionToken) {
      // Set token in memory and check if it's valid
      set({ currentToken: sessionToken });
      // checkAuth will validate the token with backend
      const store = get();
      await store.checkAuth();
    }
  },
})); 