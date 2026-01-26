# Coding Guidelines

## General Principles

- **Clean Code**: Follow SOLID principles.
- **DRY (Don't Repeat Yourself)**: Create reusable utility functions carefully.
- **Type Safety**: Use TypeScript interfaces for all data structures.

## Backend (NestJS)

- **Dependency Injection**: Use NestJS DI system.
- **DTOs**: Use `class-validator` and `class-transformer` for request validation.
- **Services**: Business logic belongs in services, not controllers.
- **Prisma**: Use the Prisma service for database operations.

## Frontend (Next.js)

- **App Router**: Use Next.js 13+ App Router features.
- **Server Components**: Use Server Components by default for better performance.
- **Client Components**: Use `"use client"` only when interactive features are needed.
- **Tailwind CSS**: Use utility classes. Avoid custom CSS unless necessary.

## Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/).
- Example: `feat: add product search`, `fix: tenant isolation bug`.
