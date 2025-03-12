// src/TrendingRepos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './TrendingRepos.css'
import { API_BASE_URL } from '../../constants/api';

interface Repo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
}

interface ApiResponse {
    items: Repo[];
}

const TrendingRepos: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingRepos() {
      try {
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/github/trending`);
        if (response.data && Array.isArray(response.data.items)) {
          setRepos(response.data.items);
        } else {
          console.error('Unexpected response structure:', response.data);
          setError('Invalid data format received from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trending repositories:', err);
        setError('Failed to fetch trending repositories');
        setLoading(false);
      }
    }

    fetchTrendingRepos();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!repos || repos.length === 0) return <div className="p-4">No repositories found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trending GitHub Repositories</h1>
      <ul className="space-y-4">
        {repos.map((repo) => (
          <li key={repo.id} className="border p-4 rounded-lg shadow-sm">
            <a href={repo.html_url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 hover:text-blue-800">
              <h3 className="text-xl font-semibold">{repo.name}</h3>
            </a>
            <p className="text-gray-600 mt-2">{repo.description}</p>
            <span className="inline-flex items-center mt-2 text-sm text-gray-500">
              ⭐ {repo.stargazers_count} stars
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrendingRepos;
