export const API_BASE_URL = 'http://localhost:3001';

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