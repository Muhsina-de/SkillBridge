import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import { Review, ReviewSubmission } from '../types/reviews';
interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  submitReview: (data: Omit<ReviewSubmission, 'mentorId'>) => Promise<Review>;
}

export const useReviews = (mentorId: number): UseReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only fetch reviews - we'll calculate summary in the component
        const reviewsData = await reviewService.getReviewsByMentor(mentorId);
        
        if (!isMounted) return;

        if (!Array.isArray(reviewsData)) {
          throw new Error('Invalid reviews data received');
        }

        setReviews(reviewsData);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error fetching reviews:', err);
        setError(err.message || 'Failed to fetch reviews');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [mentorId]);

  const submitReview = async (reviewData: Omit<ReviewSubmission, 'mentorId'>) => {
    try {
      const newReview = await reviewService.submitReview({
        ...reviewData,
        mentorId
      });
      
      // Update the reviews list with the new review
      setReviews(prev => [newReview, ...prev]);
      
      return newReview;
    } catch (err: any) {
      console.error('Error submitting review:', err);
      throw err;
    }
  };

  return { reviews, loading, error, submitReview };
}; 