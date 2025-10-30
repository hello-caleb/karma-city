import React from 'react';
import { PlayerStats } from '../../shared/gameTypes';
import { PlayerRankingItem } from './PlayerRankingItem';

interface TopContributorsProps {
  players: PlayerStats[];
}

export function TopContributors({ players }: TopContributorsProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0079d3',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '24px 16px',
    color: '#818384',
    fontSize: '14px',
    lineHeight: '1.4',
    backgroundColor: '#343536',
    borderRadius: '6px',
    border: '1px dashed #818384'
  };

  const emptyStateIconStyle: React.CSSProperties = {
    fontSize: '32px',
    marginBottom: '12px',
    display: 'block'
  };

  if (players.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={titleStyle}>Top Contributors</div>
        <div style={emptyStateStyle}>
          <span style={emptyStateIconStyle}>🏗️</span>
          <div>
            <strong>Be the first to build!</strong>
            <br />
            Start placing buildings to claim your spot on the leaderboard and help grow Karma City.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Top Contributors</div>
      {players.map((player, index) => (
        <PlayerRankingItem
          key={player.username}
          player={player}
          rank={index + 1}
        />
      ))}
    </div>
  );
}
