"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseSchema = exports.ProcessPaymentSchema = void 0;
const zod_1 = require("zod");
exports.ProcessPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    method: zod_1.z.enum(['COD', 'BANK_TRANSFER', 'MOMO', 'STRIPE', 'ZALOPAY']),
});
exports.PaymentResponseSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'COMPLETED', 'FAILED']),
    transactionId: zod_1.z.string().optional(),
    action: zod_1.z.object({
        type: zod_1.z.enum(['REDIRECT', 'DISPLAY_INFO', 'NONE']),
        payload: zod_1.z.any().optional(),
    }).optional(),
    message: zod_1.z.string().optional(),
});
//# sourceMappingURL=payment.schema.js.map