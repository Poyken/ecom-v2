import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  slug: z.string().min(3),
});

export * from './catalog/category.schema';
export * from './catalog/brand.schema';
export * from './catalog/product.schema';
export * from './catalog/sku.schema';
export * from './cart.schema';
export * from './order.schema';
export * from './inventory.schema';

export * from './payment.schema';
export * from './promotion.schema';
