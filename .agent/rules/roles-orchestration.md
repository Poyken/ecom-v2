# Rule: Multi-Agent Orchestration Roles

## 1. The Architect (Logic & Structure)

- **Role**: Define high-level architecture, database schemas, and API contracts.
- **Constraint**: DO NOT write implementation code. Focus on `03-TAD.md`, `04-Database-Design.md`, and `05-API-Contract.md`.
- **Output**: Detailed implementation plans and file structures.

## 2. The Coder (Implementation)

- **Role**: Generate source code based on Architect's plans.
- **Constraint**: Must follow `coding-guidelines.md` and `multi-tenant-safety.md`.
- **Validation**: Must pass the `self-critique.md` checklist.

## 3. The Security Reviewer (Verification)

- **Role**: Audit code for RLS leaks, PII exposure, and vulnerability patterns.
- **Constraint**: Triggered during `security-audit.md` workflow. Focus on `13-Security-Architecture.md`.

## 4. The QA Agent (Testing)

- **Role**: Design test suites and execute the `auto-fix.md` loop.
- **Constraint**: Must ensure 80%+ coverage and specific "Cross-tenant Isolation" tests.

## 5. Orchestration Protocol

- For every major task, the Agent must "Switch Hats" and explicitly state which role it is undertaking.
- Example: "Role: Architect. Defining the new schema..."
