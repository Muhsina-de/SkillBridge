import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Welcome, {user?.username}!</h2>
          <p className="text-gray-600">You are logged in as a {user?.role}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Quick Actions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Quick Actions</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/mentors"
                  className="text-blue-600 hover:text-blue-800 block"
                >
                  Browse Mentors
                </Link>
              </li>
              <li>
                <Link
                  to="/trending"
                  className="text-blue-600 hover:text-blue-800 block"
                >
                  Trending Repositories
                </Link>
              </li>
              {user?.role === 'mentee' && (
                <li>
                  <Link
                    to="/reviews"
                    className="text-blue-600 hover:text-blue-800 block"
                  >
                    My Reviews
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Profile Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Profile Information</h3>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Email:</strong> {user?.email}</li>
              <li><strong>Role:</strong> {user?.role}</li>
              <li><strong>ID:</strong> {user?.id}</li>
            </ul>
          </div>

          {/* Stats or Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Activity</h3>
            <p className="text-gray-600">
              {user?.role === 'mentor' 
                ? 'Start mentoring by browsing available sessions.'
                : 'Find a mentor to help you grow your skills.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 