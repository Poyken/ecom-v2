import { z } from 'zod';

export const CreateOrderSchema = z.object({
  addressId: z.string().uuid().optional(), // Optional if user wants to use default or creating new one (not supported in this simple schema yet, assuming existing address)
  // For MVP, let's require addressId or shipping details. 
  // Plan said "addressId, paymentMethod, note".
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER']).default('COD'),
  note: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'COMPLETED']),
  notes: z.string().optional(),
});

export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;

