import React from 'react';
import { ActivityEntry } from '../../shared/gameTypes';
import { ActivityItem } from './ActivityItem';

interface RecentActivityProps {
  activities: ActivityEntry[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0079d3',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const activityListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '300px',
    overflowY: 'auto'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '16px',
    color: '#818384',
    fontSize: '12px',
    backgroundColor: '#343536',
    borderRadius: '6px',
    border: '1px dashed #818384'
  };

  if (activities.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={titleStyle}>Recent Activity</div>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>📈</div>
          No recent building activity.
          <br />
          Start building to see activity here!
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Recent Activity</div>
      <div style={activityListStyle}>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
