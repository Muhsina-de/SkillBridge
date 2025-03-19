import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User-related API calls
export const fetchUserReviews = async (userId: string) => {
  try {
    const response = await api.get(`/api/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

export const fetchUserSessions = async (userId: string) => {
  try {
    const response = await api.get(`/api/sessions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
};

export default api;