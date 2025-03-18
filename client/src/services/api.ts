import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

// User-related API calls
export const fetchUserReviews = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

export const fetchUserSessions = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sessions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
};
