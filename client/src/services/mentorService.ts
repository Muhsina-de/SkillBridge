import axiosInstance from '../utils/axios';

export interface Mentor {
  id: number;
  username: string;
  email: string;
  skills: string[];
  role: string;
  rating: number;
  profilePicture: string | null;
  bio: string | null;
  availability: string[] | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
}

const mentorService = {
  getAllMentors: async (): Promise<Mentor[]> => {
    try {
      const response = await axiosInstance.get<Mentor[]>('/api/profiles/mentors');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  },

  getMentorById: async (id: number): Promise<Mentor> => {
    try {
      const response = await axiosInstance.get<Mentor>(`/api/profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor:', error);
      throw error;
    }
  }
};

export default mentorService; 