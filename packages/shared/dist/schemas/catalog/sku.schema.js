"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSkuSchema = exports.CreateSkuSchema = exports.SkuOptionValueSchema = void 0;
const zod_1 = require("zod");
exports.SkuOptionValueSchema = zod_1.z.object({
    optionName: zod_1.z.string(),
    value: zod_1.z.string(),
});
exports.CreateSkuSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    skuCode: zod_1.z.string().min(1),
    price: zod_1.z.number().min(0),
    stock: zod_1.z.number().int().min(0).default(0),
    optionValues: zod_1.z.array(exports.SkuOptionValueSchema).optional(),
});
exports.UpdateSkuSchema = exports.CreateSkuSchema.partial().omit({ productId: true, skuCode: true });
//# sourceMappingURL=sku.schema.js.map