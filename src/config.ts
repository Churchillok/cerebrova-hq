// ============================================
// CONFIG - App settings and game data
// ============================================

import type { Game, Domain } from './types';

// App configuration
export const CONFIG = {
  APP_NAME: 'CortexPrime',
  APP_VERSION: '2.1.0',
  MIN_THINK_ALOUD_LENGTH: 50,
  XP_PER_LEVEL: 100,
  DEFAULT_GAME_DURATION: 30,
};

// Cognitive domains
export const DOMAINS: Record<string, Domain> = {
  memory: {
    id: 'memory',
    name: 'Memory',
    icon: '🧠',
    color: '#8b5cf6',
    description: 'Remember and recall information',
  },
  attention: {
    id: 'attention',
    name: 'Attention',
    icon: '🎯',
    color: '#ec4899',
    description: 'Focus and concentration',
  },
  speed: {
    id: 'speed',
    name: 'Speed',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Quick thinking and reactions',
  },
  flexibility: {
    id: 'flexibility',
    name: 'Flexibility',
    icon: '🔄',
    color: '#10b981',
    description: 'Adapt to changing rules',
  },
  problem: {
    id: 'problem',
    name: 'Problem Solving',
    icon: '🧩',
    color: '#3b82f6',
    description: 'Logic and reasoning',
  },
  language: {
    id: 'language',
    name: 'Language',
    icon: '📝',
    color: '#6366f1',
    description: 'Words and communication',
  },
};

// All games in the app
export const GAMES: Game[] = [
  {
    id: 'mental-math',
    name: 'Mental Math',
    emoji: '🔢',
    description: 'Solve arithmetic problems quickly',
    domain: 'speed',
    type: 'tap',
    duration: 30,
  },
  {
    id: 'stroop',
    name: 'Color Clash',
    emoji: '🎨',
    description: 'Name the color, ignore the word',
    domain: 'attention',
    type: 'tap',
    duration: 30,
  },
  {
    id: 'reaction',
    name: 'Reflex Rush',
    emoji: '⚡',
    description: 'Tap when the screen turns green',
    domain: 'speed',
    type: 'tap',
    duration: 30,
  },
  {
    id: 'sequence',
    name: 'Sequence Master',
    emoji: '🔢',
    description: 'Find the pattern in numbers',
    domain: 'problem',
    type: 'tap',
    duration: 30,
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    emoji: '🎯',
    description: 'Remember the pattern of tiles',
    domain: 'memory',
    type: 'tap',
    duration: 30,
  },
  {
    id: 'speed-match',
    name: 'Speed Match',
    emoji: '👁️',
    description: 'Same or different? Decide fast!',
    domain: 'attention',
    type: 'tap',
    duration: 30,
  },
  {
    id: 'think-aloud',
    name: 'Think Aloud',
    emoji: '💭',
    description: 'Explain your reasoning to AI',
    domain: 'problem',
    type: 'think',
  },
];

// Get a game by ID
export function getGameById(id: string): Game | undefined {
  return GAMES.find(game => game.id === id);
}