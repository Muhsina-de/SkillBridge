import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { Review, ReviewSubmission } from '../types/reviews';
import { validateReviews } from '../utils/validation';

const reviewService = {
  getReviewsByMentor: async (mentorId: number): Promise<Review[]> => {
    try {
      const response = await axios.get<unknown>(
        `${API_BASE_URL}${API_ENDPOINTS.REVIEWS.GET_BY_MENTOR(mentorId)}`
      );
      return validateReviews(response.data);
    } catch (error) {
      console.error('Error fetching mentor reviews:', error);
      throw error;
    }
  },

  getReviewBySession: async (sessionId: number): Promise<Review | null> => {
    try {
      const response = await axios.get<unknown>(
        `${API_BASE_URL}${API_ENDPOINTS.REVIEWS.GET_BY_SESSION(sessionId)}`
      );
      const reviews = validateReviews([response.data]);
      return reviews[0] || null;
    } catch (error) {
      console.error('Error fetching session review:', error);
      throw error;
    }
  },

  submitReview: async (reviewData: ReviewSubmission): Promise<Review> => {
    try {
      const response = await axios.post<Review>(
        `${API_BASE_URL}${API_ENDPOINTS.REVIEWS.SUBMIT}`,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  updateReview: async (reviewId: number, data: Partial<ReviewSubmission>): Promise<Review> => {
    try {
      const response = await axios.put<Review>(
        `${API_BASE_URL}${API_ENDPOINTS.REVIEWS.UPDATE(reviewId)}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    try {
      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.REVIEWS.DELETE(reviewId)}`
      );
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};
export default reviewService; 