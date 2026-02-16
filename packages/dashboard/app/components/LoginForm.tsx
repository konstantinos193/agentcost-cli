'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (!success) {
      alert('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="terminal-card p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="terminal-title text-2xl mb-2">
            AGENTCOST
          </h1>
          <div className="terminal-subtitle text-sm">
            &gt; AI_COST_MONITORING_LOGIN
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="terminal-text-dim text-xs mb-2 block tracking-widest">
              &gt; EMAIL_ACCESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded text-terminal-text focus:outline-none focus:border-green-500/60"
              placeholder="team@company.com"
              required
            />
          </div>
          
          <div>
            <label className="terminal-text-dim text-xs mb-2 block tracking-widest">
              &gt; ACCESS_KEY
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded text-terminal-text focus:outline-none focus:border-green-500/60"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full terminal-btn py-3 disabled:opacity-50"
          >
            {isLoading ? '[AUTHENTICATING...]' : '[LOGIN_SYSTEM]'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <div className="terminal-text-dim text-xs">
            DEMO: Use any email/password to access
          </div>
        </div>
      </div>
    </div>
  );
}
