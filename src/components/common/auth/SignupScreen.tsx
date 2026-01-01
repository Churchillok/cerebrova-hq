// ============================================
// SIGNUP SCREEN - Create account
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { Button, Input, ErrorMessage } from '../common';
import { validateEmail, validatePassword, validateName } from '../../utils';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
  onBack: () => void;
}

export function SignupScreen({ onSwitchToLogin, onBack }: SignupScreenProps) {
  const { signUp, error, clearError, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const isValid = validateName(name) && validateEmail(email) && validatePassword(password) && agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await signUp(email, password, name);
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
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-slate-400">Start your brain training journey</p>
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
          label="Name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        {name && !validateName(name) && (
          <p className="text-xs text-amber-400">At least 2 characters</p>
        )}

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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {password && !validatePassword(password) && (
          <p className="text-xs text-amber-400">At least 6 characters</p>
        )}

        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
          />
          <span className="text-sm text-slate-400">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* What you get */}
      <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-sm font-medium text-white mb-3">What you get:</p>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>7 brain training games</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>AI-powered feedback</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Progress tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Cloud sync across devices</span>
          </div>
        </div>
      </div>

      {/* Switch to Login */}
      <p className="mt-8 text-center text-slate-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-violet-400 hover:text-violet-300 font-medium">
          Sign In
        </button>
      </p>
    </div>
  );
}