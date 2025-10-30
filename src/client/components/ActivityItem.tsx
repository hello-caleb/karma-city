import React from 'react';
import { ActivityEntry } from '../../shared/gameTypes';

interface ActivityItemProps {
  activity: ActivityEntry;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#343536',
    borderRadius: '4px',
    border: '1px solid #818384',
    fontSize: '12px',
    transition: 'all 0.3s ease-in-out',
    animation: 'slideInActivity 0.5s ease-out'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '16px',
    marginRight: '8px',
    minWidth: '20px',
    textAlign: 'center'
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const usernameStyle: React.CSSProperties = {
    color: '#d7dadc',
    fontWeight: 'bold'
  };

  const actionStyle: React.CSSProperties = {
    color: '#818384'
  };

  const timestampStyle: React.CSSProperties = {
    color: '#818384',
    fontSize: '10px',
    textAlign: 'right',
    minWidth: '60px'
  };

  const karmaStyle: React.CSSProperties = {
    color: '#46d160',
    fontWeight: 'bold',
    fontSize: '10px'
  };

  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#404041';
        e.currentTarget.style.borderColor = '#d7dadc';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#343536';
        e.currentTarget.style.borderColor = '#818384';
      }}
    >
      <div style={iconStyle}>{activity.buildingIcon}</div>
      
      <div style={contentStyle}>
        <div>
          <span style={usernameStyle}>{activity.username}</span>
          <span style={actionStyle}> built {activity.buildingName}</span>
        </div>
        <div style={karmaStyle}>-{activity.karmaSpent} karma</div>
      </div>
      
      <div style={timestampStyle}>
        {formatRelativeTime(activity.timestamp)}
      </div>

      <style>
        {`
          @keyframes slideInActivity {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}
