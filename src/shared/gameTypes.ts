// Building definition
export interface Building {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  effect: string;
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

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'meme-factory',
    name: 'Meme Factory',
    cost: 100,
    icon: '⚙️',
    description: 'Churn out fresh content',
    effect: '+10% karma generation'
  },
  {
    id: 'bot-defense',
    name: 'Bot Defense Grid',
    cost: 150,
    icon: '🛡️',
    description: 'Keep the spam at bay',
    effect: 'Protects town from raids'
  },
  {
    id: 'mod-academy',
    name: 'Mod Academy',
    cost: 250,
    icon: '🎓',
    description: 'Train the chosen ones',
    effect: 'Unlock governance features'
  },
  {
    id: 'gold-lounge',
    name: 'Gold Lounge',
    cost: 500,
    icon: '🏛️',
    description: 'Where premium users chill',
    effect: 'Prestige building'
  },
  {
    id: 'upvote-monument',
    name: 'Upvote Monument',
    cost: 1000,
    icon: '🗿',
    description: 'Peak Reddit achievement',
    effect: 'Endgame flex'
  }
];

export function createEmptyGrid(): (string | null)[][] {
  return Array(10).fill(null).map(() => Array(10).fill(null));
}
