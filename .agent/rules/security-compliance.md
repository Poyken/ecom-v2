# Rule: Security & Compliance Governance

## 1. Architecture Pillars (Based on docs/13-Security-Architecture.md)

- **Defense in Depth**: Multiple security layers (WAF, RBAC, RLS).
- **Zero Trust**: Always verify JWT claims and tenant context for every request.
- **Security by Design**: Sanitize all inputs using `Zod` or `class-validator`.

## 2. Authentication & Authorization

- **MFA**: Enforce multi-factor authentication for all `Super Admin` and `Tenant Admin` accounts.
- **Tokens**: short-lived Access Tokens (JWT) + secured Refresh Tokens stored via HttpOnly cookies.
- **RBAC**: Strictly follow the role matrix defined in `docs/01-BRD.md` (Super Admin, Manager, Staff, Customer).

## 3. Data Privacy & Compliance (Based on docs/12-Risk-Management-Compliance.md)

- **GDPR**: Implement the "Right to be Forgotten" and "Data Portability" (Export functionality).
- **PCI DSS**: Never store raw credit card numbers. Use tokenization from providers (Stripe/VNPay).
- **PII Protection**: Mask PII (Personally Identifiable Information) in all logs sent to Prometheus/ELK Stack.

## 4. Network Security

- **TLS**: Minimum version 1.2+ for all transit data.
- **Webhooks**: Verify every incoming webhook using the provider's signature (docs/19-Third-Party-Integration.md).
