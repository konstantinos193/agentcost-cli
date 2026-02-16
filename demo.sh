#!/bin/bash

# AgentCost Demo Script - Real AI Agent Integration
set -e

echo "🤖 AgentCost Real AI Agent Demo"
echo "================================"

# Check if CLI is installed
if ! command -v agentcost &> /dev/null; then
    echo "❌ AgentCost CLI not found. Please run ./install.sh first"
    exit 1
fi

# Initialize database
echo "📊 Initializing database..."
agentcost stats > /dev/null 2>&1 || true

echo ""
echo "🔧 Setup Instructions:"
echo "----------------------"
echo "To use real AI agents, set these environment variables:"
echo ""
echo "export ANTHROPIC_API_KEY='your-claude-api-key'"
echo "export OPENAI_API_KEY='your-openai-api-key'" 
echo "export GITHUB_TOKEN='your-github-token'"
echo ""
echo "Add these to your ~/.bashrc or ~/.zshrc to persist."
echo ""

# Demo commands
echo "🚀 Available Commands:"
echo "----------------------"
echo "agentcost claude \"Implement user authentication\"    # Call Claude API"
echo "agentcost cursor \"Add dark mode support\"           # Call Cursor/OpenAI"
echo "agentcost copilot \"Write unit tests\"              # Call GitHub Copilot"
echo "agentcost openai \"Refactor this component\"        # Call OpenAI directly"
echo "agentcost run \"npm test\"                          # Track shell commands"
echo "agentcost stats                                     # View cost statistics"
echo "agentcost recent                                    # Recent AI calls"
echo "agentcost setup                                     # Setup guide"
echo ""

# Show example usage
echo "💡 Example Usage:"
echo "----------------"
echo "# Real Claude API call with cost tracking:"
echo "agentcost claude \"Create a React component for user login\""
echo ""
echo "# Real Cursor API call with cost tracking:"
echo "agentcost cursor \"Optimize this database query\""
echo ""
echo "# Track any shell command:"
echo "agentcost run \"npm run build\""
echo ""

# Check if API keys are set
if [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$OPENAI_API_KEY" ] && [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  No API keys detected. Run 'agentcost setup' for configuration help."
    echo ""
    echo "🧪 For demo purposes, you can still track shell commands:"
    echo "agentcost run \"echo 'Hello World'\""
    echo "agentcost stats"
else
    echo "✅ API keys detected! Ready for real AI agent calls."
    echo ""
    echo "🎯 Try a real AI call:"
    if [ ! -z "$ANTHROPIC_API_KEY" ]; then
        echo "agentcost claude \"What is the best way to handle errors in Node.js?\""
    elif [ ! -z "$OPENAI_API_KEY" ]; then
        echo "agentcost openai \"Explain React hooks in simple terms\""
    fi
fi

echo ""
echo "📊 View your cost tracking:"
echo "agentcost stats"
echo "agentcost recent -n 5"
echo ""
echo "🌐 Start the dashboard:"
echo "cd packages/dashboard && npm run dev"
echo ""
echo "🎉 Happy coding with real AI cost tracking!"
