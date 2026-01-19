import { z } from 'zod';

export const CreateBrandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(), // Note: Schema doesn't have description for Brand, but might be useful. Actually Schema DOES NOT have description for Brand. Removing to be safe with schema.prisma or just keep typical ones. 
  // Wait, checking schema.prisma again: Brand model has: id, name, slug, imageUrl, imageId. No description.
  // I will omit description for now to match schema.prisma strictly, or I can add it if I plan to migrate.
  // The plan said: "Verify schema.prisma... No changes expected".
  // So I will NOT add description.
  imageId: z.string().uuid().optional(),
});

export const UpdateBrandSchema = CreateBrandSchema.partial();

export type CreateBrandDto = z.infer<typeof CreateBrandSchema>;
export type UpdateBrandDto = z.infer<typeof UpdateBrandSchema>;
