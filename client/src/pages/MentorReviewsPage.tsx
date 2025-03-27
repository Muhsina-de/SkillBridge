import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfileCard from '../components/profile/UserProfileCard';
import mentorService, { Mentor } from '../services/mentorService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { REVIEW_ENDPOINTS } from '../constants/api';
import axios from 'axios';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import { Review } from '../types/reviews';

const MentorReviewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchMentorAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          throw new Error('Mentor ID is required');
        }

        // Fetch mentor data
        const mentorData = await mentorService.getMentorById(parseInt(id, 10));
        if (!mentorData) {
          throw new Error('Mentor not found');
        }
        setMentor(mentorData);

        // Fetch reviews
        const token = localStorage.getItem('token');
        const reviewsResponse = await axios.get<Review[]>(
          REVIEW_ENDPOINTS.GET_MENTOR_REVIEWS(parseInt(id, 10)),
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load mentor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorAndReviews();
  }, [id]);

  const handleReviewSubmit = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<Review>(
        REVIEW_ENDPOINTS.CREATE_REVIEW,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setReviews([response.data, ...reviews]);
    } catch (err) {
      console.error('Error submitting review:', err);
      throw err;
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'rating') {
      return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    } else {
      return sortOrder === 'desc' 
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorDisplay message="Mentor not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews for {mentor.username}</h1>
          <p className="mt-2 text-gray-600">See what others have to say about their mentoring experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile */}
          <div className="lg:col-span-1">
            <UserProfileCard user={mentor} />
          </div>

          {/* Right column - Reviews */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Review Form Section */}
              {user && user.role === 'mentee' && (
                <div className="mb-8 border-b pb-8">
                  <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-3xl text-yellow-500">★</span>
                      <span className="text-3xl text-yellow-500">★</span>
                      <span className="text-3xl text-yellow-500">★</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Share Your Experience</h3>
                    <p className="text-gray-600 mt-1">Your feedback helps others make informed decisions</p>
                  </div>
                  <ReviewForm
                    mentorId={mentor.id}
                    menteeId={user.id}
                    sessionId={1} // This should come from the completed session
                    onSubmit={handleReviewSubmit}
                  />
                </div>
              )}

              {/* Reviews List Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">All Reviews</h3>
                  <div className="flex space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'rating' | 'date')}
                      className="px-3 py-1 border rounded-md"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="rating">Sort by Rating</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                      className="px-3 py-1 border rounded-md hover:bg-gray-50"
                    >
                      {sortOrder === 'desc' ? '↓' : '↑'}
                    </button>
                  </div>
                </div>

                <ReviewList reviews={sortedReviews} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorReviewsPage; 