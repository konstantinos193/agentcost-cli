name: Bug Report
description: File a bug report to help us improve
title: "[BUG]: "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report! Please provide as much detail as possible.

  - type: input
    id: os
    attributes:
      label: Operating System
      description: What OS are you using?
      placeholder: e.g. macOS 13.0, Windows 11, Ubuntu 22.04
    validations:
      required: true

  - type: input
    id: node-version
    attributes:
      label: Node.js Version
      description: What version of Node.js are you using?
      placeholder: e.g. v18.17.0, v20.5.0
    validations:
      required: true

  - type: input
    id: agentcost-version
    attributes:
      label: AgentCost Version
      description: What version of AgentCost are you using?
      placeholder: e.g. v1.0.0
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is.
      placeholder: Describe what happened and what you expected to happen
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: Please provide detailed steps to reproduce the issue.
      placeholder: |
        1. Install AgentCost
        2. Set API keys
        3. Run 'agentcost claude "test"'
        4. See error...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What did you expect to happen?
      placeholder: I expected to see the AI response and cost tracking
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happened?
      placeholder: I got an error message instead...
    validations:
      required: true

  - type: textarea
    id: error-message
    attributes:
      label: Error Messages
      description: Please copy and paste any error messages you received.
      render: shell

  - type: textarea
    id: config
    attributes:
      label: Configuration
      description: Please share your configuration (remove sensitive data).
      placeholder: |
        API keys set: yes/no
        Environment variables: yes/no
        Custom settings: ...
      render: shell

  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Add any other context about the problem here.
      placeholder: Screenshots, logs, related issues, etc.

  - type: checkboxes
    id: terms
    attributes:
      label: Confirmation
      description: Please confirm the following
      options:
        - label: I have searched existing issues for similar bugs
          required: true
        - label: I have provided enough detail to reproduce the issue
          required: true
        - label: I have removed any sensitive information from this report
          required: true
