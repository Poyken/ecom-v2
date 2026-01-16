import { z } from 'zod';

/**
 * Cart Schema
 */
export const CartSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  userId: z.string().uuid().nullable(), // null for guest cart
  sessionId: z.string().nullable(), // for guest cart
  promotionCode: z.string().max(50).nullable(),
  discountAmount: z.number().nonnegative().default(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Cart = z.infer<typeof CartSchema>;

/**
 * Cart Item Schema
 */
export const CartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  skuId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive(), // Price at time of adding
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

/**
 * Add to Cart Schema
 */
export const AddToCartSchema = z.object({
  skuId: z.string().uuid('Invalid SKU'),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
});
export type AddToCartInput = z.infer<typeof AddToCartSchema>;

/**
 * Update Cart Item Schema
 */
export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
});
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;

/**
 * Apply Promotion Schema
 */
export const ApplyPromotionSchema = z.object({
  promotionCode: z.string().min(1, 'Promotion code is required').max(50),
});
export type ApplyPromotionInput = z.infer<typeof ApplyPromotionSchema>;

/**
 * Cart Summary (computed)
 */
export const CartSummarySchema = z.object({
  itemCount: z.number().int().nonnegative(),
  subtotal: z.number().nonnegative(),
  discountAmount: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      skuId: z.string().uuid(),
      skuCode: z.string(),
      productName: z.string(),
      skuName: z.string().nullable(),
      imageUrl: z.string().url().nullable(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      totalPrice: z.number().nonnegative(),
      inStock: z.boolean(),
    }),
  ),
});
export type CartSummary = z.infer<typeof CartSummarySchema>;
