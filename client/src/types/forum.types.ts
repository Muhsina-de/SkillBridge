export interface ForumTopic {
    id: number;
    title: string;
    content: string;
    category: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    User?: {
      username: string;
      profilePicture?: string;
    };
    Comments?: ForumComment[];
  }
  
  export interface ForumComment {
    id: number;
    content: string;
    userId: number;
    topicId: number;
    createdAt: string;
    updatedAt: string;
    User?: {
      username: string;
      profilePicture?: string;
    };
  }