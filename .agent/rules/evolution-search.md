# Rule: Self-Evolving Skills & Semantic Search

## 1. Skill Evolution Logic

- **Discovery**: If a repetitive task is identified (e.g., configuring a new shipping provider), the Agent should offer to create a new Skill or Script in `.agent/skills/`.
- **Expansion**: Every new implementation should be documented as a reference pattern for future use.

## 2. Search Implementation Protocol

- **Algolia First**: Do not implement vector search manually. Use Algolia pattern: `SyncJob -> Algolia Index -> InstantSearch UI`.
- **Consistency**: Re-use `SearchService` for all indexing operations.

## 3. Knowledge Retention

- Any "Gotcha" or bug fix that required more than 3 `auto-fix` attempts MUST be added to a "Knowledge Base" section in `decisions.md` to prevent recurrence.
