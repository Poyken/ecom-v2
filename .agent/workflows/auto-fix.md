---
description: Autonomous loop to implement and verify code until tests pass.
---

# Workflow: Autonomous Auto-Fix Loop

## Stage 1: Success Definition

1. **Locate Requirements**: Read the target file (e.g., `REQUIREMENTS.md` or a specific issue description).
2. **Identify Test Suite**: Determine which test file (e.g., `api/test/*.spec.ts`) governs this feature. If no test exists, **create one first** based on the requirements.

## Stage 2: The Implementation Loop (Self-Correction)

// turbo

1. **Execute Test**: Run the relevant test command (e.g., `npm run test:api -- <file>` or `npx playwright test`).
2. **Analyze Result**:
   - If **PASS**: Finalize the task, update `changelog.md`, and report success.
   - If **FAIL**: Capture the exact error message and stack trace.
3. **Internal Critique**:
   - Check the failure against `.agent/rules/multi-tenant-safety.md` to ensure isolation isn't broken.
   - Check against `.agent/skills/nestjs-best-practices/` or `react-best-practices/` for pattern violations.
4. **Apply Fix**: Modify the source code in `api/` or `web/` based on the test failure.
5. **Loop**: Repeat Stage 2 until the test passes.

## Stage 3: Operational Guardrails

- **Limit**: MAX 5 iterations. If still failing after 5 attempts, halt and request human guidance with a summary of attempted fixes.
- **Tenant Context**: Never run a "fix" that removes a `tenantId` filter just to make a test pass.
- **Side-Effects**: Ensure `npx prisma migrate` or other environment steps are updated if the schema is the cause of failure.

## Stage 4: Post-Verification

1. Run the **Security Audit** workflow (`.agent/workflows/security-audit.md`) to ensure the "fix" didn't introduce vulnerabilities.
2. Perform a final commit and log the automated resolution.
