"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductOptionSchema = void 0;
const zod_1 = require("zod");
exports.ProductOptionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    values: zod_1.z.array(zod_1.z.string()),
});
exports.CreateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    brandId: zod_1.z.string().uuid(),
    categoryIds: zod_1.z.array(zod_1.z.string().uuid()),
    metaDescription: zod_1.z.string().optional(),
    metaKeywords: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0).optional(),
    options: zod_1.z.array(exports.ProductOptionSchema).optional(),
});
exports.UpdateProductSchema = exports.CreateProductSchema.partial();
//# sourceMappingURL=product.schema.js.map