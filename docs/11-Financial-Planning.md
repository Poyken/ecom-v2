# Kế hoạch Tài chính (Solo Developer Edition)

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 2.0 (Solo Dev)  
**Ngày**: 28 tháng 1, 2026  
**Tác giả**: Solo Developer

> [!NOTE]
> Tài liệu này thay thế phiên bản enterprise ($500K budget). Solo dev sử dụng bootstrap approach với chi phí tối thiểu.

---

### Chi Phí Vận Hành

#### Monthly Infrastructure (Managed Services)

| Service                  | Provider       |  Cost/Month   |
| :----------------------- | :------------- | :-----------: |
| Database (PostgreSQL)    | Neon           |      $0       |
| Cache (Redis)            | Upstash        |      $0       |
| API Hosting              | Render Starter |      $7       |
| Search Engine            | Algolia (Free) |      $0       |
| Web Hosting              | Vercel         |      $0       |
| Storage (S3-compatible)  | Cloudflare R2  |      $0       |
| Email Transactional      | Resend         |      $0       |
| Domain (.com)            | Namecheap      |      ~$1      |
| **Total Infrastructure** |                | **~$8/month** |

#### When Scaling (50+ tenants)

| Service          | Upgrade To  |   Cost/Month   |
| :--------------- | :---------- | :------------: |
| Database         | Neon Pro    |      $19       |
| Cache            | Upstash Pro |      $10       |
| API              | Render Pro  |      $25       |
| **Total Scaled** |             | **~$55/month** |

---

### Mô Hình Doanh Thu (Vietnam Market)

#### Pricing Tiers (VNĐ)

| Gói         |       Giá/Tháng | Products  |  Orders   | Phí GD |
| :---------- | --------------: | :-------: | :-------: | :----: |
| **Starter** |   99,000₫ (~$4) |    50     |    200    |  1.5%  |
| **Growth**  |  199,000₫ (~$8) |    200    |   1000    |  1.0%  |
| **Pro**     | 399,000₫ (~$16) | Unlimited | Unlimited |  0.5%  |

#### Break-even Analysis

| Scenario          | Tenants Needed |  MRR  |
| :---------------- | :------------: | :---: |
| Cover Infra ($8)  |   2 Starter    |  $8   |
| Cover Time ($500) |   30 Growth    | $240  |
| Profitable        |   50+ Growth   | $400+ |

---

### Tài Chính Dự Kiến 12 Tháng

| Tháng |   Tenants    | MRR (USD) | Chi phí |  Net  |
| :---: | :----------: | :-------: | :-----: | :---: |
|  1-4  | 0 (building) |    $0     |   $8    | -$32  |
|   5   |      5       |    $20    |   $8    | +$12  |
|   6   |      10      |    $50    |   $8    | +$42  |
|  7-8  |      20      |   $120    |   $15   | +$105 |
| 9-10  |      35      |   $200    |   $25   | +$175 |
| 11-12 |      50      |   $300    |   $55   | +$245 |

**Tổng Year 1**: ~$500 profit (không tính thời gian dev)

---

### ~~Kế hoạch Gọi Vốn (Không Áp Dụng)~~

> Chiến lược Solo Dev sử dụng **bootstrap approach**. Không gọi vốn trong giai đoạn MVP. Chỉ xem xét funding nếu đạt product-market fit (50+ paying tenants).

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Ngày**: 2026-01-28
