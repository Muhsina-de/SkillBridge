import React, { useState, useEffect, useRef } from 'react';
import  io  from 'socket.io-client';
import { API_BASE_URL } from '../../constants/api';

const ActivityNotifications: React.FC = () => {
  const socket = useRef(io(API_BASE_URL));
  const [notifications, setNotifications] = useState<{
    type: 'join' | 'leave' | 'comment' | 'reaction';
    username: string;
    timestamp: Date;
  }[]>([]);

  useEffect(() => {
    const currentSocket = socket.current;
    currentSocket.on('userActivity', (activity: { type: 'join' | 'leave' | 'comment' | 'reaction'; username: string; timestamp: Date }) => {
      setNotifications(prev => [activity, ...prev].slice(0, 5));
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n !== activity));
      }, 5000);
    });

    return () => {
      currentSocket.off('userActivity');
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg p-3 animate-slide-in"
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">{notification.username}</span>
            <span className="text-gray-500">
              {notification.type === 'join' && 'joined the discussion'}
              {notification.type === 'leave' && 'left the discussion'}
              {notification.type === 'comment' && 'added a comment'}
              {notification.type === 'reaction' && 'reacted to a comment'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityNotifications;