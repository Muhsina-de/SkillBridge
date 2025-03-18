import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import TopicCard from './TopicCard';
import { ForumTopic } from '../../types/forum.types';

const Forums: React.FC = () => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'comments'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 10;

  // Fetch topics when component mounts
  useEffect(() => {
    
    const fetchTopics = async () => {
       try {
         setLoading(true);
         const response = await axios.get<ForumTopic[]>(`${API_BASE_URL}/api/forum/topics`);
         setTopics(response.data);
         setError('');
       } catch (err) {
         setError('Failed to load topics. Please try again later.');
       } finally {
         setLoading(false);
      }
    };
     fetchTopics();
  
    // Instead, use mock data
    const mockTopics = [
      {
        id: 1,
        title: "Getting Started with React",
        content: "What resources do you recommend for beginners?",
        category: "Frontend Development",
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        User: { username: "reactLearner", profilePicture: null },
        Comments: []
      },
      {
        id: 2,
        title: "Best Practices for API Design",
        content: "I'm building my first REST API. Any tips?",
        category: "Backend Development",
        userId: 2,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        User: { username: "apiDeveloper", profilePicture: null },
        Comments: [{id: 1, content: "Sample comment", createdAt: new Date().toISOString()}]
      }
    ];
  
    setTopics(mockTopics);
    setLoading(false);
  }, []);  
  // Filter topics based on search term and category
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort topics based on selected sort option
  const sortedAndFilteredTopics = filteredTopics.sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (b.Comments?.length || 0) - (a.Comments?.length || 0);
    }
  });

  // Pagination logic
  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = sortedAndFilteredTopics.slice(indexOfFirstTopic, indexOfLastTopic);
  const totalPages = Math.ceil(sortedAndFilteredTopics.length / topicsPerPage);
  
  // Loading state
  if (loading) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  // No results state
  if (sortedAndFilteredTopics.length === 0) return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <p className="text-gray-500">No topics found matching your criteria.</p>
    </div>
  );
  
  // Main render
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discussion Forums</h1>
        <Link
          to="/forum/create"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Topic
        </Link>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          <option value="Frontend Development">Frontend Development</option>
          <option value="Backend Development">Backend Development</option>
          <option value="Career Advice">Career Advice</option>
          <option value="General Discussion">General Discussion</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'comments')}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="recent">Most Recent</option>
          <option value="comments">Most Comments</option>
        </select>
      </div>

      <div className="space-y-4">
        {currentTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Forums;
