import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserProfileCard from '../components/profile/UserProfileCard';
import mentorService, { Mentor } from '../services/mentorService';

const MentorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await mentorService.getAllMentors();
        setMentors(data);
      } catch (err) {
        setError('Failed to load mentors. Please try again later.');
        console.error('Error fetching mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Filter mentors based on search and skills
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => mentor.skills.includes(skill));
    return matchesSearch && matchesSkills;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading mentors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Mentor</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search mentors..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Add skill filter dropdown here */}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <div key={mentor.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={mentor.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={mentor.username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="ml-4">
                    <Link to={`/mentor/${mentor.id}`} className="block">
                      <h3 className="text-xl font-semibold text-gray-900">{mentor.username}</h3>
                    </Link>
                    <div className="flex items-center mt-1">
                      <Link 
                        to={`/reviews?mentorId=${mentor.id}`}
                        className="flex items-center text-gray-600 hover:text-blue-600"
                      >
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span>{mentor.rating || 'No ratings yet'}</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio || 'No bio available'}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <Link
                  to={`/mentor/${mentor.id}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  View Profile & Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorsPage; 