export interface Building {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  effect: string;
  // Synergy properties
  synergyCount: number;
  connectedBuildings: string[];
  synergyTypes: SynergyType[];
}

export interface SynergyType {
  id: string;
  name: string;
  buildings: string[];
  glowColor: string;
  effect: string;
}

export interface SynergyState {
  activeSynergies: Map<string, SynergyType>;
  buildingSynergies: Map<string, string[]>; // buildingId -> synergyIds
  totalSynergies: number;
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface SynergyPreviewData {
  position: GridPosition;
  buildingId: string;
  potentialSynergies: SynergyType[];
  affectedBuildings: GridPosition[];
}

export interface TownState {
  grid: (string | null)[][];
  totalKarma: number;
  contributorCount: number;
  buildings: Building[];
}

export interface PlayerContribution {
  username: string;
  karmaSpent: number;
  buildingsPlaced: number;
}

export interface PlayerStats {
  username: string;
  totalKarmaSpent: number;
  totalBuildings: number;
  buildingBreakdown: {
    'meme-factory': number;
    'bot-defense': number;
    'mod-academy': number;
    'gold-lounge': number;
    'upvote-monument': number;
  };
  firstContributionTime: number;
  lastActivityTime: number;
}

export interface ActivityEntry {
  id: string;
  username: string;
  buildingId: string;
  buildingName: string;
  buildingIcon: string;
  timestamp: number;
  karmaSpent: number;
}

export interface LeaderboardState {
  topPlayers: PlayerStats[];
  recentActivity: ActivityEntry[];
  isVisible: boolean; // for mobile toggle
}

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'meme-factory',
    name: 'Meme Factory',
    cost: 100,
    icon: '⚙️',
    description: 'Churn out fresh content',
    effect: '+10% karma generation',
    synergyCount: 0,
    connectedBuildings: [],
    synergyTypes: []
  },
  {
    id: 'bot-defense',
    name: 'Bot Defense Grid',
    cost: 150,
    icon: '🛡️',
    description: 'Keep the spam at bay',
    effect: 'Protects town from raids',
    synergyCount: 0,
    connectedBuildings: [],
    synergyTypes: []
  },
  {
    id: 'mod-academy',
    name: 'Mod Academy',
    cost: 250,
    icon: '🎓',
    description: 'Train the chosen ones',
    effect: 'Unlock governance features',
    synergyCount: 0,
    connectedBuildings: [],
    synergyTypes: []
  },
  {
    id: 'gold-lounge',
    name: 'Gold Lounge',
    cost: 500,
    icon: '🏛️',
    description: 'Where premium users chill',
    effect: 'Prestige building',
    synergyCount: 0,
    connectedBuildings: [],
    synergyTypes: []
  },
  {
    id: 'upvote-monument',
    name: 'Upvote Monument',
    cost: 1000,
    icon: '🗿',
    description: 'Peak Reddit achievement',
    effect: 'Endgame flex',
    synergyCount: 0,
    connectedBuildings: [],
    synergyTypes: []
  }
];

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

export function createEmptyGrid(): (string | null)[][] {
  return Array(10).fill(null).map(() => Array(10).fill(null));
}
