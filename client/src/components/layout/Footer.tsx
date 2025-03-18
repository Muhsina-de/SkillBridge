import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">SkillBridge</h3>
            <p className="text-gray-300 text-sm">
              Connecting mentors and mentees for professional growth and development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white text-sm">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/signin" className="text-gray-300 hover:text-white text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">
                Email: support@skillbridge.com
              </li>
              <li className="text-gray-300 text-sm">
                Phone: (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300 text-sm">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 