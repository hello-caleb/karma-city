import { useState, useEffect } from 'react';
import { TownState, createEmptyGrid, INITIAL_BUILDINGS, LeaderboardState, PlayerStats, ActivityEntry, SynergyState, SynergyPreviewData } from '../../shared/gameTypes';
import { SynergyCalculator } from '../../shared/SynergyCalculator';

export function useTownState() {
  const [townState, setTownState] = useState<TownState>({
    grid: createEmptyGrid(),
    totalKarma: 0,
    contributorCount: 0,
    buildings: INITIAL_BUILDINGS
  });

  const [userKarma, setUserKarma] = useState<number>(1000);
  const [isLoading, setIsLoading] = useState(false);
  
  const [leaderboardState, setLeaderboardState] = useState<LeaderboardState>({
    topPlayers: [],
    recentActivity: [],
    isVisible: false
  });

  // Synergy state management
  const [synergyState, setSynergyState] = useState<SynergyState>({
    activeSynergies: new Map(),
    buildingSynergies: new Map(),
    totalSynergies: 0
  });

  const [synergyPreview, setSynergyPreview] = useState<SynergyPreviewData | null>(null);

  // Mock current username - in real implementation this would come from Reddit context
  const currentUsername = 'Player1';

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const updatePlayerStats = (username: string, karmaSpent: number, buildingId: string) => {
    setLeaderboardState(prev => {
      const existingPlayerIndex = prev.topPlayers.findIndex(p => p.username === username);
      let updatedPlayers = [...prev.topPlayers];

      if (existingPlayerIndex >= 0) {
        // Update existing player
        const existingPlayer = { ...updatedPlayers[existingPlayerIndex] };
        existingPlayer.totalKarmaSpent += karmaSpent;
        existingPlayer.totalBuildings += 1;
        existingPlayer.buildingBreakdown[buildingId as keyof typeof existingPlayer.buildingBreakdown] += 1;
        existingPlayer.lastActivityTime = Date.now();
        updatedPlayers[existingPlayerIndex] = existingPlayer;
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
            'gold-lounge': buildingId === 'gold-lounge' ? 1 : 0,
            'upvote-monument': buildingId === 'upvote-monument' ? 1 : 0,
          },
          firstContributionTime: Date.now(),
          lastActivityTime: Date.now()
        };
        updatedPlayers.push(newPlayer);
      }

      // Sort by karma spent (descending), then by first contribution time (ascending) for ties
      updatedPlayers.sort((a, b) => {
        if (b.totalKarmaSpent !== a.totalKarmaSpent) {
          return b.totalKarmaSpent - a.totalKarmaSpent;
        }
        return a.firstContributionTime - b.firstContributionTime;
      });

      // Keep only top 10 players
      updatedPlayers = updatedPlayers.slice(0, 10);

      return {
        ...prev,
        topPlayers: updatedPlayers
      };
    });
  };

  const addActivityEntry = (username: string, buildingId: string, buildingName: string, buildingIcon: string, karmaSpent: number) => {
    setLeaderboardState(prev => {
      const newActivity: ActivityEntry = {
        id: `${username}-${Date.now()}`,
        username,
        buildingId,
        buildingName,
        buildingIcon,
        timestamp: Date.now(),
        karmaSpent
      };

      // Add new activity to the beginning and keep only last 10
      const updatedActivity = [newActivity, ...prev.recentActivity].slice(0, 10);

      return {
        ...prev,
        recentActivity: updatedActivity
      };
    });
  };

  const toggleLeaderboardVisibility = () => {
    setLeaderboardState(prev => ({
      ...prev,
      isVisible: !prev.isVisible
    }));
  };

  // Synergy preview functions
  const showSynergyPreview = (row: number, col: number, buildingId: string) => {
    const calculator = new SynergyCalculator(townState.grid, INITIAL_BUILDINGS);
    const preview = calculator.calculatePreviewSynergies(row, col, buildingId);
    setSynergyPreview(preview);
  };

  const hideSynergyPreview = () => {
    setSynergyPreview(null);
  };

  const updateSynergyStats = (newSynergyState: SynergyState) => {
    setSynergyState(newSynergyState);
  };

  const placeBuilding = async (row: number, col: number, buildingId: string) => {
    const building = INITIAL_BUILDINGS.find(b => b.id === buildingId);
    if (!building) return;

    if (userKarma < building.cost) {
      alert('Not enough karma!');
      return;
    }

    const newGrid = townState.grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? buildingId : c))
    );

    // Calculate synergies after building placement
    const calculator = new SynergyCalculator(newGrid, INITIAL_BUILDINGS);
    const newSynergyState = calculator.calculateAllSynergies();
    setSynergyState(newSynergyState);

    setTownState({
      ...townState,
      grid: newGrid,
      totalKarma: townState.totalKarma + building.cost,
      contributorCount: townState.contributorCount + 1
    });

    setUserKarma(userKarma - building.cost);

    // Clear any active preview
    setSynergyPreview(null);

    // Update leaderboard data with synergy count
    updatePlayerStats(currentUsername, building.cost, buildingId);
    addActivityEntry(currentUsername, buildingId, building.name, building.icon, building.cost);
  };

  return {
    townState,
    userKarma,
    isLoading,
    leaderboardState,
    synergyState,
    synergyPreview,
    placeBuilding,
    updatePlayerStats,
    addActivityEntry,
    toggleLeaderboardVisibility,
    showSynergyPreview,
    hideSynergyPreview,
    updateSynergyStats
  };
}
