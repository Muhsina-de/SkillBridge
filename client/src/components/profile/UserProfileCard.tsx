import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfile {
  username: string;
  email: string;
  skills: string[];
  role: string;
  rating: number;
  profilePicture: string;
  bio: string;
  availability: string[];
  location: string;
  linkedin: string;
  github: string;
  twitter: string;
}

interface UserProfileCardProps {
  user: UserProfile;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
      <div className="flex items-center space-x-4">
        <img 
          src={user.profilePicture || '/default-avatar.png'} 
          alt={`${user.username}'s profile`}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
          <p className="text-gray-500">{user.role}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-600">{user.rating}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
        <p className="mt-2 text-gray-600">{user.bio}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.skills.map((skill, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.availability.map((day, index) => (
            <span 
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
        <p className="mt-2 text-gray-600">{user.location}</p>
      </div>

      <div className="mt-6 flex space-x-4">
        {user.linkedin && (
          <a 
            href={user.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            LinkedIn
          </a>
        )}
        {user.github && (
          <a 
            href={user.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
          >
            GitHub
          </a>
        )}
        {user.twitter && (
          <a 
            href={user.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            Twitter
          </a>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard; 