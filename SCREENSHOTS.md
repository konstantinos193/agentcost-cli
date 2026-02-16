# 📸 AgentCost Screenshots

## CLI Usage Examples

### Real AI Agent Tracking
```bash
$ agentcost claude "Implement user authentication with JWT"
🤖 Calling claude API...
📝 Prompt: Implement user authentication with JWT
✅ claude response received
📊 Tokens: 245 input + 380 output = 625 total
💰 Actual cost: $0.0094
💬 Response: I'll help you implement JWT-based user authentication. Here's a comprehensive solution...

$ agentcost stats
📊 AgentCost Statistics
──────────────────────────────────────────────────
claude-3.5-sonnet     : 15 calls, 12,500 tokens, $4.25
gpt-4-turbo          : 8 calls, 8,200 tokens, $2.18
shell                : 23 calls, 1,150 tokens, $0.12
──────────────────────────────────────────────────
TOTAL                : 46 calls, 21,850 tokens, $6.55
```

### Recent Activity Tracking
```bash
$ agentcost recent -n 5
📋 Recent 5 AI Agent Calls
────────────────────────────────────────────────────────────────────────────────
✅ 14:32 claude-3.5-sonnet  claude: Implement user authentication           $0.85
✅ 14:28 gpt-4-turbo       cursor: Add dark mode support                  $0.42
✅ 14:25 claude-3.5-sonnet  claude: Write API documentation               $0.38
✅ 14:22 gpt-4              copilot: Create test suite                    $0.31
✅ 14:18 shell              npm run build                               $0.01
```

## Dashboard Preview (Coming Soon)

### Real-time Cost Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENTCOST DASHBOARD                          │
├─────────────────────────────────────────────────────────────────┤
│  💰 Total Spend: $156.42  📊 This Month: $47.83                │
│  🔔 Budget Alert: 78% of $60/month used                       │
├─────────────────────────────────────────────────────────────────┤
│  📈 USAGE TRENDS                                              │
│  │ $8.00 │                                                     │
│  │ $6.00 │     ████                                            │
│  │ $4.00 │   ██  ████                                          │
│  │ $2.00 │ ████  ████  ██                                      │
│  │ $0.00 │███████████████████████████████████████████████████│
│  └──────┴─────────────────────────────────────────────────────┘
│                                                                 │
│  🤖 MODEL BREAKDOWN                                            │
│  • Claude 3.5 Sonnet: 45% ($67.38)                            │
│  • GPT-4 Turbo: 32% ($50.05)                                  │
│  • GPT-4: 18% ($28.16)                                        │
│  • Copilot: 5% ($7.83)                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Team Analytics (Pro Feature)
```
┌─────────────────────────────────────────────────────────────────┐
│                       TEAM ANALYTICS                           │
├─────────────────────────────────────────────────────────────────┤
│  👥 Team Members: 8    📅 Period: Last 30 Days               │
│  💰 Team Spend: $1,247.63  📊 Avg/User: $155.95               │
├─────────────────────────────────────────────────────────────────┤
│  🏆 TOP USERS THIS MONTH                                       │
│  1. Sarah Chen     - $342.18 (Claude power user)             │
│  2. Mike Johnson   - $287.45 (GPT-4 heavy)                   │
│  3. Alex Rivera   - $198.22 (Mixed tools)                    │
│  4. Jamie Liu      - $156.78 (Copilot focused)               │
│  5. Sam Park       - $98.45 (Light usage)                    │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Guide

### Quick Installation
```bash
$ git clone https://github.com/your-org/agentcost-cli.git
$ cd agentcost-cli
$ npm install
$ npm link

$ agentcost setup
🔧 AgentCost Setup
────────────────────────
To use AgentCost with real AI agents, set these environment variables:

Claude:
  export ANTHROPIC_API_KEY="your-claude-api-key"

OpenAI/Cursor:
  export OPENAI_API_KEY="your-openai-api-key"

GitHub Copilot:
  export GITHUB_TOKEN="your-github-token"

Add these to your ~/.bashrc or ~/.zshrc to persist.
```

### First Use
```bash
$ export ANTHROPIC_API_KEY="sk-ant-api03-..."
$ agentcost claude "Explain React hooks in simple terms"
🤖 Calling claude API...
📝 Prompt: Explain React hooks in simple terms
✅ claude response received
📊 Tokens: 18 input + 247 output = 265 total
💰 Actual cost: $0.0041
💬 Response: React hooks are functions that let you "hook into" React state...
```

## Value Proposition

### Before AgentCost
```
❌ Surprise credit card bills
❌ No visibility into AI usage
❌ Can't optimize prompt costs
❌ Team usage is a black box
❌ Budget overruns without warning
```

### After AgentCost
```
✅ Real-time cost tracking
✅ Per-model usage breakdown
✅ Budget alerts and limits
✅ Team analytics and insights
✅ Cost optimization opportunities
```

---

*These screenshots demonstrate the core value proposition: real AI cost tracking with actionable insights.*
