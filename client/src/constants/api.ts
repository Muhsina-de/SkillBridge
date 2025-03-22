export const API_BASE_URL = 'http://localhost:3001';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  VERIFY_TOKEN: `${API_BASE_URL}/api/auth/verify-token`,
};

export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/api/profiles`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/profiles/update`,
  GET_BY_ID: (userId: number) => `${API_BASE_URL}/api/users/${userId}`,
  UPDATE_BY_ID: (userId: number) => `${API_BASE_URL}/api/users/${userId}`,
};

export const REVIEW_ENDPOINTS = {
  GET_MENTOR_REVIEWS: (mentorId: number) => `${API_BASE_URL}/api/reviews/mentor/${mentorId}`,
  GET_BY_SESSION: (sessionId: number) => `${API_BASE_URL}/api/reviews/session/${sessionId}`,
  CREATE_REVIEW: `${API_BASE_URL}/api/reviews`,
  UPDATE_REVIEW: (reviewId: number) => `${API_BASE_URL}/api/reviews/${reviewId}`,
  DELETE_REVIEW: (reviewId: number) => `${API_BASE_URL}/api/reviews/${reviewId}`,
};

export const GITHUB_ENDPOINTS = {
  TRENDING: `${API_BASE_URL}/api/github/trending`,
};

export const SESSION_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/api/sessions`,
  GET_MENTOR_SESSIONS: (mentorId: number) => `${API_BASE_URL}/api/sessions/mentor/${mentorId}`,
  GET_MENTEE_SESSIONS: (menteeId: number) => `${API_BASE_URL}/api/sessions/mentee/${menteeId}`,
  UPDATE_STATUS: (sessionId: number) => `${API_BASE_URL}/api/sessions/${sessionId}/status`,
};

export const FORUM_ENDPOINTS = {
  TOPICS: {
    GET_ALL: `${API_BASE_URL}/api/forum/topics`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/forum/topics/${id}`,
    CREATE: `${API_BASE_URL}/api/forum/topics`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/forum/topics/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/forum/topics/${id}`,
  },
  COMMENTS: {
    GET_BY_TOPIC: (topicId: number) => `${API_BASE_URL}/api/forum/topics/${topicId}/comments`,
    CREATE: (topicId: number) => `${API_BASE_URL}/api/forum/topics/${topicId}/comments`,
  },
};

export const API_ENDPOINTS = {
  REVIEWS: {
    GET_BY_MENTOR: (mentorId: number) => `/api/reviews/mentor/${mentorId}`,
    GET_BY_SESSION: (sessionId: number) => `/api/reviews/session/${sessionId}`,
    SUBMIT: '/api/reviews',
    UPDATE: (reviewId: number) => `/api/reviews/${reviewId}`,
    DELETE: (reviewId: number) => `/api/reviews/${reviewId}`,
  },
  SESSIONS: {
    CREATE: '/api/sessions',
    GET_BY_MENTOR: (mentorId: number) => `/api/sessions/mentor/${mentorId}`,
    GET_BY_MENTEE: (menteeId: number) => `/api/sessions/mentee/${menteeId}`,
  },
  USERS: {
    PROFILE: (userId: number) => `/api/users/${userId}`,
    UPDATE_PROFILE: (userId: number) => `/api/users/${userId}`,
  },
} as const; 