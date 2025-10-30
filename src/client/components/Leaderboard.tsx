import React from 'react';
import { LeaderboardState } from '../../shared/gameTypes';
import { TopContributors } from './TopContributors';
import { RecentActivity } from './RecentActivity';

interface LeaderboardProps {
  leaderboardData: LeaderboardState;
  onToggle: () => void;
}

export function Leaderboard({ leaderboardData, onToggle }: LeaderboardProps) {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    right: '20px',
    top: '20px',
    width: '320px',
    height: 'calc(100vh - 40px)',
    backgroundColor: '#1a1a1b',
    border: '1px solid #343536',
    borderRadius: '8px',
    padding: '16px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif',
    color: '#d7dadc',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const mobileOverlayStyle: React.CSSProperties = {
    ...containerStyle,
    position: 'fixed',
    top: '50%',
    left: '50%',
    right: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '400px',
    maxHeight: '80vh',
    height: 'auto'
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ff4500',
    textAlign: 'center',
    marginBottom: '8px',
    borderBottom: '1px solid #343536',
    paddingBottom: '8px'
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#818384',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s ease'
  };

  // Check if we're on mobile (simplified check)
  const isMobile = window.innerWidth <= 768;
  const currentStyle = isMobile ? mobileOverlayStyle : containerStyle;

  // Don't render on mobile if not visible
  if (isMobile && !leaderboardData.isVisible) {
    return null;
  }

  return (
    <div style={currentStyle}>
      {isMobile && (
        <button
          style={closeButtonStyle}
          onClick={onToggle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#d7dadc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#818384';
          }}
        >
          ×
        </button>
      )}
      
      <div style={headerStyle}>
        🏆 Karma City Leaderboard
      </div>

      <TopContributors players={leaderboardData.topPlayers} />
      
      <RecentActivity activities={leaderboardData.recentActivity} />
    </div>
  );
}
