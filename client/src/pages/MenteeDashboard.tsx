import React, { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Session {
  id: number;
  mentor?: {
    id: number;
    username: string;
    email: string;
  };
  startTime: string;
  status: string;
}

interface FavoriteMentor {
  mentor_id: number;
  reviewCount: number;
  averageRating: number;
  mentor: {
    id: number;
    username: string;
    email: string;
  };
}

interface DashboardData {
  upcomingSessions: Session[];
  favoriteMentors: FavoriteMentor[];
  pendingReviews: Session[];
  learningProgress: {
    date: string;
    sessionCount: number;
  }[];
}

const MenteeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.getMenteeDashboard() as DashboardData;
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!dashboardData) {
    return <ErrorDisplay message="No dashboard data available" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Mentee Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome, {user?.username}!</h2>
              <p className="text-purple-100">You are logged in as a mentee</p>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-purple-50 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                <Link to="/sessions" className="text-purple-600 hover:text-purple-800">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardData.upcomingSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.mentor?.username}`}
                            alt={session.mentor?.username}
                            className="h-8 w-8 rounded-full"
                          />
                          <h3 className="font-medium">{session.mentor?.username}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(session.startTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button className="btn btn-primary btn-sm">Join Session</button>
                        <button className="btn btn-secondary btn-sm">Reschedule</button>
                      </div>
                    </div>
                  </div>
                ))}
                {dashboardData.upcomingSessions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No upcoming sessions</p>
                    <Link to="/mentors" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">
                      Find a mentor to get started
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Mentors */}
            <div className="bg-purple-50 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Favorite Mentors</h2>
                <Link to="/mentors" className="text-purple-600 hover:text-purple-800">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.favoriteMentors.map(({ mentor_id, mentor, reviewCount, averageRating }) => (
                  <div key={mentor_id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.username}`}
                      alt={mentor.username}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{mentor.username}</h3>
                      <div className="flex items-center mt-1">
                        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">
                          {averageRating.toFixed(1)} ({reviewCount} reviews)
                        </span>
                      </div>
                      <Link 
                        to={`/mentors/${mentor_id}`}
                        className="text-purple-600 hover:text-purple-800 text-sm mt-2 inline-block"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
                {dashboardData.favoriteMentors.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500">No favorite mentors yet</p>
                    <Link to="/mentors" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">
                      Find mentors to connect with
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Learning Progress */}
            <div className="bg-purple-50 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
                <Link to="/progress" className="text-purple-600 hover:text-purple-800">
                  View Details
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardData.learningProgress.map((progress) => (
                  <div key={progress.date}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(progress.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {progress.sessionCount} sessions
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((progress.sessionCount / 5) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {dashboardData.learningProgress.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No learning progress yet</p>
                    <Link to="/mentors" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">
                      Start learning with a mentor
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Pending Reviews */}
            {dashboardData.pendingReviews.length > 0 && (
              <div className="bg-purple-50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Reviews</h2>
                <div className="space-y-4">
                  {dashboardData.pendingReviews.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.mentor?.username}`}
                          alt={session.mentor?.username}
                          className="h-8 w-8 rounded-full"
                        />
                        <h3 className="font-medium">{session.mentor?.username}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                      <button className="btn btn-primary btn-sm w-full">Write Review</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-purple-50 rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link to="/mentors" className="block text-lg text-purple-600 hover:text-purple-800 hover:underline">
                  Find New Mentor
                </Link>
                <Link to="/sessions" className="block text-lg text-purple-600 hover:text-purple-800 hover:underline">
                  View All Sessions
                </Link>
                <Link to="/forum" className="block text-lg text-purple-600 hover:text-purple-800 hover:underline">
                  Visit Forum
                </Link>
                <Link to="/profile" className="block text-lg text-purple-600 hover:text-purple-800 hover:underline">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard; 