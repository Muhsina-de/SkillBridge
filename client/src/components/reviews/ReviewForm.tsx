import { useState, FormEvent } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

interface ReviewFormData {
  mentorId: number;
  menteeId: number;
  sessionId: number;
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  mentorId: number;
  menteeId: number;
  sessionId: number;
  onSubmit: (data: ReviewFormData) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ mentorId, menteeId, sessionId, onSubmit }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    mentorId,
    menteeId,
    sessionId,
    rating: 0,
    comment: ''
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('Please provide a comment with at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({ ...formData, rating: 0, comment: '' });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const ratingValue = index + 1;
      const isHovered = hoveredRating >= ratingValue;
      const isSelected = formData.rating >= ratingValue;

      return (
        <button
          key={index}
          type="button"
          className="focus:outline-none"
          onClick={() => setFormData({ ...formData, rating: ratingValue })}
          onMouseEnter={() => setHoveredRating(ratingValue)}
          onMouseLeave={() => setHoveredRating(0)}
          aria-label={`Rate ${ratingValue} out of 5 stars`}
        >
          {isHovered || isSelected ? (
            <StarIcon className="w-8 h-8 text-yellow-400" />
          ) : (
            <StarOutline className="w-8 h-8 text-gray-400 hover:text-yellow-400" />
          )}
        </button>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Rate Your Session</h3>
      
      {/* Rating Stars */}
      <div className="space-y-2">
        <label id="rating-label" className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <div className="flex space-x-1" role="group" aria-labelledby="rating-label">
          {renderStars()}
        </div>
        <p className="text-sm text-gray-500">
          {hoveredRating ? 
            ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoveredRating - 1] :
            formData.rating ? 
              ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][formData.rating - 1] :
              'Select your rating'
          }
        </p>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700">
          Review
        </label>
        <textarea
          id="review-comment"
          name="review-comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={4}
          className={`mt-1 block w-full rounded-md shadow-sm p-2 
            border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
          placeholder="Share your experience with this mentor..."
          required
          aria-describedby="comment-description"
        />
        <div className="flex justify-between items-center">
          <p id="comment-description" className={`text-sm ${
            formData.comment.length < 10 ? 'text-red-500' : 'text-green-600'
          }`}>
            {formData.comment.length} / 10 characters minimum
          </p>
          <p className="text-sm text-gray-500">
            {formData.comment.length === 0 
              ? 'Start typing...' 
              : formData.comment.length < 10 
                ? `${10 - formData.comment.length} more characters needed` 
                : '✓ Minimum length met'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className={`btn btn-primary px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Review'
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm; 