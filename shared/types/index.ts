// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'mentor' | 'mentee';
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  availability?: string[];
  location?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  reviewCount?: number;
  activityCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Review Types
export interface Review {
  id: number;
  sessionId: number;
  menteeId: number;
  mentorId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  mentee?: {
    id: number;
    username: string;
    profilePicture?: string;
  };
}

export interface ReviewSubmission {
  sessionId: number;
  menteeId: number;
  mentorId: number;
  rating: number;
  comment: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

// Forum Types
export interface ForumTopic {
  id: number;
  title: string;
  content: string;
  category: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  Author?: {
    id: number;
    username: string;
    profilePicture?: string;
  };
  Comments?: ForumComment[];
}

export interface ForumComment {
  id: number;
  content: string;
  authorId: number;
  topicId: number;
  createdAt: string;
  updatedAt: string;
  Author?: {
    id: number;
    username: string;
    profilePicture?: string;
  };
}

// Session Types
export interface Session {
  id: number;
  mentorId: number;
  menteeId: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  date: string;
  duration: number;
  topic: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  Mentor?: {
    id: number;
    username: string;
    profilePicture?: string;
  };
  Mentee?: {
    id: number;
    username: string;
    profilePicture?: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'mentor' | 'mentee';
}

// Component Props Types
export interface ReviewSummaryProps {
  reviews: Review[];
}

export interface ReviewListProps {
  reviews: Review[];
  mentorId?: number;
}

export interface ReviewCardProps {
  review: Review;
} 