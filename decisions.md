# Architectural Decision Log (ADL)

This file tracks critical decisions made during the project to ensure long-term consistency and prevent AI "hallucinations" regarding previous choices.

## 1. Multi-tenancy Strategy

- **Decision**: Shared Database, Shared Schema with `tenantId` isolation and PostgreSQL Row Level Security (RLS).
- **Rationale**: Optimal balance between cost-efficiency for many small-to-medium tenants and high security/isolation.
- **Date**: 2026-01-26
- **Status**: Active

## 2. Tech Stack Selection

- **Backend**: NestJS (v11+) for its modularity and structured DI.
- **Frontend**: Next.js (v16.1+) with App Router for streaming and RSC performance.
- **ORM**: Prisma (v6.2.1+) for type-safety and migration reliability.
- **Database**: PostgreSQL with `pgvector` for AI-native search capabilities.
- **Date**: 2026-01-26
- **Status**: Active

## 3. Designing for Performance

- **Standard**: API response < 500ms, Frontend LCP < 2s.
- **Implementation**: Radical use of Vercel React Best Practices (57 rules) and NestJS Enterprise patterns.
- **Date**: 2026-01-26
- **Status**: Active

## 4. AI Agent Governance

- **Structure**: All AI behavior is regulated by the `.agent/` directory (Rules, Skills, Workflows).
- **Source of Truth**: The 24 files in `docs/` take precedence over AI general knowledge.
- **Date**: 2026-01-26
- **Status**: Active

## 5. Port Configuration

- **API**: Port 8080 (NestJS).
- **Web**: Port 3000 (Next.js).
- **Rationale**: standard port mapping for developer ease and avoiding conflicts with system services.
- **Date**: 2026-01-26
- **Status**: Active

## 6. Payment Integration (Vietnam Market)

- **Decision**: Primary implementation using **VNPay Sandbox**.
- **Rationale**: High adoption in local market and support for QR/Napas.
- **Date**: 2026-01-26
- **Status**: Planned (Sprint 3)

## 7. Solo Developer Strategy

- **Decision**: Adopt MVP-first approach with managed services for solo dev execution.
- **Context**: Project will be developed and maintained by a single developer.
- **Key Changes**:
  - **Scope Reduction**: Remove variants, multi-warehouse, AI search, B2B features from MVP
  - **Infrastructure**: Use managed services (Neon, Upstash, Vercel, Render) instead of self-hosted
  - **Timeline**: 4 months (16 weeks) to MVP instead of 6 months (9 sprints)
  - **Security**: 4-layer defense (Middleware → Prisma Extension → RLS → Auto-tests)
  - **Target Market**: Vietnam-only, niche down to specific vertical
- **Cost Estimate**: ~$8/month (free tiers)
- **Date**: 2026-01-28
- **Status**: Active
