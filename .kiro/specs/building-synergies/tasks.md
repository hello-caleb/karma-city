# Implementation Plan

- [x] 1. Extend data types and core synergy logic
  - Add synergy-related interfaces to shared/gameTypes.ts (SynergyType, SynergyState, SynergyPreviewData)
  - Extend Building interface with synergyCount, connectedBuildings, and synergyTypes properties
  - Define SYNERGY_TYPES constant with all four synergy configurations
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.1, 4.1, 5.5_

- [x] 2. Implement synergy calculation engine
  - [x] 2.1 Create SynergyCalculator utility class
    - Write calculateAllSynergies() method to detect all active synergies on the grid
    - Implement calculateBuildingSynergies() for individual building synergy detection
    - Add getAdjacentBuildings() helper to find horizontal and vertical neighbors
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.4, 5.1, 5.3_

  - [x] 2.2 Add synergy preview calculation
    - Implement calculatePreviewSynergies() method for hover/touch preview
    - Create temporary grid simulation for potential synergy detection
    - Add efficient caching mechanism for preview calculations
    - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2_

- [x] 3. Create visual synergy components
  - [x] 3.1 Build SynergyBadge component
    - Display synergy count on buildings with active synergies
    - Add tooltip showing synergy type names on hover
    - Implement responsive positioning for mobile and desktop
    - _Requirements: 3.1, 3.2, 2.4, 5.4_

  - [x] 3.2 Create SynergyPreview component
    - Show potential synergies when hovering over empty cells
    - Implement touch-friendly preview for mobile devices
    - Add visual indicators for affected adjacent buildings
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [-] 3.3 Implement CSS glow effects
    - Add synergy glow classes for each synergy type (orange, blue, gold, green)
    - Create connecting line effects between synergistic buildings
    - Ensure mobile-optimized glow intensity and performance
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.2, 5.4_

- [ ] 4. Integrate synergy system with existing game logic
  - [ ] 4.1 Extend useTownState hook with synergy management
    - Add synergyState and synergyPreview to hook state
    - Implement showSynergyPreview and hideSynergyPreview functions
    - Create updateSynergyStats function for leaderboard integration
    - _Requirements: 3.3, 3.4, 5.3, 5.5_

  - [ ] 4.2 Enhance building placement logic
    - Modify placeBuilding function to calculate synergies after placement
    - Update affected buildings' synergy counts and visual states
    - Integrate synergy statistics into player stats tracking
    - _Requirements: 3.3, 4.4, 5.3, 5.5_

- [ ] 5. Update grid and building components
  - [ ] 5.1 Enhance TownGrid component
    - Add synergy glow CSS classes to grid cells with active synergies
    - Integrate SynergyPreview component for hover/touch interactions
    - Implement efficient re-rendering for synergy visual updates
    - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3, 5.1, 5.4_

  - [ ] 5.2 Update BuildingSelector for synergy preview
    - Add synergy preview when selecting building types
    - Show potential synergy information in building selection UI
    - Integrate with mobile touch interactions for preview system
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 6. Enhance leaderboard with synergy statistics
  - [ ] 6.1 Extend PlayerStats interface and tracking
    - Add totalSynergies and synergyBreakdown properties to PlayerStats
    - Update updatePlayerStats function to include synergy counts
    - Implement synergy statistics calculation and storage
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 6.2 Update leaderboard display components
    - Add synergy statistics to PlayerRankingItem component
    - Display "Active Synergies" count in leaderboard headers
    - Implement real-time synergy statistics updates
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 7. Performance optimization and mobile compatibility
  - [ ] 7.1 Implement performance optimizations
    - Add incremental synergy calculation for affected areas only
    - Implement synergy calculation caching and memoization
    - Optimize CSS glow effects for smooth mobile performance
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 7.2 Ensure mobile responsiveness
    - Test and optimize touch interactions for synergy preview
    - Adjust glow effect intensity for mobile device performance
    - Verify synergy badge visibility and touch targets on mobile
    - _Requirements: 2.4, 2.5, 5.4, 5.5_

- [ ] 8. Testing and validation
  - [ ]* 8.1 Write unit tests for synergy logic
    - Test synergy detection accuracy for all defined combinations
    - Verify adjacent building calculation correctness
    - Test Community Center detection with 3+ adjacent buildings
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.4_

  - [ ] 8.2 Create integration tests
    - Test real-time synergy updates during building placement
    - Verify leaderboard synergy statistics accuracy
    - Test mobile touch interaction reliability and preview system
    - _Requirements: 2.1, 2.2, 2.3, 3.3, 5.3, 5.5_
