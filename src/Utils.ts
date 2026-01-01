// ============================================
// UTILS - Helper functions
// ============================================

import { CONFIG } from './config';

// Calculate level from total XP
export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / CONFIG.XP_PER_LEVEL) + 1;
}

// Calculate XP within current level
export function calculateXpForLevel(totalXp: number): number {
  return totalXp % CONFIG.XP_PER_LEVEL;
}

// Calculate XP needed for next level
export function calculateXpToNextLevel(totalXp: number): number {
  return CONFIG.XP_PER_LEVEL - calculateXpForLevel(totalXp);
}

// Calculate NPI (Neural Performance Index) from domain scores
export function calculateNPI(domainScores: Record<string, number>): number {
  const scores = Object.values(domainScores);
  if (scores.length === 0) return 500;
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(average * 10);
}

// Get today's date as YYYY-MM-DD
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Calculate streak based on last active date
export function calculateStreak(lastActive: string | null, currentStreak: number): number {
  if (!lastActive) return 1;
  
  const today = new Date();
  const last = new Date(lastActive);
  const diffTime = today.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - keep streak
    return currentStreak;
  } else if (diffDays === 1) {
    // Next day - increase streak
    return currentStreak + 1;
  } else {
    // Missed days - reset streak
    return 1;
  }
}

// Format large numbers nicely
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Validate email format
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password (at least 6 characters)
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

// Validate name (at least 2 characters)
export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

// Generate random avatar emoji
export function getRandomAvatar(): string {
  const avatars = ['🧠', '🎯', '⚡', '🔥', '💪', '🌟', '🎮', '🏆', '💎', '🚀'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// Delay function for animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}