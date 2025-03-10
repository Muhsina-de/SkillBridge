import axios from 'axios';


const API_URL = 'http://localhost:3000/api/auth';


// Register user or sign Up
export const registerUser = async (role: 'mentor' | 'mentee', username: string, email: string, password: string, skills: string[], bio: string, rating: number, profilePicture: string, availability: string[], location: string, linkedin: string, github: string, twitter: string) => {
  const response = await axios.post(`${API_URL}/register`, { role, username, email, password, skills, bio, rating, profilePicture, availability, location, linkedin, github, twitter });
  return response.data;
};
// Sign in user
export const signInUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/signin`, { email, password });
  return response.data;
};