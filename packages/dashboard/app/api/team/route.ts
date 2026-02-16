import { NextResponse } from 'next/server';
import { Database } from 'sqlite3';
import { join } from 'path';

const dbPath = join(process.env.HOME || '', '.agentcost.db');

export async function GET() {
  return new Promise((resolve) => {
    const db = new Database(dbPath);
    
    db.all(`
      SELECT 
        model,
        COUNT(*) as executions,
        SUM(tokens_used) as totalTokens,
        SUM(cost_cents) as totalCostCents,
        AVG(duration_ms) as avgDuration
      FROM executions
      GROUP BY model
      ORDER BY totalCostCents DESC
    `, (err, rows: any[]) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Failed to fetch team stats' }, { status: 500 }));
        return;
      }
      
      const teamStats = rows.map(row => ({
        model: row.model,
        executions: row.executions,
        totalTokens: row.totalTokens || 0,
        totalCost: (row.totalCostCents || 0) / 100,
        avgDuration: row.avgDuration || 0
      }));
      
      resolve(NextResponse.json(teamStats));
      db.close();
    });
  });
}
