import { z } from 'zod';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../constants/enums.js';

/**
 * Order Schema
 */
export const OrderSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  orderNumber: z.string().min(1),
  status: z.nativeEnum(OrderStatus),
  paymentStatus: z.nativeEnum(PaymentStatus),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
  
  // Pricing
  subtotal: z.number().nonnegative(),
  shippingFee: z.number().nonnegative().default(0),
  discountAmount: z.number().nonnegative().default(0),
  taxAmount: z.number().nonnegative().default(0),
  totalAmount: z.number().nonnegative(),
  
  // Shipping Address Snapshot
  shippingFullName: z.string().max(200),
  shippingPhone: z.string().max(20),
  shippingStreet: z.string().max(500),
  shippingWard: z.string().max(100).nullable(),
  shippingDistrict: z.string().max(100),
  shippingProvince: z.string().max(100),
  shippingPostalCode: z.string().max(20).nullable(),
  shippingCountry: z.string().max(100).default('Vietnam'),
  
  // Promotion
  promotionId: z.string().uuid().nullable(),
  promotionCode: z.string().max(50).nullable(),
  
  // Notes
  customerNote: z.string().max(1000).nullable(),
  adminNote: z.string().max(1000).nullable(),
  
  // Timestamps
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
export type Order = z.infer<typeof OrderSchema>;

/**
 * Order Item Schema - Snapshot of product at purchase time
 */
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  skuId: z.string().uuid(),
  
  // Snapshot data (immutable after order creation)
  skuCode: z.string(),
  productName: z.string(),
  skuName: z.string().nullable(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  totalPrice: z.number().nonnegative(),
  
  // Fulfillment
  fulfilledQuantity: z.number().int().default(0),
  
  createdAt: z.coerce.date(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

/**
 * Create Order Schema (from Cart)
 */
export const CreateOrderSchema = z.object({
  addressId: z.string().uuid('Please select a shipping address'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  promotionCode: z.string().max(50).optional(),
  customerNote: z.string().max(1000).optional(),
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * Update Order Status Schema (Admin)
 */
export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  adminNote: z.string().max(1000).optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

/**
 * Payment Schema
 */
export const PaymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  method: z.nativeEnum(PaymentMethod),
  amount: z.number().positive(),
  status: z.nativeEnum(PaymentStatus),
  transactionId: z.string().nullable(),
  paymentUrl: z.string().url().nullable(),
  paidAt: z.coerce.date().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Payment = z.infer<typeof PaymentSchema>;
