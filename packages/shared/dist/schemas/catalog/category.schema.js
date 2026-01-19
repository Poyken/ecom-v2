"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategorySchema = exports.CreateCategorySchema = void 0;
const zod_1 = require("zod");
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    parentId: zod_1.z.string().uuid().optional().nullable(),
    description: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    metaKeywords: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    imageId: zod_1.z.string().uuid().optional(),
});
exports.UpdateCategorySchema = exports.CreateCategorySchema.partial();
//# sourceMappingURL=category.schema.js.map