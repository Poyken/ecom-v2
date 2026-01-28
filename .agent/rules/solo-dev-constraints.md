# Solo Developer Constraints

## Purpose

Enforce scope limits and practical constraints for a solo developer project.

---

## Hard Constraints

### 1. MVP Scope Only

The following features are **EXCLUDED** from current implementation:

- SKU/Product Variants
- Multi-warehouse inventory
- SKU/Product Variants
- Multi-warehouse inventory
- **Self-hosted** AI search (Use Algolia instead)
- Loyalty points system
- B2B features
- Multi-currency support

### 2. Simplification Rules

- Categories: **Single level only** (no hierarchy)
- Inventory: **One default warehouse** per tenant
- Auth: **Email/password only** (no social login in MVP)
- Payment: **VNPay only** (no Stripe, PayPal)

### 3. Infrastructure

- Database: **Neon** (managed PostgreSQL)
- Cache: **Upstash** (managed Redis)
- Storage: **Cloudflare R2**
- API Hosting: **Render**
- Web Hosting: **Vercel**
- Search: **Algolia**
- Email: **Resend**

### 4. Development Velocity

- Maximum **1 major feature per week**
- **Ship every 2 weeks** minimum
- **No premature optimization**
- **Copy-paste is fine** for MVP speed

---

## AI Agent Instructions

When generating code for this project:

1. **Check scope first**: If feature is in excluded list, STOP and clarify
2. **Prefer managed services**: Don't suggest self-hosted alternatives
3. **Keep it simple**: Avoid over-engineering
4. **Security non-negotiable**: Always implement tenant isolation
