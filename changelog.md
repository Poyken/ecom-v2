# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-26

### Added

- **Multi-tenant Infrastructure**:
  - Implementation of `TenantMiddleware` for Header-based tenant isolation.
  - Usage of `AsyncLocalStorage` for request-scoped tenant context (TenantStorage).
  - Database schema for `Tenant` and `User` with multi-tenant relations.
- **Identity & Access Management (IAM)**:
  - Auth module with JWT-based authentication.
  - User registration and login with bcrypt password hashing.
  - Tenant onboarding flow (simultaneous creation of store and admin user).
- **Technical Excellence**:
  - Project-wide ESLint configuration with strict "Zero Warnings" policy.
  - Global exception filter for standardized API error responses.
  - Swagger UI documentation at `/docs` (Port 8080).
  - End-to-End (E2E) testing suite for Auth and Tenant modules.
- **Frontend (Web)**:
  - Next.js project setup on Port 3000.
  - Premium Monochrome design system in `globals.css`.
  - Animated Login page with visual verification (browser subagent).
- **DevOps**:
  - Migration to Port 8080 for API and Port 3000 for Web.
  - CORS enabled for cross-origin API calls.
