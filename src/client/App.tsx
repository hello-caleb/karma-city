import { useState } from 'react';
import { TownGrid } from './components/TownGrid';
import { BuildingSelector } from './components/BuildingSelector';
import { Leaderboard } from './components/Leaderboard';
import { LeaderboardToggle } from './components/LeaderboardToggle';
import { useTownState } from './hooks/useTownState';

export function App() {
  const { townState, userKarma, isLoading, leaderboardState, synergyState, placeBuilding, toggleLeaderboardVisibility } = useTownState();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (townState.grid[row][col] !== null) {
      return;
    }
    setSelectedCell({ row, col });
  };

  const handleBuildingSelect = (buildingId: string) => {
    if (selectedCell) {
      placeBuilding(selectedCell.row, selectedCell.col, buildingId);
      setSelectedCell(null);
      setSelectedBuildingId(null);
    } else {
      // If no cell is selected, set the building for preview mode
      setSelectedBuildingId(buildingId);
    }
  };

  const handleCloseSelector = () => {
    setSelectedCell(null);
    setSelectedBuildingId(null);
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
      paddingRight: window.innerWidth > 768 ? '360px' : '20px', // Make room for desktop sidebar
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
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

      {/* Quick Building Selector for Synergy Preview */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        padding: '0 20px'
      }}>
        {townState.buildings.map((building) => {
          const canAfford = userKarma >= building.cost;
          const isSelected = selectedBuildingId === building.id;
          
          return (
            <button
              key={building.id}
              onClick={() => setSelectedBuildingId(isSelected ? null : building.id)}
              disabled={!canAfford}
              style={{
                padding: '8px 12px',
                border: `2px solid ${isSelected ? '#46d160' : (canAfford ? '#0079d3' : '#ccc')}`,
                borderRadius: '6px',
                backgroundColor: isSelected ? '#e8f5e8' : (canAfford ? 'white' : '#f5f5f5'),
                cursor: canAfford ? 'pointer' : 'not-allowed',
                opacity: canAfford ? 1 : 0.5,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
                minWidth: '80px'
              }}
              title={`${building.name} - ${building.cost} karma${!canAfford ? ' (Not enough karma)' : ''}`}
            >
              <span style={{ fontSize: '16px' }}>{building.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '10px' }}>
                  {building.name.split(' ')[0]}
                </div>
                <div style={{ color: canAfford ? '#0079d3' : '#999', fontSize: '9px' }}>
                  {building.cost} 🔺
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: '16px',
        color: '#666',
        fontSize: '14px'
      }}>
        {selectedBuildingId ? (
          <div>
            <div style={{ marginBottom: '4px' }}>
              Selected: <strong>{townState.buildings.find(b => b.id === selectedBuildingId)?.name}</strong>
            </div>
            <div style={{ fontSize: '12px' }}>
              Hover over empty cells to preview synergies, then click to place
            </div>
          </div>
        ) : (
          'Select a building above, then hover over empty cells to preview synergies'
        )}
      </div>

      <TownGrid
        grid={townState.grid}
        buildings={townState.buildings}
        onCellClick={handleCellClick}
        selectedBuildingId={selectedBuildingId}
        showSynergyPreviews={true}
      />

      {selectedCell && (
        <BuildingSelector
          buildings={townState.buildings}
          userKarma={userKarma}
          onSelect={handleBuildingSelect}
          onClose={handleCloseSelector}
        />
      )}

      <LeaderboardToggle
        isVisible={leaderboardState.isVisible}
        onToggle={toggleLeaderboardVisibility}
      />

      <Leaderboard
        leaderboardData={leaderboardState}
        onToggle={toggleLeaderboardVisibility}
      />

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
