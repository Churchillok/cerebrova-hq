import React from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { Button } from '../common';
import { calculateLevel } from '../../utils';

export function ProfileView() {
  const { profile, progress, signOut } = useAuth();
  const level = progress ? calculateLevel(progress.total_xp) : 1;

  return (
    <div className="p-6 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-white/10 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-4xl mb-4">
          {profile?.avatar || '🧠'}
        </div>
        <h2 className="text-xl font-bold text-white">{profile?.name || 'Brain Trainer'}</h2>
        <p className="text-slate-400">{profile?.email}</p>
        <div className="mt-4 flex justify-center gap-6">
          <div>
            <p className="text-2xl font-bold text-white">{level}</p>
            <p className="text-slate-400 text-sm">Level</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{progress?.games_played || 0}</p>
            <p className="text-slate-400 text-sm">Games</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{progress?.streak || 0}</p>
            <p className="text-slate-400 text-sm">Streak</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Statistics</h3>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between">
          <span className="text-slate-400">Total XP</span>
          <span className="text-white font-semibold">{progress?.total_xp || 0}</span>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between">
          <span className="text-slate-400">NPI Score</span>
          <span className="text-white font-semibold">{progress?.npi || 500}</span>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between">
          <span className="text-slate-400">Best Streak</span>
          <span className="text-white font-semibold">{progress?.max_streak || 0} days</span>
        </div>
      </div>

      {/* Sign Out */}
      <Button variant="danger" className="w-full" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}