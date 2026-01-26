---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
---

# Web Interface Guidelines (Vercel-Standard Audit)

This skill provides a comprehensive checklist to audit the project's UI against professional web standards.

## 1. Interaction & Affordances

- **Focus States**: Every interactive element MUST have a visible, high-contrast `:focus-visible` state.
- **Click Targets**: Ensure buttons and links have a minimum target size of `44x44px` for mobile compliance.
- **Loading States**: Use skeleton screens for content areas and spinners only for small, localized actions.
- **Micro-interactions**: Use subtle transitions (150ms-200ms) for hover and active states.

## 2. Visual Hierarchy & Typography

- **Scale**: Use a logical font scale (e.g., 1.25x). Ensure `h1` through `h6` have distinct, predictable sizes.
- **Contrast**: Text must pass WCAG 2.1 AA (4.5:1 for normal text).
- **Empty States**: Provide actionable empty states with clear "Call to Action" buttons.
- **Grid Consistency**: Align all elements to the 4px/8px baseline grid defined in `docs/06-UI-UX-Design.md`.

## 3. Form Design

- **Labels**: Every input MUST have a permanent `<label>`. Never rely solely on `placeholder` text.
- **Error Messaging**: Errors must be descriptive and placed immediately below the relevant input field.
- **Input Types**: Use correct HTML5 types (`email`, `tel`, `number`) to trigger appropriate mobile keyboards.

## 4. Accessibility (A11y)

- **Alt Text**: All meaningful images must have `alt` attributes. Decorative images must have `alt=""`.
- **Aria Labels**: Use `aria-label` for buttons that only contain icons.
- **Semantic HTML**: Use `<main>`, `<nav>`, `<header>`, and `<footer>` to provide a clear document map for screen readers.

## 5. Performance UX

- **Layout Shift (CLS)**: Reserve space for images and ads to prevent layout jumping during load.
- **Perceived Speed**: Use pessimistic UI for fast actions and optimistic UI for predictable mutations.

## Audit Workflow

1. Fetch latest rules from: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
2. Analyze code for violations.
3. Provide feedback in `file:line` format for easy fixing.
