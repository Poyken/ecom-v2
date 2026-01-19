"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductOptionSchema = void 0;
const zod_1 = require("zod");
exports.ProductOptionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    values: zod_1.z.array(zod_1.z.string()),
});
exports.CreateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    brandId: zod_1.z.string().uuid(),
    categoryIds: zod_1.z.array(zod_1.z.string().uuid()),
    description: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    metaKeywords: zod_1.z.string().optional(),
    options: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        values: zod_1.z.array(zod_1.z.string())
    })).optional(),
    skus: zod_1.z.array(zod_1.z.object({
        price: zod_1.z.number(),
        stock: zod_1.z.number(),
        optionValues: zod_1.z.array(zod_1.z.object({
            optionName: zod_1.z.string(),
            value: zod_1.z.string()
        }))
    })).optional()
});
exports.UpdateProductSchema = exports.CreateProductSchema.partial();
//# sourceMappingURL=product.schema.js.map