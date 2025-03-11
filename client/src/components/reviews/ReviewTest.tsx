import React from 'react';
import { useReviews } from '../../hooks/useReviews';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewSummary from './ReviewSummary';

const ReviewTest: React.FC = () => {
  // Using mentor ID 1 (JohnDoe) from our seed data
  const { reviews, loading, error, submitReview } = useReviews(1);

  const handleSubmitReview = async (data: {
    rating: number;
    comment: string;
  }) => {
    try {
      console.log('Submitting review with data:', {
        sessionId: 1,
        menteeId: 2,
        mentorId: 1,
        ...data
      });
      
      // Using session ID 1 and mentee ID 2 (JaneSmith) from our seed data
      await submitReview({
        sessionId: 1,
        menteeId: 2,
        ...data
      });
      alert('Review submitted successfully!');
    } catch (err: any) {
      alert(`Failed to submit review: ${err.response?.data?.error || err.message}`);
      console.error('Review submission error:', err.response?.data || err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Ensure we have a valid array of reviews with complete mentee data
  const validReviews = Array.isArray(reviews) 
    ? reviews.filter(review => review.mentee && review.mentee.id && review.mentee.username)
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Review System Test</h1>
      
      {/* Review Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Review Summary</h2>
        <ReviewSummary reviews={validReviews} />
      </div>

      {/* Review Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Submit a Review</h2>
        <ReviewForm
          mentorId={1}
          menteeId={2}
          sessionId={1}
          onSubmit={handleSubmitReview}
        />
      </div>

      {/* Review List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Reviews</h2>
        <ReviewList reviews={validReviews} />
      </div>
    </div>
  );
};

export default ReviewTest; 