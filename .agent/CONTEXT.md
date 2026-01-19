# Dự án Ecommerce 2.0 - Multi-Tenant Platform

Tài liệu này là **Long-term Memory** của dự án. Cập nhật khi có quyết định quan trọng.

---

## 1. Tổng quan Dự án

**Mục tiêu**: Xây dựng nền tảng Ecommerce Multi-tenant SaaS cho phép nhiều cửa hàng (Tenant) hoạt động độc lập trên cùng một hạ tầng.

**Tech Stack**:

- **Backend**: NestJS 11, Prisma 6, PostgreSQL (+pgvector), Redis, BullMQ
- **Frontend**: Next.js 16, React 19, TailwindCSS 4, Zustand, SWR
- **Infrastructure**: Docker Compose (Postgres, Redis, API x2, Web, Worker)

---

## 2. Core Business Logic

### Customer Flow

1. User truy cập Storefront của Tenant (qua subdomain hoặc custom domain).
2. Đăng ký/Đăng nhập (hỗ trợ Social Login: Google, Facebook).
3. Duyệt sản phẩm (theo Category, Brand, Filter giá).
4. Thêm vào giỏ hàng (Cart) -> Checkout.
5. Thanh toán (COD, MOMO, VNPAY, STRIPE).
6. Theo dõi đơn hàng (Order statuses: PENDING -> PROCESSING -> SHIPPED -> DELIVERED).
7. Đánh giá sản phẩm (Review + AI Sentiment analysis).
8. Đổi trả hàng (RMA Flow: Return Request -> Inspection -> Refund).

### Admin & SaaS Logic

1. **Catalog Management**: Category, Brand, Product, SKU (Variants), Options.
2. **Inventory**: Multi-warehouse, Stock Logs, Low stock alerts.
3. **Sales**: Order processing, Shipments (Partial), Payments, Invoices.
4. **Marketing**: Promotions (Rules/Actions), Loyalty Points, Customer Groups (B2B pricing).
5. **CMS**: Blog, Static Pages (About/Policy), Navigation Menus.
6. **SaaS Billing**: Subscriptions, Usage tracking, Platform Fees.
7. **Support**: RMA (Returns), Ticket System, AI Chatbot.
8. **System**: Audit Logs, Notifications, Feature Flags, File Uploads (Media).
9. **Analytics**: Revenue, Traffic, Storage usage per Tenant.

---

## 3. Database Schema Highlights (~1800 lines)

| Entity                                      | Mục đích                        |
| ------------------------------------------- | ------------------------------- |
| `Tenant`                                    | Cửa hàng (SaaS multi-tenancy)   |
| `User`                                      | Người dùng (Customer, Admin)    |
| `Role, Permission`                          | RBAC (Phân quyền động)          |
| `Product, SKU, ProductOption, OptionValue`  | Sản phẩm đa biến thể            |
| `Category, Brand`                           | Phân loại sản phẩm              |
| `Warehouse, InventoryItem, InventoryLog`    | Quản lý tồn kho đa kho          |
| `Cart, CartItem`                            | Giỏ hàng                        |
| `Order, OrderItem, Payment`                 | Đơn hàng & Thanh toán           |
| `Shipment, ShipmentItem`                    | Giao hàng (Partial Fulfillment) |
| `Promotion, PromotionRule, PromotionAction` | Engine khuyến mãi               |
| `ReturnRequest, ReturnItem`                 | RMA/Đổi trả hàng                |
| `LoyaltyPoint`                              | Tích điểm khách hàng            |
| `Review`                                    | Đánh giá + AI Sentiment         |
| `Blog, Page`                                | CMS                             |
| `AiChatSession, AiChatMessage`              | AI Chatbot                      |
| `OutboxEvent`                               | Transactional Outbox Pattern    |
| `Subscription, Invoice`                     | SaaS Billing                    |

---

## 4. Quyết định Kiến trúc (ADR)

- **ADR-001**: Sử dụng **Multi-tenant với Shared Database** (mỗi table có `tenantId`).
- **ADR-002**: Dùng **Prisma** làm ORM duy nhất, enable `fullTextSearchPostgres`.
- **ADR-003**: **Domain Events** qua `@nestjs/event-emitter` (trong `DomainEventsModule`).
- **ADR-004**: **Soft Delete** cho mọi entity quan trọng (User, Product, Order, Tenant).
- **ADR-005**: API Scalable với Docker Compose `replicas: 2`.
- **ADR-006**: Frontend dùng **Next.js Server Actions** thay cho REST calls khi có thể.
- **ADR-007**: **Transactional Outbox** (`OutboxEvent` table) cho Event Sourcing.
- **ADR-008**: **Architectural Scaling Strategy**: Hybrid Multi-tenancy (Shared DB -> DB-per-tenant).
- **ADR-009**: **Infra Strategy (Solo Dev)**: **Option A (Modern Stack)** - Vercel + Railway + Neon + Upstash. Ưu tiên tốc độ dev, giảm vận hành.
- **ADR-010**: **Next.js Rendering Strategy**:
  - **SSG (Static)**: Landing Page, Docs, Marketing Pages (Zero-config).
  - **ISR (Incremental)**: Product Detail, Blog Post, Public Category Pages (Revalidate: 60s).
  - **SSR (Server)**: User Profile, Cart, Checkout, Order History (Dynamic Data).
  - **CSR (Client)**: Admin Dashboard, Complex Interactive Forms (use `use client` + SWR).

---

## 5. Các API Modules Hiện Có

| Module                                         | Chức năng                           |
| ---------------------------------------------- | ----------------------------------- |
| `auth`                                         | Đăng nhập, Đăng ký, OAuth, 2FA, JWT |
| `users`                                        | CRUD User, Profile                  |
| `tenants`                                      | CRUD Tenant, Settings, Onboarding   |
| `catalog` (categories, brands, products, skus) | Quản lý sản phẩm                    |
| `cart`                                         | Giỏ hàng                            |
| `orders`                                       | Đơn hàng                            |
| `payment`                                      | Thanh toán (Momo, VNPay, COD)       |
| `shipping`                                     | Tích hợp GHN/GHTK                   |
| `promotions`                                   | Khuyến mãi nâng cao                 |
| `return-requests`                              | RMA/Đổi trả                         |
| `inventory`, `inventory-alerts`                | Kho hàng                            |
| `reviews`                                      | Đánh giá sản phẩm                   |
| `notifications`                                | Push/Email                          |
| `blog`, `pages`                                | CMS                                 |
| `ai` (ai-chat, agent, insights, rag, images)   | AI features                         |
| `analytics`, `reports`                         | Thống kê                            |
| `roles`, `admin`, `super-admin`                | Quản trị & Phân quyền               |
| `loyalty`                                      | Điểm thưởng                         |
| `tax`                                          | Thuế                                |
| `webhooks`                                     | Webhooks cho bên thứ 3              |

---

## 6. Roadmap Tiếp Theo (TODO)

- [ ] Hoàn thiện Core: Cart, Checkout, Order, Payment
- [ ] Stabilize Inventory Management
- [ ] Complete RMA/Return flow
- [ ] AI Chatbot Integration
- [ ] SEO Optimization for Storefront
- [ ] Admin Dashboard UI/UX Enhancement

---

## 7. Changelog

- [2026-01-16] **Phase 1 Foundation completed**:
  - Monorepo setup với pnpm workspace
  - Shared package `@ecommerce/shared` với Zod schemas
  - API scaffold (NestJS 11 + Prisma 6)
  - Web scaffold (Next.js 16 + TailwindCSS 4)
  - Docker Compose (Postgres, Redis)

- [2026-01-16] **Phase 2 Core Infrastructure completed**:
  - Database Schema (30+ models) với Prisma 6
  - Auth System (JWT, Refresh Token, RBAC)
  - Core Modules (Prisma, Redis, Guards, Interceptors)
  - Resolved port conflicts (DB: 5433, Redis: 6385)

- [2026-01-19] **Architectural Analysis completed**:
  - Đánh giá kiến trúc hiện tại: Modular Monolith + Shared Database.
  - Xây dựng lộ trình Scaling 4 cấp độ (Startup -> Growth -> Scale -> High Scale).
  - Xác định chiến lược Multi-tenancy: Shared Schema cho small tenants, Database-per-tenant cho Enterprise (dùng Neon).
  - Mapping Hạ tầng Cloud tương ứng (PaaS, K8s, Neon, S3).
  - Artifact: `architecture_analysis.md`.

- [2026-01-19] **Operational Framework stabilized**:
  - Rules (`critical`, `coding-standards`, `optimization`, `prompting`) configured with `trigger: always_on`.
  - Workflows (`fresh-start`, `feature-flow`) standardized.
  - IDE Recognition fixed via YAML Frontmatter.

- [2026-01-19] **Phase 1 Foundation Setup (Re-implemented)**:
  - Monorepo initialized (pnpm workspace).
  - Shared Package created & linked.
  - NestJS API & Next.js Web Scaffolded.
  - Verified via full build.
