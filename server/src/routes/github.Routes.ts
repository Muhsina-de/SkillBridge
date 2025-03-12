import express from 'express';
const router = express.Router();
import https from 'https';

interface GitHubApiResponse {
    message?: string;
    items?: Array<{
        id: number;
        name: string;
        html_url: string;
        description: string;
        stargazers_count: number;
    }>;
}

router.get('/github/trending', async function (req, res) {
    if (!process.env.GITHUB_TOKEN) {
        console.error('GITHUB_TOKEN is not set in environment variables');
        return res.status(500).json({ error: 'GitHub token is not configured' });
    }

    const options = {
        hostname: 'api.github.com',
        path: '/search/repositories?q=stars:>1000&sort=stars&order=desc',
        headers: {
            'User-Agent': 'SkillBridge-App',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        }
    };

    const request = https.get(options, function(apiResponse) {
        let data = '';
        
        apiResponse.on('data', (chunk) => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            try {
                const parsedData = JSON.parse(data) as GitHubApiResponse;
                if (parsedData.message) {
                    console.error('GitHub API Error:', parsedData.message);
                    return res.status(apiResponse.statusCode || 500).json({ 
                        error: 'GitHub API Error', 
                        message: parsedData.message 
                    });
                }
                res.json(parsedData);
            } catch (error) {
                console.error('Error parsing GitHub response:', error);
                res.status(500).json({ 
                    error: 'Error parsing GitHub response',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        });
    });

    request.on('error', (error) => {
        console.error('Error fetching from GitHub:', error);
        res.status(500).json({ 
            error: 'Failed to fetch from GitHub API',
            message: error.message 
        });
    });

    // Set a timeout of 5 seconds
    request.setTimeout(5000, () => {
        request.destroy();
        res.status(504).json({ 
            error: 'Request timeout',
            message: 'GitHub API request timed out' 
        });
    });
});

const gitRoutes = router;
export default gitRoutes;

