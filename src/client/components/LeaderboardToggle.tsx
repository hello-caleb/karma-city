import React from 'react';

interface LeaderboardToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function LeaderboardToggle({ isVisible, onToggle }: LeaderboardToggleProps) {
  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    backgroundColor: '#ff4500',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease-in-out',
    animation: 'bounceIn 0.6s ease-out'
  };

  // Only show on mobile screens
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) {
    return null;
  }

  return (
    <button
      style={buttonStyle}
      onClick={onToggle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#e03d00';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#ff4500';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.backgroundColor = '#e03d00';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.backgroundColor = '#ff4500';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label={isVisible ? 'Close leaderboard' : 'Open leaderboard'}
    >
      {isVisible ? '×' : '🏆'}
      
      <style>
        {`
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @media (max-width: 768px) {
            .leaderboard-toggle {
              display: flex;
            }
          }

          @media (min-width: 769px) {
            .leaderboard-toggle {
              display: none;
            }
          }
        `}
      </style>
    </button>
  );
}
