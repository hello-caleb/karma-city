import React from 'react';
import { SynergyType } from '../../shared/gameTypes';

interface SynergyBadgeProps {
  synergyCount: number;
  synergyTypes: SynergyType[];
  position?: 'top-right' | 'bottom-right';
}

export function SynergyBadge({ 
  synergyCount, 
  synergyTypes, 
  position = 'top-right' 
}: SynergyBadgeProps) {
  if (synergyCount === 0) return null;

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: position === 'top-right' ? '4px' : 'auto',
    bottom: position === 'bottom-right' ? '4px' : 'auto',
    right: '4px',
    backgroundColor: '#ff4500',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    zIndex: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    cursor: 'help',
    // Mobile optimization
    minWidth: '20px',
    minHeight: '20px'
  };

  // Create tooltip text from synergy types
  const tooltipText = synergyTypes.map(s => s.name).join(', ');

  return (
    <div 
      style={badgeStyle} 
      title={tooltipText}
      aria-label={`${synergyCount} active synergies: ${tooltipText}`}
    >
      {synergyCount}
    </div>
  );
}
