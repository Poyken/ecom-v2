# Project Context: Ecommerce Monorepo (Enterprise Level)

> [!IMPORTANT]
> **Living Document**: This file is the "Memory" of the project. It MUST be updated after every major task or phase completion.

## 1. Project Overview

- **Type**: Multi-tenant Ecommerce Platform (SaaS).
- **Architecture**: Modular Monolith (NestJS) + Next.js (Web) + Shared Database (Postgres).
- **Scale Strategy**: Starts with Shared Database (Tenant Discriminator) -> Can evolve to Sharding/Service Splitting.

## 2. Tech Stack & Standards

- **Backend**: NestJS 11, Prisma 6 (Postgres), Redis (BullMQ).
- **Frontend**: Next.js 16, React 19, TailwindCSS, Zustand.
- **Validation**: **Zod-First Policy** (No Class-Validator/Joi). Shared schemas in `packages/shared`.
- **Infrastructure**: Docker Compose (Local), Neon (DB), Railway/Render (Compute).

## 3. Business Rules (Enterprise)

- **Multi-tenancy**: Strict isolation via `tenantId` (Prisma Middleware + CLS).
- **Inventory**: Multi-Warehouse model (`InventoryItem`). `Sku.stock` is a cached aggregate.
- **Orders**: Transactional flow (Create Order -> Reduce Stock -> Clear Cart).
- **Products**: SKU-centric model (Product -> Options -> Sku).

## 4. Architectural Decisions (ADR)

- **ADR-001 (Monorepo)**: Use pnpm workspaces for code sharing (`api`, `web`, `shared`).
- **ADR-002 (Auth)**: JWT with `x-tenant-id` header validation.
- **ADR-003 (Inventory)**: `InventoryItem` is Source of Truth. `Sku.stock` is Read-Only cache.

## Changelog

- [2026-01-19] Phase 9: Detailed Feature Implementation. Full Storefront Customer Journey, Admin Catalog/Inventory management, and Superadmin Tenant overview completed and verified with production build.
  - Auth & Tenancy: Secure JWT + Middleware Isolation.

- [2026-01-19] **Phase 1-3 Audit completed (Score 10/10)**:
  - Prisma Enterprise Schema fully migrated.
  - Auth & Tenancy: Secure JWT + Middleware Isolation.

- [2026-01-19] **Phase 4 Product Catalog completed**:
  - Shared Zod Schemas for Category, Brand, Product, Sku.
  - Catalog Module with Slug Generation + Transaction support.

- [2026-01-19] **Phase 5 Cart & Checkout completed**:
  - Cart with Stock Check. Orders with Transactional Reduce Stock.

- [2026-01-19] **Phase 6 Inventory Management completed**:
  - Multi-warehouse logic (InventoryItem + InventoryLog).
  - `Sku.stock` synced as Cached Aggregate.

- [2026-01-19] **Phase 7 Payment Integration completed**:
  - Strategy Pattern for Payment Providers (COD, Bank Transfer).
  - Schema-aligned Payment record creation.

- [2026-01-19] **Deep Audit (Phase 4-7)**:
  - **Score**: Code 8/10, Rule Compliance 6/10.
  - **Fixed**: InventoryLog schema mismatch.
  - **Finding**: Rule 11 (Double-Handshake) was violated throughout session.
- [2026-01-19] Hoàn thành Phase 11: Comprehensive Order Management.
  - Triển khai Order State Machine và OrderLog để theo dõi lịch sử trạng thái.
  - Tích hợp logic tồn kho (Committed Stock) xuyên suốt vòng đời đơn hàng.
  - Phát triển Admin Order Panel với đầy đủ bộ lọc và bộ điều khiển trạng thái.
  - Phát triển giao diện Lịch sử đơn hàng cho khách hàng.
  - Toàn bộ monorepo build thành công.
- [2026-01-19] **Phase 10: Advanced Inventory completed**:
  - Quản lý đa kho hàng, transactional stock transfer giữa các kho.
  - Hệ thống Warehouse Logs chi tiết (Tracking stock changes per warehouse).

- [2026-01-19] **Logic Alignment & UI/UX Revolution**:
  - Triển khai logic **Committed Stock** (Giữ chỗ tồn kho khi đặt hàng).
  - Nâng cấp UI với **Framer Motion** (VibrantButton, GlassCard) và **Lucide Icons**.
  - Tối ưu hiệu năng: Router-based refreshes, audit API calls.
  - Build thành công toàn bộ monorepo (API & Web).
