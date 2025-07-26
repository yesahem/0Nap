import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, getAuthHeaders } from '@/config';
import { SignInCredentials, User } from '@/types/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get current token from auth store or sessionStorage
const getCurrentToken = (): string | null => {
  // Import dynamically to avoid circular dependencies
  try {
    const { useAuthStore } = require('@/store/authStore');
    const store = useAuthStore.getState();
    
    // Return token from store if available
    if (store.currentToken) {
      return store.currentToken;
    }
    
    // Fallback to sessionStorage (for page reload scenarios)
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth-token');
    }
    
    return null;
  } catch {
    // Final fallback to sessionStorage if store is not available
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth-token');
    }
    return null;
  }
};

// Request interceptor to automatically add Bearer token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get 401 Unauthorized, clear auth state
    if (error.response?.status === 401) {
      try {
        const { useAuthStore } = require('@/store/authStore');
        const store = useAuthStore.getState();
        store.signOut();
      } catch {
        // Handle error silently if auth store is not available
      }
    }
    return Promise.reject(error);
  }
);

// Types for backend responses
export interface BackendUser {
  id: string;
  fullName  : string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendUrl {
  id: string;
  url: string;
  interval: number;
  pingCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Note: Backend currently doesn't provide lastPingedAt timestamp
  // This should be added to backend to show accurate last ping times
  lastPingedAt?: string;
  isActive?: boolean; // May not be provided by backend initially
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Auth API calls
export const authApi = {
  // Register user
  register: async (credentials: { email: string; password: string; fullName : string }): Promise<RegisterResponse> => {
    const response: AxiosResponse<RegisterResponse> = await api.post(
      API_CONFIG.ENDPOINTS.REGISTER,
      credentials
    );
    return response.data;
  },

  // Login user
  login: async (credentials: SignInCredentials): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  },
};

// URLs API calls (token now added automatically by interceptor)
export const urlsApi = {
  // Get all URLs for authenticated user
  getUrls: async (): Promise<BackendUrl[]> => {
    const response: AxiosResponse<BackendUrl[]> = await api.get(
      API_CONFIG.ENDPOINTS.URLS
    );
    return response.data;
  },

  // Add new URL
  addUrl: async (data: { url: string; interval: number }): Promise<BackendUrl> => {
    const response: AxiosResponse<BackendUrl> = await api.post(
      API_CONFIG.ENDPOINTS.URLS,
      data
    );
    return response.data;
  },

  // Delete URL
  deleteUrl: async (urlId: string): Promise<void> => {
    await api.delete(
      API_CONFIG.ENDPOINTS.URL_BY_ID(urlId)
    );
  },
};

// Helper functions to transform backend data to frontend types
export const transformBackendUser = (backendUser: BackendUser): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.fullName, // Use fullName from backend
    createdAt: new Date(backendUser.createdAt),
    updatedAt: new Date(backendUser.updatedAt),
  };
};

export const transformBackendUrl = (backendUrl: BackendUrl) => {
  return {
    id: backendUrl.id,
    url: backendUrl.url,
    interval: `${backendUrl.interval}min`, // Convert minutes to string format
    status: (backendUrl.isActive !== false) ? 'active' : 'paused', // Default to active if not specified
    createdAt: new Date(backendUrl.createdAt),
    updatedAt: new Date(backendUrl.updatedAt),
    lastPing: backendUrl.lastPingedAt ? new Date(backendUrl.lastPingedAt) : undefined,
    nextPing: undefined, // Backend doesn't provide this, we can calculate if needed
    pingCount: backendUrl.pingCount,
  };
}; 