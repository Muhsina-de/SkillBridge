export interface Review {
  id: number;
  mentee_id: number;
  mentor_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export interface ForumTopic {
  id: number;
  title: string;
  content: string;
  category: string;
  author_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ForumComment {
  id: number;
  content: string;
  author_id: number;
  topic_id: number;
  created_at: Date;
  updated_at: Date;
} 