import express from 'express';
const router = express.Router();
import https from 'https';


router.get('/github/trending', async function (req, res){

    const options = {
        hostname:'api.github.com', 
        path: '/search/repositories?q=stars:>1000&sort=stars&order=desc', // Example: repositories with more than 1000 stars, sorted by stars in descending order
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36',
            'Authorization': `token ${process.env.GITHUB_TOKEN}`

            
        }

    }

    https.get(options, function(apiResponse){
        let data='';
        apiResponse.on('data', (chunk)=>{
            data+=chunk;
        })
        apiResponse.on('end', ()=> {
            //send the JSON response from Github back to the client
            res.json(JSON.parse(data));
        })

    }).on('error',(e)=> {
        console.log(e);
        res.status(500).send('You messed up!');
    })

})
const gitRoutes = router;
export default gitRoutes;

