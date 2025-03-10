import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    html_url: string;
  }
  

const RepoDetail = () => {
    const { owner, repo } = useParams<{ owner: string; repo: string }>();
    const [repository, setRepository] = useState<Repository | null>(null);

    useEffect(() => {
        const fetchRepoDetails = async () => {
            try {
                const response = await axios.get<Repository>(`https://api.github.com/repos/${owner}/${repo}`);
                setRepository(response.data);
            } catch (error) {
                console.error('Error fetching repository details', error);
            }
        };

        fetchRepoDetails();
    }, [owner, repo]);

    if (!repository) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold">{repository.full_name}</h1>
            <p className="mt-2">{repository.description}</p>
            <div className="mt-4">
                <p><strong>Stars:</strong> {repository.stargazers_count}</p>
                <p><strong>Forks:</strong> {repository.forks_count}</p>
                <p><strong>Open Issues:</strong> {repository.open_issues_count}</p>
            </div>
            <a href={repository.html_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-500 hover:underline">
                View on GitHub
            </a>
        </div>
    );
};

export default RepoDetail;