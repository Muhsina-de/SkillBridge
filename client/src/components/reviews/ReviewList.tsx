import React from 'react';
import { ReviewListProps } from '../../types/reviews';
import ReviewCard from './ReviewCard';

const ReviewList: React.FC<ReviewListProps> = ({ reviews = [] }) => {
  if (!Array.isArray(reviews)) {
    return (
      <div className="text-gray-500 text-center py-4">
        No reviews available
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No reviews yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList; 