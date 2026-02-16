name: Feature Request
description: Suggest an idea for AgentCost
title: "[FEATURE]: "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a feature for AgentCost! Please provide as much detail as possible.

  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: What problem would this feature solve?
      placeholder: I need to track AI costs across my team but there's no way to see who's spending what...
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: How would you like this feature to work?
      placeholder: Add a team dashboard that shows per-user spending and allows setting budgets...
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: What other approaches have you considered?
      placeholder: I've tried using spreadsheets but they're manual and error-prone...

  - type: dropdown
    id: feature-type
    attributes:
      label: Feature Type
      description: What type of feature is this?
      options:
        - CLI Enhancement
        - Dashboard Feature
        - Integration
        - Analytics
        - Security
        - Performance
        - Documentation
        - Other
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: Priority
      description: How important is this feature to you?
      options:
        - Critical - Can't use AgentCost without it
        - High - Really need this for my workflow
        - Medium - Nice to have
        - Low - Minor improvement
    validations:
      required: true

  - type: textarea
    id: use-case
    attributes:
      label: Use Case
      description: How would you use this feature in your workflow?
      placeholder: As a team lead, I want to see who's using AI tools the most so I can optimize our budget...

  - type: textarea
    id: implementation
    attributes:
      label: Implementation Ideas
      description: Any thoughts on how this could be implemented?
      placeholder: Maybe add a new command like 'agentcost team-stats' that shows per-user breakdown...

  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Add any other context, screenshots, or examples about the feature request.

  - type: checkboxes
    id: terms
    attributes:
      label: Confirmation
      description: Please confirm the following
      options:
        - label: I have searched existing issues for similar feature requests
          required: true
        - label: I understand this is a request and not guaranteed to be implemented
          required: true
        - label: I'm willing to help contribute to this feature if possible
          required: false
