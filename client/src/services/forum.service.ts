import axiosInstance from '../utils/axios';

export const getTopics = () =>
  axiosInstance.get('/api/forum/topics');

export const getTopic = (id: number) =>
  axiosInstance.get(`/api/forum/topics/${id}`);

export const createTopic = (data: { title: string; content: string; category: string }) =>
  axiosInstance.post('/api/forum/topics', data);

export const updateTopic = (id: number, data: { title: string; content: string; category: string }) =>
  axiosInstance.put(`/api/forum/topics/${id}`, data);

export const deleteTopic = (id: number) =>
  axiosInstance.delete(`/api/forum/topics/${id}`);

export const createComment = (topicId: number, content: string) =>
  axiosInstance.post(`/api/forum/topics/${topicId}/comments`, { content });