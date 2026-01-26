# Rule: Database Integrity & Migration Standards

## 1. Schema Management

- All schema changes MUST be managed via Prisma (`schema.prisma`).
- Manual `ALTER TABLE` commands on the production database are strictly prohibited.

## 2. Migration Protocol

- **M-01: Backward Compatibility**: Schema changes must not break the current running version of the code (N-1 support).
- **M-02: Soft Deletes**: Never use `DROP COLUMN`. Rename columns if necessary or use `deletedAt` for row-level deletions.
- **M-03: Data Migrations**: If a schema change requires data transformation, a separate script must be provided and tested on `Staging`.

## 3. Performance

- **Indexing**: Every query used in the application must be backed by an efficient index.
- **Full-Text Search**: Use GIN indexes for English text search and `pgvector` IVFFlat/HNSW indexes for semantic search embeddings.
- **N+1 Prevention**: Always use Prisma's `include` or `select` with caution. Prefer targeted queries to avoid fetching unnecessary large relations.

## 4. Audit Trail

- All entities MUST have `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` fields.
- Critical business entities (Orders, Payments) MUST have their changes logged in the `audit_logs` table.
