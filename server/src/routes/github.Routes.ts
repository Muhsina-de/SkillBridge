import express from 'express';
import https from 'https';


const router = express.Router();


interface RepositoryItem {
 id: number;
 full_name: string;
 html_url: string;
 description: string;
 stargazers_count: number;
}


interface RepositoryResponse {
 message?: string;
 items?: RepositoryItem[];
}


// GET /api/github/trending
// Fetches the trending repositories from GitHub
// Returns an array of RepositoryItem objects
router.get('/trending', async function (req, res) {
 const token = process.env.GITHUB_TOKEN;
 if (!token) {
   return res.status(400).json({ error: 'GitHub token is missing from environment variables' });
 }


 const options = {
   hostname: 'api.github.com',
   path: '/search/repositories?q=stars:>1000&sort=stars&order=desc', // Repositories with more than 1000 stars
   headers: {
     'User-Agent': 'RaveNest-App',
     'Accept': 'application/vnd.github.v3+json',
     'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` // GitHub token
   }
 };


 console.log('Making request to GitHub API with options:', options);


 https.get(options, (apiResponse) => {
   let data = '';


   apiResponse.on('data', (chunk) => {
     data += chunk;
   });


   apiResponse.on('end', () => {
     console.log('Received response from GitHub API:', data);


     try {
       const parsedData = JSON.parse(data) as RepositoryResponse;


       if (parsedData.message) {
         console.error('GitHub API Error:', parsedData.message);
         return res.status(apiResponse.statusCode || 500).json({
           error: 'GitHub API Error',
           message: parsedData.message
         });
       }


       res.json(parsedData); // Send the complete parsed data (could be items + message)
     } catch (error) {
       console.error('Error parsing response from GitHub API:', error);
       res.status(500).json({ error: 'Failed to parse response from GitHub' });
     }
   });
 }).on('error', (e) => {
   console.error('Error fetching data from GitHub API:', e);
   res.status(500).json({ error: 'Failed to fetch trending repositories' });
 });
});


const gitRoutes = router;
export default gitRoutes;



