import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../constants/api';

export const useForumSocket = (topicId: number, onUpdate: (data: any) => void) => {
  const handleRealTimeUpdate = useCallback((data: any) => {
    onUpdate(data);
  }, [onUpdate]);

  useEffect(() => {
    const socket = io(API_BASE_URL);
    
    socket.emit('joinTopic', topicId);
    
    socket.on('newComment', handleRealTimeUpdate);
    socket.on('topicUpdate', handleRealTimeUpdate);
    
    return () => {
      socket.off('newComment', handleRealTimeUpdate);
      socket.off('topicUpdate', handleRealTimeUpdate);
      socket.emit('leaveTopic', topicId);
      socket.disconnect();
    };
  }, [topicId, handleRealTimeUpdate]);
};
