import { useEffect, useRef } from 'react';
import io  from 'socket.io-client';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../context/AuthContext';

export const usePresenceTracking = (topicId: number) => {
  const socket = useRef(io(API_BASE_URL));
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.username) return;

    socket.current.emit('joinTopic', {
      topicId,
      username: user.username
    });

    const pingInterval = setInterval(() => {
      socket.current.emit('updatePresence', {
        topicId,
        username: user.username
      });
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      socket.current.emit('leaveTopic', {
        topicId,
        username: user.username
      });
      socket.current.disconnect();
    };
  }, [topicId, user]);
};