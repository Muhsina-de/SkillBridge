import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export const getTopics = () =>
  axios.get(`${API_BASE_URL}/api/forum/topics`);

export const getTopic = (id: number) =>
  axios.get(`${API_BASE_URL}/api/forum/topics/${id}`);

export const createTopic = (data: { title: string; content: string; category: string }) =>
  axios.post(`${API_BASE_URL}/api/forum/topics`, data);

export const updateTopic = (id: number, data: { title: string; content: string; category: string }) =>
  axios.put(`${API_BASE_URL}/api/forum/topics/${id}`, data);

export const deleteTopic = (id: number) =>
  axios.delete(`${API_BASE_URL}/api/forum/topics/${id}`);
export const createComment = (topicId: number, content: string) =>
  axios.post(`${API_BASE_URL}/api/forum/topics/${topicId}/comments`, { content });