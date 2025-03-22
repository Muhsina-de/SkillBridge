import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
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

        // Check if the response contains the expected structure       
        if (response.data && Array.isArray(response.data.items)) {     
          setRepos(response.data.items);
        } else {
          setError('Unexpected response format');
        }

        setLoading(false);
      } catch (err) {
        console.error(err); // Log the error to the console for debugging
        setError('Failed to fetch trending repositories');
        setLoading(false);
      }
    }

    fetchTrendingRepos();
  }, []);

  if (loading) return (
    <div className="main-container">
      <div className="text-center text-lg font-semibold">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="main-container">
      <div className="text-center text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="main-container space-y-6">
      <h1 className="text-3xl font-bold text-center">Trending GitHub Repositories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(repos) && repos.length > 0 ? (
          repos.map((repo) => (
            <div key={repo.id} className="glass-card p-6 hover:bg-white/90 transition duration-200">   
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <h3 className="text-xl font-semibold hover:text-blue-500">{repo.name}</h3>
              </a>
              <p className="mt-2 text-gray-600">{repo.description}</p> 
              <div className="mt-4 text-sm text-gray-500">
                <span>{repo.stargazers_count} stars</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-lg font-medium text-gray-600">
            No repositories available.
          </div>
        )}
      </div>
    </div>
  );
}

export default TrendingRepos;