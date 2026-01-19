import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  parentId: z.string().uuid().optional().nullable(),
  description: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaTitle: z.string().optional(),
  imageId: z.string().uuid().optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
