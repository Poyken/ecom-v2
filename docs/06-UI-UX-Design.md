# Thông số Thiết kế UI/UX - Product Startup

## Nền tảng E-commerce Next-Gen

---

### Thông tin tài liệu

**Phiên bản**: 3.0 (Emotional Design)  
**Ngày**: 28 tháng 1, 2026  
**Tiêu chuẩn**: World-Class Aesthetics

> [!NOTE]
> **Tư duy Startup**: Thiết kế không chỉ để "dùng được", mà phải tạo **Cảm xúc (Emotion)** và **Niềm tin (Trust)**.
> Mỗi pixel đều phải bán được hàng.

---

### 1. Visual Identity: "Tech-Luxe" (Công nghệ + Sang trọng)

Kết hợp sự tối giản của công nghệ với sự tinh tế của thời trang cao cấp.

- **Màu sắc**: Không dùng đen/trắng thuần túy.
  - Background: `Zinc-50` (Off-white) tạo cảm giác giấy cao cấp.
  - Text: `Zinc-900` (Soft black) dễ đọc, không gắt.
  - Accent: `Indigo-600` (Digital Blue) nhưng dùng tiết chế (chỉ nút CTA).
- **Typography**:
  - Headings: `Inter Tight` (Tracking chặt, đậm chất editorial).
  - Body: `Geist Sans` (Hiện đại, dễ đọc trên mobile).

---

### 2. Mobile-First Experience (The "Thumb" Rule)

90% user sẽ truy cập bằng điện thoại. Thiết kế phải tuân thủ chuẩn Mobile:

- **Bottom Sheet Navigation**: Thay vì Modal giữa màn hình, dùng Bottom Sheet vuốt lên (Native feel).
- **Swipe-to-Action**: Vuốt item giỏ hàng để xóa.
- **Haptic Feedback**: Rung nhẹ khi "Thêm vào giỏ" (nếu thiết bị hỗ trợ).
- **Sticky CTA**: Nút "Mua ngay" luôn nổi ở đáy màn hình product detail.
- **PWA Ready**: Manifest đầy đủ (Icon, Splash Screen) để user có thể "Add to Home Screen" như app thật.

---

### 3. Motion Design: "Choreographed Chaos"

Mọi chuyển động đều phải có ý nghĩa dẫn dắt mắt người dùng.

- **Hero & Landing**: Parallax scroll nhẹ nhàng.
- **Product Transition**: Shared Element Transition (Ảnh sản phẩm "bay" từ danh sách vào trang chi tiết).
- **Micro-interactions**:
  - Heart icon "nổ" bung ra khi like.
  - Cart icon "nhảy" lên khi có hàng mới.

---

### 4. AI Integration in UX

AI không phải hộp đen, AI là trợ lý.

- **Search Bar**: Không chỉ là input text. Nó là "Command Center".
  - Gõ "váy đỏ đi tiệc" -> AI tự filter Váy + Màu Đỏ + Style Party.
- **Smart Chips**: Gợi ý filter ngay dưới thanh search dựa trên query (Ví dụ: user tìm "giày", AI gợi ý chips: "Nam/Nữ", "Thể thao/Da").

---

### 5. Công cụ thực hiện (Dev Stack)

- **Core**: Shadcn/UI (Base)
- **Animation**: Framer Motion (Complex animations) + Tailwind Animate (Simple).
- **Icons**: Lucide React (Clean, consistent strokes).
- **Fonts**: `next/font` (Zero CLS).

---

### Phê duyệt

**Head of Product**: ✅ Self-approved  
**Tiêu chuẩn**: Awwwards Nominee Level  
**Ngày**: 2026-01-28
