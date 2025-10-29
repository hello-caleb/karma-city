import { useState, useEffect } from 'react';
import { useChannel } from '@devvit/kit';
import { TownState, createEmptyGrid, INITIAL_BUILDINGS } from '../../shared/gameTypes';

export function useTownState() {
  const [townState, setTownState] = useState<TownState>({
    grid: createEmptyGrid(),
    totalKarma: 0,
    contributorCount: 0,
    buildings: INITIAL_BUILDINGS
  });

  const [userKarma, setUserKarma] = useState<number>(1000); // Mock karma for now
  const [isLoading, setIsLoading] = useState(true);

  const channel = useChannel({
    name: 'town-updates',
    onMessage: (msg: any) => {
      if (msg.type === 'town-update') {
        setTownState(msg.townState);
      }
    }
  });

  useEffect(() => {
    // Load initial town state
    loadTownState();
  }, []);

  const loadTownState = async () => {
    try {
      // TODO: Fetch from server
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load town state:', error);
      setIsLoading(false);
    }
  };

  const placeBuilding = async (row: number, col: number, buildingId: string) => {
    const building = INITIAL_BUILDINGS.find(b => b.id === buildingId);
    if (!building) return;

    if (userKarma < building.cost) {
      alert('Not enough karma!');
      return;
    }

    // Update local state immediately
    const newGrid = townState.grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? buildingId : c))
    );

    setTownState({
      ...townState,
      grid: newGrid,
      totalKarma: townState.totalKarma + building.cost
    });

    setUserKarma(userKarma - building.cost);

    // TODO: Send to server
    channel.send({
      type: 'place-building',
      row,
      col,
      buildingId,
      cost: building.cost
    });
  };

  return {
    townState,
    userKarma,
    isLoading,
    placeBuilding
  };
}
