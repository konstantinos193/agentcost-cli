name: Question
description: Ask a question about AgentCost
title: "[QUESTION]: "
labels: ["question"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for your question! Please provide as much detail as possible so we can help you better.

  - type: textarea
    id: question
    attributes:
      label: Your Question
      description: What would you like to know about AgentCost?
      placeholder: e.g., How do I track costs for multiple team members? What AI providers are supported?
    validations:
      required: true

  - type: dropdown
    id: category
    attributes:
      label: Question Category
      description: What type of question is this?
      options:
        - Installation/Setup
        - CLI Usage
        - API Integration
        - Cost Tracking
        - Troubleshooting
        - Features
        - Other
    validations:
      required: true

  - type: textarea
    id: context
    attributes:
      label: Context
      description: Please provide any relevant context about your setup or use case
      placeholder: |
        - Operating System: Windows 11 / macOS 13.0 / Ubuntu 22.04
        - Node.js version: v18.17.0
        - API keys set up: yes/no
        - What you've tried so far...
    validations:
      required: false

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What did you expect to happen?
      placeholder: I expected to see cost tracking when I run agentcost stats...

  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happened?
      placeholder: I got an error message instead...

  - type: textarea
    id: logs
    attributes:
      label: Error Messages or Logs
      description: Please copy and paste any error messages or logs
      render: shell

  - type: checkboxes
    id: checked
    attributes:
      label: What have you already tried?
      description: Please check what you've already done
      options:
        - label: I've read the README.md
          required: false
        - label: I've checked existing issues
          required: false
        - label: I've tried the setup guide
          required: false
        - label: I've checked the documentation
          required: false

  - type: markdown
    attributes:
      value: |
        ---
        
        **Tips for getting help faster:**
        - Search existing issues first
        - Provide as much detail as possible
        - Include error messages and logs
        - Mention your OS and Node.js version
        
        Thanks for asking! We'll help you get AgentCost working. 🚀
