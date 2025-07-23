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

// URLs API calls
export const urlsApi = {
  // Get all URLs for authenticated user
  getUrls: async (token: string): Promise<BackendUrl[]> => {
    const response: AxiosResponse<BackendUrl[]> = await api.get(
      API_CONFIG.ENDPOINTS.URLS,
      {
        headers: getAuthHeaders(token),
      }
    );
    return response.data;
  },

  // Add new URL
  addUrl: async (token: string, data: { url: string; interval: number }): Promise<BackendUrl> => {
    const response: AxiosResponse<BackendUrl> = await api.post(
      API_CONFIG.ENDPOINTS.URLS,
      data,
      {
        headers: getAuthHeaders(token),
      }
    );
    return response.data;
  },

  // Delete URL
  deleteUrl: async (token: string, urlId: string): Promise<void> => {
    await api.delete(
      API_CONFIG.ENDPOINTS.URL_BY_ID(urlId),
      {
        headers: getAuthHeaders(token),
      }
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