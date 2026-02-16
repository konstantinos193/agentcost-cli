import { NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const dbPath = join(process.env.HOME || process.env.USERPROFILE || '', '.agentcost.json');

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

export async function GET() {
  try {
    let executions: Execution[] = [];
    
    if (existsSync(dbPath)) {
      const content = await readFile(dbPath, 'utf-8');
      const data = JSON.parse(content);
      executions = data.executions || [];
    }
    
    const totalExecutions = executions.length;
    const totalTokens = executions.reduce((sum, exec) => sum + (exec.tokens_used || 0), 0);
    const totalCostCents = executions.reduce((sum, exec) => sum + (exec.cost_cents || 0), 0);
    const avgDuration = executions.length > 0 
      ? executions.reduce((sum, exec) => sum + (exec.duration_ms || 0), 0) / executions.length 
      : 0;
    
    return NextResponse.json({
      totalExecutions,
      totalTokens,
      totalCost: (totalCostCents || 0) / 100,
      avgDuration: Math.round(avgDuration || 0)
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stats',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
