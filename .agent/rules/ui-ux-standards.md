# Rule: UI/UX Standards & Design System

## 1. Visual Identity (Based on docs/06-UI-UX-Design.md)

The platform uses a **Monochrome/Professional** aesthetic to allow for white-labeling.

- **Primary Colors**:
  - Main: `#171717` (Gray-900)
  - Ghost: `#fafafa` (Gray-50)
  - Contrast: White/Black
- **Dashboard Semantic Colors**:
  - Success/Analytics: Emerald (`#10b981`)
  - Info/Orders: Sky (`#0ea5e9`)
  - Customers: Violet (`#8b5cf6`)
  - Warning/Marketing: Rose (`#f43f5e`)

## 2. Typography & Layout

- **Font Stack**: `Inter` (Primary), `JetBrains Mono` (Code), `Crimson Text` (Display).
- **Grid**: 12-column CSS Grid with `1.5rem` (24px) gutters.
- **Breakpoints**:
  - Mobile: `< 640px`
  - Tablet: `768px - 1024px`
  - Desktop: `> 1024px`

## 3. Component Implementation

- **Buttons**: Every button MUST have a clearly defined variant (`primary`, `secondary`, `ghost`, `destructive`).
- **Cards**: Use subtle hover effects for interactivity. Focus on image-to-content ratio in product cards.
- **Forms**: Implement instant validation with emerald/rose feedback colors.

## 4. Performance & Accessibility (WCAG 2.1 AA)

- **Contrast**: Minimum 4.5:1 ratio.
- **Images**: Mandatory `WebP` format with `loading="lazy"`.
- **Keyboard**: Full navigation support (Tab indexing).
