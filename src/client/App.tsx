import { useState } from 'react';
import { TownGrid } from './components/TownGrid';
import { BuildingSelector } from './components/BuildingSelector';
import { useTownState } from './hooks/useTownState';

export function App() {
  const { townState, userKarma, isLoading, placeBuilding } = useTownState();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    // Don't allow clicking on occupied cells
    if (townState.grid[row][col] !== null) {
      return;
    }
    setSelectedCell({ row, col });
  };

  const handleBuildingSelect = (buildingId: string) => {
    if (selectedCell) {
      placeBuilding(selectedCell.row, selectedCell.col, buildingId);
      setSelectedCell(null);
    }
  };

  const handleCloseSelector = () => {
    setSelectedCell(null);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏙️</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading Karma City...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '36px',
          margin: '0 0 8px 0',
          color: '#1a1a1a'
        }}>
          🏙️ Karma City
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: 0
        }}>
          Build your Reddit town together
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            Your Karma
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0079d3' }}>
            {userKarma} 🔺
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            Town Karma
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4500' }}>
            {townState.totalKarma}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            Contributors
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#46d160' }}>
            {townState.contributorCount}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        textAlign: 'center',
        marginBottom: '16px',
        color: '#666',
        fontSize: '14px'
      }}>
        Click an empty cell to place a building
      </div>

      {/* Town Grid */}
      <TownGrid
        grid={townState.grid}
        buildings={townState.buildings}
        onCellClick={handleCellClick}
      />

      {/* Building Selector Modal */}
      {selectedCell && (
        <BuildingSelector
          buildings={townState.buildings}
          userKarma={userKarma}
          onSelect={handleBuildingSelect}
          onClose={handleCloseSelector}
        />
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #ddd',
        color: '#999',
        fontSize: '14px'
      }}>
        <p>Built for Reddit Community Games Hackathon 2025</p>
      </div>
    </div>
  );
}
