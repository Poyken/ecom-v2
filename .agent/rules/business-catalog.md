# Rule: Catalog & Inventory Business Logic

## 1. Product & SKU Management (Source: docs/02-FSD.md)

- **Hierarchy**: All products MUST belong to at least one category. SKUs must be linked to a single parent product.
- **Attributes**: Mandatory attributes for every SKU: `price`, `compareAtPrice` (optional), `quantity`, `weight`, and `dimensions`.
- **Validation**: Check for duplicate SKU codes within the same tenant context.

## 2. Multi-Warehouse Inventory

- **Safety Stock**: Implement a "Low Inventory" threshold alert per SKU/Warehouse (docs/15-Monitoring-Alerting.md).
- **Reservation**: When an order is placed, inventory must be "Reserved" (soft-lock) before being "Commited" (hard-deduction).
- **Isolation**: Inventory levels for Tenant A must never be visible to Tenant B, even in search results.

## 3. Semantic Search (AI Search)

- **Indexing**: All product descriptions and metadata MUST be embedded into `pgvector` for semantic similarity search.
- **Search Logic**: Prioritize "In stock" items and exact title matches over semantic similarities in basic search.
