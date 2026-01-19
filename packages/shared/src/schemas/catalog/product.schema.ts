import { z } from 'zod';

export const ProductOptionSchema = z.object({
  name: z.string().min(1),
  values: z.array(z.string()), // Array of value names, e.g. ["Red", "Blue"]
});

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  brandId: z.string().uuid(),
  categoryIds: z.array(z.string().uuid()),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).optional(),
  skus: z.array(z.object({
    price: z.number(),
    stock: z.number(),
    optionValues: z.array(z.object({
      optionName: z.string(),
      value: z.string()
    }))
  })).optional()
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
