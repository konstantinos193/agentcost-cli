# AgentCost CLI — Track AI Coding Agent Usage & Costs

**Track AI coding agent usage and token cost locally or for your team.**

![CLI Demo](https://img.shields.io/badge/CLI-Node.js-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Version](https://img.shields.io/badge/version-0.1.0-orange)

## 🚀 Quick Start

### Installation
```bash
npm install -g agentcost-cli
```

### Basic Usage
```bash
# Track an AI agent command
agentcost run "claude-code 'fix the login bug'" --model claude-3

# View cost statistics
agentcost stats

# Show recent activity
agentcost history
```

## 📊 Features

- ✅ **Local Tracking**: Monitor AI agent usage with local SQLite storage
- ✅ **Token Cost Tracking**: Accurate token counting and cost estimation
- ✅ **Multi-Model Support**: Works with Claude, GPT-4, and other major models
- ✅ **Team Analytics**: Aggregate usage across your team (Pro feature)
- ✅ **Budget Alerts**: Get notified when approaching spending limits (Pro feature)
- ✅ **Export Data**: CSV/JSON export for reporting
- ✅ **Dashboard Integration**: Connect to web dashboard for visual analytics

## 📈 Screenshots

### CLI Statistics Dashboard
```
📊 AgentCost Statistics
========================
Total Sessions:     42
Total Tokens:       1,247,893
Total Cost:         $156.23
Avg Cost/Session:   $3.72

Model Breakdown:
┌─────────────┬──────────┬──────────┐
│ Model       │ Tokens   │ Cost     │
├─────────────┼──────────┼──────────┤
│ claude-3    │ 847,291  │ $106.84  │
│ gpt-4       │ 400,602  │ $49.39   │
└─────────────┴──────────┴──────────┘
```

### Recent Activity Log
```
🕒 Recent Activity
==================
2024-02-15 14:32  claude-3  $12.47  "Implement user authentication"
2024-02-15 13:18  gpt-4     $8.23   "Fix responsive design issues"  
2024-02-15 11:45  claude-3  $15.91  "Add API documentation"
2024-02-15 10:22  gpt-4     $6.18   "Debug payment integration"
```

### Web Dashboard Preview
*(Dashboard available with Pro version)*
![Dashboard Preview](https://via.placeholder.com/800x400/1e293b/ffffff?text=AgentCost+Dashboard+Preview)

## 💻 Commands

### `agentcost run`
Execute and track an AI agent command:
```bash
agentcost run "claude-code 'refactor the auth module'" --model claude-3 --project "web-app"
```

### `agentcost stats`
Display usage statistics:
```bash
agentcost stats --period week --model claude-3
```

### `agentcost history`
Show recent activity:
```bash
agentcost history --limit 10 --detailed
```

### `agentcost export`
Export usage data:
```bash
agentcost export --format csv --output usage-report.csv
```

### `agentcost config`
Configure settings:
```bash
agentcost config set api-key your-api-key
agentcost config set budget-alert 100
```

## 🔧 Configuration

Create a configuration file at `~/.agentcost/config.json`:

```json
{
  "defaultModel": "claude-3",
  "currency": "USD",
  "budgetAlerts": true,
  "monthlyBudget": 500,
  "teamId": "your-team-id"
}
```

## 📦 Pricing Models

Supported models with current pricing:

| Model | Input Tokens | Output Tokens |
|-------|--------------|---------------|
| Claude-3 Opus | $15.00/M | $75.00/M |
| Claude-3 Sonnet | $3.00/M | $15.00/M |
| Claude-3 Haiku | $0.25/M | $1.25/M |
| GPT-4 Turbo | $10.00/M | $30.00/M |
| GPT-3.5 Turbo | $0.50/M | $1.50/M |

## 🚀 Pro Version Coming Soon

**Upgrade to AgentCost Pro for advanced features:**

- 🏢 **Team Management**: Multi-user workspaces and role-based access
- 📊 **Advanced Analytics**: Custom reports, trend analysis, and insights  
- 🔔 **Smart Alerts**: Budget notifications, anomaly detection, and cost optimization tips
- 🔗 **Integrations**: Slack, Discord, and GitHub notifications
- ☁️ **Cloud Sync**: Secure cloud backup and cross-device synchronization
- 🎯 **Cost Optimization**: AI-powered recommendations to reduce spending
- 📈 **Custom Dashboards**: Build custom analytics dashboards for your team

**Get early access:** Join our waitlist at [agentcost.dev/pro](https://agentcost.dev/pro)

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/yourusername/agentcost-cli.git
cd agentcost-cli

# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📞 Support

- 📧 Email: support@agentcost.dev
- 💬 Discord: [Join our community](https://discord.gg/agentcost)
- 📖 Docs: [agentcost.dev/docs](https://agentcost.dev/docs)

---

**Track smarter, spend better.** 🎯
