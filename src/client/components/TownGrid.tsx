import { Building } from '../../shared/gameTypes';

interface TownGridProps {
  grid: (string | null)[][];
  buildings: Building[];
  onCellClick: (row: number, col: number) => void;
}

export function TownGrid({ grid, buildings, onCellClick }: TownGridProps) {
  const getBuildingById = (id: string | null) => {
    if (!id) return null;
    return buildings.find(b => b.id === id);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 50px)',
      gridTemplateRows: 'repeat(10, 50px)',
      gap: '4px',
      margin: '20px auto',
      width: 'fit-content'
    }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const building = getBuildingById(cell);
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              style={{
                width: '50px',
                height: '50px',
                border: '2px solid #ccc',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: cell ? 'default' : 'pointer',
                backgroundColor: cell ? '#e8f4f8' : '#f9f9f9',
                fontSize: '24px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!cell) {
                  e.currentTarget.style.backgroundColor = '#e0e0e0';
                }
              }}
              onMouseLeave={(e) => {
                if (!cell) {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                }
              }}
            >
              {building ? building.icon : ''}
            </div>
          );
        })
      )}
    </div>
  );
}
