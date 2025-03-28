import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfileCard from '../components/profile/UserProfileCard';
import SessionBookingForm from '../components/sessions/SessionBookingForm';
import mentorService, { Mentor } from '../services/mentorService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { REVIEW_ENDPOINTS } from '../constants/api';
import axios from 'axios';
import ReviewList from '../components/reviews/ReviewList';
import { Review } from '../types/reviews';

const MentorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleBookingSubmit = async (formData: any): Promise<void> => {
    // This will be replaced with actual API call later
    console.log('Booking submitted:', formData);
    return Promise.resolve();
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Profile */}
          <div className="lg:col-span-1">
            <div className="max-w-md mx-auto">
              <UserProfileCard user={mentor} showBookingButton={false} />
            </div>
          </div>

          {/* Right column - Booking Form */}
          <div className="lg:col-span-1">
            <SessionBookingForm 
              menteeId={user?.id || 0}
              mentorId={mentor.id}
              onSubmit={handleBookingSubmit}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default MentorProfile; 