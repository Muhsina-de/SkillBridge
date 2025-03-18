// API Configuration
export const API_CONFIG = {
  BASE_URL: '',  // Empty because we're using Vite's proxy
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
    }
  }
};

export const getApiUrl = (endpoint: string) => endpoint; // Just return the endpoint since we're using the proxy 