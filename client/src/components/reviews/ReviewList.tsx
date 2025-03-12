import { useState } from 'react';
import ReviewCard from './ReviewCard';
import { Review, ReviewListProps } from '../../types/reviews';

const ReviewList: React.FC<ReviewListProps> = ({ reviews, mentorId }) => {
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const sortedAndFilteredReviews = () => {
    let filtered = reviews;

    // Filter by mentor if mentorId is provided
    if (mentorId) {
      filtered = filtered.filter(review => review.mentorId === mentorId);
    }

    // Apply rating filter
    if (filterRating) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.rating - a.rating;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by:</label>
          <div className="flex space-x-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterRating === rating
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {rating} ★
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')}
            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedAndFilteredReviews().map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        
        {sortedAndFilteredReviews().length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {filterRating 
                ? `No ${filterRating}-star reviews yet`
                : 'No reviews yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList; 