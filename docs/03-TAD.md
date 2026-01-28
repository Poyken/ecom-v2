# Tài liệu Kiến trúc Kỹ thuật (TAD) - Competitive Production Grade

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 3.0 (Compact Enterprise)  
**Ngày**: 28 tháng 1, 2026  
**Chất lượng**: Production-Ready, Competitive Optimized

---

### 1. Triết lý: "Compact Enterprise"

Mục tiêu: Vận hành bởi 1 người, nhưng chất lượng ngang đội ngũ 10 người nhờ Automation & Architecture chuẩn.

- **Zero Dirty Hacks**: Mọi dòng code phải clean, typed, và testable.
- **Fail-Safe**: Hệ thống tự phục hồi hoặc degrade gracefully, không trắng trang.
- **Speed as a Feature**: Nhanh hơn đối thủ là lợi thế cạnh tranh chính.

---

### 2. Architecture: Modular Monolith (Strict)

Giữ Modular Monolith nhưng thêm các layer bảo vệ chất lượng.

```mermaid
graph TD
    Client --> CDN[Vercel Edge]
    CDN --> Web[Next.js 16 (Strict Mode)]

    subgraph "Observability Wrapper"
        Web --> API[NestJS API]
        API --> Logger[Pino Structured Logger]
        Logger --> Sentry[Error Tracking]
    end

    subgraph "Resilience Layer"
        API --> Redis[Upstash (Rate Limit + Cache)]
        API --> DB[Neon Postgres (Connection Pooling)]
    end

    subgraph "Logic Organizaton (Folder Structure)"
        API --> Auth[Auth Module]
        API --> Catalog[Catalog Module]
        API --> Order[Order Module]
        API --> Search[Search Module (AI Powered)]
    end

    subgraph "Simple Communication"
        Order -- Direct Call --> Catalog
        Order -.->|Side Effect| EventEmitter[In-Memory Events]
    end

    subgraph "Reliability Layer"
        Catalog -- Async Job --> SyncQueue[Redis Queue (BullMQ)]
        SyncQueue -- Retry Policy --> Algolia[Algolia Index]
    end

    subgraph "Managed Data"
        Auth --> Prisma
        Catalog --> Prisma
        Order --> Prisma
        Prisma --> DB[Neon Postgres]
    end
```

#### Quy tắc Production-Ready cho Solo Dev:

1.  **Validation Layer (Zod/DTO)**: Validate 100% data đầu vào và đầu ra. Không bao giờ tin tưởng Client.
2.  **Exception Filters**: Standardized Error Response (Message thân thiện user, Mã lỗi debug cho dev).
3.  **Database Indexing**: Review Index trong mọi PR Migration để đảm bảo Query < 50ms.

---

### 3. Chiến lược Testing (Automated QA)

Vì không có QA Tester, Code phải tự test chính nó.

- **Unit Test (Jest)**: 100% coverage cho Utils, Helpers, Pricing Logic.
- **E2E Test (Playwright)**: Test tự động luồng critical **trước mỗi lần deploy**:
  - "User Login -> Add to Cart -> Checkout -> Payment Mock -> Success".
  - Nếu E2E fail, chặn Deploy ngay lập tức. Đây là "lưới an toàn" để bạn dám release liên tục.

---

### 4. Tech Stack (Realistic Next-Gen)

| Thành phần      | Công nghệ                 | Chiến lược Cạnh tranh                                                             |
| :-------------- | :------------------------ | :-------------------------------------------------------------------------------- |
| **API**         | **NestJS 11**             | Modular Monolith (Auth, Catalog, Order).                                          |
| **Search**      | **Algolia (Recommended)** | Typo-tolerance, Faceting, Instant Search out-of-the-box. (Free tier 10k records). |
| **Frontend**    | **Next.js 16**            | **Limited Optimistic UI**: Chỉ áp dụng cho Like/Cart. Không áp dụng Checkout.     |
| **Performance** | **Upstash Redis**         | Cache API response để giảm tải DB và tăng tốc.                                    |
| **Build Time**  | < 5 phút                  | Turbo Remote Cache                                                                |

---

### 5. Deployment an toàn (Zero Downtime)

- **Rolling Updates**: Render hỗ trợ Zero-downtime deploy (khởi động container mới, healthcheck OK mới tắt container cũ).
- **Database Migrations**: Luôn tương thích ngược (Add column -> Deploy Code -> Remove column sau). Không bao giờ break code đang chạy.

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Tiêu chuẩn**: High Performance & Reliability  
**Ngày**: 2026-01-28
