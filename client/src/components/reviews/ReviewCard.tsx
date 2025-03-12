import { StarIcon } from '@heroicons/react/24/solid';
import { ReviewCardProps } from '../../types/reviews';

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`w-5 h-5 ${
          index < review.rating ? 'text-yellow-400' : 'text-gray-200'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Header: User info and date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {review.mentee ? (
            <>
              {review.mentee.profilePicture ? (
                <img
                  src={review.mentee.profilePicture}
                  alt={review.mentee.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {review.mentee.username.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{review.mentee.username}</p>
                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
              </div>
            </>
          ) : (
            <div>
              <p className="font-medium text-gray-900">Anonymous User</p>
              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {renderStars()}
          <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
        </div>
      </div>

      {/* Review Content */}
      <div className="text-gray-700">
        <p className="whitespace-pre-line">{review.comment}</p>
      </div>

      {/* Optional: Helpful/Report buttons */}
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>Helpful</span>
        </button>
        <button className="text-sm text-gray-500 hover:text-gray-700">
          Report
        </button>
      </div>
    </div>
  );
};

export default ReviewCard; 