import { NextRequest, NextResponse } from 'next/server';
import { Database } from 'sqlite3';
import { join } from 'path';

const dbPath = join(process.env.HOME || '', '.agentcost.db');

// Initialize settings table
function initSettingsTable(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      budget_limit_dollars REAL DEFAULT 100,
      alert_threshold_percent REAL DEFAULT 80,
      slack_webhook_url TEXT,
      email_notifications BOOLEAN DEFAULT 1,
      slack_notifications BOOLEAN DEFAULT 0
    )
  `);
}

export async function GET() {
  return new Promise((resolve) => {
    const db = new Database(dbPath);
    initSettingsTable(db);
    
    db.get(`SELECT * FROM settings WHERE id = 1`, (err, row) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 }));
        return;
      }
      
      // Default settings if none exist
      const defaultSettings = {
        budget_limit_dollars: 100,
        alert_threshold_percent: 80,
        slack_webhook_url: '',
        email_notifications: true,
        slack_notifications: false
      };
      
      resolve(NextResponse.json(row || defaultSettings));
      db.close();
    });
  });
}

export async function PUT(request: NextRequest) {
  return new Promise(async (resolve) => {
    const db = new Database(dbPath);
    initSettingsTable(db);
    
    const settings = await request.json();
    
    db.run(`
      INSERT OR REPLACE INTO settings (
        id, budget_limit_dollars, alert_threshold_percent, 
        slack_webhook_url, email_notifications, slack_notifications
      ) VALUES (1, ?, ?, ?, ?, ?)
    `, [
      settings.budget_limit_dollars,
      settings.alert_threshold_percent,
      settings.slack_webhook_url,
      settings.email_notifications,
      settings.slack_notifications
    ], function(err) {
      if (err) {
        resolve(NextResponse.json({ error: 'Failed to save settings' }, { status: 500 }));
        return;
      }
      
      resolve(NextResponse.json({ success: true }));
      db.close();
    });
  });
}
