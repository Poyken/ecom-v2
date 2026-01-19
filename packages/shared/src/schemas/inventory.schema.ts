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
  type: z.enum(['IMPORT', 'EXPORT', 'ADJUST', 'SALE', 'RETURN', 'TRANSFER']),
  reason: z.string().optional(),
  warehouseId: z.string().uuid().optional(), // Target warehouse
});


export const TransferInventorySchema = z.object({
  fromWarehouseId: z.string().uuid(),
  toWarehouseId: z.string().uuid(),
  quantity: z.number().int().positive(),
  reason: z.string().optional(),
});

export type CreateWarehouseDto = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseDto = z.infer<typeof UpdateWarehouseSchema>;
export type AdjustInventoryDto = z.infer<typeof AdjustInventorySchema>;
export type TransferInventoryDto = z.infer<typeof TransferInventorySchema>;

