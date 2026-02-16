name: Pull Request Template
description: Template for pull requests
title: "[PR]: "
labels: ["pull-request"]
body:
  - type: markdown
    attributes:
      value: |
        ## 🎯 **Pull Request Overview**

        <!-- Brief description of changes -->

        ## 📋 **Changes Made**

        <!-- List of changes with bullet points -->
        - 

        ## 🔗 **Related Issues**

        <!-- Link to any related issues -->
        - Closes #

        ## 🧪 **Testing**

        - [ ] **Unit tests** added/updated
        - [ ] **Integration tests** pass
        - [ ] **Manual testing** completed
        - [ ] **Cross-platform** tested (Windows/macOS/Linux)

        ## 📚 **Documentation**

        - [ ] **README.md** updated if needed
        - [ ] **SCREENSHOTS.md** updated with examples
        - [ ] **CLI help** updated (`--help` flag)
        - [ ] **CHANGELOG.md** updated (for breaking changes)

        ## 🔍 **Type Safety**

        - [ ] **TypeScript** types are correct
        - [ ] **No `any` types** unless necessary
        - [ ] **Error handling** implemented
        - [ ] **Input validation** added

        ## 🚀 **Deployment**

        - [ ] **Local testing** successful
        - [ ] **CI/CD checks** pass
        - [ ] **Version bump** considered
        - [ ] **Breaking changes** documented

        ## 📸 **Screenshots**

        <!-- Add screenshots for UI changes -->
        <!-- Before/After comparisons -->

        ## 🔐 **Security**

        - [ ] **No secrets** committed
        - [ ] **Input validation** implemented
        - [ ] **Dependencies** checked for vulnerabilities

        ## 📝 **Additional Notes**

        <!-- Any additional context for reviewers -->

        ---

        ## 🎉 **Thanks for contributing!**

        Please review the [CONTRIBUTING.md](https://github.com/konstantinos193/agentcost-cli/blob/main/CONTRIBUTING.md) and ensure all checks pass before merging.

        **Maintainers will review this PR and provide feedback.**
