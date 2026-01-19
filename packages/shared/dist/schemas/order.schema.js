"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderStatusSchema = exports.CreateOrderSchema = void 0;
const zod_1 = require("zod");
exports.CreateOrderSchema = zod_1.z.object({
    addressId: zod_1.z.string().uuid().optional(),
    paymentMethod: zod_1.z.enum(['COD', 'BANK_TRANSFER']).default('COD'),
    note: zod_1.z.string().optional(),
});
exports.UpdateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'COMPLETED']),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=order.schema.js.map