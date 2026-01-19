import { z } from 'zod';

export const CreateOrderSchema = z.object({
  addressId: z.string().uuid().optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'STRIPE', 'PAYPAL']),
  voucherCode: z.string().optional(),
  note: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'COMPLETED']),
  notes: z.string().optional(),
});

export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;

