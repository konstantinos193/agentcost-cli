# Contributing to AgentCost CLI

Thanks for your interest in contributing to AgentCost CLI! 🎉

## 🎯 **What We Welcome**

- ✅ **Bug fixes** and performance improvements
- ✅ **New AI provider integrations** (OpenAI, Anthropic, Groq, Azure, etc.)
- ✅ **CLI usability enhancements** and user experience improvements
- ✅ **Documentation improvements** and examples
- ✅ **Performance optimizations** and cross-platform fixes
- ✅ **Security improvements** and vulnerability reports

## ❌ **What We Don't Accept**

- ❌ **Breaking changes** without a major version bump
- ❌ **Proprietary/closed-source** code additions
- ❌ **Features unrelated** to cost tracking
- ❌ **Spam** or low-effort PRs
- ❌ **Competing product clones**

## 🎯 **Project Scope**

### ✅ **In Scope**
- AI/LLM cost tracking and visibility
- CLI tools for AI agent monitoring
- Team collaboration features
- Usage analytics and reporting
- Budget alerts and notifications

### ❌ **Out of Scope**
- General-purpose AI agents
- Non-cost related features
- Competing product clones
- Unrelated developer tools

## 🔧 **Requirements**

### **Code Standards**
- **TypeScript required** for all new code
- **Tests required** for all new features
- **Documentation updates** for any API or user-facing changes
- **No secrets** - Never commit API keys, tokens, or credentials (strictly enforced)

### **Testing**
- **Unit tests** for new functionality
- **Integration tests** for CLI commands
- **Cross-platform testing** (Windows, macOS, Linux)
- **Manual testing** for user-facing changes

## 🔄 **Pull Request Process**

1. **Self-review** your changes before submitting
2. **Automated checks** must pass
3. **At least one maintainer** review required
4. **Address all feedback** before merge
5. **Keep PRs small** and focused

### **PR Requirements**
- Clear description of changes
- Tests must pass
- Documentation updated if needed
- No breaking changes without version bump
- Follow existing code patterns

## 🏷️ **Labels**

We use these labels to categorize issues and PRs:

### **Priority**
- `critical`: Security issues or breaking bugs
- `high`: Important features or major bugs  
- `medium`: Enhancements or minor bugs
- `low`: Nice-to-have or documentation

### **Type**
- `bug`: Something isn't working
- `feature`: New feature or request
- `documentation`: Docs or documentation updates
- `security`: Security-related
- `good first issue`: Good for newcomers
- `help wanted`: Community help needed

## 🔒 **Security**

### **Reporting Vulnerabilities**
Please report security issues **privately** to: `security@agentcost.dev`

**Do NOT** open public issues or discussions for security vulnerabilities.

### **Security Guidelines**
- **No API keys** or secrets in code or commits
- **Input validation** required on all user inputs
- **Follow responsible disclosure** practices
- **Use secure coding practices**

## � **Getting Help**

- **Questions**: Create an issue with `help wanted` label
- **Discussions**: Use GitHub Discussions for general questions
- **Security**: Email `security@agentcost.dev`
- **General**: Create an issue or check existing documentation

## 📚 **Related Files**

- [SECURITY.md](./SECURITY.md) - Security policy
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - Community guidelines
- [LICENSE](./LICENSE) - MIT License
- [README.md](./README.md) - Project documentation

---

**Thanks for contributing to AgentCost CLI!** 🚀

*Built with ❤️ by the AgentCost community*
- Use TypeScript for all new code
- Follow the existing code style (Prettier/ESLint configured)
- Write meaningful commit messages
- Add tests for new features

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Submitting Changes
1. Ensure all tests pass
2. Update documentation if needed
3. Submit a pull request with a clear description
4. Wait for code review

## 🐛 Bug Reports

When reporting bugs, please include:
- OS and Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Any error messages

## 💡 Feature Requests

We welcome feature requests! Please:
- Check if it's already requested
- Provide use case details
- Consider implementation complexity

## 📧 Contact

- Create an issue for bugs/features
- Join our Discord for discussions
- Email: dev@agentcost.dev

Thanks for contributing! 🎉
