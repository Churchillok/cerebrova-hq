// ============================================
// TYPES - What our data looks like
// ============================================

// User's profile information
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at?: string;
}

// User's progress in the app
export interface UserProgress {
  user_id: string;
  level: number;
  xp: number;
  total_xp: number;
  npi: number;
  streak: number;
  max_streak: number;
  last_active: string | null;
  games_played: number;
  domain_scores: Record<string, number>;
  domain_plays: Record<string, number>;
  game_difficulty: Record<string, number>;
  goal: string;
  is_premium: boolean;
  updated_at?: string;
}

// A game in our app
export interface Game {
  id: string;
  name: string;
  emoji: string;
  description: string;
  domain: string;
  type: 'tap' | 'think';
  duration?: number;
}

// A cognitive domain (like Memory, Speed, etc.)
export interface Domain {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// AI analysis of Think Aloud responses
export interface ThinkAloudAnalysis {
  overall_score: number;
  dimensions: {
    depth: number;
    multiple_perspectives: number;
    practical_considerations: number;
    creativity: number;
  };
  strengths: string[];
  growth_areas: string[];
  feedback: string;
}

// Game data during play
export interface GameData {
  [key: string]: any;
}

// Leaderboard entry
export interface LeaderboardEntry {
  user_id: string;
  name: string;
  avatar: string;
  level: number;
  npi: number;
  total_xp: number;
  streak: number;
  games_played: number;
}

// Auth context type
export interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  refreshProgress: () => Promise<void>;
  clearError: () => void;
}

// Custom error class
export class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}