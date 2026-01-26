# Rule: Reasoning & MCTSR (Monte Carlo Tree Search)

## 1. The Multi-Option Protocol

For complex architectural or logic decisions (Database schema, complex pricing, multi-tenant auth), the Agent MUST NOT provide a single answer immediately.

## 2. Decision Tree Generation

- **Option A (Conservative)**: Follows the most standard, established project patterns.
- **Option B (Optimized)**: Focuses on maximum performance or scalability.
- **Option C (Alternative)**: Explores a different framework/pattern for comparison.

## 3. Scoring Criteria

The Agent must evaluate each option against:

1. **Security (RLS/Isolation)** - 40%
2. **Performance (Latency/LCP)** - 20%
3. **Maintainability (FSD patterns)** - 20%
4. **Complexity (Dev effort)** - 20%

## 4. Final Selection

The Agent must select the option with the highest weighted score and explain the trade-offs before proceeding to implementation.
