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
    profilePicture: string;
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

export interface ReviewSummaryProps {
  reviews: Array<Review>;
}

export interface ReviewListProps {
  reviews: Array<Review>;
  mentorId?: number;
}

export interface ReviewCardProps {
  review: Review;
} 