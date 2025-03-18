export interface User {
    id: string;
    username: string;
    email?: string;
    role?: string;
    profilePicture?: string;
    bio?: string;
    skills?: string[];
    rating?: number;
    reviewCount?: number;
    activityCount?: number;
    isMentor?: boolean;
  }
  