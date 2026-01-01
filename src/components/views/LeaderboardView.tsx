import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthProvider';
import { LoadingSpinner } from '../common';

interface LeaderboardEntry {
  user_id: string;
  name: string;
  avatar: string;
  level: number;
  npi: number;
  total_xp: number;
  games_played: number;
}

export function LeaderboardView() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'xp' | 'npi' | 'games'>('xp');

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const orderBy = tab === 'xp' ? 'total_xp' : tab === 'npi' ? 'npi' : 'games_played';
      
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('user_id, level, npi, total_xp, games_played')
        .order(orderBy, { ascending: false })
        .limit(50);

      if (progressError) throw progressError;

      if (progressData && progressData.length > 0) {
        const userIds = progressData.map(p => p.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, avatar')
          .in('id', userIds);

        const combined = progressData.map(progress => {
          const profile = profilesData?.find(p => p.id === progress.user_id);
          return {
            ...progress,
            name: profile?.name || 'Anonymous',
            avatar: profile?.avatar || '🧠',
          };
        });

        setLeaders(combined);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'xp', label: 'Total XP', icon: '⭐' },
    { id: 'npi', label: 'NPI Score', icon: '🧠' },
    { id: 'games', label: 'Games', icon: '🎮' },
  ];

  const getValue = (entry: LeaderboardEntry) => {
    if (tab === 'xp') return entry.total_xp.toLocaleString();
    if (tab === 'npi') return entry.npi;
    return entry.games_played;
  };

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-slate-400">See how you rank against others</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-violet-500 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🏆</p>
          <p className="text-slate-400">No players yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((entry, index) => {
            const isCurrentUser = entry.user_id === user?.id;
            return (
              <div
                key={entry.user_id}
                className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${
                  isCurrentUser
                    ? 'bg-violet-500/20 border border-violet-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index < 3 ? 'text-2xl' : 'bg-white/10 text-slate-400'
                }`}>
                  {getMedal(index)}
                </div>

                {/* Avatar & Name */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xl">
                    {entry.avatar}
                  </div>
                  <div>
                    <p className={`font-semibold ${isCurrentUser ? 'text-violet-300' : 'text-white'}`}>
                      {entry.name} {isCurrentUser && '(You)'}
                    </p>
                    <p className="text-slate-400 text-sm">Level {entry.level}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className={`text-xl font-bold ${isCurrentUser ? 'text-violet-300' : 'text-white'}`}>
                    {getValue(entry)}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {tab === 'xp' ? 'XP' : tab === 'npi' ? 'NPI' : 'games'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}