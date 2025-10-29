import { Building } from '../../shared/gameTypes';

interface BuildingSelectorProps {
  buildings: Building[];
  userKarma: number;
  onSelect: (buildingId: string) => void;
  onClose: () => void;
}

export function BuildingSelector({ buildings, userKarma, onSelect, onClose }: BuildingSelectorProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Choose a Building</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <strong>Your Karma:</strong> {userKarma}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {buildings.map((building) => {
            const canAfford = userKarma >= building.cost;
            return (
              <div
                key={building.id}
                onClick={() => canAfford && onSelect(building.id)}
                style={{
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  opacity: canAfford ? 1 : 0.5,
                  backgroundColor: canAfford ? 'white' : '#f5f5f5',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                    e.currentTarget.style.borderColor = '#0079d3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#ddd';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '32px' }}>{building.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {building.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {building.description}
                    </div>
                    <div style={{ fontSize: '12px', color: '#0079d3', marginTop: '4px' }}>
                      {building.effect}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: canAfford ? '#0079d3' : '#999'
                  }}>
                    {building.cost} 🔺
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
