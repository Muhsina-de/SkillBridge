import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-white font-bold text-xl">SkillBridge</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/mentors"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/mentors')}`}
                    >
                      Mentors
                    </Link>
                    <Link
                      to="/trending"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/trending')}`}
                    >
                      Trending
                    </Link>
                    {user?.role === 'mentee' && (
                      <Link
                        to="/reviews"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/reviews')}`}
                      >
                        Reviews
                      </Link>
                    )}
                  </>
                ) : (
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                  >
                    Home
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm">
                    {user?.username} ({user?.role})
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/signin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/signin')}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link
                to="/mentors"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/mentors')}`}
              >
                Mentors
              </Link>
              <Link
                to="/trending"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/trending')}`}
              >
                Trending
              </Link>
              {user?.role === 'mentee' && (
                <Link
                  to="/reviews"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/reviews')}`}
                >
                  Reviews
                </Link>
              )}
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/signin')}`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
