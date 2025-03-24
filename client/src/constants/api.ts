export const API_BASE_URL = '/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
};

export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/profiles`,
  UPDATE_PROFILE: `${API_BASE_URL}/profiles/update`,
  GET_BY_ID: (userId: number) => `${API_BASE_URL}/users/${userId}`,
  UPDATE_BY_ID: (userId: number) => `${API_BASE_URL}/users/${userId}`,
};

export const REVIEW_ENDPOINTS = {
  GET_MENTOR_REVIEWS: (mentorId: number) => `${API_BASE_URL}/reviews/mentor/${mentorId}`,
  GET_BY_SESSION: (sessionId: number) => `${API_BASE_URL}/reviews/session/${sessionId}`,
  CREATE_REVIEW: `${API_BASE_URL}/reviews`,
  UPDATE_REVIEW: (reviewId: number) => `${API_BASE_URL}/reviews/${reviewId}`,
  DELETE_REVIEW: (reviewId: number) => `${API_BASE_URL}/reviews/${reviewId}`,
};

export const GITHUB_ENDPOINTS = {
  TRENDING: `${API_BASE_URL}/github/trending`,
};

export const SESSION_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/sessions`,
  GET_MENTOR_SESSIONS: (mentorId: number) => `${API_BASE_URL}/sessions/mentor/${mentorId}`,
  GET_MENTEE_SESSIONS: (menteeId: number) => `${API_BASE_URL}/sessions/mentee/${menteeId}`,
  UPDATE_STATUS: (sessionId: number) => `${API_BASE_URL}/sessions/${sessionId}/status`,
};

export const FORUM_ENDPOINTS = {
  TOPICS: {
    GET_ALL: `${API_BASE_URL}/forum/topics`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/forum/topics/${id}`,
    CREATE: `${API_BASE_URL}/forum/topics`,
    UPDATE: (id: number) => `${API_BASE_URL}/forum/topics/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/forum/topics/${id}`,
  },
  COMMENTS: {
    GET_BY_TOPIC: (topicId: number) => `${API_BASE_URL}/forum/topics/${topicId}/comments`,
    CREATE: (topicId: number) => `${API_BASE_URL}/forum/topics/${topicId}/comments`,
  },
};

export const API_ENDPOINTS = {
  REVIEWS: {
    GET_BY_MENTOR: (mentorId: number) => `/reviews/mentor/${mentorId}`,
    GET_BY_SESSION: (sessionId: number) => `/reviews/session/${sessionId}`,
    SUBMIT: '/reviews',
    UPDATE: (reviewId: number) => `/reviews/${reviewId}`,
    DELETE: (reviewId: number) => `/reviews/${reviewId}`,
  },
  SESSIONS: {
    CREATE: '/sessions',
    GET_BY_MENTOR: (mentorId: number) => `/sessions/mentor/${mentorId}`,
    GET_BY_MENTEE: (menteeId: number) => `/sessions/mentee/${menteeId}`,
  },
  USERS: {
    PROFILE: (userId: number) => `/users/${userId}`,
    UPDATE_PROFILE: (userId: number) => `/users/${userId}`,
  },
} as const; 