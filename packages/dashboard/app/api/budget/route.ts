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

interface Settings {
  budget_limit_dollars: number;
  alert_threshold_percent: number;
  slack_webhook_url: string;
  email_notifications: boolean;
  slack_notifications: boolean;
}

const settingsPath = join(process.env.HOME || process.env.USERPROFILE || '', '.agentcost-settings.json');

async function sendNotification(message: string) {
  try {
    let settings: Settings = {
      budget_limit_dollars: 100,
      alert_threshold_percent: 80,
      slack_webhook_url: '',
      email_notifications: true,
      slack_notifications: false
    };
    
    if (existsSync(settingsPath)) {
      const content = await readFile(settingsPath, 'utf-8');
      settings = JSON.parse(content);
    }
    
    if (settings.slack_notifications && settings.slack_webhook_url) {
      await fetch(settings.slack_webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

export async function GET() {
  try {
    let executions: Execution[] = [];
    let settings: Settings = {
      budget_limit_dollars: 100,
      alert_threshold_percent: 80,
      slack_webhook_url: '',
      email_notifications: true,
      slack_notifications: false
    };
    
    // Load executions
    if (existsSync(dbPath)) {
      const content = await readFile(dbPath, 'utf-8');
      const data = JSON.parse(content);
      executions = data.executions || [];
    }
    
    // Load settings
    if (existsSync(settingsPath)) {
      const content = await readFile(settingsPath, 'utf-8');
      settings = JSON.parse(content);
    }
    
    // Calculate current month's spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExecutions = executions.filter(exec => {
      const execDate = new Date(exec.timestamp);
      return execDate.getMonth() === currentMonth && execDate.getFullYear() === currentYear;
    });
    
    const currentSpendCents = monthlyExecutions.reduce((sum, exec) => sum + (exec.cost_cents || 0), 0);
    const currentSpend = currentSpendCents / 100;
    const budgetLimit = settings.budget_limit_dollars;
    const thresholdPercent = settings.alert_threshold_percent;
    
    const thresholdAmount = (budgetLimit * thresholdPercent) / 100;
    const isOverBudget = currentSpend > budgetLimit;
    const isNearThreshold = currentSpend > thresholdAmount;
    
    // Send notifications if needed
    if (isOverBudget) {
      await sendNotification(`🚨 Budget Alert: You've exceeded your monthly budget of $${budgetLimit}! Current spend: $${currentSpend.toFixed(2)}`);
    } else if (isNearThreshold) {
      await sendNotification(`⚠️ Budget Alert: You've used ${((currentSpend / budgetLimit) * 100).toFixed(1)}% of your monthly budget. Current spend: $${currentSpend.toFixed(2)}`);
    }
    
    return NextResponse.json({
      currentSpend,
      budgetLimit,
      thresholdPercent,
      isOverBudget,
      isNearThreshold,
      remainingBudget: Math.max(0, budgetLimit - currentSpend),
      usagePercent: Math.min(100, (currentSpend / budgetLimit) * 100),
      monthlyExecutions: monthlyExecutions.length
    });
  } catch (error) {
    console.error('Budget API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch budget data',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
