import { Review } from '../types/reviews';

export const isValidRating = (rating: unknown): rating is number => {
  return typeof rating === 'number' && rating >= 1 && rating <= 5;
};

export const isValidReview = (review: unknown): review is Review => {
  if (!review || typeof review !== 'object') return false;
  
  const r = review as Partial<Review>;
  return (
    typeof r.id === 'number' &&
    typeof r.sessionId === 'number' &&
    typeof r.menteeId === 'number' &&
    typeof r.mentorId === 'number' &&
    isValidRating(r.rating) &&
    typeof r.comment === 'string' &&
    r.comment.length >= 10
  );
};

export const validateReviews = (reviews: unknown): Review[] => {
  if (!Array.isArray(reviews)) return [];
  return reviews.filter(isValidReview);
}; 