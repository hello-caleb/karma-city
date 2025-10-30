import React, { useState } from 'react';
import { PlayerStats } from '../../shared/gameTypes';

interface PlayerRankingItemProps {
  player: PlayerStats;
  rank: number;
}

export function PlayerRankingItem({ player, rank }: PlayerRankingItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#343536',
    borderRadius: '6px',
    padding: '12px',
    border: '1px solid #818384',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    animation: 'slideIn 0.5s ease-out'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isExpanded ? '12px' : '0'
  };

  const rankStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: rank <= 3 ? '#ff4500' : '#d7dadc',
    minWidth: '24px'
  };

  const usernameStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#d7dadc',
    flex: 1,
    marginLeft: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const statsStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#818384',
    textAlign: 'right'
  };

  const karmaStyle: React.CSSProperties = {
    color: '#46d160',
    fontWeight: 'bold'
  };

  const buildingBreakdownStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
    gap: '8px',
    paddingTop: '8px',
    borderTop: '1px solid #818384',
    animation: isExpanded ? 'fadeIn 0.3s ease-in' : 'none'
  };

  const buildingItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6px',
    backgroundColor: '#1a1a1b',
    borderRadius: '4px',
    fontSize: '10px'
  };

  const buildingIconStyle: React.CSSProperties = {
    fontSize: '16px',
    marginBottom: '2px'
  };

  const buildingCountStyle: React.CSSProperties = {
    color: '#d7dadc',
    fontWeight: 'bold'
  };

  const expandIconStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#818384',
    transition: 'transform 0.3s ease',
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const buildingIcons = {
    'meme-factory': '🏭',
    'bot-defense': '🛡️',
    'mod-academy': '🎓',
    'gold-lounge': '🏛️',
    'upvote-monument': '🗽'
  };

  const buildingNames = {
    'meme-factory': 'Meme Factory',
    'bot-defense': 'Bot Defense',
    'mod-academy': 'Mod Academy',
    'gold-lounge': 'Gold Lounge',
    'upvote-monument': 'Monument'
  };

  return (
    <div
      style={containerStyle}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#404041';
        e.currentTarget.style.borderColor = '#d7dadc';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#343536';
        e.currentTarget.style.borderColor = '#818384';
      }}
    >
      <div style={headerStyle}>
        <div style={rankStyle}>{getRankEmoji(rank)}</div>
        <div style={usernameStyle}>{player.username}</div>
        <div style={statsStyle}>
          <div style={karmaStyle}>{player.totalKarmaSpent.toLocaleString()} karma</div>
          <div>{player.totalBuildings} buildings</div>
        </div>
        <div style={expandIconStyle}>▼</div>
      </div>

      {isExpanded && (
        <div style={buildingBreakdownStyle}>
          {Object.entries(player.buildingBreakdown).map(([buildingId, count]) => (
            <div key={buildingId} style={buildingItemStyle}>
              <div style={buildingIconStyle}>
                {buildingIcons[buildingId as keyof typeof buildingIcons]}
              </div>
              <div style={buildingCountStyle}>{count}</div>
              <div style={{ color: '#818384', fontSize: '8px', textAlign: 'center' }}>
                {buildingNames[buildingId as keyof typeof buildingNames]}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              height: 0;
            }
            to {
              opacity: 1;
              height: auto;
            }
          }
        `}
      </style>
    </div>
  );
}
