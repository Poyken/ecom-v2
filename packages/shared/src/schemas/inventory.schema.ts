import { z } from 'zod';

export const CreateWarehouseSchema = z.object({
  name: z.string().min(3).max(100),
  address: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial();

export const InventoryParamSchema = z.object({
  skuId: z.string().uuid(),
  warehouseId: z.string().uuid().optional(), // Optional, if not provided, system picks default
});

export const AdjustInventorySchema = z.object({
  quantity: z.number().int(), // Can be negative
  type: z.enum(['IMPORT', 'EXPORT', 'ADJUST', 'SALE', 'RETURN']),
  reason: z.string().optional(),
  warehouseId: z.string().uuid().optional(), // Target warehouse
});

export type CreateWarehouseDto = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseDto = z.infer<typeof UpdateWarehouseSchema>;
export type AdjustInventoryDto = z.infer<typeof AdjustInventorySchema>;
