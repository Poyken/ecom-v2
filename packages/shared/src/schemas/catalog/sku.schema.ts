import { z } from 'zod';

export const SkuOptionValueSchema = z.object({
  optionName: z.string(),
  value: z.string(),
});

export const CreateSkuSchema = z.object({
  productId: z.string().uuid(),
  skuCode: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().int().min(0).default(0),
  
  // For defining which variant this is
  optionValues: z.array(SkuOptionValueSchema).optional(), 
  // API implementation will map these names to IDs found in the product.
});

export const UpdateSkuSchema = CreateSkuSchema.partial().omit({ productId: true, skuCode: true }); // Usually don't change product or code easily

export type CreateSkuDto = z.infer<typeof CreateSkuSchema>;
export type UpdateSkuDto = z.infer<typeof UpdateSkuSchema>;
