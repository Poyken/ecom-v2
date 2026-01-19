"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartItemSchema = exports.AddToCartSchema = void 0;
const zod_1 = require("zod");
exports.AddToCartSchema = zod_1.z.object({
    skuId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().min(1),
});
exports.UpdateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(1),
});
//# sourceMappingURL=cart.schema.js.map