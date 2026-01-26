# Rule: Sales, Orders & Payments Lifecycle

## 1. Order Processing (Source: docs/02-FSD.md)

- **Status Transitions**: Strictly follow the FSD state machine: `PENDING` -> `PAID` -> `PROCESSING` -> `SHIPPED` -> `COMPLETED`.
- **Cancellation**: Orders can only be cancelled by customers if status is `PENDING`. Admins can cancel at any stage before `SHIPPED`.
- **Pricing**: Final order price MUST be recalculated server-side. Never trust the total sent from the frontend.

## 2. Cart & Checkout

- **Persistence**: Carts for authenticated users must be saved to Redis/PostgreSQL. Guest carts must be stored in Client-side storage (indexedDB) but synced upon login.
- **Tax & Shipping**: Recalculate tax and shipping costs whenever the shipping address or cart items change (docs/19-Third-Party-Integration.md).

## 3. Payment Security (Source: docs/05-API-Contract.md)

- **Idempotency**: All payment-related API calls MUST include an `idempotency-key` header to prevent double charging.
- **Verification**: Use HMAC signatures to verify all incoming webhooks from Stripe/PayPal/VNPay.
- **Audit**: Log every payment attempt, including provider response codes and error messages, in the `audit_logs` table.
