'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../components/AuthProvider';
import LoginForm from '../components/LoginForm';

interface TeamStats {
  model: string;
  executions: number;
  totalTokens: number;
  totalCost: number;
  avgDuration: number;
}

interface DailyStats {
  date: string;
  executions: number;
  totalTokens: number;
  totalCost: number;
  avgDuration: number;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function TeamPage() {
  const { user, isLoading, logout } = useAuth();
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [currentTime, setCurrentTime] = useState('LOADING...');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamResponse, dailyResponse] = await Promise.all([
          fetch('/api/team'),
          fetch('/api/daily')
        ]);

        if (teamResponse.ok && dailyResponse.ok) {
          const teamData = await teamResponse.json();
          const dailyData = await dailyResponse.json();
          
          setTeamStats(teamData);
          setDailyStats(dailyData);
        }
      } catch (error) {
        console.error('Failed to fetch team data:', error);
      }
    };

    fetchData();
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

  const totalTeamCost = teamStats.reduce((sum, stat) => sum + stat.totalCost, 0);
  const totalTeamTokens = teamStats.reduce((sum, stat) => sum + stat.totalTokens, 0);

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agentcost-export.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="terminal-scanlines" />
      <div className="terminal-container relative z-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="terminal-window-controls">
              <div className="terminal-window-dot red" />
              <div className="terminal-window-dot yellow" />
              <div className="terminal-window-dot green" />
            </div>
            <div className="flex-1 h-8 bg-black/50 border border-green-500/30 rounded flex items-center px-4">
              <span className="terminal-text text-sm">$ agentcost --team</span>
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
              TEAM_ANALYTICS
            </h1>
            <div className="terminal-subtitle">
              &gt; COLLABORATIVE_AI_INTELLIGENCE
            </div>
            <div className="terminal-text-dim text-sm mt-2">
              USER: [{user.name.toUpperCase()}] | TEAM_STATUS: [ACTIVE] | LAST_SYNC: {currentTime}
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
        
        <div className="terminal-grid terminal-grid-cols-3 mb-12">
          <div className="terminal-card">
            <div className="terminal-text-dim text-xs mb-2 tracking-widest">&gt; TEAM_MODELS</div>
            <div className="text-3xl font-bold terminal-text terminal-glow">
              {teamStats.length}
            </div>
            <div className="terminal-text-dim text-xs mt-2">ACTIVE_AGENTS</div>
          </div>
          
          <div className="terminal-card">
            <div className="terminal-text-dim text-xs mb-2 tracking-widest">&gt; TEAM_TOKENS</div>
            <div className="text-3xl font-bold terminal-text terminal-glow">
              {(totalTeamTokens / 1000).toFixed(1)}K
            </div>
            <div className="terminal-text-dim text-xs mt-2">TOTAL_CONSUMED</div>
          </div>
          
          <div className="terminal-card">
            <div className="terminal-text-dim text-xs mb-2 tracking-widest">&gt; TEAM_SPEND</div>
            <div className="text-3xl font-bold terminal-text terminal-glow">
              ${totalTeamCost.toFixed(2)}
            </div>
            <div className="terminal-text-dim text-xs mt-2">CUMULATIVE_COST</div>
          </div>
        </div>

        <div className="terminal-grid terminal-grid-cols-2 mb-12">
          <div className="terminal-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="terminal-text text-lg tracking-wider">&gt; MODEL_DISTRIBUTION</h2>
              <div className="px-2 py-1 border border-green-500/30 bg-green-500/10">
                <span className="terminal-text text-xs font-bold">LIVE</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={teamStats}
                  dataKey="totalCost"
                  nameKey="model"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry: any) => `${entry.model}: $${entry.totalCost.toFixed(2)}`}
                >
                  {teamStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '0px',
                    color: '#22c55e'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="terminal-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="terminal-text text-lg tracking-wider">&gt; 30_DAY_TREND</h2>
              <div className="px-2 py-1 border border-green-500/30 bg-green-500/10">
                <span className="terminal-text text-xs font-bold">ANALYTICS</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyStats.slice(0, 14).reverse()}>
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
                <Bar dataKey="totalCost" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="terminal-card overflow-hidden">
          <div className="px-6 py-4 border-b border-green-500/30">
            <div className="flex items-center justify-between">
              <h2 className="terminal-text text-lg tracking-wider">&gt; MODEL_PERFORMANCE</h2>
              <button onClick={handleExport} className="terminal-btn">
                [EXPORT_DATA]
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="terminal-table">
              <thead className="bg-black/30 border-b border-green-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">MODEL</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">EXECUTIONS</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">TOKENS</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">COST</th>
                  <th className="px-6 py-3 text-left text-xs font-bold terminal-text-dim uppercase tracking-wider">AVG_DURATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-500/20">
                {teamStats.map((stat, index) => (
                  <tr key={stat.model} className="hover:bg-green-500/5 transition-all">
                    <td className="px-6 py-4 text-sm terminal-text">
                      <span className="terminal-tag">
                        [{stat.model.toUpperCase()}]
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm terminal-text-dim">{stat.executions}</td>
                    <td className="px-6 py-4 text-sm terminal-text-dim">{stat.totalTokens.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold terminal-text">${stat.totalCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm terminal-text-dim">{Math.round(stat.avgDuration / 1000)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="terminal-text-dim text-sm tracking-widest">
            $ TEAM_MONITORING_ACTIVE | DATA_REFRESH: [30S]
          </div>
        </div>
      </div>
    </div>
  );
}
