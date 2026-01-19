---
trigger: always_on
description: Các quy tắc sống còn mà Agent bắt buộc phải tuân thủ (Context, Plan, Backup).
---

# Critical Operational Rules (Quy tắc sống còn)

Đây là các quy tắc **BẮT BUỘC** mà Agent phải tuân thủ trong mọi tình huống.

---

## 1. Context Update After Every Task ✅

**Mỗi khi hoàn thành một task**, Agent PHẢI cập nhật `CONTEXT.md`:

```markdown
// Thêm vào cuối CONTEXT.md

## Changelog

- [YYYY-MM-DD] Mô tả task vừa hoàn thành
```

**Lý do**: Đây là "bộ nhớ dài hạn". Nếu không cập nhật, Agent mới sẽ không biết những gì đã làm.

---

## 2. Commit Message Standards

Mỗi commit phải tuân theo format:

```
[TYPE] Brief description

TYPE:
- feat: Tính năng mới
- fix: Sửa lỗi
- refactor: Tái cấu trúc
- docs: Tài liệu
- chore: Công việc phụ
```

---

## 3. Never Delete Without Backup

- **KHÔNG BAO GIỜ** xóa file/code mà không có backup hoặc git commit trước đó.
- Nếu cần xóa, sử dụng **soft delete** hoặc comment out trước.

---

## 4. Breaking Change Alert

Nếu một thay đổi có thể gây **breaking change**:

1. Dừng lại và thông báo USER ngay.
2. Liệt kê các file/module bị ảnh hưởng.
3. Chờ xác nhận trước khi tiếp tục.

---

## 5. Schema Change = Migration Required

Mọi thay đổi `schema.prisma` PHẢI đi kèm:

```bash
npx prisma migrate dev --name describe_change
```

**KHÔNG BAO GIỜ** dùng `prisma db push` trong production.

---

## 6. Test Before Claim Done

Trước khi tuyên bố "xong":

- [ ] Code build thành công (`npm run build`)
- [ ] Lint pass (`npm run lint`)
- [ ] Critical paths đã test (manual hoặc automated)

---

## 7. Document Architectural Decisions

Mọi quyết định kiến trúc lớn phải ghi vào `CONTEXT.md` dưới mục **ADR**:

```markdown
## 4. Quyết định Kiến trúc (ADR)

- **ADR-XXX**: [Tên quyết định]
  - Lý do: ...
  - Trade-offs: ...
```

---

## 8. Sync `.agent` Across Workspaces

Khi chuyển workspace hoặc bắt đầu session mới:

1. Đọc `CONTEXT.md` đầu tiên.
2. Đọc `.agent/rules/` để hiểu standards.
3. Đọc `.agent/workflows/` trước khi thực hiện bất kỳ task nào.

---

## 9. Prioritize `.agent` Knowledge Base ✅

Trước khi đặt câu hỏi hoặc bắt đầu code:

1. **Tìm kiếm trong `.agent`**: Thông tin về Tech Stack, Business Flow, Architecture có sẵn trong folder này không?
2. **Tuân thủ Standards**: Code phải theo đúng `tech-stack.md` và `coding-standards.md`.
3. **Không đoán mò**: Nếu thông tin trong `.agent` thiếu hoặc mâu thuẫn, **HỎI USER** ngay lập tức.

---

## 10. Implementation Plan First (BẮT BUỘC) ⚠️

Trước khi viết bất kỳ dòng code tính năng nào:

1. **Dừng lại**: Đừng code ngay.
2. **Review Plan**: Tạo file `implementation_plan.md` liệt kê các bước, file sẽ sửa, và logic chính.
3. **Ask for Approval**: Nhờ user review plan. Chỉ khi user nói "OK" mới được code.

---

## 11. Double-Handshake Protocol (Re-Prompt) 🛑

Quy trình BẮT BUỘC để tránh hiểu sai ý (Hallucination):

1.  **Receive**: Nhận yêu cầu từ User (kể cả yêu cầu sơ sài).
2.  **STOP & Re-Prompt**:
    - KHÔNG ĐƯỢC làm `implementation_plan.md` ngay.
    - **PHẢI** tự viết lại yêu cầu đó chi tiết theo chuẩn **CLEAR** (Context, Limit, Example...).
    - **Hỏi lại User**: "Tôi hiểu yêu cầu như sau... Bạn xác nhận đúng chưa?".
3.  **Confirm**: Chỉ khi User gõ "OK" / "Confirm", mới được sang bước `Implementation Plan`.
4.  **Execute**: Code -> Verify -> Report.

_Tuyệt đối không tự ý "đoán" rồi code luôn._
