# AgentCost CLI Setup Guide

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

#### Option 1: Automated Installation (Recommended)

**Windows:**
```bash
.\install.bat
```

**macOS/Linux:**
```bash
chmod +x install.sh
./install.sh
```

#### Option 2: Manual Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/agentcost.git
cd agentcost
```

2. **Install dependencies:**
```bash
# CLI dependencies
cd packages/cli
npm install
npm run build
npm link

# Dashboard dependencies
cd ../dashboard
npm install
```

3. **Initialize database:**
```bash
agentcost stats  # This will create the database automatically
```

### Usage

#### CLI Commands

```bash
# Track any command
agentcost run "npm test"

# Track AI agents directly
agentcost claude "implement user authentication"
agentcost cursor "add dark mode support"
agentcost copilot "optimize database queries"

# View statistics
agentcost stats

# View help
agentcost --help
```

#### Dashboard

Start the web dashboard:

```bash
cd packages/dashboard
npm run dev
```

Visit `http://localhost:3000` to access:
- 📊 Real-time cost tracking
- 👥 Team analytics
- ⚙️ Budget settings
- 📤 Data export

### Configuration

#### Environment Variables

Create a `.env` file in `packages/dashboard`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=file:../.agentcost.db
```

#### Budget Settings

Configure budget alerts in the dashboard at `/settings`:
- Monthly budget limit
- Alert threshold (percentage)
- Slack notifications
- Email notifications

### Integration Examples

#### With Claude Code

```bash
# Instead of: claude "refactor this component"
agentcost claude "refactor this component"
```

#### With Cursor

```bash
# Instead of: cursor "fix the bug"
agentcost cursor "fix the bug"
```

#### With GitHub Copilot

```bash
# Instead of: copilot "write tests"
agentcost copilot "write tests"
```

### Data Storage

- **Database**: `~/.agentcost.db` (SQLite)
- **Logs**: Console output with cost information
- **Exports**: CSV download from dashboard

### Troubleshooting

#### Common Issues

1. **Command not found:**
   ```bash
   npm link  # Re-link the CLI
   ```

2. **Database errors:**
   ```bash
   rm ~/.agentcost.db  # Delete and recreate
   agentcost stats     # Reinitialize
   ```

3. **Permission errors (macOS/Linux):**
   ```bash
   sudo npm link  # Use sudo for global installation
   ```

#### Development Mode

For development with hot reload:

```bash
# CLI development
cd packages/cli
npm run dev

# Dashboard development
cd packages/dashboard
npm run dev
```

### Support

- 📖 Documentation: `./docs/`
- 🐛 Issues: GitHub Issues
- 💬 Discord: [Join our community](https://discord.gg/agentcost)

### Uninstall

```bash
npm unlink agentcost
rm ~/.agentcost.db
```

---

**Happy coding with cost visibility! 🚀**
