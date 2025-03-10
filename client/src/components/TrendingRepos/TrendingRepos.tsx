// src/TrendingRepos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './TrendingRepos.css'

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
const TrendingRepos: React.FC =() => {
  const [repos, setRepos] = useState<Repo[]>([]); // Repos is an array of Repo objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingRepos() {
      try {
        const response = await axios.get<ApiResponse>('http://localhost:5000/api/github/trending');
        setRepos(response.data.items);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch trending repositories');
        setLoading(false);
      }
    }

    fetchTrendingRepos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Trending GitHub Repositories</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <h3>{repo.name}</h3>
            </a>
            <p>{repo.description}</p>
            <span>{repo.stargazers_count} stars</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrendingRepos;
