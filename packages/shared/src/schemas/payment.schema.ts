import { z } from 'zod';

export const ProcessPaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(['COD', 'BANK_TRANSFER', 'MOMO', 'STRIPE', 'ZALOPAY']),
});

export const PaymentResponseSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  transactionId: z.string().optional(),
  action: z.object({
      type: z.enum(['REDIRECT', 'DISPLAY_INFO', 'NONE']),
      payload: z.any().optional(), // URL or Bank Info
  }).optional(),
  message: z.string().optional(),
});

export type ProcessPaymentDto = z.infer<typeof ProcessPaymentSchema>;
export type PaymentResponseDto = z.infer<typeof PaymentResponseSchema>;
