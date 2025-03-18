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
};

export const REVIEW_ENDPOINTS = {
  GET_MENTOR_REVIEWS: (mentorId: number) => `${API_BASE_URL}/api/reviews/mentor/${mentorId}`,
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