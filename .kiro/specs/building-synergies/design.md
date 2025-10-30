# Building Synergies System Design Document

## Overview

The Building Adjacency Bonuses System introduces strategic depth to Karma City by rewarding thoughtful building placement through visual and gameplay synergies. The system detects adjacent buildings (horizontal and vertical neighbors), applies appropriate visual effects using CSS box-shadow glows, and provides real-time feedback through hover previews and synergy counters. The design emphasizes performance optimization and mobile compatibility while integrating seamlessly with the existing game architecture.

## Architecture

### Component Integration

```
Existing Architecture:
├── useTownState.ts (extended)
├── TownGrid.tsx (enhanced)
├── BuildingSelector.tsx (enhanced)
└── Leaderboard components (enhanced)

New Synergy Components:
├── SynergyCalculator.ts (utility)
├── SynergyVisualizer.tsx (visual effects)
├── SynergyPreview.tsx (hover/touch preview)
└── SynergyBadge.tsx (counter display)
```

### Data Flow

1. **Building Placement**: Player places building → `calculateSynergies()` runs for affected area
2. **Synergy Detection**: System checks 4 adjacent cells for each affected building
3. **Visual Updates**: CSS classes applied for glow effects and badges
4. **Statistics Update**: Leaderboard synergy counts updated in real-time
5. **Preview System**: Hover/touch events trigger synergy preview calculations

## Components and Interfaces

### Enhanced Data Types

```typescript
// Extend existing Building interface
interface Building {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  effect: string;
  // New synergy properties
  synergyCount: number;
  connectedBuildings: string[];
  synergyTypes: SynergyType[];
}

// New synergy-specific types
interface SynergyType {
  id: string;
  name: string;
  buildings: string[];
  glowColor: string;
  effect: string;
}

interface SynergyState {
  activeSynergies: Map<string, SynergyType>;
  buildingSynergies: Map<string, string[]>; // buildingId -> synergyIds
  totalSynergies: number;
}

interface GridPosition {
  row: number;
  col: number;
}

interface SynergyPreviewData {
  position: GridPosition;
  buildingId: string;
  potentialSynergies: SynergyType[];
  affectedBuildings: GridPosition[];
}
```

### Synergy Definitions

```typescript
export const SYNERGY_TYPES: SynergyType[] = [
  {
    id: 'viral-content-hub',
    name: 'Viral Content Hub',
    buildings: ['meme-factory', 'upvote-monument'],
    glowColor: '#ff4500', // Reddit orange
    effect: '2x karma generation bonus'
  },
  {
    id: 'security-nexus',
    name: 'Security Nexus',
    buildings: ['mod-academy', 'bot-defense'],
    glowColor: '#0079d3', // Reddit blue
    effect: 'Enhanced protection bonus'
  },
  {
    id: 'monument-plaza',
    name: 'Monument Plaza',
    buildings: ['upvote-monument', 'upvote-monument'],
    glowColor: '#ffd700', // Gold
    effect: 'Prestige multiplier'
  },
  {
    id: 'community-center',
    name: 'Community Center',
    buildings: [], // Special case: any building with 3+ neighbors
    glowColor: '#46d160', // Reddit green
    effect: 'Efficiency bonus'
  }
];
```

### Core Algorithm: Synergy Calculator

```typescript
class SynergyCalculator {
  private grid: (string | null)[][];
  private buildings: Building[];

  constructor(grid: (string | null)[][], buildings: Building[]) {
    this.grid = grid;
    this.buildings = buildings;
  }

  // Main calculation function
  calculateAllSynergies(): SynergyState {
    const activeSynergies = new Map<string, SynergyType>();
    const buildingSynergies = new Map<string, string[]>();

    // Iterate through each cell in the grid
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const buildingId = this.grid[row][col];
        if (buildingId) {
          const synergies = this.calculateBuildingSynergies(row, col, buildingId);
          if (synergies.length > 0) {
            buildingSynergies.set(`${row}-${col}`, synergies.map(s => s.id));
            synergies.forEach(synergy => {
              activeSynergies.set(`${synergy.id}-${row}-${col}`, synergy);
            });
          }
        }
      }
    }

    return {
      activeSynergies,
      buildingSynergies,
      totalSynergies: activeSynergies.size
    };
  }

  // Calculate synergies for a specific building
  private calculateBuildingSynergies(row: number, col: number, buildingId: string): SynergyType[] {
    const synergies: SynergyType[] = [];
    const adjacentBuildings = this.getAdjacentBuildings(row, col);

    // Check standard synergies
    SYNERGY_TYPES.forEach(synergyType => {
      if (synergyType.id === 'community-center') {
        // Special case: Community Center (3+ adjacent buildings)
        if (adjacentBuildings.length >= 3) {
          synergies.push(synergyType);
        }
      } else {
        // Standard synergies
        const hasRequiredBuildings = synergyType.buildings.every(requiredBuilding => {
          return buildingId === requiredBuilding || 
                 adjacentBuildings.some(adj => adj.buildingId === requiredBuilding);
        });
        
        if (hasRequiredBuildings && synergyType.buildings.includes(buildingId)) {
          synergies.push(synergyType);
        }
      }
    });

    return synergies;
  }

  // Get adjacent buildings (up, down, left, right)
  private getAdjacentBuildings(row: number, col: number): Array<{row: number, col: number, buildingId: string}> {
    const adjacent = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (this.isValidPosition(newRow, newCol)) {
        const buildingId = this.grid[newRow][newCol];
        if (buildingId) {
          adjacent.push({ row: newRow, col: newCol, buildingId });
        }
      }
    });

    return adjacent;
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.grid.length && 
           col >= 0 && col < this.grid[0].length;
  }

  // Preview potential synergies for building placement
  calculatePreviewSynergies(row: number, col: number, buildingId: string): SynergyPreviewData {
    // Temporarily place building for calculation
    const tempGrid = this.grid.map(r => [...r]);
    tempGrid[row][col] = buildingId;
    
    const tempCalculator = new SynergyCalculator(tempGrid, this.buildings);
    const synergies = tempCalculator.calculateBuildingSynergies(row, col, buildingId);
    const adjacentBuildings = this.getAdjacentBuildings(row, col);

    return {
      position: { row, col },
      buildingId,
      potentialSynergies: synergies,
      affectedBuildings: adjacentBuildings.map(adj => ({ row: adj.row, col: adj.col }))
    };
  }
}
```

## Visual Design Specifications

### CSS Glow Effects

```css
/* Base synergy glow classes */
.synergy-glow {
  position: relative;
  transition: box-shadow 0.3s ease-in-out;
}

.synergy-viral-content-hub {
  box-shadow: 
    0 0 20px rgba(255, 69, 0, 0.6),
    inset 0 0 20px rgba(255, 69, 0, 0.2);
}

.synergy-security-nexus {
  box-shadow: 
    0 0 20px rgba(0, 121, 211, 0.6),
    inset 0 0 20px rgba(0, 121, 211, 0.2);
}

.synergy-monument-plaza {
  box-shadow: 
    0 0 25px rgba(255, 215, 0, 0.7),
    inset 0 0 25px rgba(255, 215, 0, 0.3);
}

.synergy-community-center {
  box-shadow: 
    0 0 15px rgba(70, 209, 96, 0.5),
    inset 0 0 15px rgba(70, 209, 96, 0.2);
}

/* Connecting lines between synergistic buildings */
.synergy-connection {
  position: absolute;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  height: 2px;
  z-index: 10;
  pointer-events: none;
}

.synergy-connection.vertical {
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, currentColor, transparent);
}
```

### Synergy Badge Component

```typescript
interface SynergyBadgeProps {
  synergyCount: number;
  synergyTypes: SynergyType[];
  position: 'top-right' | 'bottom-right';
}

export function SynergyBadge({ synergyCount, synergyTypes, position }: SynergyBadgeProps) {
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  };

  return (
    <div style={badgeStyle} title={synergyTypes.map(s => s.name).join(', ')}>
      {synergyCount}
    </div>
  );
}
```

### Preview System Component

```typescript
interface SynergyPreviewProps {
  previewData: SynergyPreviewData | null;
  gridCellSize: number;
}

export function SynergyPreview({ previewData, gridCellSize }: SynergyPreviewProps) {
  if (!previewData || previewData.potentialSynergies.length === 0) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: previewData.position.row * gridCellSize,
    left: previewData.position.col * gridCellSize,
    width: gridCellSize,
    height: gridCellSize,
    border: '2px dashed #46d160',
    borderRadius: '4px',
    backgroundColor: 'rgba(70, 209, 96, 0.1)',
    zIndex: 15,
    pointerEvents: 'none'
  };

  return (
    <div style={overlayStyle}>
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1a1a1b',
        color: '#d7dadc',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        whiteSpace: 'nowrap',
        border: '1px solid #343536'
      }}>
        +{previewData.potentialSynergies.length} synergy
      </div>
    </div>
  );
}
```

## State Management Integration

### Extended useTownState Hook

```typescript
// Add to existing useTownState hook
const [synergyState, setSynergyState] = useState<SynergyState>({
  activeSynergies: new Map(),
  buildingSynergies: new Map(),
  totalSynergies: 0
});

const [synergyPreview, setSynergyPreview] = useState<SynergyPreviewData | null>(null);

// Enhanced placeBuilding function
const placeBuilding = async (row: number, col: number, buildingId: string) => {
  // ... existing logic ...
  
  // Calculate synergies after building placement
  const calculator = new SynergyCalculator(newGrid, INITIAL_BUILDINGS);
  const newSynergyState = calculator.calculateAllSynergies();
  setSynergyState(newSynergyState);
  
  // Update leaderboard with synergy stats
  updatePlayerStats(currentUsername, building.cost, buildingId, newSynergyState.totalSynergies);
};

// New preview functions
const showSynergyPreview = (row: number, col: number, buildingId: string) => {
  const calculator = new SynergyCalculator(townState.grid, INITIAL_BUILDINGS);
  const preview = calculator.calculatePreviewSynergies(row, col, buildingId);
  setSynergyPreview(preview);
};

const hideSynergyPreview = () => {
  setSynergyPreview(null);
};
```

## Performance Considerations

### Optimization Strategies

1. **Incremental Updates**: Only recalculate synergies for buildings within 2-cell radius of placement
2. **Memoization**: Cache synergy calculations for unchanged grid sections
3. **Efficient Data Structures**: Use Maps for O(1) synergy lookups
4. **CSS-Only Animations**: Avoid JavaScript animations for glow effects
5. **Debounced Preview**: Limit preview calculations during rapid hover movements

### Memory Management

```typescript
// Efficient synergy storage
class SynergyManager {
  private synergyCache = new Map<string, SynergyType[]>();
  
  // Cache key based on building and neighbors
  private getCacheKey(row: number, col: number, neighbors: string[]): string {
    return `${row}-${col}-${neighbors.sort().join(',')}`;
  }
  
  // Clear cache when grid changes significantly
  clearCache() {
    this.synergyCache.clear();
  }
}
```

## Mobile Responsiveness

### Touch Interaction Design

```typescript
// Enhanced touch handling for mobile preview
const handleTouchStart = (row: number, col: number, buildingId: string) => {
  showSynergyPreview(row, col, buildingId);
  
  // Auto-hide preview after 2 seconds on mobile
  setTimeout(() => {
    hideSynergyPreview();
  }, 2000);
};

// Responsive glow sizing
const getGlowIntensity = () => {
  return window.innerWidth <= 768 ? 0.4 : 0.6; // Reduced intensity on mobile
};
```

### Accessibility Considerations

- High contrast glow colors for visibility
- Screen reader announcements for synergy activation
- Keyboard navigation support for preview system
- Touch target sizing meets accessibility guidelines (44px minimum)

## Integration Points

### Leaderboard Enhancement

```typescript
// Extended PlayerStats interface
interface PlayerStats {
  // ... existing properties ...
  totalSynergies: number;
  synergyBreakdown: {
    'viral-content-hub': number;
    'security-nexus': number;
    'monument-plaza': number;
    'community-center': number;
  };
}

// Enhanced leaderboard display
const renderSynergyStats = (player: PlayerStats) => (
  <div style={{ fontSize: '10px', color: '#46d160' }}>
    ⚡ {player.totalSynergies} synergies
  </div>
);
```

### Error Handling

```typescript
// Graceful degradation for synergy system
const safeSynergyCalculation = (grid: (string | null)[][]) => {
  try {
    const calculator = new SynergyCalculator(grid, INITIAL_BUILDINGS);
    return calculator.calculateAllSynergies();
  } catch (error) {
    console.warn('Synergy calculation failed:', error);
    return {
      activeSynergies: new Map(),
      buildingSynergies: new Map(),
      totalSynergies: 0
    };
  }
};
```

## Testing Strategy

### Unit Testing Focus

- Synergy detection accuracy for all defined combinations
- Adjacent building calculation correctness
- Preview system functionality
- Performance with large grids (stress testing)

### Integration Testing

- Real-time synergy updates during building placement
- Leaderboard synergy statistics accuracy
- Mobile touch interaction reliability
- Visual glow effect rendering across browsers

### Performance Benchmarks

- Synergy calculation time < 16ms (60fps target)
- Memory usage increase < 10% with synergy system
- Mobile performance parity with desktop
- Smooth interaction with 100+ buildings on grid
