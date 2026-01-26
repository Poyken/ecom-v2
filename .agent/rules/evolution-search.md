# Rule: Self-Evolving Skills & Semantic Search

## 1. Skill Evolution Logic

- **Discovery**: If a repetitive task is identified (e.g., configuring a new shipping provider), the Agent should offer to create a new Skill or Script in `.agent/skills/`.
- **Expansion**: Every new implementation should be documented as a reference pattern for future use.

## 2. Semantic Code Search Protocol

- **Research First**: Before writing any new module or service, the Agent MUST use `grep_search` or `find_by_name` to find existing similar implementations in the codebase.
- **Consistency**: Re-use existing utility patterns, decorators, and error-handling logic from the found examples to ensure the codebase remains unified.
- **Action**: "I am searching for existing 'Auth' implementations to ensure consistency..."

## 3. Knowledge Retention

- Any "Gotcha" or bug fix that required more than 3 `auto-fix` attempts MUST be added to a "Knowledge Base" section in `decisions.md` to prevent recurrence.
