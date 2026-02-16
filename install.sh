#!/bin/bash

# AgentCost CLI Installation Script
set -e

echo "🤖 Installing AgentCost CLI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install npm first."
    exit 1
fi

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
CLI_DIR="$SCRIPT_DIR/packages/cli"

# Check if CLI directory exists
if [ ! -d "$CLI_DIR" ]; then
    echo "❌ CLI directory not found at $CLI_DIR"
    exit 1
fi

# Install dependencies
echo "📦 Installing CLI dependencies..."
cd "$CLI_DIR"
npm install

# Build the CLI
echo "🔨 Building CLI..."
npm run build

# Create global symlink
echo "🔗 Creating global symlink..."
if command -v sudo &> /dev/null; then
    sudo npm link
else
    npm link
fi

# Initialize database
echo "💾 Initializing database..."
node -e "
const { Database } = require('sqlite3');
const path = require('path');
const os = require('os');

const dbPath = path.join(os.homedir(), '.agentcost.db');
const db = new Database(dbPath);

db.serialize(() => {
    db.run(\`
        CREATE TABLE IF NOT EXISTS executions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            command TEXT NOT NULL,
            model TEXT,
            tokens_used INTEGER DEFAULT 0,
            duration_ms INTEGER,
            cost_cents INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            files_changed TEXT,
            exit_code INTEGER
        )
    \`);
    
    db.run(\`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            budget_limit_dollars REAL DEFAULT 100,
            alert_threshold_percent REAL DEFAULT 80,
            slack_webhook_url TEXT,
            email_notifications BOOLEAN DEFAULT 1,
            slack_notifications BOOLEAN DEFAULT 0
        )
    \`);
});

console.log('✅ Database initialized successfully');
db.close();
"

echo "✅ AgentCost CLI installed successfully!"
echo ""
echo "🚀 Usage:"
echo "  agentcost run 'your-command'     # Track any command"
echo "  agentcost claude 'your-prompt'   # Track Claude Code"
echo "  agentcost cursor 'your-prompt'   # Track Cursor"
echo "  agentcost copilot 'your-prompt'   # Track GitHub Copilot"
echo "  agentcost stats                  # View cost statistics"
echo ""
echo "📊 Start the dashboard:"
echo "  cd packages/dashboard && npm run dev"
echo ""
echo "⚙️  Configuration:"
echo "  Edit settings at: ~/.agentcost.db"
echo "  Or use the web dashboard at http://localhost:3000/settings"
