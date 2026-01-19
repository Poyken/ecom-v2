import { z } from 'zod';

export const PromotionTypeSchema = z.enum(['AUTOMATIC', 'VOUCHER']);
export const PromotionRuleTypeSchema = z.enum(['MIN_ORDER_VALUE', 'SPECIFIC_PRODUCT', 'SPECIFIC_CATEGORY', 'SPECIFIC_BRAND']);
export const PromotionActionTypeSchema = z.enum(['DISCOUNT_PERCENT', 'DISCOUNT_FIXED', 'FREE_SHIPPING']);

export const CreatePromotionRuleSchema = z.object({
  type: PromotionRuleTypeSchema,
  operator: z.string().default('GTE'), // Greater Than or Equal
  value: z.string(), // JSON string or simple value
});

export const CreatePromotionActionSchema = z.object({
  type: PromotionActionTypeSchema,
  value: z.string(),
  maxDiscountAmount: z.number().optional(),
});

export const CreatePromotionSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
  usageLimit: z.number().int().optional(),
  rules: z.array(CreatePromotionRuleSchema),
  actions: z.array(CreatePromotionActionSchema),
});

export const UpdatePromotionSchema = CreatePromotionSchema.partial();

export type CreatePromotionDto = z.infer<typeof CreatePromotionSchema>;
export type UpdatePromotionDto = z.infer<typeof UpdatePromotionSchema>;
export type PromotionResponseDto = any; // Placeholder for full promotion object
