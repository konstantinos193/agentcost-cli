# 🤖 AgentCost - Track AI Coding Agent Costs

> **Track AI coding agent usage and token cost locally or for your team.**

![AgentCost CLI](https://img.shields.io/badge/CLI-v1.0.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-16+-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 **Why AgentCost?**

AI coding agents like Claude, Cursor, and GitHub Copilot are amazing... but your credit card bill isn't. **AgentCost** gives you real-time visibility into your AI coding costs across your entire team.

## 🚀 **Quick Start**

### Installation
```bash
# Clone and install
git clone https://github.com/konstantinos193/agentcost-cli.git
cd agentcost-cli
npm install
npm link

# Or install globally (coming soon)
npm install -g agentcost
```

### Setup API Keys
```bash
export ANTHROPIC_API_KEY="your-claude-api-key"
export OPENAI_API_KEY="your-openai-api-key"
export GITHUB_TOKEN="your-github-token"
```

### Start Tracking
```bash
# Track Claude API calls with real cost
agentcost claude "Implement user authentication"

# Track Cursor/OpenAI calls
agentcost cursor "Add dark mode support"

# Track GitHub Copilot
agentcost copilot "Write unit tests"

# View your spending
agentcost stats
```

## 📊 **Dashboard Preview**

### Real-time Cost Tracking
```
📊 AgentCost Statistics
──────────────────────────────────────────────────
claude-3.5-sonnet     : 15 calls, 12,500 tokens, $4.25
gpt-4-turbo          : 8 calls, 8,200 tokens, $2.18
shell                : 23 calls, 1,150 tokens, $0.12
──────────────────────────────────────────────────
TOTAL                : 46 calls, 21,850 tokens, $6.55
```

### Recent Activity
```
📋 Recent 5 AI Agent Calls
────────────────────────────────────────────────────────────────────────────────
✅ 14:32 claude-3.5-sonnet  claude: Implement user authentication           $0.85
✅ 14:28 gpt-4-turbo       cursor: Add dark mode support                  $0.42
✅ 14:25 claude-3.5-sonnet  claude: Write API documentation               $0.38
✅ 14:22 gpt-4              copilot: Create test suite                    $0.31
✅ 14:18 shell              npm run build                               $0.01
```

## 🎯 **Features**

### ✅ **Current (Free Version)**
- 🤖 **Real AI API Integration** - Claude, OpenAI, Cursor, Copilot
- 📊 **Accurate Token Tracking** - Real token counts from API responses
- 💰 **Precise Cost Calculation** - Based on actual model pricing
- 📱 **CLI Interface** - Simple command-line tracking
- 📋 **Usage Statistics** - Per-model breakdown and totals
- 💾 **Local Storage** - JSON-based database (no dependencies)

### 🚀 **Coming Soon (Pro Version)**
- 🌐 **Web Dashboard** - Beautiful real-time analytics
- 👥 **Team Collaboration** - Multi-user cost tracking
- 🔔 **Budget Alerts** - Slack/email notifications
- 📈 **Advanced Analytics** - Trends, forecasts, insights
- 🔐 **Enterprise Features** - SSO, audit logs, compliance
- ☁️ **Cloud Sync** - Share data across devices

## 💡 **Use Cases**

### For Individual Developers
- Track monthly AI coding expenses
- Optimize prompt efficiency
- Budget for AI tools

### For Development Teams
- Monitor team-wide AI usage
- Set budget limits and alerts
- Cost allocation per project

### For Agencies/Consultants
- Bill clients for AI usage
- Track ROI on AI tools
- Manage multiple team accounts

## 🛠️ **Commands**

```bash
# AI Agent Commands
agentcost claude "your prompt"        # Claude API
agentcost cursor "your prompt"        # Cursor/OpenAI
agentcost copilot "your prompt"       # GitHub Copilot
agentcost openai "your prompt"        # Direct OpenAI

# Utility Commands
agentcost stats                       # View cost statistics
agentcost recent -n 10                # Recent activity
agentcost run "shell command"         # Track any command
agentcost setup                       # Setup guide
```

## 📈 **Real Pricing Integration**

| Model | Input Cost | Output Cost |
|-------|------------|-------------|
| Claude 3.5 Sonnet | $0.003/1K tokens | $0.015/1K tokens |
| Claude 3 Opus | $0.015/1K tokens | $0.075/1K tokens |
| GPT-4 | $0.03/1K tokens | $0.06/1K tokens |
| GPT-4 Turbo | $0.01/1K tokens | $0.03/1K tokens |
| GPT-3.5 Turbo | $0.0015/1K tokens | $0.002/1K tokens |

## � **Development**

```bash
# Clone repository
git clone https://github.com/konstantinos193/agentcost-cli.git
cd agentcost-cli

# Install dependencies
npm install

# Build CLI
npm run build

# Run in development
npm run dev

# Run tests
npm test
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

## 🚀 **Roadmap**

### Version 1.0 (Current)
- ✅ CLI with real AI API integration
- ✅ Local cost tracking
- ✅ Basic statistics

### Version 1.1 (Next)
- 🔄 Web dashboard
- 🔄 Team features
- 🔄 Budget alerts

### Version 2.0 (Future)
- 📋 Enterprise features
- 📋 Advanced analytics
- 📋 Cloud sync

---

## 🎯 **Pro Version Coming Soon!**

Get ready for **team collaboration**, **real-time dashboard**, **budget alerts**, and **advanced analytics**.

**Join our waitlist for early access:** [Coming Soon]

---

**Built with ❤️ for developers who love AI but hate surprise bills.**
