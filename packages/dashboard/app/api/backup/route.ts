import { NextRequest, NextResponse } from 'next/server';
import { Database } from 'sqlite3';
import { join } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const dbPath = join(process.env.HOME || '', '.agentcost.db');

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { type, format } = await request.json();
    
    if (type === 'backup') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = join(process.env.HOME || '', `.agentcost-backup-${timestamp}.db`);
      
      // Create backup
      await execAsync(`cp "${dbPath}" "${backupPath}"`);
      
      return NextResponse.json({
        success: true,
        backupPath,
        timestamp
      });
    }
    
    if (type === 'export') {
      const db = new Database(dbPath);
      
      return new Promise((resolve) => {
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
          db.close();
          
          if (err) {
            resolve(NextResponse.json({ error: 'Failed to export data' }, { status: 500 }));
            return;
          }
          
          if (format === 'json') {
            resolve(NextResponse.json({
              success: true,
              data: rows,
              exported_at: new Date().toISOString()
            }));
          } else {
            // CSV format
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
                'Content-Disposition': `attachment; filename="agentcost-export-${new Date().toISOString().split('T')[0]}.csv"`
              }
            }));
          }
        });
      });
    }
    
    return NextResponse.json({ error: 'Invalid backup type' }, { status: 400 });
    
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ 
      error: 'Backup failed',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = new Database(dbPath);
    
    return new Promise((resolve) => {
      db.all(`
        SELECT 
          name,
          sql
        FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `, (err, tables) => {
        if (err) {
          resolve(NextResponse.json({ error: 'Failed to get database info' }, { status: 500 }));
          return;
        }
        
        const stats: any = {};
        
        Promise.all(tables.map((table: any) => {
          return new Promise<void>((tableResolve) => {
            db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, result: any) => {
              stats[table.name] = {
                count: result.count,
                sql: table.sql
              };
              tableResolve();
            });
          });
        })).then(() => {
          db.close();
          
          // Get database file size
          const fs = require('fs');
          const statsObj = fs.statSync(dbPath);
          
          resolve(NextResponse.json({
            success: true,
            database_info: {
              path: dbPath,
              size_bytes: statsObj.size,
              size_mb: (statsObj.size / (1024 * 1024)).toFixed(2),
              tables: stats,
              last_modified: statsObj.mtime
            }
          }));
        });
      });
    });
    
  } catch (error) {
    console.error('Database info error:', error);
    return NextResponse.json({ 
      error: 'Failed to get database info',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
