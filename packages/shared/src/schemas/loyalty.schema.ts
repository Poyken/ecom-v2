import { z } from 'zod';

export const LoyaltyTransactionType = z.enum([
  'EARN_ORDER',
  'REDEEM_REWARD',
  'ADJUSTMENT',
  'EXPIRATION',
  'REFUND_DEDUCTION',
]);

export const LoyaltyRewardType = z.enum([
  'VOUCHER_DISCOUNT',
  'PHYSICAL_GIFT',
]);

export const CreateLoyaltyProgramSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ratePerUnitCurrency: z.number().min(0),
  isActive: z.boolean().optional(),
});

export const UpdateLoyaltyProgramSchema = CreateLoyaltyProgramSchema.partial();

export const CreateLoyaltyTierSchema = z.object({
  name: z.string().min(1),
  minSpend: z.number().min(0),
  benefits: z.array(z.string()).optional(),
  programId: z.string().uuid(),
});

export const UpdateLoyaltyTierSchema = CreateLoyaltyTierSchema.partial().omit({ programId: true });

export const CreateLoyaltyRewardSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  pointsCost: z.number().int().min(1),
  type: LoyaltyRewardType,
  value: z.number().min(0).optional(),
  maxRedemptionsPerUser: z.number().int().min(1).optional(),
  programId: z.string().uuid(),
  isActive: z.boolean().optional(),
});

export const UpdateLoyaltyRewardSchema = CreateLoyaltyRewardSchema.partial().omit({ programId: true });

export const RedeemRewardSchema = z.object({
  rewardId: z.string().uuid(),
});
