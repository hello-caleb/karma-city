import React, { useState, useEffect } from 'react';
import { SynergyPreviewData } from '../../shared/gameTypes';

interface SynergyPreviewProps {
  previewData: SynergyPreviewData | null;
  gridCellSize?: number;
  isMobile?: boolean;
  showDetailedTooltip?: boolean;
}

export function SynergyPreview({ 
  previewData, 
  gridCellSize = 50,
  isMobile = false,
  showDetailedTooltip = false
}: SynergyPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle visibility with fade-in effect
  useEffect(() => {
    if (previewData && previewData.potentialSynergies.length > 0) {
      setIsVisible(true);
      
      // Auto-hide on mobile after 2 seconds for touch interactions
      if (isMobile) {
        if (touchTimeout) {
          clearTimeout(touchTimeout);
        }
        const timeout = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
        setTouchTimeout(timeout);
      }
    } else {
      setIsVisible(false);
      if (touchTimeout) {
        clearTimeout(touchTimeout);
        setTouchTimeout(null);
      }
    }

    return () => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }
    };
  }, [previewData, isMobile]);

  if (!previewData || previewData.potentialSynergies.length === 0 || !isVisible) {
    return null;
  }

  const gap = 4; // Grid gap from TownGrid
  const cellWithGap = gridCellSize + gap;

  // Main preview overlay style
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: previewData.position.row * cellWithGap,
    left: previewData.position.col * cellWithGap,
    width: gridCellSize,
    height: gridCellSize,
    border: `${isMobile ? '3px' : '2px'} dashed #46d160`,
    borderRadius: '4px',
    backgroundColor: 'rgba(70, 209, 96, 0.15)',
    zIndex: 15,
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out, transform 0.2s ease-in-out',
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    boxShadow: '0 0 12px rgba(70, 209, 96, 0.4)'
  };

  // Enhanced tooltip with synergy details
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: isMobile ? '-45px' : '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1a1a1b',
    color: '#d7dadc',
    padding: isMobile ? '6px 10px' : '5px 9px',
    borderRadius: '6px',
    fontSize: isMobile ? '11px' : '10px',
    whiteSpace: 'nowrap',
    border: '1px solid #343536',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    zIndex: 16,
    minWidth: 'max-content',
    maxWidth: isMobile ? '180px' : '200px',
    textAlign: 'center'
  };

  // Detailed tooltip content
  const renderTooltipContent = () => {
    const synergyCount = previewData.potentialSynergies.length;
    const synergyText = synergyCount === 1 ? '1 synergy' : `${synergyCount} synergies`;
    
    if (!showDetailedTooltip) {
      return `+${synergyText}`;
    }

    // Show synergy names for detailed tooltip
    const synergyNames = previewData.potentialSynergies
      .map(s => s.name)
      .join(', ');
    
    return (
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
          +{synergyText}
        </div>
        <div style={{ fontSize: '9px', opacity: 0.8 }}>
          {synergyNames}
        </div>
      </div>
    );
  };

  // Create enhanced synergy indicators for affected buildings
  const affectedBuildingIndicators = previewData.affectedBuildings.map((building, index) => {
    // Determine the synergy color based on the potential synergies
    const primarySynergy = previewData.potentialSynergies[0];
    const synergyColor = primarySynergy?.glowColor || '#46d160';
    
    const indicatorStyle: React.CSSProperties = {
      position: 'absolute',
      top: building.row * cellWithGap,
      left: building.col * cellWithGap,
      width: gridCellSize,
      height: gridCellSize,
      border: `2px solid ${synergyColor}`,
      borderRadius: '4px',
      backgroundColor: `${synergyColor}10`, // Very light background
      zIndex: 14,
      pointerEvents: 'none',
      opacity: isVisible ? 0.8 : 0,
      transition: 'opacity 0.3s ease-in-out, transform 0.2s ease-in-out',
      transform: isVisible ? 'scale(1)' : 'scale(0.98)',
      animation: 'synergyPulse 2s ease-in-out infinite'
    };

    // Connection line style (simplified for performance)
    const connectionStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: 13,
      pointerEvents: 'none',
      opacity: isVisible ? 0.6 : 0,
      transition: 'opacity 0.3s ease-in-out'
    };

    // Calculate connection line position
    const isHorizontal = building.row === previewData.position.row;
    const isVertical = building.col === previewData.position.col;
    
    let connectionElement = null;
    
    if (isHorizontal) {
      // Horizontal connection
      const startCol = Math.min(building.col, previewData.position.col);
      const endCol = Math.max(building.col, previewData.position.col);
      const lineWidth = (endCol - startCol) * cellWithGap - gap;
      
      connectionElement = (
        <div
          key={`connection-h-${index}`}
          style={{
            ...connectionStyle,
            top: building.row * cellWithGap + gridCellSize / 2 - 1,
            left: startCol * cellWithGap + gridCellSize,
            width: lineWidth,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${synergyColor}, transparent)`,
          }}
        />
      );
    } else if (isVertical) {
      // Vertical connection
      const startRow = Math.min(building.row, previewData.position.row);
      const endRow = Math.max(building.row, previewData.position.row);
      const lineHeight = (endRow - startRow) * cellWithGap - gap;
      
      connectionElement = (
        <div
          key={`connection-v-${index}`}
          style={{
            ...connectionStyle,
            top: startRow * cellWithGap + gridCellSize,
            left: building.col * cellWithGap + gridCellSize / 2 - 1,
            width: '2px',
            height: lineHeight,
            background: `linear-gradient(180deg, transparent, ${synergyColor}, transparent)`,
          }}
        />
      );
    }

    return (
      <React.Fragment key={`affected-${index}`}>
        <div style={indicatorStyle} />
        {connectionElement}
      </React.Fragment>
    );
  });

  // Synergy type indicators (small colored dots)
  const synergyTypeIndicators = previewData.potentialSynergies.map((synergy, index) => {
    const dotStyle: React.CSSProperties = {
      position: 'absolute',
      top: '4px',
      right: `${4 + (index * 12)}px`,
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: synergy.glowColor,
      border: '1px solid rgba(255,255,255,0.8)',
      zIndex: 17,
      boxShadow: `0 0 4px ${synergy.glowColor}`,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    };

    return (
      <div
        key={`synergy-dot-${index}`}
        style={dotStyle}
        title={synergy.name}
      />
    );
  });

  return (
    <>
      {/* Main preview overlay */}
      <div style={overlayStyle}>
        {/* Synergy type indicators */}
        {synergyTypeIndicators}
        
        {/* Tooltip */}
        <div style={tooltipStyle}>
          {renderTooltipContent()}
        </div>
      </div>
      
      {/* Affected building indicators and connections */}
      {affectedBuildingIndicators}
      
      {/* Enhanced CSS animations and styles */}
      <style>{`
        @keyframes synergyPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
            box-shadow: 0 0 8px rgba(70, 209, 96, 0.3);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
            box-shadow: 0 0 16px rgba(70, 209, 96, 0.5);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          .synergy-preview-tooltip {
            font-size: 11px !important;
            padding: 6px 10px !important;
            bottom: -45px !important;
            max-width: 180px !important;
          }
          
          .synergy-preview-overlay {
            border-width: 3px !important;
          }
        }
        
        /* Touch-friendly enhancements */
        @media (pointer: coarse) {
          .synergy-preview-overlay {
            border-width: 3px !important;
            box-shadow: 0 0 16px rgba(70, 209, 96, 0.5) !important;
          }
          
          .synergy-affected-indicator {
            border-width: 3px !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .synergy-preview-overlay {
            border-color: #00ff00 !important;
            background-color: rgba(0, 255, 0, 0.2) !important;
          }
          
          .synergy-preview-tooltip {
            background-color: #000000 !important;
            color: #ffffff !important;
            border-color: #ffffff !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .synergy-preview-overlay,
          .synergy-affected-indicator {
            animation: none !important;
            transition: opacity 0.1s ease-in-out !important;
          }
        }
      `}</style>
    </>
  );
}
