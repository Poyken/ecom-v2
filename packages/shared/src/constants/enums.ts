/**
 * Order Status Enum
 * Follows the order lifecycle: PENDING → PROCESSING → SHIPPED → DELIVERED → COMPLETED
 */
export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
  COMPLETED: 'COMPLETED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/**
 * Payment Status Enum
 */
export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/**
 * Shipment Status Enum
 */
export const ShipmentStatus = {
  PENDING: 'PENDING',
  READY_TO_SHIP: 'READY_TO_SHIP',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  RETURNED: 'RETURNED',
} as const;
export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

/**
 * Return Status Enum (RMA)
 */
export const ReturnStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  WAITING_FOR_RETURN: 'WAITING_FOR_RETURN',
  IN_TRANSIT: 'IN_TRANSIT',
  RECEIVED: 'RECEIVED',
  INSPECTING: 'INSPECTING',
  REFUNDED: 'REFUNDED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;
export type ReturnStatus = (typeof ReturnStatus)[keyof typeof ReturnStatus];

/**
 * Return Type Enum
 */
export const ReturnType = {
  REFUND_ONLY: 'REFUND_ONLY',
  RETURN_AND_REFUND: 'RETURN_AND_REFUND',
  EXCHANGE: 'EXCHANGE',
} as const;
export type ReturnType = (typeof ReturnType)[keyof typeof ReturnType];

/**
 * Tenant Plan Enum (SaaS billing)
 */
export const TenantPlan = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE',
} as const;
export type TenantPlan = (typeof TenantPlan)[keyof typeof TenantPlan];

/**
 * Loyalty Point Type Enum
 */
export const LoyaltyPointType = {
  EARNED: 'EARNED',
  REDEEMED: 'REDEEMED',
  REFUNDED: 'REFUNDED',
} as const;
export type LoyaltyPointType = (typeof LoyaltyPointType)[keyof typeof LoyaltyPointType];

/**
 * Payment Method Enum
 */
export const PaymentMethod = {
  COD: 'COD',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
  STRIPE: 'STRIPE',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

/**
 * User Role Type
 */
export const UserRoleType = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;
export type UserRoleType = (typeof UserRoleType)[keyof typeof UserRoleType];

/**
 * Sentiment for AI review analysis
 */
export const Sentiment = {
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
  NEUTRAL: 'NEUTRAL',
} as const;
export type Sentiment = (typeof Sentiment)[keyof typeof Sentiment];
