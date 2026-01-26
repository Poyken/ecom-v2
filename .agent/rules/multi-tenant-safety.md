# Rule: Multi-tenant Data Safety & Isolation

## 1. Principle of Total Isolation

The platform operates on a shared-infrastructure model. Data leakage between tenants is considered a **Critical Security Incident**.

## 2. Implementation Guardrails

### G-01: Schema Enforcement

- Every table that contains merchant data MUST have a `tenantId: UUID` column.
- The `tenantId` column MUST have a foreign key reference to the `tenants` table.
- Composite indexes MUST be used where `tenantId` is the first key (e.g., `(tenantId, slug)`).

### G-02: Query Enforcement (Prisma)

- **Selection**: All find operations must include a `where: { tenantId }` filter.
- **Insertion**: All create operations must explicitly pass the `tenantId` from the active context.
- **Middleware**: Use Prisma middleware to automatically inject `tenantId` filters into queries whenever possible.

### G-03: Row Level Security (RLS)

- PostgreSQL RLS must be enabled for all tenant-specific tables.
- The RLS policy should be: `USING (tenantId = current_setting('app.current_tenant_id')::UUID)`.
- Never bypass RLS in the API layer unless it is for a cross-tenant "Super Admin" functionality (requires explicit flag).

## 3. Validation

- Automated tests MUST include cross-tenant access attempts that expect `403 Forbidden` or "Not Found" responses.
