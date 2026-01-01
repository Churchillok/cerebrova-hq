import React from 'react';
import { GAMES, DOMAINS } from '../../config';

export function TrainingView({ onSelectGame }: { onSelectGame: (gameId: string) => void }) {
  return (
    <div className="p-6 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Training</h1>
        <p className="text-slate-400">Choose a game to train your brain</p>
      </div>

      {/* Games Grid */}
      <div className="space-y-4">
        {GAMES.map((game) => {
          const domain = DOMAINS[game.domain];
          return (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${domain.color}20` }}>
                  {game.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{game.name}</h3>
                  <p className="text-slate-400 text-sm">{game.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${domain.color}30`, color: domain.color }}>
                      {domain.name}
                    </span>
                    {game.duration && <span className="text-xs text-slate-500">{game.duration}s</span>}
                  </div>
                </div>
                <span className="text-slate-500">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}