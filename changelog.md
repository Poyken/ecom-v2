# Changelog

## 2026-01-28

### Added

- **Solo Developer Strategy** (Decision #7 in `decisions.md`)
  - MVP-first approach with 4-month timeline
  - Managed services stack: Neon, Upstash, Vercel, Render, R2, Resend
  - Scope reduction: removed variants, multi-warehouse, AI search, B2B from MVP
  - 4-layer security: Middleware → Prisma Extension → RLS → Auto-tests

- **New AI Agent Rule**: `.agent/rules/solo-dev-constraints.md`
  - Enforces MVP scope limits for AI-assisted development
  - Lists excluded features and simplification rules
  - Documents infrastructure choices

### Changed

- `context.md`: Updated executive summary to reflect solo dev strategy
- `decisions.md`: Added Decision #7 for Solo Developer Strategy

### Project Assessment

- Created comprehensive assessment report analyzing 25 docs
- Identified SWOT, financial analysis, risk matrix
- Recommended phased implementation approach
