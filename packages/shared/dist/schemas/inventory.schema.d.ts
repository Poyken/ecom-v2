import { z } from 'zod';
export declare const CreateWarehouseSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isDefault: boolean;
    address?: string | undefined;
}, {
    name: string;
    address?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const UpdateWarehouseSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isDefault: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    address?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    name?: string | undefined;
    address?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const InventoryParamSchema: z.ZodObject<{
    skuId: z.ZodString;
    warehouseId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skuId: string;
    warehouseId?: string | undefined;
}, {
    skuId: string;
    warehouseId?: string | undefined;
}>;
export declare const AdjustInventorySchema: z.ZodObject<{
    quantity: z.ZodNumber;
    type: z.ZodEnum<["IMPORT", "EXPORT", "ADJUST", "SALE", "RETURN", "TRANSFER"]>;
    reason: z.ZodOptional<z.ZodString>;
    warehouseId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "IMPORT" | "EXPORT" | "ADJUST" | "SALE" | "RETURN" | "TRANSFER";
    quantity: number;
    warehouseId?: string | undefined;
    reason?: string | undefined;
}, {
    type: "IMPORT" | "EXPORT" | "ADJUST" | "SALE" | "RETURN" | "TRANSFER";
    quantity: number;
    warehouseId?: string | undefined;
    reason?: string | undefined;
}>;
export declare const TransferInventorySchema: z.ZodObject<{
    fromWarehouseId: z.ZodString;
    toWarehouseId: z.ZodString;
    quantity: z.ZodNumber;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    fromWarehouseId: string;
    toWarehouseId: string;
    reason?: string | undefined;
}, {
    quantity: number;
    fromWarehouseId: string;
    toWarehouseId: string;
    reason?: string | undefined;
}>;
export type CreateWarehouseDto = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseDto = z.infer<typeof UpdateWarehouseSchema>;
export type AdjustInventoryDto = z.infer<typeof AdjustInventorySchema>;
export type TransferInventoryDto = z.infer<typeof TransferInventorySchema>;
