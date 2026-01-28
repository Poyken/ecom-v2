# Tài liệu Thiết kế Cơ sở Dữ liệu (Database Design) - MVP

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin Tài liệu

**Phiên bản**: 2.0 (Solo Dev)  
**Ngày**: 28 tháng 1, 2026  
**Trạng thái**: MVP Scope

> [!NOTE]
> Các bảng phức tạp (Multi-warehouse, Advanced Promo) được đánh dấu là **Phase 2**.

---

### Lược đồ MVP rút gọn

Các bảng chính cần thiết cho MVP (4 tháng đầu):

1. **Tenants**: Quản lý cửa hàng (`id`, `domain`, `status`).
2. **Users**: Admin/Staff/Customer (`tenantId`, `email`, `role`).
3. **Products**: Sản phẩm cơ bản (`tenantId`, `name`, `price`, `images`).
   - _Bỏ qua bảng SKUs và ProductOptions ở MVP_.
4. **Categories**: Danh mục 1 cấp (`tenantId`, `name`).
5. **Orders**: Đơn hàng (`tenantId`, `status`, `total`).
6. **OrderItems**: Chi tiết đơn (`orderId`, `productName`, `price`).
7. **Inventory**: Tồn kho đơn giản (`productId`, `quantity`).
   - _Thay thế inventory_items phức tạp_.

---

### Chi tiết thay đổi Schema (MVP vs Enterprise)

| Bảng/Khu vực  | Enterprise Design                    | Solo MVP         | Ghi chú                                                |
| :------------ | :----------------------------------- | :--------------- | :----------------------------------------------------- |
| **Product**   | Product -> Options -> Variants (SKU) | Product (Simple) | Chỉ support sản phẩm đơn giản (không màu/size) lúc đầu |
| **Inventory** | InventoryItems (Warehouse + SKU)     | Product.stock    | Field `stock` trực tiếp trong bảng Product             |
| **Pricing**   | PriceBooks, TieredPricing            | Product.price    | 1 giá bán duy nhất                                     |
| **Cart**      | Redis Cart Persisted                 | Redis Only (TTL) | Giỏ hàng tạm thời, clear khi session out               |
| **Audit**     | AuditLogs (Full history)             | Bỏ qua           | Chưa cần audit log chi tiết cho MVP                    |

---

### Schema Prisma (Dự kiến MVP)

```prisma
model Tenant {
  id        String   @id @default(uuid())
  name      String
  domain    String   @unique
  users     User[]
  products  Product[]
  orders    Order[]
}

model User {
  id        String   @id @default(uuid())
  tenantId  String
  email     String
  password  String
  role      Role     @default(CUSTOMER)
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  orders    Order[]
}

model Product {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  description String?
  price       Decimal
  stock       Int      @default(0) // Simplified Inventory
  image       String?
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  orderItems  OrderItem[]
}

model Order {
  id          String      @id @default(uuid())
  tenantId    String
  userId      String?
  customerInfo Json?    // { email, name, phone, address } for Guest
  total       Decimal
  status      OrderStatus @default(PENDING)
  items       OrderItem[]
  tenant      Tenant      @relation(fields: [tenantId], references: [id])
  user        User?       @relation(fields: [userId], references: [id])
  createdAt   DateTime    @default(now())
}
```

---

### Chiến lược Migration (Phase 1 -> Phase 2)

Khi cần nâng cấp lên Phase 2 (thêm Variants):

1. Tạo bảng `ProductVariant`.
2. Migrate dữ liệu từ `Product` sang `ProductVariant` (mỗi product có 1 default variant).
3. Update code để trỏ về bảng Variant.

---

### Phê duyệt

**Solo Developer**: ✅ Self-approved  
**Ngày**: 2026-01-28
