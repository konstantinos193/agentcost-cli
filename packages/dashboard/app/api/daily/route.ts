import { NextResponse } from 'next/server';
import { Database } from 'sqlite3';
import { join } from 'path';

const dbPath = join(process.env.HOME || '', '.agentcost.db');

export async function GET() {
  return new Promise((resolve) => {
    const db = new Database(dbPath);
    
    db.all(`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as executions,
        SUM(tokens_used) as totalTokens,
        SUM(cost_cents) as totalCostCents,
        AVG(duration_ms) as avgDuration
      FROM executions
      WHERE timestamp >= datetime('now', '-30 days')
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `, (err, rows: any[]) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Failed to fetch daily stats' }, { status: 500 }));
        return;
      }
      
      const dailyStats = rows.map(row => ({
        date: row.date,
        executions: row.executions,
        totalTokens: row.totalTokens || 0,
        totalCost: (row.totalCostCents || 0) / 100,
        avgDuration: row.avgDuration || 0
      }));
      
      resolve(NextResponse.json(dailyStats));
      db.close();
    });
  });
}
