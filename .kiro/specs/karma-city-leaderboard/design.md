# Leaderboard System Design Document

## Overview

The Karma City Leaderboard System is a comprehensive ranking and statistics component that enhances player engagement through competitive elements. It consists of a responsive sidebar that displays top contributors, detailed building breakdowns, and recent activity feeds. The system integrates seamlessly with the existing React-based game architecture while maintaining the established visual design language.

## Architecture

### Component Hierarchy

```
App.tsx
├── Leaderboard.tsx (new)
│   ├── LeaderboardHeader.tsx
│   ├── TopContributors.tsx
│   │   └── PlayerRankingItem.tsx
│   ├── BuildingBreakdown.tsx
│   └── RecentActivity.tsx
│       └── ActivityItem.tsx
└── LeaderboardToggle.tsx (mobile only)
```

### Data Flow

1. **State Management**: Extend existing `useTownState` hook to include leaderboard data
2. **Real-time Updates**: Leaderboard data updates immediately when `placeBuilding` is called
3. **Persistence**: Player contributions stored in the same format as existing town state
4. **Responsive Behavior**: CSS media queries handle desktop sidebar vs mobile overlay

## Components and Interfaces

### Core Data Types

```typescript
interface PlayerStats {
  username: string;
  totalKarmaSpent: number;
  totalBuildings: number;
  buildingBreakdown: {
    'meme-factory': number;
    'bot-defense': number;
    'mod-academy': number;
    'upvote-monument': number;
  };
  firstContributionTime: number;
  lastActivityTime: number;
}

interface ActivityEntry {
  id: string;
  username: string;
  buildingId: string;
  buildingName: string;
  buildingIcon: string;
  timestamp: number;
  karmaSpent: number;
}

interface LeaderboardState {
  topPlayers: PlayerStats[];
  recentActivity: ActivityEntry[];
  isVisible: boolean; // for mobile toggle
}
```

### Component Specifications

#### Leaderboard.tsx
- **Purpose**: Main container component managing layout and responsive behavior
- **Props**: `leaderboardData: LeaderboardState`, `onToggle: () => void`
- **Styling**: Fixed position sidebar on desktop, overlay on mobile
- **Responsive Breakpoint**: 768px

#### TopContributors.tsx
- **Purpose**: Displays ranked list of top 10 players
- **Features**: Smooth animations for rank changes, tie-breaking by timestamp
- **Empty State**: Encouraging message when no contributors exist

#### PlayerRankingItem.tsx
- **Purpose**: Individual player entry with stats and building breakdown
- **Animation**: Slide-in effect for new entries, highlight for recent changes
- **Layout**: Username, karma spent, building count, expandable breakdown

#### RecentActivity.tsx
- **Purpose**: Chronological feed of last 10 building placements
- **Features**: Real-time updates, relative timestamps, building icons
- **Scroll Behavior**: Auto-scroll to top on new entries

#### BuildingBreakdown.tsx
- **Purpose**: Visual breakdown of building types per player
- **Display**: Building icons with counts, compact horizontal layout
- **Interaction**: Hover tooltips showing building names and effects

### State Management Extension

Extend `useTownState` hook with leaderboard functionality:

```typescript
// Add to existing useTownState hook
const [leaderboardState, setLeaderboardState] = useState<LeaderboardState>({
  topPlayers: [],
  recentActivity: [],
  isVisible: false
});

// Modify placeBuilding function to update leaderboard
const placeBuilding = async (row: number, col: number, buildingId: string) => {
  // ... existing logic ...
  
  // Update leaderboard data
  updatePlayerStats(currentUsername, building.cost, buildingId);
  addActivityEntry(currentUsername, building);
};
```

## Data Models

### Player Statistics Calculation

```typescript
function updatePlayerStats(username: string, karmaSpent: number, buildingId: string) {
  const existingPlayer = leaderboardState.topPlayers.find(p => p.username === username);
  
  if (existingPlayer) {
    existingPlayer.totalKarmaSpent += karmaSpent;
    existingPlayer.totalBuildings += 1;
    existingPlayer.buildingBreakdown[buildingId] += 1;
    existingPlayer.lastActivityTime = Date.now();
  } else {
    // Create new player entry
    const newPlayer: PlayerStats = {
      username,
      totalKarmaSpent: karmaSpent,
      totalBuildings: 1,
      buildingBreakdown: {
        'meme-factory': buildingId === 'meme-factory' ? 1 : 0,
        'bot-defense': buildingId === 'bot-defense' ? 1 : 0,
        'mod-academy': buildingId === 'mod-academy' ? 1 : 0,
        'upvote-monument': buildingId === 'upvote-monument' ? 1 : 0,
      },
      firstContributionTime: Date.now(),
      lastActivityTime: Date.now()
    };
  }
  
  // Re-sort by karma spent, then by first contribution time for ties
  const sortedPlayers = [...leaderboardState.topPlayers]
    .sort((a, b) => {
      if (b.totalKarmaSpent !== a.totalKarmaSpent) {
        return b.totalKarmaSpent - a.totalKarmaSpent;
      }
      return a.firstContributionTime - b.firstContributionTime;
    })
    .slice(0, 10);
}
```

### Activity Feed Management

```typescript
function addActivityEntry(username: string, building: Building) {
  const newActivity: ActivityEntry = {
    id: `${username}-${Date.now()}`,
    username,
    buildingId: building.id,
    buildingName: building.name,
    buildingIcon: building.icon,
    timestamp: Date.now(),
    karmaSpent: building.cost
  };
  
  const updatedActivity = [newActivity, ...leaderboardState.recentActivity].slice(0, 10);
  
  setLeaderboardState(prev => ({
    ...prev,
    recentActivity: updatedActivity
  }));
}
```

## Error Handling

### Edge Cases

1. **No Players Yet**: Display encouraging message with game instructions
2. **Tied Scores**: Use first contribution timestamp as tiebreaker
3. **Mobile Overflow**: Implement proper scrolling for long lists
4. **Animation Conflicts**: Queue animations to prevent visual glitches
5. **Username Display**: Truncate long usernames with ellipsis

### Graceful Degradation

- Leaderboard functions without breaking main game if data is unavailable
- Fallback to empty states with appropriate messaging
- Maintain game functionality even if leaderboard updates fail

## Testing Strategy

### Unit Tests (Optional)

- Player statistics calculation accuracy
- Activity feed ordering and truncation
- Responsive layout behavior
- Animation timing and transitions

### Integration Tests (Optional)

- Leaderboard updates when buildings are placed
- Mobile toggle functionality
- Data persistence across game sessions
- Performance with large datasets

### Manual Testing Focus

- Visual consistency across different screen sizes
- Smooth animations during rapid building placement
- Proper ranking updates with multiple simultaneous players
- Mobile usability and touch interactions

## Visual Design Specifications

### Color Scheme (Reddit-inspired Dark Theme)

```css
:root {
  --reddit-orange: #ff4500;
  --reddit-blue: #0079d3;
  --reddit-dark: #1a1a1b;
  --reddit-gray: #343536;
  --reddit-light-gray: #818384;
  --reddit-white: #d7dadc;
  --reddit-green: #46d160;
  --background-dark: #030303;
  --card-background: #1a1a1b;
  --border-color: #343536;
}
```

### Layout Specifications

- **Desktop Sidebar**: 320px width, fixed position right
- **Mobile Overlay**: Full screen with 90% width, centered
- **Card Spacing**: 12px between items, 16px padding inside cards
- **Typography**: Arial font family, consistent with existing app
- **Animations**: 0.3s ease-in-out transitions, 0.5s slide animations

### Responsive Breakpoints

```css
/* Desktop: Sidebar layout */
@media (min-width: 769px) {
  .leaderboard {
    position: fixed;
    right: 20px;
    top: 20px;
    width: 320px;
    height: calc(100vh - 40px);
  }
}

/* Mobile: Overlay layout */
@media (max-width: 768px) {
  .leaderboard {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-height: 80vh;
    z-index: 1000;
  }
}
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use React.memo for PlayerRankingItem components
2. **Virtual Scrolling**: Not needed for top 10 list, but consider for future expansion
3. **Debounced Updates**: Batch rapid building placements to prevent excessive re-renders
4. **Efficient Sorting**: Pre-sort data and use binary search for insertions

### Memory Management

- Limit activity feed to 10 items maximum
- Clean up animation timers and intervals
- Use weak references for temporary highlight effects

## Integration Points

### Existing Codebase Integration

1. **useTownState Hook**: Extend with leaderboard state management
2. **App.tsx**: Add Leaderboard component to main layout
3. **Building Placement**: Modify placeBuilding function to update leaderboard
4. **Styling Consistency**: Use existing inline style patterns

### Future Extensibility

- Modular design allows easy addition of new statistics
- Component structure supports additional leaderboard categories
- Data model accommodates future building types
- Animation system can be extended for new visual effects
