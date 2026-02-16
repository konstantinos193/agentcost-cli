'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import LoginForm from '../components/LoginForm';

interface Settings {
  budget_limit_dollars: number;
  alert_threshold_percent: number;
  slack_webhook_url: string;
  email_notifications: boolean;
  slack_notifications: boolean;
}

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    budget_limit_dollars: 100,
    alert_threshold_percent: 80,
    slack_webhook_url: '',
    email_notifications: true,
    slack_notifications: false
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [backupStatus, setBackupStatus] = useState('');
  const [databaseInfo, setDatabaseInfo] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsResponse, backupResponse] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/backup')
        ]);
        
        if (settingsResponse.ok) {
          const data = await settingsResponse.json();
          setSettings(data);
        }
        
        if (backupResponse.ok) {
          const data = await backupResponse.json();
          setDatabaseInfo(data.database_info);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsLoadingSettings(true);
    setSaveStatus('');
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveStatus('Settings saved successfully!');
      } else {
        setSaveStatus('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('Failed to save settings');
    }
    
    setIsLoadingSettings(false);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleBackup = async () => {
    setBackupStatus('Creating backup...');
    
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'backup' }),
      });

      if (response.ok) {
        const data = await response.json();
        setBackupStatus(`Backup created: ${data.backupPath}`);
      } else {
        setBackupStatus('Failed to create backup');
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      setBackupStatus('Failed to create backup');
    }
    
    setTimeout(() => setBackupStatus(''), 5000);
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'export', format }),
      });

      if (response.ok) {
        if (format === 'json') {
          const data = await response.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `agentcost-export-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `agentcost-export-${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

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
              <span className="terminal-text text-sm">$ agentcost --settings</span>
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
              SYSTEM_SETTINGS
            </h1>
            <div className="terminal-subtitle">
              &gt; CONFIGURATION_MANAGEMENT
            </div>
            <div className="terminal-text-dim text-sm mt-2">
              USER: [{user.name.toUpperCase()}] | CONFIG_MODE: [EDIT]
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

        <div className="terminal-grid terminal-grid-cols-2 mb-12">
          <div className="terminal-card p-6">
            <h2 className="terminal-text text-lg tracking-wider mb-6">&gt; BUDGET_ALERTS</h2>
            
            <div className="space-y-6">
              <div>
                <label className="terminal-text-dim text-xs mb-2 block tracking-widest">
                  &gt; MONTHLY_BUDGET_LIMIT
                </label>
                <input
                  type="number"
                  value={settings.budget_limit_dollars}
                  onChange={(e) => setSettings({...settings, budget_limit_dollars: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded text-terminal-text focus:outline-none focus:border-green-500/60"
                  placeholder="100"
                />
                <div className="terminal-text-dim text-xs mt-2">USD per month</div>
              </div>
              
              <div>
                <label className="terminal-text-dim text-xs mb-2 block tracking-widest">
                  &gt; ALERT_THRESHOLD
                </label>
                <input
                  type="number"
                  value={settings.alert_threshold_percent}
                  onChange={(e) => setSettings({...settings, alert_threshold_percent: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded text-terminal-text focus:outline-none focus:border-green-500/60"
                  placeholder="80"
                  min="0"
                  max="100"
                />
                <div className="terminal-text-dim text-xs mt-2">Percentage of budget</div>
              </div>
            </div>
          </div>
          
          <div className="terminal-card p-6">
            <h2 className="terminal-text text-lg tracking-wider mb-6">&gt; NOTIFICATIONS</h2>
            
            <div className="space-y-6">
              <div>
                <label className="terminal-text-dim text-xs mb-2 block tracking-widest">
                  &gt; EMAIL_NOTIFICATIONS
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSettings({...settings, email_notifications: !settings.email_notifications})}
                    className={`terminal-btn px-4 py-2 ${settings.email_notifications ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                  >
                    [{settings.email_notifications ? 'ENABLED' : 'DISABLED'}]
                  </button>
                  <span className="terminal-text-dim text-xs">Receive budget alerts via email</span>
                </div>
              </div>
              
              <div>
                <label className="terminal-text-dim text-xs mb-2 block tracking-widest">
                  &gt; SLACK_NOTIFICATIONS
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <button
                    onClick={() => setSettings({...settings, slack_notifications: !settings.slack_notifications})}
                    className={`terminal-btn px-4 py-2 ${settings.slack_notifications ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                  >
                    [{settings.slack_notifications ? 'ENABLED' : 'DISABLED'}]
                  </button>
                </div>
                {settings.slack_notifications && (
                  <input
                    type="url"
                    value={settings.slack_webhook_url}
                    onChange={(e) => setSettings({...settings, slack_webhook_url: e.target.value})}
                    className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded text-terminal-text focus:outline-none focus:border-green-500/60 text-sm"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                )}
                <div className="terminal-text-dim text-xs mt-2">Slack webhook URL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="terminal-card p-6 mb-8">
          <h2 className="terminal-text text-lg tracking-wider mb-6">&gt; DATA_MANAGEMENT</h2>
          
          {databaseInfo && (
            <div className="mb-6 p-4 bg-black/30 border border-green-500/30 rounded">
              <div className="terminal-text-dim text-sm mb-2">
                Database Information:
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="terminal-text-dim">Size:</span> {databaseInfo.size_mb} MB
                </div>
                <div>
                  <span className="terminal-text-dim">Records:</span> {databaseInfo.tables.executions?.count || 0}
                </div>
                <div>
                  <span className="terminal-text-dim">Last Modified:</span> {new Date(databaseInfo.last_modified).toLocaleDateString()}
                </div>
                <div>
                  <span className="terminal-text-dim">Location:</span> ~/.agentcost.db
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="terminal-text text-sm font-bold">CREATE_BACKUP</div>
                <div className="terminal-text-dim text-xs">Create a full database backup</div>
              </div>
              <button onClick={handleBackup} className="terminal-btn text-sm px-4 py-2">
                [BACKUP_NOW]
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="terminal-text text-sm font-bold">EXPORT_DATA</div>
                <div className="terminal-text-dim text-xs">Export execution history</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleExport('csv')} className="terminal-btn text-sm px-3 py-2">
                  [CSV]
                </button>
                <button onClick={() => handleExport('json')} className="terminal-btn text-sm px-3 py-2">
                  [JSON]
                </button>
              </div>
            </div>
          </div>
          
          {backupStatus && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
              <div className="terminal-text text-xs">
                {backupStatus}
              </div>
            </div>
          )}
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="terminal-text text-lg tracking-wider">&gt; SYSTEM_OPERATIONS</h2>
              <div className="terminal-text-dim text-sm mt-2">
                Save configuration changes to apply system-wide
              </div>
            </div>
            <div className="flex items-center gap-4">
              {saveStatus && (
                <div className={`terminal-text text-xs ${saveStatus.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                  [{saveStatus.toUpperCase()}]
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isLoadingSettings}
                className="terminal-btn px-6 py-3 disabled:opacity-50"
              >
                {isLoadingSettings ? '[SAVING...]' : '[SAVE_SETTINGS]'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="terminal-text-dim text-sm tracking-widest">
            $ CONFIGURATION_ACTIVE | CHANGES_PENDING: [{saveStatus ? 'YES' : 'NO'}]
          </div>
        </div>
      </div>
    </div>
  );
}
