export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// API Configuration
export const API_CONFIG = {
  BASE_URL: BACKEND_URL,
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    
    // URLs endpoints
    URLS: '/api/urls',
    URL_BY_ID: (id: string) => `/api/urls/${id}`,
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};