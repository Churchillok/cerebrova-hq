import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { Button, Input, ErrorMessage } from '../common';
import { validateEmail, validatePassword } from '../../utils';

export function LoginScreen({ onSwitchToSignup, onBack }: { onSwitchToSignup: () => void; onBack: () => void }) {
  const { signIn, error, clearError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = validateEmail(email) && validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    try { await signIn(email, password); } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col px-6 py-8">
      <button onClick={onBack} className="text-slate-400 hover:text-white mb-6">← Back</button>
      <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
      <p className="text-slate-400 mb-8">Sign in to continue training</p>
      {error && <div className="mb-6"><ErrorMessage message={error} onDismiss={clearError} /></div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="Your password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
        <Button type="submit" disabled={!isValid || loading} className="w-full" size="lg">{loading ? 'Signing in...' : 'Sign In'}</Button>
      </form>
      <p className="mt-8 text-center text-slate-400">Don't have an account? <button onClick={onSwitchToSignup} className="text-violet-400">Sign Up</button></p>
    </div>
  );
}