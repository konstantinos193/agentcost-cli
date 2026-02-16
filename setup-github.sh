#!/bin/bash

# GitHub Repository Setup Script for AgentCost CLI
set -e

echo "🚀 Setting up AgentCost GitHub Repository..."

# Repository configuration
REPO_NAME="agentcost-cli"
OWNER="konstantinos193"
DESCRIPTION="Track AI coding agent usage and token cost locally or for your team."
HOMEPAGE="https://github.com/$OWNER/$REPO_NAME"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database files
*.db
*.sqlite
*.sqlite3
.agentcost.json
.agentcost-settings.json

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
tmp/
temp/
EOF
fi

# Add files to git
echo "📦 Adding files to git..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: AgentCost CLI - Track AI coding agent costs

✅ Features:
- Real AI API integration (Claude, OpenAI, Cursor, Copilot)
- Accurate token tracking and cost calculation
- CLI interface with statistics
- JSON-based local storage
- Cross-platform compatibility

🚀 Ready for Week 0 validation and user feedback!

Pro version coming soon with web dashboard and team features."

# Create GitHub repository (requires gh CLI)
if command -v gh &> /dev/null; then
    echo "🌐 Creating GitHub repository..."
    gh repo create "$REPO_NAME" \
        --description "$DESCRIPTION" \
        --homepage "$HOMEPAGE" \
        --public \
        --source=. \
        --push
    
    echo "✅ Repository created at: https://github.com/$OWNER/$REPO_NAME"
    
    # Add repository topics for discoverability
    echo "🏷️  Adding repository topics..."
    gh repo edit "$REPO_NAME" --add-topic "ai" --add-topic "cli" --add-topic "cost-tracking" \
        --add-topic "claude" --add-topic "openai" --add-topic "cursor" --add-topic "copilot" \
        --add-topic "developer-tools" --add-topic "token-usage" --add-topic "budget" \
        --add-topic "analytics" --add-topic "nodejs" --add-topic "typescript"
    
    # Enable issues and discussions
    echo "💬 Enabling community features..."
    gh repo edit "$REPO_NAME" --enable-issues --enable-discussions
    
    # Set default branch to main
    echo "🌿 Setting default branch to main..."
    git branch -M main
    git push -u origin main
    
else
    echo "⚠️  GitHub CLI not found. Manual setup required:"
    echo "1. Repository already exists at: https://github.com/$OWNER/$REPO_NAME"
    echo "2. Run: git remote add origin https://github.com/$OWNER/$REPO_NAME.git"
    echo "3. Run: git branch -M main"
    echo "4. Run: git push -u origin main"
    echo "5. Add topics: ai, cli, cost-tracking, claude, openai, cursor, copilot"
fi

# Create GitHub release
if command -v gh &> /dev/null; then
    echo "🏷️  Creating GitHub release..."
    gh release create v1.0.0 \
        --title "AgentCost CLI v1.0.0 - Track AI Costs" \
        --notes "## 🎉 AgentCost CLI v1.0.0

Track AI coding agent usage and token cost locally or for your team.

### ✅ Features
- 🤖 Real AI API integration (Claude, OpenAI, Cursor, Copilot)
- 📊 Accurate token tracking from API responses  
- 💰 Precise cost calculation with real pricing
- 📱 Simple CLI interface
- 📋 Usage statistics and analytics
- 💾 Local JSON storage (no dependencies)

### 🚀 Quick Start
\`\`\`bash
npm install -g agentcost
export ANTHROPIC_API_KEY=\"your-key\"
agentcost claude \"Explain React hooks\"
\`\`\`

### 🎯 Pro Version Coming Soon
- 🌐 Web dashboard
- 👥 Team collaboration  
- 🔔 Budget alerts
- 📈 Advanced analytics

**Built for developers who love AI but hate surprise bills!**"
fi

echo "🎊 GitHub repository setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Visit: https://github.com/your-org/$REPO_NAME"
echo "2. Share on Twitter, LinkedIn, Hacker News"
echo "3. Monitor for stars and issues"
echo "4. Engage with early adopters"
echo "5. Collect feedback for Pro version"
echo ""
echo "🚀 Week 0 validation ready!"
