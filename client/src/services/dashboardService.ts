import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:3001/api/dashboard',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const getMentorDashboard = async () => {
  try {
    const response = await api.get('/mentor');
    return response.data;
  } catch (error) {
    console.error('Error fetching mentor dashboard:', error);
    throw error;
  }
};

export const getMenteeDashboard = async () => {
  try {
    const response = await api.get('/mentee');
    return response.data;
  } catch (error) {
    console.error('Error fetching mentee dashboard:', error);
    throw error;
  }
};

export default {
  getMentorDashboard,
  getMenteeDashboard
}; 