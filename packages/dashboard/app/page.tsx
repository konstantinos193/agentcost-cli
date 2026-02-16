'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from './components/AuthProvider';
import LoginForm from './components/LoginForm';

interface Execution {
  id: number;
  command: string;
  model: string;
  tokens_used: number;
  duration_ms: number;
  cost_cents: number;
  timestamp: string;
  exit_code: number;
}

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [stats, setStats] = useState({
    totalExecutions: 0,
    totalTokens: 0,
    totalCost: 0,
    avgDuration: 0
  });
  const [currentTime, setCurrentTime] = useState('LOADING...');
  const [budgetAlert, setBudgetAlert] = useState<any>(null);

  useEffect(() => {
    // Set current time only on client side
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBudgetAlert = async () => {
      try {
        const response = await fetch('/api/budget');
        if (response.ok) {
          const data = await response.json();
          setBudgetAlert(data);
        }
      } catch (error) {
        console.error('Failed to fetch budget alert:', error);
      }
    };

    fetchBudgetAlert();
    const interval = setInterval(fetchBudgetAlert, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch real data from API
    const fetchData = async () => {
      try {
        const [executionsResponse, statsResponse] = await Promise.all([
          fetch('/api/executions'),
          fetch('/api/stats')
        ]);

        if (executionsResponse.ok && statsResponse.ok) {
          const executionsData = await executionsResponse.json();
          const statsData = await statsResponse.json();
          
          setExecutions(executionsData);
          setStats(statsData);
        } else {
          // Fallback to mock data if API fails
          const mockData: Execution[] = [
            {
              id: 1,
              command: 'claude-code "implement user authentication"',
              model: 'claude-3.5-sonnet',
              tokens_used: 8432,
              duration_ms: 125000,
              cost_cents: 126,
              timestamp: '2024-02-16T10:30:00Z',
              exit_code: 0
            },
            {
              id: 2,
              command: 'cursor "add dark mode support"',
              model: 'gpt-4-turbo',
              tokens_used: 5210,
              duration_ms: 89000,
              cost_cents: 78,
              timestamp: '2024-02-16T11:15:00Z',
              exit_code: 0
            },
            {
              id: 3,
              command: 'copilot "optimize database queries"',
              model: 'gpt-4',
              tokens_used: 3156,
              duration_ms: 67000,
              cost_cents: 47,
              timestamp: '2024-02-16T14:20:00Z',
              exit_code: 0
            }
          ];

          setExecutions(mockData);
          
          const totalCost = mockData.reduce((sum, exec) => sum + exec.cost_cents, 0) / 100;
          const totalTokens = mockData.reduce((sum, exec) => sum + exec.tokens_used, 0);
          const avgDuration = mockData.reduce((sum, exec) => sum + exec.duration_ms, 0) / mockData.length;

          setStats({
            totalExecutions: mockData.length,
            totalTokens,
            totalCost,
            avgDuration
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle loading and authentication states after all hooks are called
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="terminal-text">INITIALIZING_SYSTEM...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const dailyData = executions.reduce((acc: any[], exec) => {
    const date = new Date(exec.timestamp).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.cost += exec.cost_cents / 100;
      existing.tokens += exec.tokens_used;
    } else {
      acc.push({
        date,
        cost: exec.cost_cents / 100,
        tokens: exec.tokens_used
      });
    }
    return acc;
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Terminal scanlines effect */}
      <div className="terminal-scanlines" />

      <div className="terminal-container relative z-10">
        {/* Terminal Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="terminal-window-controls">
              <div className="terminal-window-dot red" />
              <div className="terminal-window-dot yellow" />
              <div className="terminal-window-dot green" />
            </div>
            <div className="flex-1 h-8 bg-black/50 border border-green-500/30 rounded flex items-center px-4">
              <span className="terminal-text text-sm">$ agentcost --dashboard</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="terminal-btn text-xs px-2 py-1"
              >
                [DASHBOARD]
              </button>
              <button 
                onClick={() => window.location.href = '/team'}
                className="terminal-btn text-xs px-2 py-1"
              >
                [TEAM]
              </button>
              <button 
                onClick={() => window.location.href = '/settings'}
                className="terminal-btn text-xs px-2 py-1"
              >
                [SETTINGS]
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="terminal-title">
              AGENTCOST
            </h1>
            <div className="terminal-subtitle">
              &gt; AI_CODING_AGENT_COST_INTELLIGENCE
            </div>
            <div className="terminal-text-dim text-sm mt-2">
              USER: [{user.name.toUpperCase()}] | SYSTEM_STATUS: [ONLINE] | LAST_SYNC: {currentTime}
            </div>
            <div className="mt-4">
              <button 
                onClick={logout}
                className="terminal-btn text-xs px-2 py-1"
              >
                [LOGOUT]
              </button>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        {budgetAlert && (budgetAlert.should_alert || budgetAlert.is_over_budget) && (
          <div className={`terminal-card p-4 mb-8 border-2 ${
            budgetAlert.is_over_budget 
              ? 'border-red-500/50 bg-red-500/10' 
              : 'border-yellow-500/50 bg-yellow-500/10'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-bold mb-2 ${
                  budgetAlert.is_over_budget ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  &gt; {budgetAlert.is_over_budget ? 'BUDGET_EXCEEDED' : 'BUDGET_ALERT'}
                </h3>
                <div className="terminal-text-dim text-sm">
                  Current: ${budgetAlert.current_spend.toFixed(2)} / ${budgetAlert.budget_limit.toFixed(2)} 
                  ({budgetAlert.budget_used_percent.toFixed(1)}% used)
                </div>
                {budgetAlert.remaining_budget > 0 && (
                  <div className="terminal-text-dim text-sm mt-1">
                    Remaining: ${budgetAlert.remaining_budget.toFixed(2)}
                  </div>
                )}
              </div>
              <button 
                onClick={() => window.location.href = '/settings'}
                className="terminal-btn text-xs px-3 py-2"
              >
                [ADJUST_BUDGET]
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="terminal-grid terminal-grid-cols-4 mb-12">
          <div className="terminal-card">
            <div className="terminal-text-dim text-xs mb-2 tracking-widest">&gt; TOTAL_EXECUTIONS</div>
            <div className="text-3xl font-bold terminal-text terminal-glow">
              {stats.totalExecutions}
            </div>
            <div className="terminal-text-dim text-xs mt-2">PROCESSED_REQUESTS</div>
          </div>
          
          <div className="terminal-card">
            <div className="terminal-text-dim text-xs mb-2 tracking-widest">&gt; TOKEN_USAGE</div>
            <div className="text-3xl font-bold terminal-text terminal-glow">
              {(stats.totalTokens / 1000).toFixed(1)}K
            </div>
            <div className="terminal-text-dim text-xs mt-2">TOTAL_TOKENS</div>
          </div>
          
          <div className="terminal-card">
            <div className="terminal-text-dim text-xs mb-2 tracking-widest">&gt; TOTAL_SPEND</div>
            <div className="text-3xl font-bold terminal-text terminal-glow">
              ${stats.totalCost.toFixed(2)}
            </div>
            <div className="terminal-text-dim text-xs mt-2">COST_ACCUMULATED</div>
          </div>
          
          <div className="terminal-card">
            <div className="terminal-text-dim text-xs mb-2 tracking-widest">&gt; AVG_DURATION</div>
            <div className="text-3xl font-bold terminal-text terminal-glow">
              {Math.round(stats.avgDuration / 1000)}s
            </div>
            <div className="terminal-text-dim text-xs mt-2">RESPONSE_TIME</div>
          </div>
        </div>

        {/* Charts */}
        <div className="terminal-grid terminal-grid-cols-2 mb-12">
          <div className="terminal-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="terminal-text text-lg tracking-wider">&gt; DAILY_COST_TREND</h2>
              <div className="px-2 py-1 border border-green-500/30 bg-green-500/10">
                <span className="terminal-text text-xs font-bold">+12%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                <XAxis dataKey="date" stroke="rgba(34, 197, 94, 0.5)" />
                <YAxis stroke="rgba(34, 197, 94, 0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '0px',
                    color: '#22c55e'
                  }}
                  formatter={(value) => [`$${value}`, 'COST']}
                />
                <Line type="monotone" dataKey="cost" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="terminal-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="terminal-text text-lg tracking-wider">&gt; TOKEN_CONSUMPTION</h2>
              <div className="px-2 py-1 border border-green-500/30 bg-green-500/10">
                <span className="terminal-text text-xs font-bold">ACTIVE</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                <XAxis dataKey="date" stroke="rgba(34, 197, 94, 0.5)" />
                <YAxis stroke="rgba(34, 197, 94, 0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '0px',
                    color: '#22c55e'
                  }}
                />
                <Bar dataKey="tokens" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Terminal Log */}
        <div className="terminal-card overflow-hidden">
          <div className="px-6 py-4 border-b border-green-500/30">
            <div className="flex items-center justify-between">
              <h2 className="terminal-text text-lg tracking-wider">&gt; RECENT_AGENT_SESSIONS</h2>
              <button className="terminal-btn">
                [VIEW_ALL]
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="terminal-table">
              <thead className="bg-black/30 border-b border-green-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">AGENT_COMMAND</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">MODEL</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">TOKENS</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">COST</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">DURATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-500/20">
                {executions.map((exec, index) => (
                  <tr key={exec.id} className="hover:bg-green-500/5 transition-all">
                    <td className="px-6 py-4 text-sm terminal-text">{exec.command}</td>
                    <td className="px-6 py-4">
                      <span className="terminal-tag">
                        [{exec.model.toUpperCase()}]
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm terminal-text-dim">{exec.tokens_used.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold terminal-text">${(exec.cost_cents / 100).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm terminal-text-dim">{Math.round(exec.duration_ms / 1000)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-12 text-center">
          <div className="terminal-text-dim text-sm tracking-widest">
            $ SYSTEM_MONITORING_ACTIVE | PRESS [CTRL+C] TO_TERMINATE
          </div>
        </div>
      </div>
    </div>
  );
}
