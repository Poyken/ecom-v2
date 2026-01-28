# Kế hoạch Triển khai (Competitive Grade)

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 3.0 (Quality First)  
**Ngày**: 28 tháng 1, 2026  
**Chiến lược**: Triển khai chậm mà chắc, Release là chạy ngon.

---

### Phase 0: The "Iron" Foundation (Tuần 1-2)

- **Repo Setup**: Turborepo, Biome, Husky, Github Actions.
- **PWA Setup**: Manifest, Service Worker skeleton.
- **Observability**: Sentry, Pino Logging.
- **Design System**: Shadcn/UI configuration.

### Phase 1: Core Commerce & Search (Tuần 3-6)

**Timeline Chi tiết:**
| Tuần | Focus | Deliverables |
|:---|:---|:---|
| **3-4** | Products | Database Schema, Product CRUD, Image Upload, Algolia Sync Job. |
| **5-6** | Storefront | Home, Product List (Algolia UI), Detail Page, Optimistic Like/Cart. |

**Quality Gates (Trước khi move sang Payment):**
| Feature | Gate |
|:---|:---|
| **Search** | Tìm "váy đỏ" ra kết quả trong < 100ms. Facet hoạt động chuẩn. |
| **Mobile** | Add to Home Screen hoạt động. Scroll mượt 60fps. |
| **Data** | Product tạo ở Admin -> Sync sang Algolia trong < 5s. |

### Phase 2: Payment & Checkout (Tuần 7-9)

- **VNPay Integration**: Xử lý Idempotency (chống trùng đơn), Webhook signature verification chặt chẽ.
- **Stress Test**: Dùng k6 chạy load test giả lập 500 CCU vào trang Checkout để đảm bảo không sập giờ cao điểm.

### Phase 3: Launch & Iterate (Tuần 13-16)

- **Security Audit**: Tự chạy tool scan (OWASP Zap).
- **Soft Launch**: Mời friend/family dùng thử thật, trả tiền thật (sau đó refund) để test flow.

---

### KPIs Chất Lượng (Non-negotiable)

- **Bug Critical**: 0 (Không được release nếu còn lỗi thanh toán/data loss).
- **Uptime**: 99.9% (Nhờ kiến trúc Serverless High Availability).
- **UX Score**: 90+ Lighthouse Performance/Accessibility.

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Cam kết**: Chất lượng > Số lượng tính năng.
