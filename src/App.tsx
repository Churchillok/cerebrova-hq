import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthProvider';
import { LoadingScreen } from './components/common';
import { SplashScreen, LoginScreen, SignupScreen } from './components/auth';
import { DashboardView, TrainingView, ProfileView, LeaderboardView, AchievementsView } from './components/views';
import { GameScreen } from './components/games';

type AuthScreen = 'splash' | 'login' | 'signup';
type AppView = 'dashboard' | 'training' | 'leaderboard' | 'achievements' | 'profile' | 'game';

function AuthFlow() {
  const [screen, setScreen] = useState<AuthScreen>('splash');
  return (
    <>
      {screen === 'splash' && <SplashScreen onGetStarted={() => setScreen('signup')} />}
      {screen === 'login' && <LoginScreen onSwitchToSignup={() => setScreen('signup')} onBack={() => setScreen('splash')} />}
      {screen === 'signup' && <SignupScreen onSwitchToLogin={() => setScreen('login')} onBack={() => setScreen('splash')} />}
    </>
  );
}

function NavBar({ view, setView }: { view: AppView; setView: (v: AppView) => void }) {
  if (view === 'game') return null;
  
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'training', icon: '🧠', label: 'Train' },
    { id: 'leaderboard', icon: '🏆', label: 'Ranks' },
    { id: 'achievements', icon: '🎖️', label: 'Awards' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur border-t border-white/10 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as AppView)}
            className={`flex flex-col items-center py-2 px-2 rounded-xl transition-all ${view === tab.id ? 'text-violet-400' : 'text-slate-500'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function MainApp() {
  const { progress, updateProgress } = useAuth();
  const [view, setView] = useState<AppView>('dashboard');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId);
    setView('game');
  };

  const handleGameComplete = async (score: number, xp: number) => {
    const newTotalXp = (progress?.total_xp || 0) + xp;
    const newGamesPlayed = (progress?.games_played || 0) + 1;
    
    await updateProgress({
      total_xp: newTotalXp,
      xp: newTotalXp % 100,
      level: Math.floor(newTotalXp / 100) + 1,
      games_played: newGamesPlayed,
    });
    
    setView('dashboard');
    setSelectedGame(null);
  };

  const handleBackFromGame = () => {
    setView('training');
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {view === 'dashboard' && <DashboardView onStartTraining={() => setView('training')} />}
      {view === 'training' && <TrainingView onSelectGame={handleSelectGame} />}
      {view === 'leaderboard' && <LeaderboardView />}
      {view === 'achievements' && <AchievementsView />}
      {view === 'profile' && <ProfileView />}
      {view === 'game' && selectedGame && (
        <GameScreen 
          gameId={selectedGame} 
          onBack={handleBackFromGame}
          onComplete={handleGameComplete}
        />
      )}
      <NavBar view={view} setView={setView} />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Loading CortexPrime..." />;
  if (!user) return <AuthFlow />;
  return <MainApp />;
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}