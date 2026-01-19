# 🤖 AI Agent Workflow Guide

Tài liệu này hướng dẫn cách làm việc hiệu quả nhất với AI Agent trong dự án Ecommerce 2.0.

## 1. Khởi động Session (BẮT BUỘC)

Mỗi khi mở mới IDE hoặc bắt đầu một phiên làm việc, hãy paste dòng lệnh sau vào khung chat:

```
@.agent/prompt_init.md
```

**Tác dụng**:

- Load toàn bộ Context, Tech Stack, Business Flows.
- Kích hoạt **Rule #11 (Double-Handshake)** để ngăn chặn Hallucination.

## 2. Quy trình "Double-Handshake" (4 Bước)

Để đảm bảo code đúng ý và không gây lỗi (No Regression):

1.  **Prompt**: Anh đưa yêu cầu (sơ sài cũng được).
    > "Làm tính năng Product Variant"
2.  **Re-Prompt (Agent)**: Agent tự động dừng lại, viết lại yêu cầu theo chuẩn CLEAR và hỏi xác nhận.
    > "Tôi hiểu là bạn muốn ABCD... Có đúng không?"
3.  **Confirm**: Anh xác nhận.
    > "OK" / "Đúng rồi"
4.  **Plan & Action**: Agent mới bắt đầu viết Plan -> Code.

## 3. Quản lý Artifacts & Kiến thức

- **Design Doc**: Mọi phân tích kiến trúc sau khi chốt phải lưu vào `.agent/knowledge/` (Ví dụ: `architecture.md`).
- **Backup**: Cuối mỗi session, hãy nhắc Agent:
  > "Commit code và update CONTEXT.md vào changelog"

## 4. Các lệnh tắt (Slash Commands)

- `/feature-flow`: Xem quy trình chuẩn khi dev feature mới.
- `/fresh-start`: Reset dự án (Cẩn thận!).

---

_Tuân thủ quy trình này để đạt hiệu suất Senior Dev 10x._
