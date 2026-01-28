---
description: Standardized procedure for implementing or modifying DB schemas.
---

# Workflow: Schema Modification & Data Migration

## Phase 1: Impact Analysis

1.  **Draft Migration**: Create the `schema.prisma` change.
2.  **Verify Integrity**: Ensure the new schema includes `tenantId` and complies with `docs/04-Database-Design.md`.
3.  **Check Compatibility**: Ensure the change is **backward compatible** (N-1 support).

## Phase 2: Implementation & Testing

1.  **Generate Migration**: Run `npx prisma migrate dev --create-only`.
2.  **Add Data Transformation**: If column data needs conversion, write a specific script in the migration file.
3.  **Local Test**: Run migration on local Docker and verify with `seed.ts`.

## Phase 3: Deployment Strategy

1.  **Staging Test**: Deploy to the Staging environment with a copy of production data (masked).
2.  **Production Rollout**: Execute during low-traffic windows.
3.  **Verification**: Run database health checks and monitoring dashboard overlay.

## Phase 4: Audit

1.  Update `docs/04-Database-Design.md` if the schema change is major.
2.  Log the change in `changelog.md`.
