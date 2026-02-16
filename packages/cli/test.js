#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');

const program = new Command();

program
  .name('agentcost')
  .description('CLI wrapper for tracking AI agent costs')
  .version('0.1.0');

program
  .command('test')
  .description('Test command')
  .action(() => {
    console.log('✅ AgentCost CLI is working!');
  });

program.parse();
