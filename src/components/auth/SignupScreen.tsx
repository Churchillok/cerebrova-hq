import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { Button, Input, ErrorMessage } from '../common';
import { validateEmail, validatePassword, validateName } from '../../utils';

export function SignupScreen({ onSwitchToLogin, onBack }: { onSwitchToLogin: () => void; onBack: () => void }) {
  const { signUp, error, clearError, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const isValid = validateName(name) && validateEmail(email) && validatePassword(password) && agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    try { await signUp(email, password, name); } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col px-6 py-8">
      <button onClick={onBack} className="text-slate-400 hover:text-white mb-6">← Back</button>
      <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
      <p className="text-slate-400 mb-8">Start your brain training journey</p>
      {error && <div className="mb-6"><ErrorMessage message={error} onDismiss={clearError} /></div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Name" placeholder="Your name" value={name} onChange={(e: any) => setName(e.target.value)} />
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e: any) => setPassword(e.target.value)} />
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-5 h-5" />
          <span className="text-sm text-slate-400">I agree to the Terms and Privacy Policy</span>
        </label>
        <Button type="submit" disabled={!isValid || loading} className="w-full" size="lg">{loading ? 'Creating...' : 'Create Account'}</Button>
      </form>
      <p className="mt-8 text-center text-slate-400">Already have an account? <button onClick={onSwitchToLogin} className="text-violet-400">Sign In</button></p>
    </div>
  );
}