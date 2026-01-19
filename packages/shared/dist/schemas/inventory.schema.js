"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustInventorySchema = exports.InventoryParamSchema = exports.UpdateWarehouseSchema = exports.CreateWarehouseSchema = void 0;
const zod_1 = require("zod");
exports.CreateWarehouseSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    address: zod_1.z.string().optional(),
    isDefault: zod_1.z.boolean().default(false),
});
exports.UpdateWarehouseSchema = exports.CreateWarehouseSchema.partial();
exports.InventoryParamSchema = zod_1.z.object({
    skuId: zod_1.z.string().uuid(),
    warehouseId: zod_1.z.string().uuid().optional(),
});
exports.AdjustInventorySchema = zod_1.z.object({
    quantity: zod_1.z.number().int(),
    type: zod_1.z.enum(['IMPORT', 'EXPORT', 'ADJUST', 'SALE', 'RETURN']),
    reason: zod_1.z.string().optional(),
    warehouseId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=inventory.schema.js.map