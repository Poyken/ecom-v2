---
description: Automated process to visually verify UI components and layouts.
---

# Workflow: Visual Verification Audit

## Stage 1: Component Rendering

1. Identifiy the UI component or page to verify (e.g., `web/app/login/page.tsx`).
2. Run the local development server: `npm run dev`.

## Stage 2: Visual Inspection (Browser Agent)

// turbo

1. Use the Browser Subagent to navigate to the target URL (e.g., `http://localhost:3000/auth/login`).
2. Perform a "visual scan":
   - Check if the **Monochrome Design System** is applied (Gray-900/50).
   - Verify layout consistency (4px/8px grid alignment).
   - Check for layout shifts (CLS) during load.
3. Capture a screenshot for the audit report.

## Stage 3: Verification Against Guidelines

1. Compare current UI state against `.agent/skills/web-design-guidelines/rules/`.
2. Ensure accessibility compliance (Color contrast, Aria labels).

## Stage 4: Reporting

1. If non-compliant: Log specific issues and trigger the `auto-fix.md` workflow.
2. If compliant: Archive the screenshot as proof of visual regression testing.
