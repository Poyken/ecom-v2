"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemRewardSchema = exports.UpdateLoyaltyRewardSchema = exports.CreateLoyaltyRewardSchema = exports.UpdateLoyaltyTierSchema = exports.CreateLoyaltyTierSchema = exports.UpdateLoyaltyProgramSchema = exports.CreateLoyaltyProgramSchema = exports.LoyaltyRewardType = exports.LoyaltyTransactionType = void 0;
const zod_1 = require("zod");
exports.LoyaltyTransactionType = zod_1.z.enum([
    'EARN_ORDER',
    'REDEEM_REWARD',
    'ADJUSTMENT',
    'EXPIRATION',
    'REFUND_DEDUCTION',
]);
exports.LoyaltyRewardType = zod_1.z.enum([
    'VOUCHER_DISCOUNT',
    'PHYSICAL_GIFT',
]);
exports.CreateLoyaltyProgramSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    ratePerUnitCurrency: zod_1.z.number().min(0),
    isActive: zod_1.z.boolean().optional(),
});
exports.UpdateLoyaltyProgramSchema = exports.CreateLoyaltyProgramSchema.partial();
exports.CreateLoyaltyTierSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    minSpend: zod_1.z.number().min(0),
    benefits: zod_1.z.array(zod_1.z.string()).optional(),
    programId: zod_1.z.string().uuid(),
});
exports.UpdateLoyaltyTierSchema = exports.CreateLoyaltyTierSchema.partial().omit({ programId: true });
exports.CreateLoyaltyRewardSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    pointsCost: zod_1.z.number().int().min(1),
    type: exports.LoyaltyRewardType,
    value: zod_1.z.number().min(0).optional(),
    maxRedemptionsPerUser: zod_1.z.number().int().min(1).optional(),
    programId: zod_1.z.string().uuid(),
    isActive: zod_1.z.boolean().optional(),
});
exports.UpdateLoyaltyRewardSchema = exports.CreateLoyaltyRewardSchema.partial().omit({ programId: true });
exports.RedeemRewardSchema = zod_1.z.object({
    rewardId: zod_1.z.string().uuid(),
});
//# sourceMappingURL=loyalty.schema.js.map