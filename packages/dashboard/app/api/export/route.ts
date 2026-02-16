import { NextResponse } from 'next/server';
import { Database } from 'sqlite3';
import { join } from 'path';

const dbPath = join(process.env.HOME || '', '.agentcost.db');

export async function GET() {
  return new Promise((resolve) => {
    const db = new Database(dbPath);
    
    db.all(`
      SELECT 
        id,
        command,
        model,
        tokens_used,
        duration_ms,
        cost_cents,
        timestamp,
        exit_code
      FROM executions
      ORDER BY timestamp DESC
    `, (err, rows) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Failed to export data' }, { status: 500 }));
        return;
      }
      
      // Convert to CSV format
      const csvHeaders = ['ID', 'Command', 'Model', 'Tokens Used', 'Duration (ms)', 'Cost (cents)', 'Timestamp', 'Exit Code'];
      const csvRows = rows.map((row: any) => [
        row.id,
        `"${row.command}"`,
        row.model,
        row.tokens_used,
        row.duration_ms,
        row.cost_cents,
        row.timestamp,
        row.exit_code
      ]);
      
      const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
      
      resolve(new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="agentcost-export.csv"'
        }
      }));
      
      db.close();
    });
  });
}
