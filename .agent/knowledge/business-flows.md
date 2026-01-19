# Business Flows Reference (Enterprise Edition)

Tài liệu này mô tả chi tiết các luồng nghiệp vụ của hệ thống Ecommerce 2.0 (Enterprise), tương ứng với `schema.prisma` mới.

---

## 1. Multi-Tenancy & Auth Flow

### 1.1 Tenant Resolution

Mọi Request tới API đều phải xác định Context Tenant:

1.  **Public Storefront**: Dựa vào `Host` Header (Subdomain hoặc Custom Domain).
    - `shop1.platform.com` -> Tenant A
    - `mystore.com` (CNAME) -> Tenant A
2.  **Platform Admin**: Dựa vào đường dẫn hoặc subdomain quản trị (`admin.platform.com`).
3.  **API Requests**:
    - Header `x-tenant-id`: Bắt buộc cho các tác vụ quản trị.
    - Nếu thiếu -> Trả về 400 (Bad Request).

### 1.2 User Roles & Hierarchy

Hệ thống hỗ trợ RBAC động (Dynamic Roles):

- **Platform Owner**: Super Admin, quản lý toàn bộ hệ thống (Global Access).
- **Tenant Owner**: Người tạo Store. Full quyền trong Tenant của họ.
- **Staff**: Nhân viên, quyền hạn dựa trên bảng `UserPermission` liên kết với `UserRole`.
- **Customer**: Khách mua hàng (B2C hoặc B2B).
  - **B2C**: Khách lẻ.
  - **B2B**: Thuộc `CustomerGroup`, có `PriceList` riêng.

---

## 2. Catalog & Inventory (Advanced)

### 2.1 Product Variants & Options

Mô hình SKU-centric:

- **Product**: Chứa thông tin chung (Tên, Mô tả, Brand).
- **ProductOption**: Định nghĩa thuộc tính (Size, Color).
- **OptionValue**: Giá trị cụ thể (S, M, Red, Blue).
- **SKU**: Biến thể cụ thể (Product A - Red - S).
  - SKU liên kết N-N với `OptionValue`.
  - SKU có giá riêng (`price`, `originalPrice`, `costPrice`).

### 2.2 Inventory Management

Hỗ trợ Multi-Warehouse:

- Mỗi SKU có `InventoryItem` tại nhiều `Warehouse`.
- **InventoryLog**: Ghi lại mọi biến động kho (Purchase, Sale, Return, Adjustment).
- **Logic**:
  - `Available Stock` = `OnHand` - `Committed` (Đang nằm trong đơn chưa ship).
  - Khi order -> Tăng `Committed`.
  - Khi ship -> Giảm `OnHand`, Giảm `Committed`.

---

## 3. Order Processing & Fulfillment

### 3.1 Checkout Flow (Enterprise)

1.  **Cart Calculation**:
    - Tính tổng tiền hàng.
    - **Promotion Engine**: Check `PromotionRules` -> Apply `PromotionActions` (Discount Item, Discount Order, Free Shipping).
    - **Tax Engine**: Tính thuế theo `Region` và `TaxRate`.
    - **Tiered Pricing**: Nếu là B2B Customer, áp dụng giá từ `PriceList` thay vì giá niêm yết.
2.  **Place Order**:
    - Tạo `Order` (Status: PENDING).
    - Tạo `OrderLineItem` (Snapshot giá và discount tại thời điểm mua).
    - Khóa tồn kho (Inventory Commitment).
3.  **Payment**:
    - Tạo `Payment` record.
    - Tích hợp Stripe/PayPal/Momo.

### 3.2 Fulfillment & Shipping

- **Split Shipments**: Một Order có thể tách thành nhiều `Fulfillment` (Giao nhiều lần/từ nhiều kho).
- **Routing**: Chọn kho gần nhất để fulfill (Future Phase).

### 3.3 Returns (RMA)

- User request `ReturnRequest`.
- Admin duyệt -> `APPROVED`.
- Hàng về kho -> Update `InventoryLog` (Type: `RETURN`).
- Refund tiền -> Update `Wallet` hoặc hoàn tiền qua Gateway.

---

## 4. Marketing & Loyalty

### 4.1 Advanced Promotions

- **Conditions**:
  - Min Order Value.
  - Specific Product/Category/Brand.
  - Customer Group (VIP only).
  - Usage Limit (Per user / Total).
- **Actions**:
  - Percentage Off.
  - Fixed Amount Off.
  - Buy X Get Y.

### 4.2 Loyalty System

- **Earning**: Tỷ lệ tích điểm cấu hình theo `TenantSettings`.
- **Tier**: Hạng thành viên (Silver, Gold) dựa trên tổng chi tiêu.
- **Redemption**: Dùng điểm đổi voucher hoặc trừ trực tiếp vào đơn hàng.

---

## 5. AI & Automation (RAG)

### 5.1 AI Chat Assistant

- **Embedding**: Sync Product/Blog data vào Vector DB (pgvector) qua bảng `ProductEmbedding`.
- **Flow**:
  1.  User hỏi "Tìm giày chạy bộ màu đỏ dưới 1 triệu".
  2.  System embed query -> Search pgvector.
  3.  LLM rerank kết quả -> Trả lời User.
  4.  Lưu history vào `AiChatSession` và `AiChatMessage`.

### 5.2 Insight & Analytics

- Phân tích hành vi User qua `UserBehaviorLog`.
- Gợi ý sản phẩm (Recommendation Engine).

---

## 6. Subscription (SaaS for Tenant)

- **SubscriptionPlan**: Gói dịch vụ (Free, Pro, Enterprise).
- **Subscription**: Tenant đăng ký gói.
- **Limits**: Giới hạn số lượng Product, Staff, Storage theo gói.
- **Billing**: Thu phí Tenant định kỳ.
