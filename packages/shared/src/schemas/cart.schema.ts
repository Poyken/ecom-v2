import { z } from 'zod';

export const AddToCartSchema = z.object({
  skuId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>;
