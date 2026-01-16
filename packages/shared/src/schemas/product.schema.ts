import { z } from 'zod';

/**
 * Product Schema
 */
export const ProductSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(500),
  slug: z.string().min(1).max(600),
  description: z.string().nullable(),
  categoryId: z.string().uuid().nullable(),
  brandId: z.string().uuid().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  avgRating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().default(0),
  metaTitle: z.string().max(200).nullable(),
  metaDescription: z.string().max(500).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
export type Product = z.infer<typeof ProductSchema>;

/**
 * SKU Schema - Stock Keeping Unit (Product Variant)
 */
export const SKUSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  productId: z.string().uuid(),
  skuCode: z.string().min(1).max(100),
  name: z.string().max(500).nullable(),
  price: z.number().positive(),
  salePrice: z.number().positive().nullable(),
  costPrice: z.number().positive().nullable(),
  stock: z.number().int().default(0),
  lowStockThreshold: z.number().int().default(10),
  weight: z.number().positive().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type SKU = z.infer<typeof SKUSchema>;

/**
 * Create Product Schema
 */
export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(500),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  skus: z
    .array(
      z.object({
        skuCode: z.string().min(1),
        name: z.string().optional(),
        price: z.number().positive('Price must be positive'),
        salePrice: z.number().positive().optional(),
        costPrice: z.number().positive().optional(),
        stock: z.number().int().default(0),
        weight: z.number().positive().optional(),
        optionValues: z.array(z.string().uuid()).optional(),
      }),
    )
    .min(1, 'At least one SKU is required'),
});
export type CreateProductInput = z.infer<typeof CreateProductSchema>;

/**
 * Update Product Schema
 */
export const UpdateProductSchema = CreateProductSchema.partial().omit({ skus: true });
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

/**
 * Category Schema
 */
export const CategorySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(250),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  parentId: z.string().uuid().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type Category = z.infer<typeof CategorySchema>;

/**
 * Brand Schema
 */
export const BrandSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(250),
  description: z.string().nullable(),
  logoUrl: z.string().url().nullable(),
  isActive: z.boolean().default(true),
});
export type Brand = z.infer<typeof BrandSchema>;

/**
 * Product Option Schema (Color, Size, etc.)
 */
export const ProductOptionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  productId: z.string().uuid(),
  name: z.string().min(1).max(100),
  displayName: z.string().max(100).nullable(),
  sortOrder: z.number().int().default(0),
});
export type ProductOption = z.infer<typeof ProductOptionSchema>;

/**
 * Option Value Schema (Red, Blue, S, M, L, etc.)
 */
export const OptionValueSchema = z.object({
  id: z.string().uuid(),
  optionId: z.string().uuid(),
  value: z.string().min(1).max(100),
  displayValue: z.string().max(100).nullable(),
  colorCode: z.string().max(7).nullable(),
  sortOrder: z.number().int().default(0),
});
export type OptionValue = z.infer<typeof OptionValueSchema>;
