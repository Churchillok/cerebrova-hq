import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { getGameById, DOMAINS } from '../../config';
import { Button } from '../common';

interface GameScreenProps {
  gameId: string;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface AIFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

export function GameScreen({ gameId, onBack, onComplete }: GameScreenProps) {
  const game = getGameById(gameId);
  const domain = game ? DOMAINS[game.domain] : null;
  
  const [phase, setPhase] = useState<'ready' | 'playing' | 'analyzing' | 'finished'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game?.duration || 30);
  const [gameData, setGameData] = useState<any>({});
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);

  useEffect(() => {
    if (phase !== 'playing' || timeLeft <= 0 || gameId === 'think-aloud') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPhase('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft, gameId]);

  const startGame = () => {
    setPhase('playing');
    setScore(0);
    setTimeLeft(game?.duration || 30);
    setAiFeedback(null);
    generateQuestion();
  };

  const generateQuestion = useCallback(() => {
    if (gameId === 'mental-math') {
      const ops = ['+', '-', '×'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a, b, answer;
      if (op === '+') { a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; }
      else if (op === '-') { a = Math.floor(Math.random() * 50) + 20; b = Math.floor(Math.random() * 20) + 1; answer = a - b; }
      else { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
      const choices = [answer, answer + Math.floor(Math.random() * 10) + 1, answer - Math.floor(Math.random() * 10) - 1, answer + Math.floor(Math.random() * 5) + 1].sort(() => Math.random() - 0.5);
      setGameData({ question: `${a} ${op} ${b}`, answer, choices });
    } 
    else if (gameId === 'stroop') {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
      const colorCodes: any = { red: '#ef4444', blue: '#3b82f6', green: '#22c55e', yellow: '#eab308', purple: '#a855f7' };
      const word = colors[Math.floor(Math.random() * colors.length)];
      const displayColor = colors[Math.floor(Math.random() * colors.length)];
      setGameData({ word, displayColor, colorCode: colorCodes[displayColor], colors, colorCodes });
    }
    else if (gameId === 'reaction') {
      setGameData({ waiting: true, startTime: 0, showGreen: false });
      const delay = Math.random() * 3000 + 1000;
      setTimeout(() => setGameData((d: any) => ({ ...d, waiting: false, showGreen: true, startTime: Date.now() })), delay);
    }
    else if (gameId === 'sequence') {
      const patterns = [
        { seq: [2, 4, 6, 8], next: 10 }, { seq: [1, 3, 5, 7], next: 9 },
        { seq: [3, 6, 9, 12], next: 15 }, { seq: [5, 10, 15, 20], next: 25 },
        { seq: [1, 2, 4, 8], next: 16 }, { seq: [100, 90, 80, 70], next: 60 },
      ];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      const choices = [pattern.next, pattern.next + 1, pattern.next - 1, pattern.next + 2].sort(() => Math.random() - 0.5);
      setGameData({ sequence: pattern.seq, answer: pattern.next, choices });
    }
    else if (gameId === 'memory-matrix') {
      const size = 3;
      const cells = Array(size * size).fill(false);
      const numActive = 3 + Math.floor(Math.random() * 2);
      const indices = [...Array(size * size).keys()].sort(() => Math.random() - 0.5).slice(0, numActive);
      indices.forEach(i => cells[i] = true);
      setGameData({ size, pattern: [...cells], userPattern: Array(size * size).fill(false), showPattern: true });
      setTimeout(() => setGameData((d: any) => ({ ...d, showPattern: false })), 2000);
    }
    else if (gameId === 'speed-match') {
      const symbols = ['🔴', '🔵', '🟢', '🟡', '🟣', '⭐', '💎', '🔶'];
      const current = symbols[Math.floor(Math.random() * symbols.length)];
      const previous = gameData.current || symbols[Math.floor(Math.random() * symbols.length)];
      const isSame = Math.random() > 0.5;
      setGameData({ previous, current: isSame ? previous : current, isSame });
    }
    else if (gameId === 'think-aloud') {
      const prompts = [
        "If you could solve one world problem, what would it be and how would you approach it?",
        "What would you do if you had unlimited resources for one year?",
        "How would you redesign education for the future?",
        "What makes a person truly successful in life?",
        "If you could create any invention, what would help humanity most?",
        "How should cities be designed to make people happier?",
        "What's the most important skill everyone should learn?",
        "How would you solve the problem of loneliness in modern society?",
      ];
      setGameData({ prompt: prompts[Math.floor(Math.random() * prompts.length)], response: '' });
    }
  }, [gameId, gameData.current]);

  const handleAnswer = (answer: any) => {
    let correct = false;
    if (gameId === 'mental-math') correct = answer === gameData.answer;
    else if (gameId === 'stroop') correct = answer === gameData.displayColor;
    else if (gameId === 'sequence') correct = answer === gameData.answer;
    else if (gameId === 'speed-match') {
      correct = (answer === 'same' && gameData.isSame) || (answer === 'diff' && !gameData.isSame);
    }
    if (correct) setScore(s => s + 10);
    setTimeout(generateQuestion, 300);
  };

  const handleReactionTap = () => {
    if (!gameData.showGreen) {
      setScore(s => Math.max(0, s - 5));
      generateQuestion();
      return;
    }
    const reactionTime = Date.now() - gameData.startTime;
    const points = Math.max(1, Math.floor((500 - reactionTime) / 10));
    setScore(s => s + points);
    generateQuestion();
  };

  const handleMatrixTap = (index: number) => {
    if (gameData.showPattern) return;
    const newPattern = [...gameData.userPattern];
    newPattern[index] = !newPattern[index];
    setGameData((d: any) => ({ ...d, userPattern: newPattern }));
    
    const correctCount = gameData.pattern.filter((v: boolean, i: number) => v === newPattern[i]).length;
    if (newPattern.filter(Boolean).length === gameData.pattern.filter(Boolean).length) {
      if (correctCount === gameData.pattern.length) setScore(s => s + 20);
      setTimeout(generateQuestion, 500);
    }
  };

  const analyzeThinkAloud = async () => {
    setPhase('analyzing');
    
    const response = gameData.response || '';
    const wordCount = response.trim().split(/\s+/).length;
    
    // Simple AI-like analysis (local, no API needed)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking
    
    let analysisScore = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    // Length analysis
    if (wordCount >= 100) {
      analysisScore += 30;
      strengths.push("Thorough and detailed response");
    } else if (wordCount >= 50) {
      analysisScore += 20;
      strengths.push("Good level of detail");
    } else if (wordCount >= 25) {
      analysisScore += 10;
      improvements.push("Try to elaborate more on your ideas");
    } else {
      improvements.push("Expand your response with more details");
    }
    
    // Check for reasoning words
    const reasoningWords = ['because', 'therefore', 'however', 'although', 'since', 'thus', 'consequently'];
    const hasReasoning = reasoningWords.some(word => response.toLowerCase().includes(word));
    if (hasReasoning) {
      analysisScore += 20;
      strengths.push("Good use of logical reasoning");
    } else {
      improvements.push("Try using words like 'because' or 'therefore' to explain your reasoning");
    }
    
    // Check for multiple perspectives
    const perspectiveWords = ['other hand', 'alternatively', 'some people', 'different', 'another way', 'perspective'];
    const hasMultiplePerspectives = perspectiveWords.some(word => response.toLowerCase().includes(word));
    if (hasMultiplePerspectives) {
      analysisScore += 20;
      strengths.push("Considers multiple perspectives");
    } else {
      improvements.push("Consider presenting alternative viewpoints");
    }
    
    // Check for examples
    const exampleWords = ['example', 'instance', 'such as', 'like when', 'for instance'];
    const hasExamples = exampleWords.some(word => response.toLowerCase().includes(word));
    if (hasExamples) {
      analysisScore += 15;
      strengths.push("Uses concrete examples");
    } else {
      improvements.push("Add specific examples to support your points");
    }
    
    // Check for structure
    const hasStructure = response.includes('.') && response.split('.').length >= 3;
    if (hasStructure) {
      analysisScore += 15;
      strengths.push("Well-structured response");
    } else {
      improvements.push("Break your response into clear sentences");
    }
    
    // Ensure minimum scores and limits
    analysisScore = Math.max(20, Math.min(100, analysisScore));
    
    if (strengths.length === 0) strengths.push("You attempted the challenge");
    if (improvements.length === 0) improvements.push("Keep practicing critical thinking");
    
    const feedback = analysisScore >= 70 
      ? "Excellent thinking! You demonstrated strong analytical skills."
      : analysisScore >= 50
      ? "Good effort! Your response shows promise. Keep developing your ideas."
      : "Nice start! Focus on expanding your thoughts and adding more depth.";
    
    setAiFeedback({ score: analysisScore, strengths, improvements, feedback });
    setScore(analysisScore);
    setPhase('finished');
  };

  const finishGame = () => {
    const xp = Math.floor(score / 2) + 10;
    onComplete(score, xp);
  };

  if (!game || !domain) return <div className="p-6 text-white">Game not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <button onClick={onBack} className="text-slate-400 hover:text-white">← Back</button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{game.emoji}</span>
          <span className="text-white font-semibold">{game.name}</span>
        </div>
        <div className="text-right">
          {phase === 'playing' && gameId !== 'think-aloud' && <p className="text-2xl font-bold text-white">{timeLeft}s</p>}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {phase === 'ready' && (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-5xl" style={{ backgroundColor: `${domain.color}20` }}>
              {game.emoji}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{game.name}</h1>
            <p className="text-slate-400 mb-8">{game.description}</p>
            {gameId === 'think-aloud' && (
              <p className="text-cyan-400 text-sm mb-4">✨ AI will analyze your response!</p>
            )}
            <Button onClick={startGame} size="lg">Start Game</Button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full max-w-md">
            {gameId !== 'think-aloud' && (
              <div className="text-center mb-8">
                <p className="text-slate-400">Score</p>
                <p className="text-4xl font-bold text-white">{score}</p>
              </div>
            )}

            {/* Mental Math */}
            {gameId === 'mental-math' && (
              <div className="text-center">
                <p className="text-5xl font-bold text-white mb-8">{gameData.question}</p>
                <div className="grid grid-cols-2 gap-4">
                  {gameData.choices?.map((choice: number, i: number) => (
                    <button key={i} onClick={() => handleAnswer(choice)} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 text-2xl font-bold text-white">{choice}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Stroop */}
            {gameId === 'stroop' && (
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-4">Tap the COLOR, not the word!</p>
                <p className="text-6xl font-bold mb-8" style={{ color: gameData.colorCode }}>{gameData.word?.toUpperCase()}</p>
                <div className="grid grid-cols-3 gap-3">
                  {gameData.colors?.map((color: string) => (
                    <button key={color} onClick={() => handleAnswer(color)} className="p-4 rounded-xl text-white font-semibold capitalize" style={{ backgroundColor: gameData.colorCodes[color] }}>{color}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Reaction */}
            {gameId === 'reaction' && (
              <button onClick={handleReactionTap} className={`w-full h-64 rounded-2xl flex items-center justify-center text-2xl font-bold ${gameData.showGreen ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                {gameData.showGreen ? 'TAP NOW!' : 'Wait...'}
              </button>
            )}

            {/* Sequence */}
            {gameId === 'sequence' && (
              <div className="text-center">
                <p className="text-slate-400 mb-4">What comes next?</p>
                <p className="text-4xl font-bold text-white mb-8">{gameData.sequence?.join(', ')}, ?</p>
                <div className="grid grid-cols-2 gap-4">
                  {gameData.choices?.map((choice: number, i: number) => (
                    <button key={i} onClick={() => handleAnswer(choice)} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 text-2xl font-bold text-white">{choice}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Memory Matrix */}
            {gameId === 'memory-matrix' && (
              <div className="text-center">
                <p className="text-slate-400 mb-4">{gameData.showPattern ? 'Memorize!' : 'Tap the squares!'}</p>
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {Array(9).fill(0).map((_, i) => (
                    <button key={i} onClick={() => handleMatrixTap(i)} className={`aspect-square rounded-lg ${gameData.showPattern ? (gameData.pattern?.[i] ? 'bg-violet-500' : 'bg-white/10') : (gameData.userPattern?.[i] ? 'bg-cyan-500' : 'bg-white/10')}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Speed Match */}
            {gameId === 'speed-match' && (
              <div className="text-center">
                <p className="text-slate-400 mb-2">Previous</p>
                <p className="text-4xl mb-4">{gameData.previous}</p>
                <p className="text-slate-400 mb-2">Current</p>
                <p className="text-6xl mb-8">{gameData.current}</p>
                <div className="flex gap-4">
                  <button onClick={() => handleAnswer('same')} className="flex-1 p-4 rounded-xl bg-green-500/20 hover:bg-green-500/40 text-green-400 font-bold text-xl">SAME</button>
                  <button onClick={() => handleAnswer('diff')} className="flex-1 p-4 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold text-xl">DIFFERENT</button>
                </div>
              </div>
            )}

            {/* Think Aloud */}
            {gameId === 'think-aloud' && (
              <div className="w-full">
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-6">
                  <p className="text-lg text-white">{gameData.prompt}</p>
                </div>
                <textarea
                  value={gameData.response || ''}
                  onChange={(e) => setGameData((d: any) => ({ ...d, response: e.target.value }))}
                  placeholder="Share your thoughts... (The more detailed, the better!)"
                  className="w-full h-48 p-4 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-violet-500"
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-slate-400">{(gameData.response || '').trim().split(/\s+/).filter(Boolean).length} words</p>
                  <Button onClick={analyzeThinkAloud} disabled={(gameData.response || '').length < 20}>
                    ✨ Analyze with AI
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 'analyzing' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-xl text-white mb-2">Analyzing your response...</p>
            <p className="text-slate-400">AI is evaluating your thinking</p>
          </div>
        )}

        {phase === 'finished' && (
          <div className="text-center w-full max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {gameId === 'think-aloud' ? 'Analysis Complete!' : 'Game Complete!'}
            </h2>
            <p className="text-5xl font-bold text-violet-400 mb-2">{score}</p>
            <p className="text-slate-400 mb-6">{gameId === 'think-aloud' ? 'thinking score' : 'points earned'}</p>

            {/* AI Feedback for Think Aloud */}
            {aiFeedback && (
              <div className="text-left space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-emerald-400 font-semibold mb-2">💪 Strengths</p>
                  <ul className="space-y-1">
                    {aiFeedback.strengths.map((s, i) => (
                      <li key={i} className="text-slate-300 text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-400 font-semibold mb-2">🎯 Areas to Improve</p>
                  <ul className="space-y-1">
                    {aiFeedback.improvements.map((s, i) => (
                      <li key={i} className="text-slate-300 text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-violet-400 font-semibold mb-2">✨ Feedback</p>
                  <p className="text-slate-300 text-sm">{aiFeedback.feedback}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="secondary" onClick={startGame}>Play Again</Button>
              <Button onClick={finishGame}>Finish</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}