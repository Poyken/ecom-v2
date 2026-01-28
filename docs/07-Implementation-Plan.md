# Kế hoạch Triển khai (Solo Developer Edition)

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 2.0 (Solo Dev)  
**Ngày**: 28 tháng 1, 2026  
**Tác giả**: Solo Developer  
**Thời gian dự kiến**: **4 tháng** (16 tuần)

> [!IMPORTANT]
> Tài liệu này thay thế phiên bản cũ (9 sprints/6 tháng). Xem `decisions.md#7` cho context.

---

### Tổng quan MVP

#### Scope In (MVP)

- ✅ Multi-tenant với tenant isolation
- ✅ Auth (Email/Password + JWT)
- ✅ CRUD Products (không có variants)
- ✅ Categories (1 cấp, không phân cấp)
- ✅ Cart + Checkout (logged-in users only)
- ✅ VNPay Integration
- ✅ Basic Order Management
- ✅ Simple Admin Dashboard

#### Scope Out (Phase 2+)

- ❌ SKU/Product Variants
- ❌ Multi-warehouse Inventory
- ❌ AI Search (pgvector)
- ❌ Loyalty Points
- ❌ B2B Features
- ❌ Guest Checkout
- ❌ Social Login
- ❌ Multi-currency

---

### Timeline 4 Tháng

|   Tuần    | Focus       | Deliverable                             | Status |
| :-------: | :---------- | :-------------------------------------- | :----: |
|  **1-2**  | Foundation  | Monorepo, Auth, Tenant Middleware       |  [ ]   |
|  **3-4**  | Products    | CRUD Products, Image Upload, Categories |  [ ]   |
|  **5-6**  | Storefront  | Product List, Detail, Cart (Redis)      |  [ ]   |
|  **7-8**  | Commerce    | VNPay, Checkout, Order Creation         |  [ ]   |
| **9-10**  | Admin       | Dashboard, Order Management             |  [ ]   |
| **11-12** | Polish      | Bug fixes, Performance, Deploy          |  [ ]   |
| **13-14** | Soft Launch | 5-10 Beta Customers                     |  [ ]   |
| **15-16** | Iterate     | Feedback → Improvements                 |  [ ]   |

---

### Infrastructure (Managed Services)

| Service     | Provider      |  Cost/Month   | Tier           |
| :---------- | :------------ | :-----------: | :------------- |
| Database    | Neon          |      $0       | Free (0.5GB)   |
| Cache       | Upstash       |      $0       | Free (10K/day) |
| API Hosting | Render        |      $7       | Starter        |
| Web Hosting | Vercel        |      $0       | Free           |
| Storage     | Cloudflare R2 |      $0       | Free (10GB)    |
| Email       | Resend        |      $0       | Free (3K/mo)   |
| Domain      | Any           |      ~$1      | .com           |
| **Total**   |               | **~$8/month** |                |

---

### Daily Workflow (Solo Dev)

```
Morning (2h):   Planning + Self PR Review
Afternoon (4h): Coding Sprint (1 feature/day)
Evening (1h):   Testing + Deploy + Docs
```

#### Tools

- **Code**: VS Code + Cursor AI + Gemini CLI
- **Version Control**: GitHub + GitHub Actions
- **Monitoring**: Sentry (free) + Uptime Robot (free)

---

### Risk Mitigation

| Risk        | Mitigation                                          |
| :---------- | :-------------------------------------------------- |
| Burnout     | Ship every 2 weeks, không perfectionism             |
| Scope Creep | Strict MVP scope trong `.agent/rules/`              |
| Security    | 4-layer defense (Middleware → Prisma → RLS → Tests) |
| No Users    | Soft launch với 5 beta customers trước              |

---

### KPIs

| Metric        | Target (4 months) |
| :------------ | :---------------- |
| Tenants       | 10-20             |
| MRR           | $100-500          |
| Uptime        | 99%               |
| Page Load     | < 3s              |
| Test Coverage | > 60%             |

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Ngày**: 2026-01-28
