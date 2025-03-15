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


const RepoDetail: React.FC = () => {
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
   <div className="space-y-4">
     {/* Repository Box with Border */}
     <div className="bg-white border border-gray-300 rounded-lg shadow p-6 space-y-4 max-w-4xl mx-auto">
       {/* Header: Repository Info */}
       <div>
         <h1 className="text-2xl font-bold text-gray-900">{repository.full_name}</h1>
         <p className="mt-2 text-gray-600">{repository.description}</p>
       </div>


       {/* Repository Stats in Separate Divs */}
       <div className="mt-4 space-y-2">
         <div className="p-4 border border-gray-300 rounded-md">
           <p className="text-gray-700">
             <strong>Stars:</strong> {repository.stargazers_count}
           </p>
         </div>


         <div className="p-4 border border-gray-300 rounded-md">
           <p className="text-gray-700">
             <strong>Forks:</strong> {repository.forks_count}
           </p>
         </div>


         <div className="p-4 border border-gray-300 rounded-md">
           <p className="text-gray-700">
             <strong>Open Issues:</strong> {repository.open_issues_count}
           </p>
         </div>
       </div>


       {/* Repository Link */}
       <a
         href={repository.html_url}
         target="_blank"
         rel="noopener noreferrer"
         className="mt-4 inline-block text-blue-500 hover:underline"
       >
         View on GitHub
       </a>
     </div>


     {/* Optionally add more repositories here in a similar style */}
     {/* Example of another repository */}
     {/*
     <div className="bg-white border border-gray-300 rounded-lg shadow p-6 space-y-4 max-w-4xl mx-auto">
       <h2 className="text-2xl font-bold text-gray-900">Another Repository</h2>
       <p>Description of another repository</p>
     </div>
     */}
   </div>
 );
};


export default RepoDetail;



