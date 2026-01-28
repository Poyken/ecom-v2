# Project Context: Enterprise Multi-tenant E-commerce Platform

## 1. Executive Summary & Source of Truth

This is a **MVP-first** multi-tenant e-commerce platform for **B2C** (Vietnam market). Developed by a **solo developer** with managed services. The **Source of Truth** is `docs/`. Architectural decisions in `decisions.md`. See Decision #7 for Solo Dev Strategy.

## 2. Advanced Agentic Intelligence

The AI Agent operates with 6 advanced cognitive features:

| Feature                     | Protocol File            | Function                                                        |
| :-------------------------- | :----------------------- | :-------------------------------------------------------------- |
| **1. Multi-Agent Roles**    | `roles-orchestration.md` | Divides Agent into Architect, Coder, Security, and QA personas. |
| **2. Reasoning (MCTSR)**    | `reasoning-mctsr.md`     | Generates 3 options + scoring for complex decisions.            |
| **3. Visual Verification**  | `visual-verify.md`       | Browser-based UI/UX and monochrome audit.                       |
| **4. Self-Evolving Skills** | `evolution-search.md`    | Ability to create new .agent skills for repetitive tasks.       |
| **5. Long-term Memory**     | `decisions.md`           | Persistent Architectural Decision Log (ADL).                    |
| **6. Semantic Search**      | `evolution-search.md`    | Always researches similar patterns before implementation.       |

## 3. Mandatory Guardrails

- **Tenant Isolation**: Mandatory `tenantId` filtering. SEV-0 for failures.
- **Contract Strictness**: 100% alignment with `05-API-Contract.md`.
- **Self-Critique**: Agent MUST run `self-critique.md` BEFORE replying with code.

## 4. Governance Matrix (Mapping)

| Activity     | Governing Documents | Integrated Skills                               |
| :----------- | :------------------ | :---------------------------------------------- |
| **Backend**  | `TAD`, `DB-Design`  | `nestjs-best-practices`                         |
| **Frontend** | `UI-UX-Design`      | `react-best-practices`, `web-design-guidelines` |
| **Business** | `BRD`, `FSD`        | `docs-specialist`                               |

## 5. Workflows

1. `new-feature.md`: Standard implementation.
2. `auto-fix.md`: Autonomous TDD loop.
3. `visual-verify.md`: UI/UX browser audit.
4. `security-audit.md`: Compliance scan.
5. `tenant-onboarding.md`: Merchant provisioning.

## 6. Directory Map

- `/api`: NestJS Backend.
- `/web`: Next.js Frontend.
- `/docs`: Specifications.
- `.agent`: Advanced Agent Intelligence (Rules, Skills, Workflows).
