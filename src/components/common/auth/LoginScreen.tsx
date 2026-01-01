// ============================================
// LOGIN SCREEN - Sign in
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { Button, Input, ErrorMessage } from '../common';
import { validateEmail, validatePassword } from '../../utils';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
  onBack: () => void;
}

export function LoginScreen({ onSwitchToSignup, onBack }: LoginScreenProps) {
  const { signIn, error, clearError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = validateEmail(email) && validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await signIn(email, password);
    } catch (err) {
      // Error is handled by AuthProvider
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col px-6 py-8">
      {/* Back Button */}
      <button onClick={onBack} className="text-slate-400 hover:text-white mb-6">
        ← Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400">Sign in to continue training</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onDismiss={clearError} />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {/* Forgot Password */}
        <div className="text-right">
          <button type="button" className="text-sm text-violet-400 hover:text-violet-300">
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Switch to Signup */}
      <p className="mt-8 text-center text-slate-400">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="text-violet-400 hover:text-violet-300 font-medium">
          Sign Up
        </button>
      </p>
    </div>
  );
}