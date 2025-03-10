import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

interface ReviewSummaryProps {
  reviews: Array<{
    rating: number;
  }>;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ reviews }) => {
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  const calculateRatingDistribution = () => {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });
    return distribution;
  };

  const averageRating = calculateAverageRating();
  const distribution = calculateRatingDistribution();
  const totalReviews = reviews.length;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const value = index + 0.5;
      return (
        <span key={index}>
          {rating >= index + 1 ? (
            <StarIcon className="w-5 h-5 text-yellow-400" />
          ) : rating >= value ? (
            <StarIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarOutline className="w-5 h-5 text-gray-300" />
          )}
        </span>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Review Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
            <div>
              <div className="flex">{renderStars(averageRating)}</div>
              <p className="text-sm text-gray-500 mt-1">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {([5, 4, 3, 2, 1] as const).map((rating) => {
            const count = distribution[rating];
            const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center text-sm">
                <span className="w-12">{rating} star</span>
                <div className="flex-1 mx-3">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-gray-500">
                  {count} ({Math.round(percentage)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary; 