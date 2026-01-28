# Technical Flow: API Request & Multi-tenant Isolation

Tài liệu này mô tả chi tiết luồng đi của dữ liệu từ khi Client gửi yêu cầu cho đến khi nhận kết quả.

## Sơ đồ Sequence

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Filter as Global Exception Filter
    participant Middleware as Tenant Middleware
    participant Storage as AsyncLocalStorage
    participant Controller as Auth/Tenant Controller
    participant Service as Business Logic Service
    participant Prisma as Prisma ORM
    participant DB as PostgreSQL (RLS Enabled)

    Client->>Filter: Request (Headers: X-Tenant-ID)
    Filter->>Middleware: Pass to Middleware

    Note over Middleware: Validate Tenant ID & Route

    Middleware->>Storage: Run in Context (tenantId)
    Storage->>Controller: Route to Action
    Controller->>Service: Execute Logic

    Note over Service: const { tenantId } = storage.getStore()

    Service->>Prisma: Query with { where: { tenantId } }
    Prisma->>DB: SQL SELECT ... WHERE tenantId = ...
    DB-->>Prisma: Result set (Isolated)
    Prisma-->>Service: Typed Objects
    Service-->>Controller: DTO / Result
    Controller-->>Client: HTTP Response (JSON)

    Note over Filter: In case of error
    Service--X Filter: Throw Exception
    Filter-->>Client: Standardized Error JSON
```

## Giải thích các thành phần:

1.  **Middleware**: Đóng vai trò lớp bảo vệ và trích xuất danh tính Tenant.
2.  **AsyncLocalStorage**: Lưu trữ "trạng thái" của request hiện tại mà không làm bẩn các tham số hàm.
3.  **Isolation Strategy**: Chúng ta áp dụng **Logical Isolation** (Lọc ở tầng ứng dụng qua Prisma) và hướng tới **Physical Isolation** (RLS ở tầng DB).

---

_Tài liệu được khởi tạo tự động bởi Antigravity AI._
