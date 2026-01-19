"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBrandSchema = exports.CreateBrandSchema = void 0;
const zod_1 = require("zod");
exports.CreateBrandSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    imageId: zod_1.z.string().uuid().optional(),
});
exports.UpdateBrandSchema = exports.CreateBrandSchema.partial();
//# sourceMappingURL=brand.schema.js.map