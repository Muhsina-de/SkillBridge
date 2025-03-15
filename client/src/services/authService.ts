import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const signUp = async (userData: FormData) => {
  const response = await axios.post(`${API_URL}/signup`, userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};
