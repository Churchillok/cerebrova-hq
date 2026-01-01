import React from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { DOMAINS } from '../../config';
import { calculateLevel, calculateXpForLevel } from '../../utils';

export function DashboardView({ onStartTraining }: { onStartTraining: () => void }) {
  const { profile, progress } = useAuth();
  
  const level = progress ? calculateLevel(progress.total_xp) : 1;
  const xpInLevel = progress ? calculateXpForLevel(progress.total_xp) : 0;
  const xpNeeded = 100;

  return (
    <div className="p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hello, {profile?.name?.split(' ')[0] || 'Trainer'}!</h1>
          <p className="text-slate-400">Ready to train your brain?</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl">
          {profile?.avatar || '🧠'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-600/5 border border-violet-500/20">
          <p className="text-slate-400 text-sm">Level</p>
          <p className="text-3xl font-bold text-white">{level}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-cyan-600/5 border border-cyan-500/20">
          <p className="text-slate-400 text-sm">NPI Score</p>
          <p className="text-3xl font-bold text-white">{progress?.npi || 500}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-600/5 border border-amber-500/20">
          <p className="text-slate-400 text-sm">Streak</p>
          <p className="text-3xl font-bold text-white">🔥 {progress?.streak || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 border border-emerald-500/20">
          <p className="text-slate-400 text-sm">Games Played</p>
          <p className="text-3xl font-bold text-white">{progress?.games_played || 0}</p>
        </div>
      </div>

      {/* XP Progress */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400">Level {level}</span>
          <span className="text-slate-400">{xpInLevel}/{xpNeeded} XP</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all" style={{ width: `${(xpInLevel / xpNeeded) * 100}%` }} />
        </div>
      </div>

      {/* Start Training Button */}
      <button
        onClick={onStartTraining}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
      >
        🧠 Start Training
      </button>

      {/* Domain Scores */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Your Skills</h2>
        {Object.values(DOMAINS).map((domain) => {
          const score = progress?.domain_scores?.[domain.id] || 50;
          return (
            <div key={domain.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{domain.icon}</span>
                  <span className="text-white">{domain.name}</span>
                </div>
                <span className="text-slate-400">{score}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: domain.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}