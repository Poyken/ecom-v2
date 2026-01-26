---
description: Emergency procedure for fixing critical production issues.
---

# Workflow: Critical Hotfix (P0/P1)

## Stage 1: Detection & Triage (Source: docs/10-Operations-Maintenance.md)

1.  **Diagnose**: Use Sentry/Prometheus to identify the root cause.
2.  **Triage**: Confirm if the issue is `P0` (System down) or `P1` (Critical feature broken).
3.  **Communication**: Notify the Incident Commander and clear the `changelog.md` "Hotfix" category.

## Stage 2: Isolation & Fix

1.  **Reproduce**: Create a failing unit test that mimics the production error.
2.  **Fix**: Apply the minimal change required to resolve the issue without feature creep.
3.  **Verification**: Run the test suite and verify tenant isolation (docs/13-Security-Architecture.md).

## Stage 3: Rapid Deployment

1.  **CI/CD**: Push to `main` (or a dedicated `hotfix` branch) to trigger GitHub Actions.
2.  **Verfication**: Monitor the rollout on Vercel/Render using the Health Check endpoints (`/health`).

## Stage 4: Post-Mortem

1.  Perform Root Cause Analysis (RCA).
2.  Update `docs/09-Risk-Management.md` if the risk was previously unidentified.
3.  Document the incident and resolution in `changelog.md`.
