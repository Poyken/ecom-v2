# Tài liệu Kiến trúc Kỹ thuật (TAD) - Solo Developer Edition

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 2.0 (Solo Dev)  
**Ngày**: 28 tháng 1, 2026  
**Tác giả**: Solo Developer

---

### Tổng quan Kiến trúc (Managed Services)

Kiến trúc được thiết kế tối ưu cho **Solo Developer**: không quản lý server (serverless/managed), chi phí thấp, vận hành tự động.

```mermaid
graph TD
    User[Clients] --> CDN[Vercel Edge Network]
    CDN --> Web[Next.js App (Vercel)]
    User --> API_LB[Render Load Balancer]
    API_LB --> API[NestJS API (Render)]

    subgraph "Managed Data Layer"
        API --> Redis[Upstash Redis (Cache/Queue)]
        API --> DB[Neon PostgreSQL]
        DB --> Vector[pgvector (AI Search - Phase 2)]
    end

    subgraph "External Services"
        API --> R2[Cloudflare R2 (Storage)]
        API --> Email[Resend]
        API --> Payment[VNPay]
    end
```

### Tech Stack Chi tiết

| Thành phần      | Công nghệ     | Dịch vụ Managed | Lý do chọn cho Solo Dev                         |
| :-------------- | :------------ | :-------------- | :---------------------------------------------- |
| **Frontend**    | Next.js 16    | Vercel          | Deploy git-to-prod, zero config                 |
| **Backend**     | NestJS 11     | Render          | Support Docker, auto-deploy, healthy free tier  |
| **Database**    | PostgreSQL 15 | Neon            | Serverless, branching, auto-suspend (tiết kiệm) |
| **Cache/Queue** | Redis         | Upstash         | Serverless Redis, pay-per-request               |
| **Storage**     | S3 API        | Cloudflare R2   | Không phí egress (băng thông), free 10GB        |
| **Email**       | SMTP/API      | Resend          | DX tốt nhất, dev-friendly                       |

---

### Chiến lược Multi-tenant (MVP)

Sử dụng **Logical Isolation** (Row-level Isolation) trên Database chia sẻ.

1. **Request Flow**:
   - Client gửi `x-tenant-id` header (hoặc subdomain parse).
   - Middleware `TenantMiddleware` validate và lưu vào `AsyncLocalStorage`.

2. **Data Access**:
   - Prisma Extension tự động inject `WHERE tenantId = ?` vào mọi query.
   - **Backup**: RLS (Row Level Security) trong Postgres chặn truy cập chéo ở mức DB.

---

### Kiến trúc Deployment (CI/CD)

**Github Actions** đóng vai trò orchestrator:

1. **Push to Main**:
   - Run Tests (Unit/E2E).
   - Nếu Pass -> Trigger Vercel & Render deploy hook.
2. **Database Migrations**:
   - Chạy trong pipeline CI trước khi deploy API mới.
   - Neon support instant branching để test migration an toàn.

---

### Giám sát & Logs (Zero-setup)

- **Logs**: Xem trực tiếp trên Dashboard Vercel & Render.
- **Errors**: Sentry (Free tier) bắt exception realtime.
- **Uptime**: UptimeRobot ping API 5 phút/lần.

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Ngày**: 2026-01-28
