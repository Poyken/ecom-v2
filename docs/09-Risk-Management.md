# Quản lý Rủi ro (Solo Developer Edition)

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 2.0 (Solo Dev)  
**Ngày**: 28 tháng 1, 2026  
**Tác giả**: Solo Developer

---

### Rủi ro Solo Developer

| Rủi ro          | Mức độ | Biện pháp                                                |
| :-------------- | :----: | :------------------------------------------------------- |
| **Burnout**     | 🔴 Cao | Ship every 2 weeks, không perfectionism, nghỉ weekend    |
| **Scope Creep** | 🔴 Cao | Strict MVP trong `.agent/rules/solo-dev-constraints.md`  |
| **Bị stuck**    | 🟡 TB  | Dùng AI tools (Gemini, Copilot), Stack Overflow, Discord |
| **No revenue**  | 🟡 TB  | Validate với 5 beta trước khi build full features        |

---

### Rủi ro Kỹ thuật (Solo Dev Focus)

| Rủi ro               | Mức độ  | Biện pháp                                           |
| :------------------- | :-----: | :-------------------------------------------------- |
| **Tenant Data Leak** | 🔴 Cao  | 4-layer defense: Middleware → Prisma → RLS → Tests  |
| **Server Down**      |  🟡 TB  | Managed services (Render auto-restart, Neon HA)     |
| **DB Corruption**    | 🟢 Thấp | Neon auto-backup, Prisma migrations version control |
| **Security Breach**  |  🟡 TB  | Helmet.js, Rate limiting, Regular npm audit         |

---

### Rủi ro Kinh doanh

| Rủi ro             | Mức độ  | Biện pháp                                                                |
| :----------------- | :-----: | :----------------------------------------------------------------------- |
| **Không có users** |  🟡 TB  | Soft launch với network, free beta program                               |
| **Algolia Cost**   |  🟡 TB  | Dùng Free Tier (10k records). Tối ưu index size. Cache kết quả phổ biến. |
| **Cạnh tranh**     | 🟢 Thấp | Niche VN market, pricing cạnh tranh (99K VNĐ)                            |
| **VNPay issues**   | 🟢 Thấp | Sandbox testing kỹ, backup COD option                                    |

---

### Incident Response (Solo)

```
1. Nhận alert (Sentry/Email) → Check severity
2. Nếu Critical: Rollback ngay (Render one-click)
3. Nếu Important: Debug + Hotfix trong 24h
4. Nếu Minor: Log to Backlog, fix trong sprint sau
5. Post-mortem: Update docs nếu cần
```

---

### Backup Plan

| Nếu...        | Thì...                          |
| :------------ | :------------------------------ |
| Mất code      | GitHub has all code             |
| DB corrupt    | Neon auto-backup (7 days)       |
| Render down   | Deploy to Railway (backup)      |
| Domain issues | Vercel fallback subdomain       |
| Burnout       | Pause 1 week, prioritize health |

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Ngày**: 2026-01-28
