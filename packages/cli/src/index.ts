#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { spawn, exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const program = new Command();
const dbPath = join(process.env.HOME || process.env.USERPROFILE || '', '.agentcost.json');
const execAsync = promisify(exec);

// Initialize JSON database
async function initDb() {
  if (!existsSync(dbPath)) {
    await writeFile(dbPath, JSON.stringify({ executions: [] }));
  }
}

// AI Model Pricing (per 1K tokens - input/output)
const MODEL_PRICING = {
  'claude-3.5-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  'o1-preview': { input: 0.015, output: 0.06 },
  'o1-mini': { input: 0.003, output: 0.012 }
};

// Real Claude API integration
async function callClaude(prompt: string, model: string = 'claude-3.5-sonnet'): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  return await response.json();
}

// Real OpenAI API integration
async function callOpenAI(prompt: string, model: string = 'gpt-4-turbo'): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  return await response.json();
}

// Real Cursor integration (uses OpenAI API)
async function callCursor(prompt: string): Promise<any> {
  // Cursor uses OpenAI API with special handling
  return await callOpenAI(prompt, 'gpt-4-turbo');
}

// Real GitHub Copilot integration
async function callCopilot(prompt: string): Promise<any> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable not set');
  }

  const response = await fetch('https://api.githubcopilot.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'AgentCost-CLI'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`Copilot API error: ${response.statusText}`);
  }

  return await response.json();
}

// Track real AI agent execution
async function trackAIExecution(prompt: string, agent: string, model?: string) {
  await initDb();
  const startTime = Date.now();
  
  let response: any;
  let actualModel = model;
  let promptTokens = 0;
  let completionTokens = 0;
  let totalTokens = 0;
  let costCents = 0;
  let exitCode = 0;
  let apiResponse = '';

  try {
    console.log(chalk.blue(`🤖 Calling ${agent} API...`));
    console.log(chalk.gray(`📝 Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`));

    switch (agent) {
      case 'claude':
        actualModel = model || 'claude-3.5-sonnet';
        response = await callClaude(prompt, actualModel);
        promptTokens = response.usage?.input_tokens || 0;
        completionTokens = response.usage?.output_tokens || 0;
        apiResponse = response.content?.[0]?.text || '';
        break;
        
      case 'cursor':
        actualModel = 'gpt-4-turbo';
        response = await callCursor(prompt);
        promptTokens = response.usage?.prompt_tokens || 0;
        completionTokens = response.usage?.completion_tokens || 0;
        apiResponse = response.choices?.[0]?.message?.content || '';
        break;
        
      case 'copilot':
        actualModel = 'gpt-4';
        response = await callCopilot(prompt);
        promptTokens = response.usage?.prompt_tokens || 0;
        completionTokens = response.usage?.completion_tokens || 0;
        apiResponse = response.choices?.[0]?.message?.content || '';
        break;
        
      case 'openai':
        actualModel = model || 'gpt-4-turbo';
        response = await callOpenAI(prompt, actualModel);
        promptTokens = response.usage?.prompt_tokens || 0;
        completionTokens = response.usage?.completion_tokens || 0;
        apiResponse = response.choices?.[0]?.message?.content || '';
        break;
        
      default:
        throw new Error(`Unknown agent: ${agent}`);
    }

    totalTokens = promptTokens + completionTokens;
    
    // Calculate real cost based on actual token usage
    const pricing = MODEL_PRICING[actualModel as keyof typeof MODEL_PRICING];
    if (pricing) {
      const inputCost = (promptTokens / 1000) * pricing.input;
      const outputCost = (completionTokens / 1000) * pricing.output;
      costCents = Math.round((inputCost + outputCost) * 100);
    }

    console.log(chalk.green(`✅ ${agent} response received`));
    console.log(chalk.yellow(`📊 Tokens: ${promptTokens} input + ${completionTokens} output = ${totalTokens} total`));
    console.log(chalk.yellow(`💰 Actual cost: $${(costCents / 100).toFixed(4)}`));
    console.log(chalk.gray(`💬 Response: ${apiResponse.substring(0, 200)}${apiResponse.length > 200 ? '...' : ''}`));

  } catch (error) {
    console.error(chalk.red(`❌ Error calling ${agent}: ${(error as Error).message}`));
    exitCode = 1;
    apiResponse = `Error: ${(error as Error).message}`;
  }

  const duration = Date.now() - startTime;

  // Save to JSON database with real data
  try {
    const data = JSON.parse(await readFile(dbPath, 'utf-8'));
    const newExecution = {
      id: Date.now(),
      command: `${agent}: ${prompt}`,
      model: actualModel,
      tokens_used: totalTokens,
      duration_ms: duration,
      cost_cents: costCents,
      timestamp: new Date().toISOString(),
      files_changed: '',
      exit_code: exitCode,
      api_response: apiResponse,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens
    };
    
    data.executions.push(newExecution);
    await writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(chalk.red('Failed to save execution data:', error));
  }
  
  return {
    success: exitCode === 0,
    response: apiResponse,
    tokens: totalTokens,
    cost: costCents,
    duration
  };
}

program
  .name('agentcost')
  .description('CLI wrapper for tracking AI agent costs')
  .version('0.1.0');

program
  .command('run <command>')
  .description('Run a command and track its cost')
  .option('-m, --model <model>', 'AI model used (claude-3, gpt-4, etc)')
  .action(async (command, options) => {
    // For general commands, we'll track shell execution but not AI calls
    await initDb();
    const startTime = Date.now();
    
    console.log(chalk.blue(`🚀 Running command: ${command}`));
    
    const child = spawn(command, { shell: true, stdio: 'inherit' });
    
    child.on('close', async (code) => {
      const duration = Date.now() - startTime;
      
      // Estimate cost for shell commands (much lower than AI)
      const estimatedTokens = Math.ceil(command.length / 4);
      const costCents = Math.round(estimatedTokens * 0.001); // Minimal cost for shell commands
      
      try {
        const data = JSON.parse(await readFile(dbPath, 'utf-8'));
        const newExecution = {
          id: Date.now(),
          command: command,
          model: 'shell',
          tokens_used: estimatedTokens,
          duration_ms: duration,
          cost_cents: costCents,
          timestamp: new Date().toISOString(),
          files_changed: '',
          exit_code: code || 0,
          api_response: '',
          prompt_tokens: 0,
          completion_tokens: 0
        };
        
        data.executions.push(newExecution);
        await writeFile(dbPath, JSON.stringify(data, null, 2));
      } catch (error) {
        console.error(chalk.red('Failed to save execution data:', error));
      }
      
      console.log(chalk.green(`✅ Command completed in ${duration}ms`));
      console.log(chalk.yellow(`💰 Estimated cost: $${(costCents / 100).toFixed(4)}`));
    });
  });

program
  .command('claude <prompt>')
  .description('Call Claude API with cost tracking')
  .option('-m, --model <model>', 'Claude model (sonnet, opus, haiku)', 'sonnet')
  .action(async (prompt, options) => {
    const modelMap: Record<string, string> = {
      'sonnet': 'claude-3.5-sonnet',
      'opus': 'claude-3-opus', 
      'haiku': 'claude-3-haiku'
    };
    const model = modelMap[options.model] || 'claude-3.5-sonnet';
    await trackAIExecution(prompt, 'claude', model);
  });

program
  .command('cursor <prompt>')
  .description('Call Cursor API with cost tracking')
  .action(async (prompt) => {
    await trackAIExecution(prompt, 'cursor');
  });

program
  .command('copilot <prompt>')
  .description('Call GitHub Copilot API with cost tracking')
  .action(async (prompt) => {
    await trackAIExecution(prompt, 'copilot');
  });

program
  .command('openai <prompt>')
  .description('Call OpenAI API with cost tracking')
  .option('-m, --model <model>', 'OpenAI model (gpt-4, gpt-3.5-turbo)', 'gpt-4-turbo')
  .action(async (prompt, options) => {
    await trackAIExecution(prompt, 'openai', options.model);
  });

program
  .command('stats')
  .description('Show cost statistics')
  .action(async () => {
    await initDb();
    
    try {
      const data = JSON.parse(await readFile(dbPath, 'utf-8'));
      const executions = data.executions || [];
      
      // Group by model
      const modelStats: Record<string, { count: number; tokens: number; cost: number }> = {};
      
      executions.forEach(exec => {
        const model = exec.model || 'unknown';
        if (!modelStats[model]) {
          modelStats[model] = { count: 0, tokens: 0, cost: 0 };
        }
        modelStats[model].count++;
        modelStats[model].tokens += exec.tokens_used || 0;
        modelStats[model].cost += exec.cost_cents || 0;
      });
      
      console.log(chalk.blue('📊 AgentCost Statistics'));
      console.log(chalk.gray('─'.repeat(50)));
      
      let totalExecutions = 0;
      let totalTokens = 0;
      let totalCost = 0;
      
      Object.entries(modelStats).forEach(([model, stats]) => {
        totalExecutions += stats.count;
        totalTokens += stats.tokens;
        totalCost += stats.cost;
        
        console.log(`${chalk.cyan(model.padEnd(20))}: ${stats.count} calls, ${stats.tokens.toLocaleString()} tokens, $${(stats.cost / 100).toFixed(2)}`);
      });
      
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`${chalk.green('TOTAL'.padEnd(20))}: ${totalExecutions} calls, ${totalTokens.toLocaleString()} tokens, $${(totalCost / 100).toFixed(2)}`);
      
    } catch (error) {
      console.error(chalk.red('Error fetching stats'));
    }
  });

program
  .command('recent')
  .description('Show recent AI agent calls')
  .option('-n, --number <number>', 'Number of recent calls to show', '10')
  .action(async (options) => {
    await initDb();
    const limit = parseInt(options.number);
    
    try {
      const data = JSON.parse(await readFile(dbPath, 'utf-8'));
      const executions = data.executions || [];
      
      const recent = executions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      
      console.log(chalk.blue(`📋 Recent ${limit} AI Agent Calls`));
      console.log(chalk.gray('─'.repeat(80)));
      
      recent.forEach((row) => {
        const status = row.exit_code === 0 ? chalk.green('✅') : chalk.red('❌');
        const time = new Date(row.timestamp).toLocaleTimeString();
        const command = row.command.length > 50 ? row.command.substring(0, 47) + '...' : row.command;
        
        console.log(`${status} ${chalk.gray(time)} ${chalk.cyan((row.model || '').padEnd(15))} ${command.padEnd(50)} $${((row.cost_cents || 0) / 100).toFixed(4)}`);
      });
      
    } catch (error) {
      console.error(chalk.red('Error fetching recent calls'));
    }
  });

program
  .command('setup')
  .description('Setup API keys for AI agents')
  .action(() => {
    console.log(chalk.blue('🔧 AgentCost Setup'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log('\nTo use AgentCost with real AI agents, set these environment variables:');
    console.log('\n' + chalk.yellow('Claude:'));
    console.log('  export ANTHROPIC_API_KEY="your-claude-api-key"');
    console.log('\n' + chalk.yellow('OpenAI/Cursor:'));
    console.log('  export OPENAI_API_KEY="your-openai-api-key"');
    console.log('\n' + chalk.yellow('GitHub Copilot:'));
    console.log('  export GITHUB_TOKEN="your-github-token"');
    console.log('\n' + chalk.green('Add these to your ~/.bashrc or ~/.zshrc to persist.'));
  });

program.parse();
