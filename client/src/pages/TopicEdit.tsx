import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api'; // Adjust the path as needed
import { useAuth } from '../context/AuthContext';

const EditTopic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
const {user} = useAuth();
  // Fetch topic details on mount
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/forum/topics/${id}`);
        const data : any = response.data;
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      } catch (err) {
        setError('Failed to fetch topic details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log("TOKEN<<>>", token);
      await axios.put(
        `${API_BASE_URL}/api/forum/topics/${id}?userId=${user?.id}`,
        { title, content, category },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      navigate(`/forum/topics/${id}`);
    } catch (err) {
      setError('Failed to update topic. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading topic details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <h1 className="text-2xl font-bold text-center mb-6">Edit Topic</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Career Advice">Career Advice</option>
            <option value="General Discussion">General Discussion</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Topic'}
        </button>
      </form>
    </div>
  );
};

export default EditTopic;
