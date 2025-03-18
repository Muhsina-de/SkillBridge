import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import TopicCard from '../components/forums/TopicCard';
import { API_BASE_URL } from '../constants/api';
const ForumPage: React.FC = () => {
  interface Topic {
    id: number;
    title: string;
    content: string;
    category: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
  }

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/forum/topics`);
        setTopics(response.data as Topic[]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load topics');
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) return <div className="text-center py-8">Loading forum topics...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
        {user && (
          <Link
            to="/forum/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            New Topic
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {topics.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm">
            No topics yet. Be the first to start a discussion!
          </div>
        ) : (
          topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)
        )}
      </div>
    </div>
  );
};

export default ForumPage;