export const UserActivity: React.FC<{ username: string; lastActive: Date }> = ({ username, lastActive }) => {
    const getActivityStatus = (lastActive: Date) => {
      const minutesAgo = Math.floor((Date.now() - new Date(lastActive).getTime()) / 60000);
      if (minutesAgo < 1) return 'Just now';
      if (minutesAgo < 60) return `${minutesAgo}m ago`;
      return `${Math.floor(minutesAgo / 60)}h ago`;
    };
  
    return (
      <div className="flex items-center space-x-2 text-sm">
        <span className="font-medium">{username}</span>
        <span className="text-gray-500">{getActivityStatus(lastActive)}</span>
      </div>
    );
  };
  