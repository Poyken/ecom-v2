"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromotionSchema = exports.CreatePromotionSchema = exports.CreatePromotionActionSchema = exports.CreatePromotionRuleSchema = exports.PromotionActionTypeSchema = exports.PromotionRuleTypeSchema = exports.PromotionTypeSchema = void 0;
const zod_1 = require("zod");
exports.PromotionTypeSchema = zod_1.z.enum(['AUTOMATIC', 'VOUCHER']);
exports.PromotionRuleTypeSchema = zod_1.z.enum(['MIN_ORDER_VALUE', 'SPECIFIC_PRODUCT', 'SPECIFIC_CATEGORY', 'SPECIFIC_BRAND']);
exports.PromotionActionTypeSchema = zod_1.z.enum(['DISCOUNT_PERCENT', 'DISCOUNT_FIXED', 'FREE_SHIPPING']);
exports.CreatePromotionRuleSchema = zod_1.z.object({
    type: exports.PromotionRuleTypeSchema,
    operator: zod_1.z.string().default('GTE'),
    value: zod_1.z.string(),
});
exports.CreatePromotionActionSchema = zod_1.z.object({
    type: exports.PromotionActionTypeSchema,
    value: zod_1.z.string(),
    maxDiscountAmount: zod_1.z.number().optional(),
});
exports.CreatePromotionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    code: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    startDate: zod_1.z.string().or(zod_1.z.date()),
    endDate: zod_1.z.string().or(zod_1.z.date()),
    isActive: zod_1.z.boolean().default(true),
    priority: zod_1.z.number().int().default(0),
    usageLimit: zod_1.z.number().int().optional(),
    rules: zod_1.z.array(exports.CreatePromotionRuleSchema),
    actions: zod_1.z.array(exports.CreatePromotionActionSchema),
});
exports.UpdatePromotionSchema = exports.CreatePromotionSchema.partial();
//# sourceMappingURL=promotion.schema.js.map