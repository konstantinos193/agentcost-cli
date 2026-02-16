import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const dbPath = join(process.env.HOME || process.env.USERPROFILE || '', '.agentcost.json');

// Simple JSON-based database for Next.js compatibility
interface Execution {
  id: number;
  command: string;
  model: string;
  tokens_used: number;
  duration_ms: number;
  cost_cents: number;
  timestamp: string;
  exit_code: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  api_response?: string;
}

class SimpleDB {
  private data: { executions: Execution[] } = { executions: [] };
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async load(): Promise<void> {
    try {
      if (existsSync(this.filePath)) {
        const content = await readFile(this.filePath, 'utf-8');
        this.data = JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = { executions: [] };
    }
  }

  private async save(): Promise<void> {
    try {
      await writeFile(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  async all(query: string, params?: any[]): Promise<Execution[]> {
    await this.load();
    
    // Simple query parser for our use case
    if (query.includes('ORDER BY timestamp DESC')) {
      const limit = params?.[0] || 100;
      return this.data.executions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    }
    
    return this.data.executions;
  }

  async get(query: string, params?: any[]): Promise<any> {
    await this.load();
    
    if (query.includes('SELECT')) {
      if (query.includes('COUNT(*)')) {
        return { total_executions: this.data.executions.length };
      }
      if (query.includes('SUM(tokens_used)')) {
        const totalTokens = this.data.executions.reduce((sum, exec) => sum + (exec.tokens_used || 0), 0);
        const totalCost = this.data.executions.reduce((sum, exec) => sum + (exec.cost_cents || 0), 0);
        const avgDuration = this.data.executions.length > 0 
          ? this.data.executions.reduce((sum, exec) => sum + (exec.duration_ms || 0), 0) / this.data.executions.length 
          : 0;
        
        return {
          totalTokens,
          totalCostCents: totalCost,
          avgDuration
        };
      }
    }
    
    return {};
  }

  async run(query: string, params?: any[]): Promise<void> {
    await this.load();
    
    if (query.includes('INSERT INTO executions')) {
      const newExecution: Execution = {
        id: Date.now(),
        command: params?.[0] || '',
        model: params?.[1] || '',
        tokens_used: params?.[2] || 0,
        duration_ms: params?.[3] || 0,
        cost_cents: params?.[4] || 0,
        timestamp: new Date().toISOString(),
        exit_code: params?.[6] || 0,
        prompt_tokens: params?.[8] || 0,
        completion_tokens: params?.[9] || 0,
        api_response: params?.[7] || ''
      };
      
      this.data.executions.push(newExecution);
      await this.save();
    }
  }
}

export async function GET() {
  try {
    const db = new SimpleDB(dbPath);
    const rows = await db.all(`
      SELECT 
        id,
        command,
        model,
        tokens_used,
        duration_ms,
        cost_cents,
        timestamp,
        exit_code,
        prompt_tokens,
        completion_tokens,
        api_response
      FROM executions
      ORDER BY timestamp DESC
      LIMIT 100
    `);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error in executions API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch executions',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
