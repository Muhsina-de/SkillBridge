import React from 'react';
import { useAuth } from '../context/AuthContext';
import MentorDashboard from '../pages/MentorDashboard';
import MenteeDashboard from '../pages/MenteeDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Render different dashboard based on user role
  return user.role === 'mentor' ? <MentorDashboard /> : <MenteeDashboard />;
};

export default Dashboard; 