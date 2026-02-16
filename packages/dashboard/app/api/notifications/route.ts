import { NextRequest, NextResponse } from 'next/server';

interface SlackMessage {
  text: string;
  attachments?: Array<{
    color: string;
    fields: Array<{
      title: string;
      value: string;
      short: boolean;
    }>;
  }>;
}

async function sendSlackNotification(webhookUrl: string, message: SlackMessage): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, current_spend, budget_limit, budget_used_percent } = await request.json();

    // Get settings including Slack webhook
    const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/settings`);
    if (!settingsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    const settings = await settingsResponse.json();
    
    if (!settings.slack_notifications || !settings.slack_webhook_url) {
      return NextResponse.json({ success: true, message: 'Slack notifications disabled' });
    }

    const isOverBudget = current_spend > budget_limit;
    const color = isOverBudget ? 'danger' : 'warning';
    
    const slackMessage: SlackMessage = {
      text: `🤖 AgentCost ${type === 'budget_exceeded' ? 'BUDGET EXCEEDED' : 'BUDGET ALERT'}`,
      attachments: [{
        color,
        fields: [
          {
            title: 'Current Spend',
            value: `$${current_spend.toFixed(2)}`,
            short: true
          },
          {
            title: 'Budget Limit',
            value: `$${budget_limit.toFixed(2)}`,
            short: true
          },
          {
            title: 'Usage',
            value: `${budget_used_percent.toFixed(1)}%`,
            short: true
          },
          {
            title: 'Status',
            value: isOverBudget ? '❌ Over Budget' : '⚠️ Approaching Limit',
            short: true
          }
        ]
      }]
    };

    const success = await sendSlackNotification(settings.slack_webhook_url, slackMessage);

    if (success) {
      return NextResponse.json({ success: true, message: 'Slack notification sent' });
    } else {
      return NextResponse.json({ error: 'Failed to send Slack notification' }, { status: 500 });
    }

  } catch (error) {
    console.error('Slack notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
