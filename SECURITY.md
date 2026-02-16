# Security Policy

## Supported Versions

| Version | Supported          |
|---------|-------------------|
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in AgentCost, please report it to us privately before disclosing it publicly.

### How to Report

**Email**: security@agentcost.dev

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any proof-of-concept code

### Response Time

We will acknowledge receipt within 24 hours and provide a detailed response within 48 hours.

### What Happens Next

1. We investigate the report
2. We determine the severity and impact
3. We develop a fix
4. We coordinate disclosure with you
5. We release a security update

## Security Best Practices

### For Users
- Keep your API keys secure
- Don't share your `.agentcost.json` files
- Use environment variables for sensitive data
- Regularly update to the latest version

### For Developers
- Never commit API keys to repositories
- Use `.env` files for local development
- Validate all user inputs
- Follow secure coding practices

## API Key Security

AgentCost stores API keys in environment variables only:
- No API keys are stored in the database
- No API keys are logged or transmitted
- API keys are only used for making authorized requests

### Recommended Setup
```bash
# Use environment variables
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
export GITHUB_TOKEN="your-token"

# Or use a .env file (add to .gitignore)
echo "ANTHROPIC_API_KEY=your-key" > .env
```

## Data Privacy

AgentCost is designed with privacy in mind:
- All data is stored locally by default
- No data is sent to external servers
- AI prompts and responses are stored locally only
- No telemetry or analytics collection

## Security Features

- **Local Storage**: All data stored locally by default
- **No Tracking**: No analytics or telemetry
- **API Key Protection**: Keys never stored or logged
- **Input Validation**: All inputs validated and sanitized
- **Secure Defaults**: Secure configuration out of the box

## Responsible Disclosure

We appreciate responsible disclosure and will:
- Respond promptly to security reports
- Credit researchers who discover vulnerabilities
- Work with researchers to understand and fix issues
- Coordinate disclosure when needed

Thank you for helping keep AgentCost secure! 🔒
