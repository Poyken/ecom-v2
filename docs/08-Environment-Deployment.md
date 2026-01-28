# Môi trường & Triển khai (Solo Developer Edition)

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 2.0 (Solo Dev)  
**Ngày**: 28 tháng 1, 2026

---

### Môi Trường

#### Development (Local)

```bash
# Required
- Node.js 20+
- pnpm (package manager)
- Docker Desktop (optional, for local PostgreSQL)

# .env.local
DATABASE_URL="postgresql://..."  # Neon connection string
REDIS_URL="redis://..."          # Upstash connection string
```

#### Staging

Không cần riêng. Dùng **Render Preview Environments** (auto-deploy từ PR).

#### Production

| Component | Service | URL Pattern           |
| :-------- | :------ | :-------------------- |
| Web       | Vercel  | `yourdomain.com`      |
| API       | Render  | `api.yourdomain.com`  |
| Database  | Neon    | (internal connection) |
| Cache     | Upstash | (internal connection) |
| Storage   | R2      | `cdn.yourdomain.com`  |

---

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm lint

  # Vercel & Render auto-deploy from main branch
  # No manual deploy step needed
```

---

### Bí mật (Secrets)

Lưu trong:

- **GitHub Secrets**: CI/CD variables
- **Render/Vercel Dashboard**: Production env vars

| Secret            | Nơi lưu                        |
| :---------------- | :----------------------------- |
| `DATABASE_URL`    | Render + Vercel                |
| `REDIS_URL`       | Render + Vercel                |
| `JWT_SECRET`      | Render + Vercel                |
| `VNPAY_*`         | Render only (API)              |
| `ALGOLIA_APP_ID`  | Render + Vercel                |
| `ALGOLIA_API_KEY` | Render (Write) + Vercel (Read) |
| `R2_*`            | Render only (API)              |

---

### Deploy Workflow

```
1. git push main
2. GitHub Actions runs tests
3. If pass → Auto-deploy:
   - Web → Vercel (30s)
   - API → Render (2-3 min)
4. Monitor Sentry for errors
```

---

### Rollback

```bash
# Render: One-click rollback trong dashboard
# Vercel: One-click rollback trong dashboard
# Database: Neon Point-in-time recovery
```

### Cold Start Mitigation (Free Tier)

Do Render Free/Starter sẽ sleep sau 15p không hoạt động:

1.  **Setup UptimeRobot**: Ping `GET https://api.yourdomain.com/health` mỗi 5 phút.
2.  **API Health Check**: Tạo endpoint `/health` trả về 200 OK nhẹ nhất có thể.

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Ngày**: 2026-01-28
