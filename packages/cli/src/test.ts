#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('agentcost')
  .description('CLI wrapper for tracking AI agent costs')
  .version('0.1.0');

program
  .command('test')
  .description('Test command')
  .action(() => {
    console.log(chalk.green('✅ AgentCost CLI is working!'));
  });

program.parse();
