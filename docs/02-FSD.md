# Tài liệu Thông số Chức năng (FSD)

## Nền tảng E-commerce Multi-tenant MVP

---

### Thông tin tài liệu

**Phiên bản**: 3.0 (Competitive Startup - Solo MVP)  
**Ngày**: 28 tháng 1, 2026  
**Tác giả**: Solo Developer  
**Trạng thái**: Locked for Execution

> [!IMPORTANT]
> **MVP Scope**: Chỉ hỗ trợ các tính năng cốt lõi nhất để đảm bảo chất lượng.
> ❌ No Variants | ❌ No Multi-warehouse | ❌ No Loyalty Program

---

### Phân loại Tính năng theo Modules

#### 1. Module Quản lý Danh tính & Truy cập ✅ MVP

##### 1.1 Hệ thống Xác thực ✅ MVP (Simplified)

**User Story**: Là người dùng, tôi muốn xác thực bảo mật để có thể truy cập nền tảng.

**Tiêu chí Chấp nhận (MVP)**:

- ✅ Hỗ trợ xác thực email/password với bcrypt hashing
- ❌ ~~Bật đăng nhập xã hội (Google, Facebook)~~ → Phase 2
- ❌ ~~Triển khai xác thực hai yếu tố~~ → Phase 2
- ✅ Cung cấp chức năng đặt lại mật khẩu với xác thực email
- ✅ Hỗ trợ quản lý session với JWT tokens
- ✅ Bật chức năng ghi nhớ tôi với refresh tokens bảo mật

**Quy tắc Kinh doanh**:

- Mật khẩu tối thiểu 8 ký tự với yêu cầu về độ phức tạp
- Session hết hạn sau 30 phút không hoạt động
- Tối đa 5 lần đăng nhập thất bại trước khi khóa tài khoản
- ~~Tài khoản đăng nhập mạng xã hội~~ (Không áp dụng MVP)

##### 1.2 Quản lý Người dùng

**User Story**: Là chủ cửa hàng, tôi muốn quản lý tài khoản người dùng và phân quyền để có thể kiểm soát quyền truy cập vào cửa hàng của mình.

**Tiêu chí Chấp nhận**:

- Tạo, đọc, cập nhật, xóa tài khoản người dùng
- Gán vai trò và quyền cho người dùng
- Chức năng nhập/xuất người dùng hàng loạt
- Nhật ký hoạt động người dùng và dấu vết kiểm toán
- Thực thi chính sách mật khẩu
- Quản lý trạng thái tài khoản (hoạt động/không hoạt động/bị đình chỉ)

**Quy tắc Kinh doanh**:

- Chủ cửa hàng chỉ có thể quản lý người dùng trong tenant của họ
- Super admin có thể quản lý tất cả người dùng nền tảng
- Người dùng bị xóa sẽ được xóa mềm (soft-delete) cho mục đích kiểm toán
- Địa chỉ email người dùng phải là duy nhất trong mỗi tenant

##### 1.3 Kiểm soát Truy cập dựa trên Vai trò (RBAC)

**User Story**: Là quản trị viên nền tảng, tôi muốn định nghĩa các vai trò và quyền hạn để có thể thực thi kiểm soát truy cập phù hợp.

**Tiêu chí Chấp nhận**:

- Tạo vai trò tùy chỉnh với quyền hạn chi tiết
- Gán quyền cho vai trò (đọc, ghi, xóa, admin)
- Hỗ trợ k### Các Module Khác (Phase 2)
  (Đã lược bỏ các phần B2B/Vector Search cũ)
  (runtime)
- Mẫu quyền hạn cho các trường hợp sử dụng phổ biến
- Nhật ký kiểm toán cho các thay đổi về quyền hạn

**Quy tắc Kinh doanh**:

- Vai trò hệ thống không thể bị xóa, chỉ có thể sửa đổi
- Ít nhất một người dùng phải có quyền admin cho mỗi tenant
- Quyền hạn có tính tích lũy (người dùng nhận tất cả quyền từ các vai trò được gán)
- Các hoạt động quan trọng yêu cầu xác thực đa yếu tố

---

#### 2. Module Quản lý Danh mục (Catalog)

##### 2.1 Quản lý Sản phẩm

**User Story**: Là quản lý cửa hàng, tôi muốn quản lý sản phẩm và các biến thể để có thể bán hàng hiệu quả.

**Tiêu chí Chấp nhận**:

- Tạo sản phẩm đơn giản (Không biến thể)
- Quản lý thông tin sản phẩm (tên, mô tả, hình ảnh, giá cả, tồn kho đơn giản)
- Hoạt động sản phẩm hàng loạt (nhập, xuất, cập nhật)
- Phân loại và gắn thẻ sản phẩm
- Quản lý trạng thái sản phẩm (nháp, hoạt động, lưu trữ)
- **Auto-Sync**: Tự động đồng bộ sang Algolia khi lưu.

**Quy tắc Kinh doanh**:

- Đường dẫn sản phẩm (slug) phải là duy nhất trong tenant
- Yêu cầu ít nhất một hình ảnh cho các sản phẩm đang hoạt động
- Giá không thể là số âm
- Sản phẩm đã lưu trữ vẫn được giữ lại trong hệ thống cho lịch sử đơn hàng
- Xóa sản phẩm yêu cầu xác nhận và ảnh hưởng đến dữ liệu lịch sử

##### 2.2 Quản lý Danh mục

**User Story**: Là chủ cửa hàng, tôi muốn tổ chức sản phẩm vào các danh mục để khách hàng có thể duyệt cứu dễ dàng.

**Tiêu chí Chấp nhận**:

- Tạo cấu trúc danh mục phân cấp
- Gán sản phẩm vào nhiều danh mục
- Cài đặt hiển thị cụ thể cho từng danh mục
- Hình ảnh và mô tả cho danh mục
- Kiểm soát thứ tự và hiển thị danh mục
- Tối ưu hóa SEO cho danh mục

**Quy tắc Kinh doanh**:

- Độ sâu danh mục tối đa là 5 cấp
- Tên danh mục phải là duy nhất trong cùng một danh mục cha
- Danh mục trống có thể được ẩn tự động
- Xóa danh mục sẽ chuyển sản phẩm sang danh mục cha

##### 2.3 Quản lý Thương hiệu

**User Story**: Là quản lý cửa hàng, tôi muốn quản lý các thương hiệu để có thể tổ chức sản phẩm theo nhà sản xuất.

**Tiêu chí Chấp nhận**:

- Tạo và quản lý hồ sơ thương hiệu
- Gán sản phẩm vào các thương hiệu
- Logo và mô tả thương hiệu
- Lọc và tìm kiếm theo thương hiệu cụ thể
- Thống kê và báo cáo theo thương hiệu

**Quy tắc Kinh doanh**:

- Tên thương hiệu phải là duy nhất trong mỗi tenant
- Sản phẩm chỉ có thể thuộc về một thương hiệu duy nhất
- Xóa thương hiệu sẽ gỡ bỏ liên kết với sản phẩm (đặt về null)

---

#### 3. Module Quản lý Bán hàng & Đơn hàng

##### 3.1 Giỏ hàng

**User Story**: Là khách hàng, tôi muốn thêm sản phẩm vào giỏ hàng và quản lý chúng để có thể mua nhiều mặt hàng.

**Tiêu chí Chấp nhận**:

- Thêm sản phẩm vào giỏ hàng với lựa chọn số lượng
- Xem nội dung giỏ hàng với tính toán tổng tạm tính
- Cập nhật số lượng mặt hàng và xóa mặt hàng
- Áp dụng mã khuyến mãi và giảm giá
- Giỏ hàng duy trì qua các phiên (cho người dùng đã đăng nhập)
- Hỗ trợ giỏ hàng khách vãng lai với việc thu thập email

**Quy tắc Kinh doanh**:

- Giỏ hàng hết hạn sau 30 ngày không hoạt động
- Tối đa 100 mặt hàng mỗi giỏ hàng
- Xác thực tồn kho tại thời điểm thanh toán
- Giá được tính toán lại khi thanh toán (không lưu trong giỏ hàng)
- Giỏ hàng khách vãng lai sẽ gộp vào giỏ hàng người dùng khi đăng nhập

##### 3.2 Xử lý Đơn hàng

**User Story**: Là chủ cửa hàng, tôi muốn xử lý đơn hàng hiệu quả để có thể hoàn tất mua sắm của khách hàng.

**Tiêu chí Chấp nhận**:

- Tạo đơn hàng từ thanh toán giỏ hàng
- Theo dõi trạng thái đơn hàng (đang chờ, đang xử lý, đã giao, đã nhận, đã hủy)
- Hoàn tất đơn hàng với hỗ trợ giao hàng từng phần
- Sửa đổi và hủy đơn hàng
- Lịch sử đơn hàng và tìm kiếm
- Thông báo đơn hàng cho khách hàng

**Quy tắc Kinh doanh**:

- Mã đơn hàng là duy nhất và tuần tự cho mỗi tenant
- Hủy đơn hàng chỉ được phép trước khi giao hàng
- Tồn kho được giữ chỗ (reserve) khi tạo đơn hàng
- Dữ liệu đơn hàng là bất biến (việc sửa đổi sử dụng các giao dịch mới)
- Đơn hàng cũ hơn 1 năm không thể sửa đổi

##### 3.3 Xử lý Thanh toán

**User Story**: Là khách hàng, tôi muốn thanh toán bằng nhiều phương thức để có thể hoàn tất mua hàng thuận tiện.

**Tiêu chí Chấp nhận**:

- Hỗ trợ nhiều cổng thanh toán (Stripe, PayPal, COD, VnPay)
- Xử lý thẻ tín dụng/ghi nợ với token hóa
- Hỗ trợ ví điện tử (Apple Pay, Google Pay, MoMo)
- Tùy chọn chuyển khoản ngân hàng và trả góp
- Theo dõi trạng thái thanh toán và đối soát
- Xử lý hoàn tiền và hoàn tiền một phần

**Quy tắc Kinh doanh**:

- Thông tin thanh toán không bao giờ được lưu dưới dạng văn bản thuần túy
- Các lần thanh toán thất bại được ghi nhật ký và giới hạn tốc độ
- Hoàn tiền phải được xử lý trong vòng 90 ngày
- Phí cổng thanh toán được tính toán và theo dõi
- Cho phép nhiều phương thức thanh toán cho mỗi đơn hàng

---

#### 4. Module Tồn kho & Marketing (Phase 2 - Scope Out)

> [!NOTE]
> Các tính năng Multi-warehouse, Loyalty, và Advanced Promotion tạm thời Scope Out để tập trung vào Core Commerce.
> Xem `archive_enterprise` nếu cần tham khảo logic cũ.

---

#### 6. Module Phân tích & Báo cáo

##### 6.1 Dashboard Thời gian thực

**User Story**: Là chủ cửa hàng, tôi muốn xem các chỉ số kinh doanh thời gian thực để có thể đưa ra quyết định sáng suốt.

**Tiêu chí Chấp nhận**:

- Chỉ số doanh thu và bán hàng với bộ lọc ngày
- Phân tích thu hút và giữ chân khách hàng
- Hiệu suất sản phẩm và thông tin tồn kho
- Theo dõi lưu lượng truy cập và tỷ lệ chuyển đổi
- Các widgets dashboard có thể tùy chỉnh
- Khả năng xuất dữ liệu (CSV, PDF, Excel)

**Quy tắc Kinh doanh**:

- Dữ liệu dashboard làm mới mỗi 5 phút
- Dữ liệu lịch sử có sẵn trong 2 năm
- Xuất dữ liệu giới hạn ở 10.000 bản ghi mỗi yêu cầu
- Dữ liệu nhạy cảm được che giấu đối với người dùng không phải admin
- Tùy chọn dashboard được lưu cho mỗi người dùng

##### 6.2 Phân tích Nâng cao

**User Story**: Là chuyên viên phân tích kinh doanh, tôi muốn phân tích các xu hướng và mô hình để xác định cơ hội tăng trưởng.

**Tiêu chí Chấp nhận**:

- Phân tích cohort và phân đoạn khách hàng
- Hệ thống gợi ý sản phẩm
- Dự báo bán hàng với máy học (machine learning)
- Khung thử nghiệm A/B
- Trình tạo báo cáo tùy chỉnh
- Truy cập API cho dữ liệu phân tích

**Quy tắc Kinh doanh**:

- Dữ liệu phân tích được tổng hợp và ẩn danh
- Mô hình máy học được huấn luyện lại hàng tuần
- Thử nghiệm A/B yêu cầu quy mô mẫu tối thiểu
- Báo cáo tùy chỉnh có giới hạn thời gian thực thi
- Truy cập API được giới hạn tốc độ và xác thực

---

### Các Trường hợp sử dụng & Kịch bản

#### UC-001: Hành trình Mua hàng của Khách hàng

**Actor**: Khách hàng  
**Điều kiện tiên quyết**: Khách hàng đã đăng nhập, sản phẩm còn hàng

**Luồng chính**:

1. Khách hàng tìm kiếm sản phẩm bằng tìm kiếm hỗ trợ AI
2. Khách hàng xem chi tiết sản phẩm và các đánh giá
3. Khách hàng thêm sản phẩm vào giỏ hàng
4. Khách hàng áp dụng mã khuyến mãi
5. Khách hàng tiến hành thanh toán
6. Khách hàng chọn phương thức vận chuyển
7. Khách hàng chọn phương thức thanh toán
8. Khách hàng hoàn tất thanh toán
9. Khách hàng nhận được xác nhận đơn hàng
10. Khách hàng có thể theo dõi trạng thái đơn hàng

**Luồng thay thế**:

- Thanh toán khách vãng lai không cần tạo tài khoản
- Thanh toán thất bại yêu cầu thử lại
- Hết hàng trong quá trình thanh toán
- Nhiều địa chỉ giao hàng

#### UC-002: Hoạt động hàng ngày của Chủ cửa hàng

**Actor**: Chủ cửa hàng  
**Điều kiện tiên quyết**: Cửa hàng đã được cấu hình, sản phẩm tồn tại

**Luồng chính**:

1. Chủ cửa hàng đăng nhập vào dashboard admin
2. Chủ cửa hàng xem lại tóm tắt bán hàng hàng ngày
3. Chủ cửa hàng xử lý các đơn hàng mới
4. Chủ cửa hàng cập nhật mức tồn kho
5. Chủ cửa hàng phản hồi các thắc mắc của khách hàng
6. Chủ cửa hàng tạo khuyến mãi mới
7. Chủ cửa hàng xem lại các báo cáo phân tích
8. Chủ cửa hàng cập nhật thông tin sản phẩm

**Luồng thay thế**:

- Xử lý trả hàng và hoàn tiền
- Quản lý hết hàng và đơn hàng chờ
- Xử lý đơn hàng số lượng lớn
- Cập nhật cấu hình vận chuyển

---

### Kiểm tra Quy tắc Kinh doanh

#### Quy tắc Giá cả

- Giá cơ bản không thể là số âm
- Giá giảm giá không được vượt quá giá cơ bản
- Tính toán thuế tuân thủ quy định địa phương
- Chuyển đổi tiền tệ sử dụng tỷ giá thời gian thực
- Thực thi chính sách giá quảng cáo tối thiểu (MAP)

#### Quy tắc Tồn kho

- Mức tồn kho không thể là số âm
- Tồn kho giữ chỗ được tính vào tồn kho khả dụng
- Mức tồn kho an toàn ngăn chặn việc bán quá mức
- Mặt hàng dễ hỏng có theo dõi hết hạn
- Theo dõi số serial cho các mặt hàng giá trị cao

#### Quy tắc Đơn hàng

- Tổng đơn hàng phải khớp với số tiền thanh toán
- Yêu cầu xác thực địa chỉ vận chuyển
- Sản phẩm số không có vận chuyển
- Đơn hàng quà tặng yêu cầu thông tin người nhận
- Đơn hàng định kỳ có thanh toán lặp lại

---

### Yêu cầu Xử lý Lỗi

#### Lỗi Xác thực (Validation)

- Thông báo lỗi rõ ràng, có thể hành động
- Phản hồi xác thực ở cấp độ trường dữ liệu
- Bảo toàn dữ liệu biểu mẫu khi có lỗi
- Thông báo lỗi được đa ngôn ngữ hóa
- Nhật ký lỗi để gỡ lỗi

#### Lỗi Hệ thống

- Suy giảm nhẹ nhàng cho các hỏng hóc dịch vụ
- Cơ chế tự động thử lại
- Quay lại sử dụng dữ liệu được lưu trong bộ nhớ tạm
- Thông báo cho người dùng về các vấn đề dịch vụ
- Quy trình phục hồi lỗi

#### Lỗi Logic Kinh doanh

- Giải quyết xung đột tồn kho
- Xử lý thất bại thanh toán
- Xung đột quy tắc khuyến mãi
- Xác thực trạng thái đơn hàng
- Kiểm tra tính nhất quán dữ liệu

---

### Thông số Luồng Dữ liệu

#### Luồng Đăng ký Khách hàng

```
Dữ liệu khách hàng → Xác thực → Xác minh Email → Tạo tài khoản → Email chào mừng → Truy cập Dashboard
```

#### Luồng Xử lý Đơn hàng

```
Giỏ hàng → Thanh toán → Thanh toán → Giữ chỗ tồn kho → Tạo đơn hàng → Hoàn tất → Giao hàng → Hoàn thành
```

#### Luồng Cập nhật Tồn kho

```
Cập nhật sản phẩm → Xác thực → Cập nhật DB → Xóa cache → Cập nhật chỉ mục tìm kiếm → Thông báo
```

---

### Yêu cầu Tích hợp

#### Tích hợp Cổng Thanh toán

- Xử lý thanh toán tuân thủ PCI-DSS
- Xử lý webhook cho các sự kiện thanh toán
- Quản lý hoàn tiền và tranh chấp
- Hỗ trợ đa tiền tệ
- Token hóa cho các thanh toán định kỳ

#### Tích hợp Đơn vị Vận chuyển

- Tính toán giá cước thời gian thực
- In nhãn và theo dõi
- So sánh giữa các đơn vị vận chuyển
- Xác thực địa chỉ
- Quản lý vận chuyển hàng trả về

#### Tích hợp Dịch vụ Email

- Mẫu email giao dịch
- Quản lý chiến dịch marketing
- Phân tích và theo dõi email
- Quản lý nội dung hủy đăng ký
- Tuân thủ chống spam

---

### Yêu cầu Hiệu suất

#### Yêu cầu Thời gian phản hồi

- Phản hồi API: <500ms (phần trăm thứ 95)
- Tải trang: <2 giây (trung bình)
- Kết quả tìm kiếm: <1 giây
- Quá trình thanh toán: <3 giây tổng cộng
- Tải dashboard: <5 giây

#### Yêu cầu Thông lượng

- Người dùng đồng thời: 10.000
- Đơn hàng mỗi phút: 1.000
- Yêu cầu API mỗi giây: 5.000
- Giao dịch cơ sở dữ liệu: 10.000/giây
- Tải tệp lên: 100/giây

#### Yêu cầu Khả năng Mở rộng

- Mở rộng theo chiều ngang với cân bằng tải
- Khả năng sharding cơ sở dữ liệu
- Tích hợp CDN cho các tài sản tĩnh
- Tự động mở rộng dựa trên nhu cầu
- Hỗ trợ phân bổ địa lý

---

### Yêu cầu Bảo mật

#### Bảo mật Xác thực

- Băm mật khẩu với bcrypt
- Mã JWT với thời gian hết hạn
- OAuth 2.0 cho đăng nhập bên thứ ba
- Xác thực đa yếu tố
- Bảo mật quản lý phiên

#### Bảo mật Dữ liệu

- Mã hóa khi tĩnh và khi truyền tải
- Che giấu và bảo vệ dữ liệu PII
- Nhật ký kiểm toán cho tất cả truy cập dữ liệu
- Chính sách lưu trữ dữ liệu
- Triển khai quyền được quên

#### Bảo mật API

- Giới hạn tốc độ theo người dùng/IP
- Xác thực khóa API
- Xác thực và làm sạch yêu cầu (sanitization)
- Thực thi chính sách CORS
- Ngăn chặn SQL injection

---

### Yêu cầu Kiểm thử

#### Kiểm thử Đơn vị (Unit Testing)

- Độ bao phủ mã tối thiểu 80%
- Tất cả logic kinh doanh được kiểm thử
- Các trường hợp biên và điều kiện lỗi
- Các luồng quan trọng về hiệu suất
- Kiểm thử lỗ hổng bảo mật

#### Kiểm thử Tích hợp (Integration Testing)

- Kiểm thử endpoint API
- Kiểm thử tích hợp cơ sở dữ liệu
- Kiểm thử dịch vụ bên thứ ba
- Kiểm thử cổng thanh toán
- Kiểm thử dịch vụ email

#### Kiểm thử Toàn trình (End-to-End Testing)

- Hành trình khách hàng quan trọng
- Tương thích đa trình duyệt
- Phản hồi trên di động
- Kiểm thử hiệu suất
- Kiểm thử bảo mật

---

### Phê duyệt

**Trưởng nhóm Chức năng**: **\*\*\*\***\_\_\_**\*\*\*\***  
**Ngày**: **\*\*\*\***\_\_\_**\*\*\*\***  
**Chữ ký**: **\*\*\*\***\_\_\_**\*\*\*\***

**Trưởng nhóm Kỹ thuật**: **\*\*\*\***\_\_\_**\*\*\*\***  
**Ngày**: **\*\*\*\***\_\_\_**\*\*\*\***  
**Chữ ký**: **\*\*\*\***\_\_\_**\*\*\*\***

**Chủ sở hữu Kinh doanh**: **\*\*\*\***\_\_\_**\*\*\*\***  
**Ngày**: **\*\*\*\***\_\_\_**\*\*\*\***  
**Chữ ký**: **\*\*\*\***\_\_\_**\*\*\*\***
