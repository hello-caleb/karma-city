# Implementation Plan

- [x] 1. Extend data types and state management
  - Add new TypeScript interfaces for PlayerStats, ActivityEntry, and LeaderboardState to shared/gameTypes.ts
  - Extend useTownState hook to include leaderboard state management and update functions
  - Implement player statistics calculation and activity feed management functions
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

- [x] 2. Create core leaderboard components
  - [x] 2.1 Implement main Leaderboard container component
    - Create responsive layout that switches between sidebar and overlay based on screen size
    - Implement dark theme styling consistent with Reddit colors
    - Add smooth CSS transitions for show/hide animations
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.5_

  - [x] 2.2 Build TopContributors ranking display
    - Create component to display top 10 players ranked by karma spent
    - Implement tie-breaking logic using first contribution timestamp
    - Add empty state message for when no players have contributed yet
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [x] 2.3 Create PlayerRankingItem component
    - Display player username, total karma spent, and building count
    - Implement expandable building breakdown with icons and counts
    - Add smooth animations for ranking changes and new entries
    - _Requirements: 1.2, 2.1, 2.2, 2.4, 5.3, 5.4_

- [x] 3. Implement activity feed system
  - [x] 3.1 Create RecentActivity component
    - Display chronological list of last 10 building placements
    - Show player username, building type, and relative timestamps
    - Implement auto-scroll to top behavior for new entries
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Build ActivityItem component
    - Display individual activity entries with building icons
    - Format relative timestamps (e.g., "2 minutes ago")
    - Apply consistent styling with the overall leaderboard theme
    - _Requirements: 3.2, 3.3, 5.2_

- [x] 4. Add mobile responsiveness and toggle functionality
  - [x] 4.1 Implement mobile toggle button
    - Create toggle button that appears only on mobile screens
    - Position button appropriately without blocking game grid
    - Add smooth animation for button appearance and interaction
    - _Requirements: 4.3, 4.5_

  - [x] 4.2 Configure responsive layout behavior
    - Implement CSS media queries for desktop sidebar vs mobile overlay
    - Ensure leaderboard maintains full functionality across all screen sizes
    - Test and adjust layout for various mobile device sizes
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 5. Integrate leaderboard with existing game systems
  - [x] 5.1 Modify building placement logic
    - Update placeBuilding function in useTownState to trigger leaderboard updates
    - Implement real-time statistics updates when buildings are placed
    - Add activity feed entries for each building placement
    - _Requirements: 1.3, 2.3, 3.2_

  - [x] 5.2 Add leaderboard to main App component
    - Import and render Leaderboard component in App.tsx
    - Position leaderboard appropriately without blocking main game interface
    - Pass necessary props and state from main app to leaderboard
    - _Requirements: 4.5, 5.2_

- [x] 6. Polish animations and visual feedback
  - [x] 6.1 Implement ranking change animations
    - Add smooth transitions when player rankings update
    - Create highlight effects for ranking changes that last 2 seconds
    - Implement slide-in animations for new leaderboard entries
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 6.2 Add visual consistency and theming
    - Apply Reddit-inspired dark theme colors throughout leaderboard
    - Ensure all components use inline styles consistent with existing codebase
    - Add hover effects and interactive feedback for better user experience
    - _Requirements: 5.2, 5.5_

- [ ] 7. Testing and validation
  - [ ]* 7.1 Write unit tests for leaderboard logic
    - Test player statistics calculation accuracy
    - Verify activity feed ordering and truncation
    - Test tie-breaking logic for equal karma scores
    - _Requirements: 1.4, 3.4_

  - [ ] 7.2 Create integration tests
    - Test leaderboard updates when buildings are placed
    - Verify mobile toggle functionality works correctly
    - Test responsive layout behavior across different screen sizes
    - _Requirements: 1.3, 4.1, 4.2, 4.3_
