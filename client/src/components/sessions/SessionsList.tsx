import React from 'react';
import { Session } from '../../services/dashboardService';
import { format } from 'date-fns';

interface SessionsListProps {
  sessions: Session[];
  title: string;
  emptyMessage: string;
}

const SessionsList: React.FC<SessionsListProps> = ({ sessions, title, emptyMessage }) => {
  if (sessions.length === 0) {
    return (
      <div className="bg-primary/10 p-4 rounded-lg border border-primary-light/20">
        <h3 className="font-semibold text-primary mb-2">{title}</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-primary/10 p-4 rounded-lg border border-primary-light/20">
      <h3 className="font-semibold text-primary mb-4">{title}</h3>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">
                  {session.mentor?.username || 'Unknown Mentor'}
                </h4>
                <p className="text-sm text-gray-600">{session.skill}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(session.date), 'MMM d, yyyy')} at {session.time}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionsList; 