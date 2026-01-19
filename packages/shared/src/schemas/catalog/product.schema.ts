import { z } from 'zod';

export const ProductOptionSchema = z.object({
  name: z.string().min(1),
  values: z.array(z.string()), // Array of value names, e.g. ["Red", "Blue"]
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  brandId: z.string().uuid(),
  categoryIds: z.array(z.string().uuid()),
  
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaTitle: z.string().optional(),
  
  price: z.number().min(0).optional(), // Base price for simple products or display
  
  // Optional: Create options immediately
  options: z.array(ProductOptionSchema).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
