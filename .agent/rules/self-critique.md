# Rule: Mandatory Self-Critique & Verification

## 1. The "Zero-Assumption" Protocol

Before presenting any implementation or code change, the Agent MUST execute a mental "Self-Critique" loop.

## 2. Checklist for Backend (NestJS)

- [ ] Is `tenantId` present in EVERY database query?
- [ ] Does it follow the Repository pattern defined in `nestjs-best-practices`?
- [ ] Are DTOs used for both Request and Response serialization?
- [ ] Is there an automated unit test accompanying this change?

## 3. Checklist for Frontend (React/Next.js)

- [ ] Does it violate any of the 57 `react-best-practices` (e.g., Barrel imports, Waterfalls)?
- [ ] Is it accessible (alt text, labels)?
- [ ] Does it match the Monochrome aesthetic from `docs/06-UI-UX-Design.md`?

## 4. Documentation Alignment

- [ ] Does this change conflict with any statement in the 24 `docs/` files?
- [ ] Does it update `changelog.md` and `decisions.md` (if architectural)?

## 5. Technical Validation Gate (Mandatory)

Before every response, the Agent MUST:

- [ ] Run `npm run lint` and ensure ZERO errors/warnings.
- [ ] Run `npm run build` and ensure success.
- [ ] Run relevant unit/E2E tests if code logic was changed.

## 6. Failure Management

If any checklist item is "No", the Agent MUST NOT present the solution. Instead, it must refactor internally until all items are "Yes".
