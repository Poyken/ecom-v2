---
description: Enterprise workflow for implementing verified features.
---

# Workflow: Verified Feature Implementation

## Stage 1: Discovery & Gap Analysis

1.  **Read Specifications**: Locate and read the feature's requirements in `docs/01-BRD.md` and `docs/02-FSD.md`.
2.  **Verify Architecture**: Confirm implementation strategy against `docs/03-TAD.md`.
3.  **Schema Check**: Check for necessary fields in `docs/04-Database-Design.md`.
4.  **Consistency Check**: Flag any contradictions between documents to the user.

## Stage 2: Technical Design & Preparation

1.  **API Contract**: Define or update the contract in `docs/05-API-Contract.md`.
2.  **Schema Update**: Modify `schema.prisma`.
3.  **Migration Draft**: Run `npx prisma migrate dev --create-only` and review the SQL.

## Stage 3: Implementation

1.  **Domain Logic**: Implement services in NestJS using strict TDD (Test Driven Development) where possible.
2.  **Isolation Check**: Ensure `tenantId` is correctly applied to all database interactions.
3.  **UI/UX Layer**: Build the interface in Next.js following the established Design System in `docs/06-UI-UX-Design.md`.

## Stage 4: Quality Assurance & Documentation

1.  **Verification**: Run unit and integration tests.
2.  **Security Audit**: Verify cross-tenant isolation.
3.  **Update Docs**: If implementation details changed, update the relevant `docs/*.md`.
4.  **Changelog**: Add a professional entry to `changelog.md` using the "Added" or "Changed" categories.
