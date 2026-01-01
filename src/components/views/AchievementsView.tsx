import React from 'react';
import { useAuth } from '../../contexts/AuthProvider';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (progress: any) => boolean;
  progress: (progress: any) => { current: number; target: number };
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    name: 'First Steps',
    description: 'Complete your first game',
    icon: '🎮',
    requirement: (p) => p?.games_played >= 1,
    progress: (p) => ({ current: Math.min(p?.games_played || 0, 1), target: 1 }),
  },
  {
    id: 'ten-games',
    name: 'Getting Started',
    description: 'Complete 10 games',
    icon: '🔥',
    requirement: (p) => p?.games_played >= 10,
    progress: (p) => ({ current: Math.min(p?.games_played || 0, 10), target: 10 }),
  },
  {
    id: 'fifty-games',
    name: 'Dedicated Trainer',
    description: 'Complete 50 games',
    icon: '💪',
    requirement: (p) => p?.games_played >= 50,
    progress: (p) => ({ current: Math.min(p?.games_played || 0, 50), target: 50 }),
  },
  {
    id: 'hundred-games',
    name: 'Brain Athlete',
    description: 'Complete 100 games',
    icon: '🏆',
    requirement: (p) => p?.games_played >= 100,
    progress: (p) => ({ current: Math.min(p?.games_played || 0, 100), target: 100 }),
  },
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    requirement: (p) => p?.level >= 5,
    progress: (p) => ({ current: Math.min(p?.level || 1, 5), target: 5 }),
  },
  {
    id: 'level-10',
    name: 'Brain Master',
    description: 'Reach level 10',
    icon: '🌟',
    requirement: (p) => p?.level >= 10,
    progress: (p) => ({ current: Math.min(p?.level || 1, 10), target: 10 }),
  },
  {
    id: 'level-25',
    name: 'Genius',
    description: 'Reach level 25',
    icon: '🧠',
    requirement: (p) => p?.level >= 25,
    progress: (p) => ({ current: Math.min(p?.level || 1, 25), target: 25 }),
  },
  {
    id: 'xp-1000',
    name: 'XP Hunter',
    description: 'Earn 1,000 total XP',
    icon: '💎',
    requirement: (p) => p?.total_xp >= 1000,
    progress: (p) => ({ current: Math.min(p?.total_xp || 0, 1000), target: 1000 }),
  },
  {
    id: 'xp-5000',
    name: 'XP Champion',
    description: 'Earn 5,000 total XP',
    icon: '👑',
    requirement: (p) => p?.total_xp >= 5000,
    progress: (p) => ({ current: Math.min(p?.total_xp || 0, 5000), target: 5000 }),
  },
  {
    id: 'npi-600',
    name: 'Sharp Mind',
    description: 'Reach NPI score of 600',
    icon: '🎯',
    requirement: (p) => p?.npi >= 600,
    progress: (p) => ({ current: Math.min(p?.npi || 500, 600), target: 600 }),
  },
  {
    id: 'npi-700',
    name: 'Elite Thinker',
    description: 'Reach NPI score of 700',
    icon: '🚀',
    requirement: (p) => p?.npi >= 700,
    progress: (p) => ({ current: Math.min(p?.npi || 500, 700), target: 700 }),
  },
  {
    id: 'streak-3',
    name: 'On Fire',
    description: 'Reach a 3-day streak',
    icon: '🔥',
    requirement: (p) => p?.max_streak >= 3,
    progress: (p) => ({ current: Math.min(p?.max_streak || 0, 3), target: 3 }),
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Reach a 7-day streak',
    icon: '📅',
    requirement: (p) => p?.max_streak >= 7,
    progress: (p) => ({ current: Math.min(p?.max_streak || 0, 7), target: 7 }),
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Reach a 30-day streak',
    icon: '🏅',
    requirement: (p) => p?.max_streak >= 30,
    progress: (p) => ({ current: Math.min(p?.max_streak || 0, 30), target: 30 }),
  },
];

export function AchievementsView() {
  const { progress } = useAuth();

  const unlockedCount = ACHIEVEMENTS.filter(a => a.requirement(progress)).length;

  return (
    <div className="p-6 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <p className="text-slate-400">
          {unlockedCount} of {ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400">Completion</span>
          <span className="text-white font-semibold">
            {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all"
            style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-3">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = achievement.requirement(progress);
          const { current, target } = achievement.progress(progress);
          const percent = Math.round((current / target) * 100);

          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl border transition-all ${
                unlocked
                  ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border-violet-500/30'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                    unlocked ? 'bg-violet-500/20' : 'bg-white/10 grayscale'
                  }`}
                >
                  {achievement.icon}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${unlocked ? 'text-white' : 'text-slate-400'}`}>
                      {achievement.name}
                    </h3>
                    {unlocked && <span className="text-emerald-400">✓</span>}
                  </div>
                  <p className="text-slate-400 text-sm">{achievement.description}</p>

                  {/* Progress Bar */}
                  {!unlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{current} / {target}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500/50 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}