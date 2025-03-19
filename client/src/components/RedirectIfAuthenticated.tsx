import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RedirectIfAuthenticatedProps {
  children: React.ReactElement;
}

const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
  const { user } = useAuth();

  // If a user is already authenticated, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children (signin or signup page)
  return children;
};

export default RedirectIfAuthenticated;
