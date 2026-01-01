// ============================================
// SPLASH SCREEN - Welcome screen
// ============================================

import React from 'react';
import { Button } from '../common';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-5xl animate-float shadow-2xl shadow-violet-500/25">
          🧠
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-3">
          CortexPrime
        </h1>

        {/* Tagline */}
        <p className="text-lg text-slate-400 mb-8 max-w-xs">
          Train your thinking, not just your tapping
        </p>

        {/* Features */}
        <div className="space-y-3 mb-10">
          {[
            '7 cognitive training games',
            'AI-powered feedback',
            'Track your progress',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300">
              <span className="text-emerald-400">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button onClick={onGetStarted} size="lg" className="w-full max-w-xs">
          Get Started
        </Button>

        <p className="mt-4 text-sm text-slate-500">
          Free forever • No credit card needed
        </p>
      </div>
    </div>
  );
}