---
description: Procedure for onboarding a new merchant/tenant into the platform.
---

# Workflow: Tenant Onboarding & Initialization

## Stage 1: Verification & Provisioning (Source: docs/10-Customer-Support.md)

1.  **KYC Check**: Verify the merchant's business registration and identity.
2.  **Account Creation**: Create the `tenant` record in the database.
3.  **Security Setup**: Generate store-specific API keys and set up the default `Admin` role (docs/13-Security-Architecture.md).

## Stage 2: Workspace Initialization (Source: docs/18-Data-Migration-Strategy.md)

1.  **Seed Default Data**: Execute the `tenant_seeding` script to provide default categories, tax settings, and shipping templates.
2.  **Subdomain/Domain Setup**: Configure the store's subdomain (e.g., `store-name.platform.com`) and SSL certificates via Vercel/Router APIs.
3.  **Storage Isolation**: Provision dedicated folders in S3 for the tenant's assets (images/files).

## Stage 3: Configuration & Integration (Source: docs/19-Third-Party-Integration.md)

1.  **Payment Activation**: Guide the merchant to connect their Stripe/VNPay accounts.
2.  **Shipping Setup**: Configure API keys for GHN/GHTK/FedEx based on the merchant's location.
3.  **Theme Selection**: Initialize the merchant's storefront using the default Monochrome theme (docs/06-UI-UX-Design.md).

## Stage 4: Go-Live

1.  **Welcome Email**: Send automated onboarding guide via SendGrid.
2.  **Health Check**: Verify the new tenant's dashboard and storefront are responsive (< 2s load time).
3.  **Audit**: Log the successful onboarding in `changelog.md` and audit trails.
