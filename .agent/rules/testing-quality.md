# Rule: Testing & Quality Assurance

## 1. Testing Pyramid (Based on docs/09-Testing-Strategy.md)

Adhere to the 70/20/10 ratio:

- **70% Unit Tests**: Jest (Backend), Vitest (Frontend). Independent of external services.
- **20% Integration Tests**: Verify API endpoints, DB transactions, and 3rd party adapters.
- **10% E2E Tests**: Use Playwright for critical customer journeys and multi-tenant isolation.

## 2. Quality Metrics (KPIs)

- **Coverage**: Minimum 80% for logic in `services/`, `utils/`, and `controllers/`.
- **Latency**: API response MUST be `< 500ms` under normal load.
- **Status**: No security vulnerabilities of "High" or "Critical" severity allowed.

## 3. Execution Protocols

- **Test Data**: Use the **Factory Pattern** for generating test data. Never use production data.
- **Isolation Test**: Every E2E suite must include a test case where a user from `Tenant A` attempts to access a resource from `Tenant B`.
- **Load Testing**: Before a major release, verify performance against `docs/17-Performance-Testing.md` (Target: 1,000 orders/min).

## 4. Definitions of Done

- All relevant tests PASS.
- Documentation updated to reflect changes.
- Performance benchmarks are within acceptable limits (docs/17-Performance-Testing.md).
