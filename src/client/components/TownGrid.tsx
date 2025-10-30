import React, { useState, useCallback, useMemo } from 'react';
import { Building, SynergyPreviewData, SynergyState } from '../../shared/gameTypes';
import { SynergyCalculator } from '../../shared/SynergyCalculator';
import { SynergyPreview } from './SynergyPreview';

interface TownGridProps {
  grid: (string | null)[][];
  buildings: Building[];
  onCellClick: (row: number, col: number) => void;
  selectedBuildingId?: string | null;
  showSynergyPreviews?: boolean;
  synergyState?: SynergyState | null;
}

export function TownGrid({ 
  grid, 
  buildings, 
  onCellClick, 
  selectedBuildingId = null,
  showSynergyPreviews = true,
  synergyState = null
}: TownGridProps) {
  const [synergyPreview, setSynergyPreview] = useState<SynergyPreviewData | null>(null);
  const [isMobile] = useState(() => {
    // Detect mobile device
    return typeof window !== 'undefined' && (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768
    );
  });

  // Calculate current synergies if not provided
  const currentSynergyState = useMemo(() => {
    if (synergyState) return synergyState;
    
    const calculator = new SynergyCalculator(grid, buildings);
    return calculator.calculateAllSynergies();
  }, [grid, buildings, synergyState]);

  const getBuildingById = (id: string | null) => {
    if (!id) return null;
    return buildings.find(b => b.id === id);
  };

  // Get synergy CSS classes for a cell
  const getSynergyCssClasses = (row: number, col: number): string => {
    const positionKey = `${row}-${col}`;
    const synergyIds = currentSynergyState.buildingSynergies.get(positionKey);
    
    if (!synergyIds || synergyIds.length === 0) {
      return '';
    }

    const classes = ['synergy-glow'];
    synergyIds.forEach(synergyId => {
      classes.push(`synergy-${synergyId}`);
    });

    return classes.join(' ');
  };

  // Generate connection lines between synergistic buildings
  const renderSynergyConnections = (): React.ReactElement[] => {
    const connections: React.ReactElement[] = [];
    const processedPairs = new Set<string>();

    // Iterate through all active synergies to create connections
    currentSynergyState.buildingSynergies.forEach((synergyIds, positionKey) => {
      const positionParts = positionKey.split('-').map(Number);
      if (positionParts.length !== 2) return;
      
      const [row, col] = positionParts;
      if (row === undefined || col === undefined) return;
      
      const calculator = new SynergyCalculator(grid, buildings);
      const adjacentBuildings = calculator.getAdjacentBuildings(row, col);

      synergyIds.forEach(synergyId => {
        // Skip community center as it doesn't need connection lines
        if (synergyId === 'community-center') return;

        adjacentBuildings.forEach(adjacent => {
          const adjacentKey = `${adjacent.row}-${adjacent.col}`;
          const adjacentSynergies = currentSynergyState.buildingSynergies.get(adjacentKey) || [];
          
          // Check if the adjacent building shares this synergy
          if (adjacentSynergies.includes(synergyId)) {
            // Create a unique pair key to avoid duplicate connections
            const pairKey = [positionKey, adjacentKey].sort().join('|') + `|${synergyId}`;
            
            if (!processedPairs.has(pairKey)) {
              processedPairs.add(pairKey);
              
              // Calculate connection line position and orientation
              const isHorizontal = row === adjacent.row;
              const connectionKey = `connection-${pairKey}`;
              
              if (isHorizontal) {
                // Horizontal connection
                const leftCol = Math.min(col, adjacent.col);
                const rightCol = Math.max(col, adjacent.col);
                const connectionStyle: React.CSSProperties = {
                  position: 'absolute',
                  top: `${row * 54 + 25}px`, // 50px cell + 4px gap, centered
                  left: `${leftCol * 54 + 50}px`, // Start from right edge of left cell
                  width: `${(rightCol - leftCol) * 54 - 46}px`, // Connect to left edge of right cell
                  height: '2px',
                  zIndex: 10,
                  pointerEvents: 'none'
                };
                
                connections.push(
                  <div
                    key={connectionKey}
                    className={`synergy-connection ${synergyId}`}
                    style={connectionStyle}
                  />
                );
              } else {
                // Vertical connection
                const topRow = Math.min(row, adjacent.row);
                const bottomRow = Math.max(row, adjacent.row);
                const connectionStyle: React.CSSProperties = {
                  position: 'absolute',
                  top: `${topRow * 54 + 50}px`, // Start from bottom edge of top cell
                  left: `${col * 54 + 25}px`, // Centered horizontally
                  width: '2px',
                  height: `${(bottomRow - topRow) * 54 - 46}px`, // Connect to top edge of bottom cell
                  zIndex: 10,
                  pointerEvents: 'none'
                };
                
                connections.push(
                  <div
                    key={connectionKey}
                    className={`synergy-connection vertical ${synergyId}`}
                    style={connectionStyle}
                  />
                );
              }
            }
          }
        });
      });
    });

    return connections;
  };

  // Handle synergy preview for hover interactions
  const handleCellHover = useCallback((row: number, col: number, isEntering: boolean) => {
    if (!showSynergyPreviews || !selectedBuildingId || grid[row]?.[col] !== null) {
      if (!isEntering) {
        setSynergyPreview(null);
      }
      return;
    }

    if (isEntering) {
      // Calculate potential synergies for the selected building
      const calculator = new SynergyCalculator(grid, buildings);
      const preview = calculator.calculatePreviewSynergies(row, col, selectedBuildingId);
      setSynergyPreview(preview);
    } else {
      // Clear preview when leaving cell (with small delay for better UX)
      setTimeout(() => setSynergyPreview(null), 100);
    }
  }, [grid, buildings, selectedBuildingId, showSynergyPreviews]);

  // Handle touch interactions for mobile
  const handleCellTouch = useCallback((row: number, col: number) => {
    if (!showSynergyPreviews || !selectedBuildingId || grid[row]?.[col] !== null) {
      return;
    }

    // Show preview on touch
    const calculator = new SynergyCalculator(grid, buildings);
    const preview = calculator.calculatePreviewSynergies(row, col, selectedBuildingId);
    setSynergyPreview(preview);
  }, [grid, buildings, selectedBuildingId, showSynergyPreviews]);

  // Clear preview when building selection changes
  React.useEffect(() => {
    if (!selectedBuildingId) {
      setSynergyPreview(null);
    }
  }, [selectedBuildingId]);

  return (
    <div style={{
      position: 'relative', // Important for absolute positioning of preview
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 50px)',
      gridTemplateRows: 'repeat(10, 50px)',
      gap: '4px',
      margin: '20px auto',
      width: 'fit-content'
    }}>
      {grid.filter(row => row !== undefined).map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const building = getBuildingById(cell);
          const isEmpty = cell === null;
          const canPreview = isEmpty && selectedBuildingId && showSynergyPreviews;
          const synergyCssClasses = getSynergyCssClasses(rowIndex, colIndex);
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={synergyCssClasses}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onMouseEnter={() => {
                if (canPreview && !isMobile) {
                  handleCellHover(rowIndex, colIndex, true);
                }
                // Visual hover effect
                if (isEmpty) {
                  const element = document.getElementById(`cell-${rowIndex}-${colIndex}`);
                  if (element) {
                    element.style.backgroundColor = canPreview ? '#e8f5e8' : '#e0e0e0';
                  }
                }
              }}
              onMouseLeave={() => {
                if (canPreview && !isMobile) {
                  handleCellHover(rowIndex, colIndex, false);
                }
                // Reset visual hover effect
                if (isEmpty) {
                  const element = document.getElementById(`cell-${rowIndex}-${colIndex}`);
                  if (element) {
                    element.style.backgroundColor = '#f9f9f9';
                  }
                }
              }}
              onTouchStart={() => {
                if (canPreview && isMobile) {
                  handleCellTouch(rowIndex, colIndex);
                }
              }}
              id={`cell-${rowIndex}-${colIndex}`}
              style={{
                width: '50px',
                height: '50px',
                border: `2px solid ${canPreview ? '#46d160' : '#ccc'}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isEmpty ? 'pointer' : 'default',
                backgroundColor: cell ? '#e8f4f8' : '#f9f9f9',
                fontSize: '24px',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                // Enhanced touch targets for mobile
                minHeight: isMobile ? '44px' : '50px',
                minWidth: isMobile ? '44px' : '50px',
                // Visual feedback for preview capability
                boxShadow: canPreview ? '0 0 4px rgba(70, 209, 96, 0.3)' : 'none'
              }}
            >
              {building ? building.icon : ''}
              
              {/* Preview hint for empty cells when building is selected */}
              {canPreview && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#46d160',
                  opacity: 0.6,
                  animation: 'previewHint 2s ease-in-out infinite'
                }} />
              )}
            </div>
          );
        })
      )}
      
      {/* Synergy Connection Lines */}
      {renderSynergyConnections()}
      
      {/* Synergy Preview Overlay */}
      {synergyPreview && (
        <SynergyPreview
          previewData={synergyPreview}
          gridCellSize={50}
          isMobile={isMobile}
          showDetailedTooltip={!isMobile} // Show detailed tooltips on desktop
        />
      )}
      
      {/* Additional CSS for animations and mobile optimizations */}
      <style>{`
        @keyframes previewHint {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
        
        /* Mobile touch optimizations */
        @media (pointer: coarse) {
          .town-grid-cell {
            min-height: 44px !important;
            min-width: 44px !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .town-grid-cell {
            border-width: 3px !important;
          }
          
          .preview-capable-cell {
            border-color: #00ff00 !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .town-grid-cell {
            transition: background-color 0.1s ease-in-out !important;
          }
          
          .preview-hint {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
