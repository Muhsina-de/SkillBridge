import axiosInstance from '../utils/axios';

export const getTopics = () =>
  axiosInstance.get('/forum/topics');

export const getTopic = (id: number) =>
  axiosInstance.get(`/forum/topics/${id}`);

export const createTopic = (data: { title: string; content: string; category: string }) =>
  axiosInstance.post('/forum/topics', data);

export const updateTopic = (id: number, data: { title: string; content: string; category: string }) =>
  axiosInstance.put(`/forum/topics/${id}`, data);

export const deleteTopic = (id: number) =>
  axiosInstance.delete(`/forum/topics/${id}`);

export const createComment = (topicId: number, content: string) =>
  axiosInstance.post(`/forum/topics/${topicId}/comments`, { content });