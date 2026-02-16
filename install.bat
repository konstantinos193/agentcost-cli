@echo off
setlocal enabledelayedexpansion

echo 🤖 Installing AgentCost CLI...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is required but not installed. Please install npm first.
    exit /b 1
)

REM Get the directory of this script
set SCRIPT_DIR=%~dp0
set CLI_DIR=%SCRIPT_DIR%packages\cli

REM Check if CLI directory exists
if not exist "%CLI_DIR%" (
    echo ❌ CLI directory not found at %CLI_DIR%
    exit /b 1
)

REM Install dependencies
echo 📦 Installing CLI dependencies...
cd /d "%CLI_DIR%"
call npm install

REM Build the CLI
echo 🔨 Building CLI...
call npm run build

REM Create global symlink
echo 🔗 Creating global symlink...
call npm link

REM Initialize database
echo 💾 Initializing database...
node -e "const { Database } = require('sqlite3'); const path = require('path'); const os = require('os'); const dbPath = path.join(os.homedir(), '.agentcost.db'); const db = new Database(dbPath); db.serialize(() => { db.run('CREATE TABLE IF NOT EXISTS executions (id INTEGER PRIMARY KEY AUTOINCREMENT, command TEXT NOT NULL, model TEXT, tokens_used INTEGER DEFAULT 0, duration_ms INTEGER, cost_cents INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, files_changed TEXT, exit_code INTEGER)'); db.run('CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK (id = 1), budget_limit_dollars REAL DEFAULT 100, alert_threshold_percent REAL DEFAULT 80, slack_webhook_url TEXT, email_notifications BOOLEAN DEFAULT 1, slack_notifications BOOLEAN DEFAULT 0)'); }); console.log('✅ Database initialized successfully'); db.close();"

echo ✅ AgentCost CLI installed successfully!
echo.
echo 🚀 Usage:
echo   agentcost run "your-command"     # Track any command
echo   agentcost claude "your-prompt"   # Track Claude Code
echo   agentcost cursor "your-prompt"   # Track Cursor
echo   agentcost copilot "your-prompt"   # Track GitHub Copilot
echo   agentcost stats                  # View cost statistics
echo.
echo 📊 Start the dashboard:
echo   cd packages\dashboard && npm run dev
echo.
echo ⚙️  Configuration:
echo   Database: %USERPROFILE%\.agentcost.db
echo   Web dashboard: http://localhost:3000/settings

pause
